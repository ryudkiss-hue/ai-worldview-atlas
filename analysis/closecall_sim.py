"""SIMULATION ONLY (synthetic respondents, never reported as data about people).
Calibrates the close-call margin against measurement error. For each synthetic answer sheet, the statements are
resampled within each axis and horizon (a bootstrap: "what if you'd met a different handful of statements on the same
themes?") and the sheet is rescored. A result is unstable when the top match survives fewer than half the resamples.
The margin is the gap between the two closest archetypes that best separates stable from unstable results."""
import json, math, random, sys
import numpy as np
import os
REF = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'atlas_reference.json'), encoding='utf-8'))
items = [dict(i, agreeShiftsToward='A' if i['direction'] == 1 else 'B') for i in REF['items']]
if '--short' in sys.argv:   # the short version: three pairs per axis
    SHORT = {7, 13, 15, 25, 27, 31, 41, 49, 53, 55, 67, 69, 79, 81, 85, 93, 101, 103, 109, 117, 121, 127, 137, 143}
    items = [i for i in items if i['id'] in SHORT or i['id'] - 1 in SHORT]
AX = [a['id'] for a in REF['axes']]
profiles = REF['profiles']
P = np.array([[p['coords'][a] for a in AX] for p in profiles], float)
# groups of pair ids per axis and horizon
groups = []
for a in AX:
    for h in ('T1', 'T2'):
        groups.append([(i['id'], i['pair']) for i in items if i['axisId'] == a and i['horizon'] == h and i['agreeShiftsToward'] == 'A'])
gax = [AX.index(a) for a in AX for h in ('T1', 'T2')]
def score_pairs(ans, gsel):
    S = np.zeros(8); n = np.zeros(8)
    for g, sel in zip(range(len(groups)), gsel):
        for k in sel:
            a, b = groups[g][k]
            S[gax[g]] += ans[a] - ans[b]; n[gax[g]] += 2
    return 10 * S / (2 * n)
full = [list(range(len(g))) for g in groups]
def respond(theta, rng, k=3.0, noise=0.3):
    ans = {}
    for i in items:
        t = theta[AX.index(i['axisId'])] + rng.gauss(0, noise)
        s = 1 if i['agreeShiftsToward'] == 'A' else -1
        side = 1 if rng.random() < 1 / (1 + math.exp(-k * s * t)) else -1
        ans[i['id']] = side * (2 if rng.random() < min(0.95, abs(t)) else 1)
    return ans
def analyse(sheets, rng, B=200):
    gaps, stab = [], []
    for ans in sheets:
        S = score_pairs(ans, full); dd = np.sqrt(((P - S) ** 2).sum(1)); o = np.argsort(dd)
        top = o[0]; gaps.append(dd[o[1]] - dd[o[0]])
        keep = 0
        for _ in range(B):
            sel = [[rng.randrange(len(g)) for _ in g] for g in groups]
            Sb = score_pairs(ans, sel); keep += int(np.argmin(((P - Sb) ** 2).sum(1)) == top)
        stab.append(keep / B)
    return np.array(gaps), np.array(stab)
rng = random.Random(11)
near = []
for p in profiles:
    for _ in range(20):
        theta = [max(-1, min(1, p['coords'][a] / 10 + rng.gauss(0, 0.15))) for a in AX]
        near.append(respond(theta, rng))
broad = [respond([rng.uniform(-1, 1) for _ in AX], rng) for _ in range(500)]
g1, s1 = analyse(near, rng); g2, s2 = analyse(broad, rng)
G = np.concatenate([g1, g2]); S = np.concatenate([s1, s2]); U = S < 0.5
best = None
for m in np.arange(0.1, 4.01, 0.05):
    err = np.mean((G < m) != U)
    if best is None or err < best[1]: best = (round(float(m), 2), float(err))
m = best[0]
print(f'unstable (top match kept in <50% of resamples): near-archetype {np.mean(s1<0.5):.0%}, broad {np.mean(s2<0.5):.0%}')
print(f'best margin {m} (misclassifies {best[1]:.0%} of sheets)')
for name, g, s in (('near-archetype', g1, s1), ('broad', g2, s2)):
    print(f'  {name}: flagged at {m}: {np.mean(g<m):.0%}; at 0.8: {np.mean(g<0.8):.0%}')
print('median stability by gap band:')
for lo, hi in ((0, .5), (.5, 1), (1, 1.5), (1.5, 2), (2, 3), (3, 5), (5, 99)):
    sel = (G >= lo) & (G < hi)
    if sel.any(): print(f'  gap {lo}-{hi}: n={sel.sum()}, median kept {np.median(S[sel]):.2f}')
