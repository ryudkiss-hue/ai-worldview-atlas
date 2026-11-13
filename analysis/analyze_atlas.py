#!/usr/bin/env python3
"""AI Worldview Atlas validation analysis, protocol 2.0 (docs/VALIDATION_PROTOCOL.md).

Usage:
  python3 analysis/analyze_atlas.py ANSWERS.csv OUT_DIR [--test] [--seed N]

ANSWERS.csv  the "Answers" tab of the Google Form's response sheet, downloaded as CSV
             (File > Download > Comma-separated values, with the Answers tab selected).
OUT_DIR      receives report.md, results.json and exclusions.csv.
--test       required when the file has a "Synthetic" column marking test rows; every output is then
             labeled as a test run. Without it, synthetic rows stop the analysis.

Every rule and threshold below is fixed by protocol 2.0. Changing one is a protocol deviation and must be
logged in the protocol's deviation table with a date and a reason, before the data it affects are analysed.
"""
import argparse, hashlib, json, math, os, sys
from datetime import datetime
import numpy as np
import pandas as pd

PROTOCOL_VERSION = "2.0"
HERE = os.path.dirname(os.path.abspath(__file__))
REF = json.load(open(os.path.join(HERE, "atlas_reference.json"), encoding="utf-8"))

# ---------------- protocol constants (2.0) ----------------
ITEM_SET = REF["itemSet"]               # E1: responses must come from this exact wording
NO_VIEW_MAX = 36                        # E4: more than 36 of 144 "no settled view" answers (25%)
SAME_ANSWER_SHARE = 0.90                # E5: 90% or more of answered statements given the identical answer
STRONG_SAME_PAIRS_FLAG = 20             # flag only: 20+ mirrored pairs answered with the same strong answer
MIN_N = {"reliability": 30, "correlations": 100, "calibration": 200, "selfId": 100, "retest": 30}
RECAL_MIN_PER_ARCHETYPE = 15            # A11: self-identifiers needed before an archetype's coordinates are checked
RECAL_MIN_GAP = 2.0                     # A11: a coordinate is proposed for change only if its gap is this large and outside the 95% CI
RETEST_MIN_DAYS = 7
ALPHA_GOOD, ALPHA_MARGINAL = 0.70, 0.60
PAIR_R_FLAG = -0.10                     # a mirrored pair whose answers correlate above this isn't working as opposites
ITEM_REST_FLAG = 0.20
AXIS_R_FLAG = 0.70
BAND_Z, BAND_MIN, BAND_MAX = 1.96, 1.0, 4.0
BOOT_ALPHA, BOOT_STABILITY = 1000, 200

AX = [a["id"] for a in REF["axes"]]
AXNAME = {a["id"]: a["name"] for a in REF["axes"]}
ITEMS = REF["items"]
IDS = [i["id"] for i in ITEMS]
DIR = np.array([i["direction"] for i in ITEMS], float)
AXIDX = {a: [k for k, i in enumerate(ITEMS) if i["axisId"] == a] for a in AX}
PAIRS = [(k, IDS.index(i["pair"])) for k, i in enumerate(ITEMS) if i["direction"] == 1]
PROF = np.array([[p["coords"][a] for a in AX] for p in REF["profiles"]], float)
PNAME = [p["name"] for p in REF["profiles"]]
CHECKS = {c["id"]: c["expect"] for c in REF["checks"]}


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def axis_scores(X):
    """X: n x 144 answers (-2..2, 0 = no settled view). Same formula as the quiz: 10 x sum / (2 x n items)."""
    aligned = X * DIR
    return np.column_stack([10 * aligned[:, AXIDX[a]].sum(1) / (2 * len(AXIDX[a])) for a in AX])


def classify(S):
    d = np.sqrt(((S[:, None, :] - PROF[None, :, :]) ** 2).sum(2))
    o = np.argsort(d, 1)
    return o, np.take_along_axis(d, o, 1)


def cronbach(M):
    k = M.shape[1]
    if k < 2 or M.shape[0] < 3:
        return float("nan")
    tv = M.sum(1).var(ddof=1)
    return float(k / (k - 1) * (1 - M.var(0, ddof=1).sum() / tv)) if tv > 0 else float("nan")


def boot_ci(f, M, rng, B):
    vals = [f(M[rng.integers(0, len(M), len(M))]) for _ in range(B)]
    vals = [v for v in vals if not math.isnan(v)]
    return (float(np.percentile(vals, 2.5)), float(np.percentile(vals, 97.5))) if vals else (float("nan"),) * 2


def load(path, test):
    df = pd.read_csv(path, dtype=str).fillna("")
    missing = [c for c in ["Response ID", "Submitted", "Item set", "Consent"] + [str(i) for i in IDS] if c not in df.columns]
    if missing:
        sys.exit(f"The file is missing columns: {missing[:5]}{'...' if len(missing) > 5 else ''}. Use the Answers tab.")
    synthetic = "Synthetic" in df.columns and df["Synthetic"].str.upper().isin(["TRUE", "1", "YES"]).any()
    if synthetic and not test:
        sys.exit("This file contains synthetic (test) rows. Rerun with --test; the outputs will be labeled as a test run.")
    if test and not synthetic:
        sys.exit("--test was given but the file has no synthetic rows. Real data is never analysed as a test run.")
    return df


def exclusions(df):
    rows, keep = [], []
    seen = set()
    for n, r in df.iterrows():
        why = []
        if r["Response ID"] in seen:
            why.append("E2 duplicate response")
        seen.add(r["Response ID"])
        if r["Item set"] != ITEM_SET:
            why.append("E1 different item set")
        if r["Consent"] != "Yes":
            why.append("E3 no study consent")
        ans = [r[str(i)] for i in IDS]
        vals = [int(float(v)) for v in ans if v != ""]
        if len(vals) < len(IDS):
            why.append("E1 incomplete answer row")
        nov = sum(1 for v in vals if v == 0)
        if nov > NO_VIEW_MAX:
            why.append(f"E4 {nov} statements with no settled view")
        answered = [v for v in vals if v != 0]
        if answered and max(answered.count(v) for v in set(answered)) / len(answered) >= SAME_ANSWER_SHARE:
            why.append("E5 same answer to nearly every statement")
        for cid, exp in CHECKS.items():
            col = f"Check {cid}"
            if col in df.columns and r[col] != "" and int(float(r[col])) != exp:
                why.append(f"E6 check {cid} answered differently from what it asked")
        rows.append({"Response ID": r["Response ID"], "excluded": bool(why), "reasons": "; ".join(why)})
        keep.append(not why)
    return pd.DataFrame(rows), np.array(keep)


def stability(x, rng, B):
    """Share of statement resamples (pairs drawn with replacement within each axis and horizon) that keep the top match."""
    groups = {}
    for a, b in PAIRS:
        groups.setdefault((ITEMS[a]["axisId"], ITEMS[a]["horizon"]), []).append((a, b))
    top = classify(axis_scores(x[None, :]))[0][0, 0]
    keep = 0
    for _ in range(B):
        S = np.zeros(len(AX)); n = np.zeros(len(AX))
        for (ax, _h), g in groups.items():
            j = AX.index(ax)
            for k in rng.integers(0, len(g), len(g)):
                a, b = g[k]
                S[j] += x[a] * DIR[a] + x[b] * DIR[b]; n[j] += 2
        keep += classify((10 * S / (2 * n))[None, :])[0][0, 0] == top
    return keep / B


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("answers"); ap.add_argument("out")
    ap.add_argument("--test", action="store_true"); ap.add_argument("--seed", type=int, default=20261113)
    a = ap.parse_args()
    rng = np.random.default_rng(a.seed)
    os.makedirs(a.out, exist_ok=True)
    df = load(a.answers, a.test)
    ex, keep = exclusions(df)
    ex.to_csv(os.path.join(a.out, "exclusions.csv"), index=False)
    kept = df[keep].reset_index(drop=True)
    X = kept[[str(i) for i in IDS]].astype(float).to_numpy()
    n = len(X)
    S = axis_scores(X) if n else np.zeros((0, len(AX)))
    res = {"protocol": PROTOCOL_VERSION, "test_run": a.test, "item_set": ITEM_SET,
           "input_sha256": sha256(a.answers), "script_sha256": sha256(os.path.abspath(__file__)),
           "reference_sha256": sha256(os.path.join(HERE, "atlas_reference.json")), "seed": a.seed,
           "n_rows": len(df), "n_analysed": n,
           "excluded_by_rule": ex[ex.excluded].reasons.str.split("; ").explode().str.split(" ").str[0].value_counts().to_dict()}
    L = []
    if a.test:
        L += ["# TEST RUN on synthetic data", "", "**Nothing in this report describes real people.** It checks that the analysis runs.", ""]
    L += [f"# AI Worldview Atlas validation report (protocol {PROTOCOL_VERSION})", "",
          f"- Input: `{os.path.basename(a.answers)}`, sha256 `{res['input_sha256'][:16]}…`",
          f"- Script sha256 `{res['script_sha256'][:16]}…`; reference data sha256 `{res['reference_sha256'][:16]}…`; item set `{ITEM_SET}`",
          f"- Rows: {len(df)}; analysed after exclusions: {n}",
          f"- Excluded by rule: {res['excluded_by_rule'] or 'none'}", ""]

    def enough(key, have):
        if have < MIN_N[key]:
            L.append(f"*Not run: needs at least {MIN_N[key]} responses, has {have}.*"); L.append("")
            return False
        return True

    # A2 reliability
    L += ["## A2. Reliability of each axis", ""]
    res["reliability"] = {}
    if enough("reliability", n):
        L += ["| Axis | Alpha (18) | 95% CI | Near term (8) | Long run (10) | Verdict |", "|---|---|---|---|---|---|"]
        for ax in AX:
            M = (X * DIR)[:, AXIDX[ax]]
            al = cronbach(M); lo, hi = boot_ci(cronbach, M, rng, BOOT_ALPHA)
            t1 = cronbach((X * DIR)[:, [k for k in AXIDX[ax] if ITEMS[k]["horizon"] == "T1"]])
            t2 = cronbach((X * DIR)[:, [k for k in AXIDX[ax] if ITEMS[k]["horizon"] == "T2"]])
            verdict = "acceptable" if al >= ALPHA_GOOD else "marginal" if al >= ALPHA_MARGINAL else "needs revision"
            res["reliability"][ax] = {"alpha": al, "ci": [lo, hi], "alpha_T1": t1, "alpha_T2": t2, "verdict": verdict}
            L.append(f"| {AXNAME[ax]} | {al:.2f} | {lo:.2f} to {hi:.2f} | {t1:.2f} | {t2:.2f} | {verdict} |")
        L.append("")

    # A3 mirrored pairs and item-rest correlations
    L += ["## A3. Mirrored pairs and individual statements", ""]
    res["pairs"] = []
    if enough("reliability", n):
        flagged = []
        for a_, b_ in PAIRS:
            r = np.corrcoef(X[:, a_], X[:, b_])[0, 1] if X[:, a_].std() and X[:, b_].std() else float("nan")
            ax = ITEMS[a_]["axisId"]; M = (X * DIR)[:, AXIDX[ax]]
            rest = lambda k: np.corrcoef(M[:, AXIDX[ax].index(k)], M.sum(1) - M[:, AXIDX[ax].index(k)])[0, 1]
            rec = {"pair": [IDS[a_], IDS[b_]], "r": None if math.isnan(r) else float(r), "item_rest": [float(rest(a_)), float(rest(b_))]}
            res["pairs"].append(rec)
            if (not math.isnan(r) and r > PAIR_R_FLAG) or min(rec["item_rest"]) < ITEM_REST_FLAG:
                flagged.append(rec)
        strong_same = ((X[:, [p[0] for p in PAIRS]] == X[:, [p[1] for p in PAIRS]]) & (np.abs(X[:, [p[0] for p in PAIRS]]) == 2)).sum(1)
        res["flag_strong_same_pairs"] = int((strong_same >= STRONG_SAME_PAIRS_FLAG).sum())
        L.append(f"{len(flagged)} of {len(PAIRS)} pairs flagged (partners correlating above {PAIR_R_FLAG}, or a statement "
                 f"correlating below {ITEM_REST_FLAG} with the rest of its axis). Respondents giving the same strong answer "
                 f"to {STRONG_SAME_PAIRS_FLAG}+ mirrored pairs (flag only): {res['flag_strong_same_pairs']}.")
        if flagged:
            L += ["", "| Pair | Partner r | Item-rest r |", "|---|---|---|"]
            L += [f"| {f['pair'][0]}/{f['pair'][1]} | {f['r'] if f['r'] is None else round(f['r'], 2)} | "
                  f"{f['item_rest'][0]:.2f}, {f['item_rest'][1]:.2f} |" for f in flagged]
        L.append("")

    # A4 acquiescence, A5 axis independence
    L += ["## A4. Agreeing out of habit", ""]
    if enough("reliability", n):
        acq = X.mean(1)
        res["acquiescence_r"] = {ax: float(np.corrcoef(acq, S[:, j])[0, 1]) if S[:, j].std() else None for j, ax in enumerate(AX)}
        L.append("Correlation of each person's average raw answer (a habit of agreeing) with each axis score; the mirrored "
                 "design should keep these small: " + ", ".join(f"{AXNAME[k]} {v:.2f}" for k, v in res["acquiescence_r"].items() if v is not None) + ".")
        L.append("")
    L += ["## A5. Are the axes distinct?", ""]
    if enough("correlations", n):
        C = np.corrcoef(S.T); res["axis_correlations"] = C.tolist()
        high = [(AX[i], AX[j], C[i, j]) for i in range(8) for j in range(i + 1, 8) if abs(C[i, j]) >= AXIS_R_FLAG]
        L.append(f"Axis pairs correlating at |r| ≥ {AXIS_R_FLAG}: " + ("; ".join(f"{AXNAME[a]}–{AXNAME[b]} {r:.2f}" for a, b, r in high) or "none") + ".")
        L.append("")

    # A6 precision and tier band, A7 close-call margin
    L += ["## A6. Measurement precision and the tier boundary", ""]
    if enough("calibration", n):
        res["band"] = {}
        for j, ax in enumerate(AX):
            al = res["reliability"][ax]["alpha"]
            sem = S[:, j].std(ddof=1) * math.sqrt(max(0.0, 1 - al))
            band = min(BAND_MAX, max(BAND_MIN, round(BAND_Z * sem * 2) / 2)) if al >= ALPHA_GOOD else REF["tierBand"]
            res["band"][ax] = {"sem": sem, "suggested_band": band, "kept_provisional": al < ALPHA_GOOD}
        L.append("Standard error of measurement and the boundary it implies (1.96 × SEM, to the nearest 0.5, between 1 and 4; "
                 f"kept at {REF['tierBand']} where alpha is below {ALPHA_GOOD}): " +
                 ", ".join(f"{AXNAME[k]} SEM {v['sem']:.2f} → {v['suggested_band']}" for k, v in res["band"].items()) + ".")
        L.append("")
    L += ["## A7. Close-call margin", ""]
    if enough("calibration", n):
        order, dist = classify(S)
        gaps = dist[:, 1] - dist[:, 0]
        stab = np.array([stability(X[i], rng, BOOT_STABILITY) for i in range(n)])
        best = min(((m, float(np.mean((gaps < m) != (stab < 0.5)))) for m in np.arange(0.05, 4.01, 0.05)), key=lambda t: t[1])
        res["close_call"] = {"current": REF["closeCallMargin"], "suggested": round(float(best[0]), 2), "misclassified": best[1],
                             "share_unstable": float(np.mean(stab < 0.5)), "share_flagged_current": float(np.mean(gaps < REF["closeCallMargin"]))}
        cc = res["close_call"]
        L.append(f"{cc['share_unstable']:.0%} of results keep their top match in fewer than half of statement resamples. The "
                 f"margin that best separates them is {cc['suggested']} (current {cc['current']}, which flags "
                 f"{cc['share_flagged_current']:.0%}).")
        L.append("")

    # A8 distribution, A9 self-identification
    L += ["## A8. Which archetypes people land on", ""]
    if n:
        order, _ = classify(S)
        counts = pd.Series([PNAME[k] for k in order[:, 0]]).value_counts()
        res["top_match_counts"] = counts.to_dict()
        L.append(", ".join(f"{k} {v}" for k, v in counts.head(12).items()) + (f", and {len(counts) - 12} more" if len(counts) > 12 else "") + ".")
        L.append("")
    L += ["## A9. Does the quiz find the viewpoint people pick for themselves?", ""]
    sid = kept.get("Self-identified viewpoint", pd.Series([""] * n))
    have = sid != ""
    if enough("selfId", int(have.sum())):
        order, _ = classify(S)
        idx = {nm: k for k, nm in enumerate(PNAME)}
        chosen = np.array([idx.get(v, -1) for v in sid])
        m = have.to_numpy() & (chosen >= 0)
        top1 = float(np.mean(order[m, 0] == chosen[m])); top3 = float(np.mean((order[m, :3] == chosen[m][:, None]).any(1)))
        res["self_id"] = {"n": int(m.sum()), "top1": top1, "top3": top3, "chance_top1": 1 / len(PNAME), "chance_top3": 3 / len(PNAME)}
        L.append(f"Of {int(m.sum())} people who picked a viewpoint first, {top1:.0%} got it as their top match and {top3:.0%} "
                 f"within their top three (chance: {1 / len(PNAME):.0%} and {3 / len(PNAME):.0%}).")
        L.append("")

    # A11 archetype coordinates against the people who chose them
    L += ["## A11. Archetype coordinates against the people who chose them", ""]
    res["recalibration"] = {}
    if int(have.sum()):
        for k, nm in enumerate(PNAME):
            m = (sid == nm).to_numpy()
            if m.sum() < RECAL_MIN_PER_ARCHETYPE:
                continue
            mean, se = S[m].mean(0), S[m].std(0, ddof=1) / math.sqrt(m.sum())
            off = {AX[j]: {"coord": float(PROF[k, j]), "mean": float(mean[j]), "ci": [float(mean[j] - 1.96 * se[j]), float(mean[j] + 1.96 * se[j])]}
                   for j in range(len(AX)) if abs(mean[j] - PROF[k, j]) > max(1.96 * se[j], RECAL_MIN_GAP - 1e-9)}
            res["recalibration"][nm] = {"n": int(m.sum()), "axes_outside_ci": off}
        if res["recalibration"]:
            for nm, v in res["recalibration"].items():
                L.append(f"- {nm} (n = {v['n']}): " + ("; ".join(f"{AXNAME[a]} coordinate {o['coord']:+g}, chosen-by mean {o['mean']:+.1f} "
                         f"(95% CI {o['ci'][0]:+.1f} to {o['ci'][1]:+.1f}), proposed {round(o['mean']):+d}" for a, o in v["axes_outside_ci"].items())
                         or f"no coordinate {RECAL_MIN_GAP:g}+ points from its chosen-by mean"))
        else:
            L.append(f"*Not run: no archetype was chosen by at least {RECAL_MIN_PER_ARCHETYPE} people.*")
        L.append("")
    else:
        L += ["*Not run: no one picked a viewpoint.*", ""]

    # A10 retest
    L += ["## A10. Taking it twice", ""]
    codes = kept.get("Retest code", pd.Series([""] * n)).str.strip().str.lower()
    pairs = []
    for code, g in kept[codes != ""].groupby(codes[codes != ""]):
        g = g.assign(t=pd.to_datetime(g["Submitted"], errors="coerce")).sort_values("t")
        if len(g) >= 2 and pd.notna(g.t.iloc[0]) and (g.t.iloc[1] - g.t.iloc[0]).days >= RETEST_MIN_DAYS:
            pairs.append((g.index[0], g.index[1]))
    if enough("retest", len(pairs)):
        A, B_ = S[[p[0] for p in pairs]], S[[p[1] for p in pairs]]
        res["retest"] = {"pairs": len(pairs), "r": {ax: float(np.corrcoef(A[:, j], B_[:, j])[0, 1]) for j, ax in enumerate(AX)},
                         "same_top_match": float(np.mean(classify(A)[0][:, 0] == classify(B_)[0][:, 0]))}
        L.append(f"{len(pairs)} people took it twice, at least {RETEST_MIN_DAYS} days apart. Axis correlations: " +
                 ", ".join(f"{AXNAME[k]} {v:.2f}" for k, v in res["retest"]["r"].items()) +
                 f". Same top match both times: {res['retest']['same_top_match']:.0%}.")
        L.append("")

    if a.test:
        L += ["---", "TEST RUN on synthetic data. Nothing above describes real people."]
    open(os.path.join(a.out, "report.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    json.dump(res, open(os.path.join(a.out, "results.json"), "w"), indent=1, default=float)
    print("\n".join(L[:12])); print(f"... full report in {os.path.join(a.out, 'report.md')}")


if __name__ == "__main__":
    main()
