#!/usr/bin/env python3
"""Writes a SYNTHETIC answers file for testing analyze_atlas.py. Every row is marked Synthetic=TRUE, and the
analysis refuses it without --test. Respondents are simulated around archetype coordinates; nothing here is data
about people.

Usage: python3 analysis/make_test_data.py OUT.csv [N]"""
import csv, json, math, os, random, sys
from datetime import datetime, timedelta
REF = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "atlas_reference.json"), encoding="utf-8"))
AX = [a["id"] for a in REF["axes"]]
out, N = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 400
rng = random.Random(7)

def respond(theta):
    ans = {}
    for i in REF["items"]:
        t = theta[i["axisId"]] + rng.gauss(0, 0.3)
        side = 1 if rng.random() < 1 / (1 + math.exp(-3 * i["direction"] * t)) else -1
        ans[i["id"]] = 0 if rng.random() < 0.05 else side * (2 if rng.random() < min(0.95, abs(t)) else 1)
    return ans

head = ["Response ID", "Submitted", "Item set", "Consent", "Self-identified viewpoint", "Retest code", "Check 901", "Check 902"] + [str(i["id"]) for i in REF["items"]] + ["Synthetic"]
start = datetime(2026, 12, 1)
rows = []
for n in range(N):
    p = rng.choice(REF["profiles"])
    theta = {a: max(-1, min(1, p["coords"][a] / 10 + rng.gauss(0, 0.15))) for a in AX}
    retest = f"code{n}" if n < 40 else ""
    for take in range(2 if retest else 1):
        ans = respond(theta)
        if n % 50 == 3:                      # a careless sheet: the same answer everywhere
            ans = {k: 1 for k in ans}
        rows.append([f"S{n}-{take}", (start + timedelta(days=n % 20 + 10 * take)).isoformat(), REF["itemSet"],
                     "No" if n % 40 == 5 else "Yes", p["name"] if rng.random() < 0.5 else "", retest,
                     -1 if n % 25 else 1, 2 if rng.random() < 0.6 else ""] + [ans[i["id"]] for i in REF["items"]] + ["TRUE"])
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(head); w.writerows(rows)
print(len(rows), "synthetic rows ->", out)
