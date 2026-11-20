"""Test harness: paper tally rules (as printed by build.py) vs the Atlas engine, on 3,000 generated sheets (synthetic test data)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B
r = json.load(open(os.path.join(B.HERE, 'engine_results.json')))
LET = {1: 'SD', 2: 'D', 4: 'A', 5: 'SA'}
core_by_tiers = {tuple(a['tiers']): a['name'] for a in B.APP['CORE_ARCHETYPES']}
bad = {'nets': 0, 'blanks': 0, 'score': 0, 'table': 0, 'tier': 0, 'core': 0, 'agree': 0}
for x in r:
    ans = {int(k): v for k, v in x['answers'].items()}
    net, blank = {}, {}
    for ax in B.AX:
        for h in ('T1', 'T2'):
            a_pts = b_pts = nb = 0
            for iid in [i for i in B.ORDER if B.BYID[i]['axisId'] == ax and B.BYID[i]['horizon'] == h]:
                if iid not in ans: nb += 1; continue           # "—" scores nothing but is counted
                ea, eb = B.entries(B.BYID[iid]); L = LET[ans[iid]]
                a_pts += sum(p for l, p in ea if l == L); b_pts += sum(p for l, p in eb if l == L)
            net[(ax, h)] = a_pts - b_pts; blank[(ax, h)] = nb
        bad['nets'] += net[(ax, 'T1')] != x['r1'][ax] or net[(ax, 'T2')] != x['r2'][ax]
        bad['blanks'] += B.N1 - blank[(ax, 'T1')] != x['a1'][ax] or B.N2 - blank[(ax, 'T2')] != x['a2'][ax]
    total = {ax: net[(ax, 'T1')] + net[(ax, 'T2')] for ax in B.AX}
    base = {ax: B.base_of(blank[(ax, 'T1')], blank[(ax, 'T2')]) for ax in B.AX}
    score = {ax: B.score_of(total[ax], base[ax]) for ax in B.AX}
    bad['score'] += any(abs(score[ax] - x['combined'][ax]) > 1e-9 for ax in B.AX)
    # the printed table rounds |score| to one decimal; it must agree with the engine's score rounded the same way
    bad['table'] += any(f'{abs(score[ax]):.1f}' != f'{abs(x["combined"][ax]):.1f}' for ax in B.AX)
    tiers = {ax: 1 if total[ax] >= B.tier_net(base[ax]) else -1 if -total[ax] >= B.tier_net(base[ax]) else 0 for ax in B.AX}
    tiers_printed = {ax: 1 if round(score[ax], 1) >= 2 else -1 if round(score[ax], 1) <= -2 else 0 for ax in B.AX}
    eng_t = {ax: 1 if x['combined'][ax] >= 2 else -1 if x['combined'][ax] <= -2 else 0 for ax in B.AX}
    bad['tier'] += tiers != eng_t or tiers_printed != eng_t
    bad['core'] += core_by_tiers[(tiers['ontological'], tiers['legalMoral'], -tiers['teleological'] or 0)] != x['core']
    sym = {1: '+', 0: '0', -1: B.MINUS}
    top = B.PROFILES[x['top'][0]['id']]
    bad['agree'] += sum(sym[tiers[a]] == B.tier_sym(top['coords'][a]) for a in B.AX) != x['top'][0]['agree']
print(len(r), 'sheets | mismatches:', bad)
