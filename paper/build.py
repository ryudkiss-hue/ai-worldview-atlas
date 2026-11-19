"""Builds the paper edition of the AI Worldview Atlas (144 statements, tally scoring) as HTML for render.py.

Run from the repository root:
  npx vite-node scripts/export_paper_data.ts      # paper/data.json from the quiz source
  python3 paper/build.py                          # paper/booklet.html
  python3 paper/render.py                         # public/ai-worldview-atlas-paper.pdf (needs Python Playwright)
  npx vite-node paper/gen_engine.ts && python3 paper/verify.py   # check tally scoring against the app's engine
"""
import json, random, html, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
E = html.escape
MINUS = '−'
D = json.load(open(os.path.join(HERE, 'data.json'), encoding='utf-8'))
AXES, ITEMS = D['axes'], D['items']
AX = [a['id'] for a in AXES]
APP = D
PROFILES = {p['id']: p for p in D['profiles']}
BYID = {i['id']: i for i in ITEMS}
N1, N2 = 8, 10                     # statements per axis: near term, long run
FULL1, FULL2, FULL = 2 * N1, 2 * N2, 2 * (N1 + N2)   # largest possible nets: 16, 20, 36
HALF1, HALF2 = math.ceil(N1 / 2), math.ceil(N2 / 2)  # a block's base never drops below half its statements
def base_of(blank1, blank2): return max(N1 - blank1, HALF1) + max(N2 - blank2, HALF2)
def tier_net(base): return -(-2 * base // 5)          # smallest whole net with score >= 2: net * 5 / base >= 2
def score_of(net, base): return 5 * net / base
SHORT = {'ontological': 'Exper.', 'legalMoral': 'Moral', 'relational': 'Relat.', 'teleological': 'Growth',
         'evolutionary': 'Control', 'risk': 'Speed', 'socioEconomic': 'Open.', 'geopolitical': 'Nations'}
URL = 'ryudkiss-hue.github.io/ai-worldview-atlas/#/paper'

# ---------- fixed order: shuffled within each axis and horizon, mirrored partners at least 4 apart ----------
def axis_order(ax, seed):
    ids = [i['id'] for i in ITEMS if i['axisId'] == ax]
    rng = random.Random(seed)
    for _ in range(20000):
        rng.shuffle(ids)
        pos = {v: k for k, v in enumerate(ids)}
        if all(abs(pos[i] - pos[BYID[i]['pair']]) >= 4 for i in ids):
            return list(ids)
    raise SystemExit('no order')
ORDER = []
for k, ax in enumerate(AX):
    ORDER += axis_order(ax, 2000 + k)
PAPER = {iid: n + 1 for n, iid in enumerate(ORDER)}

def entries(it):
    """(pole A cell, pole B cell) as [(letter, points)] for one statement."""
    agree, disagree = [('A', 1), ('SA', 2)], [('D', 1), ('SD', 2)]
    return (agree, disagree) if it['agreeShiftsToward'] == 'A' else (disagree, agree)

def tier_sym(v): return '+' if v >= 2 else (MINUS if v <= -2 else '0')

def cell(e): return ' · '.join(f'<span class="tk">{l}&nbsp;{p}</span>' for l, p in e)

# ---------- pieces ----------
def statements_pages():
    out = []
    for k, a in enumerate(AXES):
        ids = ORDER[k * 18:(k + 1) * 18]
        for half in (0, 1):
            rows = ''.join(f'<div class="q"><span class="qn">{PAPER[i]}</span><span class="qt">{E(BYID[i]["statement"])}</span>'
                           f'<div class="opts">{"".join(f"<span class=opt>{o}</span>" for o in ("SD", "D", "A", "SA", "—"))}</div></div>'
                           for i in ids[half * 9:(half + 1) * 9])
            cont = '' if half == 0 else ', continued'
            note = '<p class="note" style="text-align:right">Continued on the next page</p>' if half == 0 else (
                '<p class="note" style="text-align:right">End of Part 1. Turn the page to start scoring.</p>' if k == 7 else '')
            out.append(f'''<section class="stage"><div class="stagehead"><span class="eyebrow">Part 1 · Axis {k + 1} of 8{cont}</span>
<h2>{E(a["name"])}</h2><p class="small">{E(a["question"])}</p></div>
<div class="scale-key">SD strongly disagree · D disagree · A agree · SA strongly agree · — I have no settled view</div>
<div class="qs">{rows}</div>{note}</section>''')
    return '\n'.join(out)

def grid_pages():
    out = []
    for k, a in enumerate(AXES):
        ids = ORDER[k * 18:(k + 1) * 18]
        body = ''
        for h, label in (('T1', 'Near term'), ('T2', 'Long run')):
            hid = sorted([i for i in ids if BYID[i]['horizon'] == h], key=lambda i: PAPER[i])
            for i in hid:
                ea, eb = entries(BYID[i])
                body += f'<tr><td class="num">{PAPER[i]}</td><td class="ya"></td><td class="on">{cell(ea)}</td><td class="on">{cell(eb)}</td></tr>'
            body += f'<tr class="sub"><td colspan="2" class="sublabel" style="white-space:nowrap">{label} totals<br><span class="small">— answers: ____</span></td><td class="box"></td><td class="box"></td></tr>'
        out.append(f'''<section class="grid"><div class="stagehead"><span class="eyebrow">Part 2 · Scoring grid · Axis {k + 1} of 8</span><h2>{E(a["name"])}</h2></div>
<table class="tally"><thead><tr><th>No.</th><th>Your<br>answer</th><th>Pole A: {E(a["poleA"])}</th><th>Pole B: {E(a["poleB"])}</th></tr></thead>
<tbody>{body}</tbody></table>
<p class="note">Circle the entry that matches your answer in each row. An answer of — (no settled view) scores nothing, but count how many you gave in each block and write the count beside its totals, because the totals page needs it. Statements are grouped by time frame here, so the numbers are not in order.</p></section>''')
    return '\n'.join(out)

def totals_page():
    rows = ''.join(f'<tr><td>{E(a["name"])}</td>' + '<td class="box"></td>' * 8 + '</tr>' for a in AXES)
    srows = ''.join(f'<tr><td>{E(a["name"])}</td>' + '<td class="box"></td>' * 4 + '</tr>' for a in AXES)
    return f'''<section class="stack"><span class="eyebrow">Part 2 · Totals</span><h2>Your totals</h2>
<p>Copy each grid's totals and its count of — answers into the table. Each <b>net</b> is pole A points minus pole B points.</p>
<table class="work"><thead><tr><th>Axis</th><th>Near A</th><th>Near B</th><th>Near net</th><th>Near —</th><th>Long A</th><th>Long B</th><th>Long net</th><th>Long —</th></tr></thead><tbody>{rows}</tbody></table>
<h3>Your scores</h3>
<p>The <b>total net</b> is the near-term net plus the long-run net. The <b>base</b> is how many statements you answered on that axis: {N1} near-term statements minus your near-term — answers, but never less than {HALF1}, plus {N2} long-run statements minus your long-run — answers, but never less than {HALF2}. With no — answers the base is {N1 + N2}.</p>
<table class="work"><thead><tr><th>Axis</th><th>Total net</th><th>Base</th><th>Score</th><th>Tier</th></tr></thead><tbody>{srows}</tbody></table>
<p><b>Score</b> = total net × 5 ÷ base, rounded to one decimal place. It runs from {MINUS}10 to +10. The next page gives every score, so no calculator is needed: find your total net without its sign in the left column, read across to your base, and give the score the same sign.</p>
<p><b>Tier</b> = <b>+</b> if the score is +2.0 or more, <b>{MINUS}</b> if it is {MINUS}2.0 or less, and <b>0</b> otherwise.</p>
<p class="small">Leaving a statement as — doesn't pull your score toward the middle, because the score is an average over the statements you answered. The floor on the base keeps one strong answer on an axis you mostly left blank from producing an extreme score. Someone who answered A to every statement would get a total net of 0 on every axis, because every statement has a mirrored partner.</p>
</section>''' + score_table_page()

def score_table_page():
    bases = list(range(HALF1 + HALF2, N1 + N2 + 1))
    head = '<tr><th>Net</th>' + ''.join(f'<th>{b}</th>' for b in bases) + '</tr>'
    body = ''.join('<tr><td class="num"><b>' + str(n) + '</b></td>' + ''.join(
        (f'<td class="num">{score_of(n, b):.1f}</td>' if n <= 2 * b else '<td></td>') for b in bases) + '</tr>' for n in range(0, FULL + 1))
    return f'''<section class="stack"><span class="eyebrow">Part 2 · Score table</span><h2>Score for each total net and base</h2>
<p class="small">Rows are total nets without their sign; columns are bases. Give the score your net's sign. A blank cell can't happen: a net can't be larger than twice the base.</p>
<table class="conv scores"><thead>{head}</thead><tbody>{body}</tbody></table></section>'''

def core_page():
    T, A = APP['CORE_TIERS'], APP['CORE_ARCHETYPES']
    def arch(t): return next(a for a in A if a['tiers'] == list(t))
    sym = lambda v: '+' if v > 0 else (MINUS if v < 0 else '0')
    grids = ''
    for xt in (-1, 0, 1):
        head = ''.join(f'<th>Z{sym(z)}</th>' for z in (-1, 0, 1))
        body = ''.join('<tr><th>Y' + sym(y) + '</th>' + ''.join(f'<td>{E(arch((xt, y, z))["name"].replace("The ", "", 1))}</td>' for z in (-1, 0, 1)) + '</tr>' for y in (1, 0, -1))
        grids += f'<div class="xgrp"><span class="eyebrow">X{sym(xt)} · {E(T["x"][str(xt)]["label"])}</span><table class="cells"><thead><tr><th></th>{head}</tr></thead><tbody>{body}</tbody></table></div>'
    return f'''<section class="stack"><span class="eyebrow">Part 2 · Your core three</span><h2>Your core-three archetype</h2>
<p>Three of the axes are about AI systems themselves and what they are for. Their tiers place you among 27 archetypes:</p>
<ul class="small"><li><b>X</b> is your <b>Machine Experience</b> tier.</li><li><b>Y</b> is your <b>Moral Standing</b> tier.</li>
<li><b>Z</b> is your <b>Growth and Limits</b> tier <b>reversed</b>: + becomes {MINUS}, {MINUS} becomes +, and 0 stays 0. Z+ is the within-limits end and Z{MINUS} the growth-first end.</li></ul>
<p>Find the table for your X tier, then the row for your Y tier and the column for your Z tier.</p>{grids}
<div class="box2" style="gap:9pt">{"".join(f'<div style="display:grid;grid-template-columns:110pt 1fr;align-items:end;gap:6pt"><span class="eyebrow">{lab}</span><div style="height:14pt;border-bottom:1px solid var(--line)"></div></div>' for lab in ("X  Y  Z tiers", "Core-three archetype"))}</div>
</section>'''

def agreement_pages():
    you = '<tr class="you"><td><b>Your tiers</b></td>' + '<td class="box"></td>' * 8 + '<td></td></tr>'
    head = '<tr><th>Archetype</th>' + ''.join(f'<th>{SHORT[a]}</th>' for a in AX) + '<th>Matches</th></tr>'
    def table(clusters):
        rows = ''
        for c in clusters:
            rows += f'<tr class="grp"><td colspan="10">{E(c["name"])}</td></tr>'
            for pid in c['profileIds']:
                p = PROFILES[pid]
                rows += f'<tr><td>{E(p["name"])}</td>' + ''.join(f'<td class="num">{tier_sym(p["coords"][a])}</td>' for a in AX) + '<td class="box"></td></tr>'
        return f'<table class="agree"><thead>{head}</thead><tbody>{you}{rows}</tbody></table>'
    cl = APP['archetypeClusters']
    return f'''<section class="stack"><span class="eyebrow">Part 2 · The 50 archetypes</span><h2>Archetypes that share your sides</h2>
<p class="small">Write your eight tiers in the top row of each table. For each archetype, count the axes where its symbol matches yours and write the count in the last column. The archetypes with the highest counts share your side on the most axes. This count is a different measure from the online match, which ranks archetypes by overall distance, so the two can differ. For the exact online match, enter your 16 nets and your counts of — (near and long for each axis) at <b>{URL}</b>.</p>
{table(cl[:3])}</section>
<section class="stack"><span class="eyebrow">Part 2 · The 50 archetypes, continued</span>{table(cl[3:])}</section>'''

def reference_pages():
    out = ''
    for c in APP['archetypeClusters']:
        cards = ''.join(f'<div class="card c50"><h3>{E(PROFILES[pid]["name"])}</h3><p>{E(PROFILES[pid]["summary"])}</p></div>' for pid in c['profileIds'])
        out += f'<h3 class="grp-h">{E(c["name"])}</h3><div class="cards2">{cards}</div>'
    return f'''<section class="stack"><span class="eyebrow">Reference</span><h2>The 50 archetypes</h2>
<p class="small">Grouped into seven families. No archetype is the right answer, and most people hold more mixed views than any one archetype describes.</p>{out}</section>'''

def core_reference():
    T, A = APP['CORE_TIERS'], APP['CORE_ARCHETYPES']
    sym = lambda v: '+' if v > 0 else (MINUS if v < 0 else '0')
    names = {'x': 'X · Machine Experience', 'y': 'Y · Moral Standing', 'z': 'Z · Growth and Limits, reversed'}
    tiers = ''.join(f'<div class="axis"><h3>{names[k]}</h3><div class="tkrow">' + ''.join(
        f'<div class="tk3"><span class="mono small">{k.upper()}{sym(v)}</span><p><b>{E(T[k][str(v)]["label"][0].upper() + T[k][str(v)]["label"][1:])}.</b> {E(T[k][str(v)]["sentence"])}</p><p class="small">Related: {E(T[k][str(v)]["thinkers"])}</p></div>'
        for v in (-1, 0, 1)) + '</div></div>' for k in 'xyz')
    cards = ''.join(f'<div class="card c27"><span class="mono">{" ".join(c.upper() + sym(v) for c, v in zip("xyz", a["tiers"]))}</span><h3>{E(a["name"])}</h3><p>{E(a["tagline"])}</p></div>' for a in A)
    return f'''<section class="stack"><span class="eyebrow">Reference</span><h2>What your core-three tiers say</h2>
<p class="small">Your core-three description is the three sentences below for your three tiers. If your X tier is {MINUS} and your Y tier is +, use this sentence for Y instead: {E(APP["Y_POSITIVE_FOR_DOUBTERS"])} Related thinkers made arguments close to one tier; none of them necessarily holds a whole profile.</p>{tiers}</section>
<section class="stack"><span class="eyebrow">Reference</span><h2>The 27 core-three archetypes</h2><div class="cards3">{cards}</div></section>'''

def map_table():
    cells = [(n + 1, ORDER[n]) for n in range(144)]
    cols, per = 8, 18
    out = '<table class="map"><thead><tr>' + ''.join('<th>Paper</th><th>ID</th>' for _ in range(cols)) + '</tr></thead><tbody>'
    for r in range(per):
        out += '<tr>' + ''.join(f'<td>{cells[c * per + r][0]}</td><td>{cells[c * per + r][1]}</td>' for c in range(cols)) + '</tr>'
    return out + '</tbody></table>'

F = os.path.join(ROOT, 'node_modules', '@fontsource')
css = f'''
@font-face{{font-family:"Newsreader";src:url("file://{F}/newsreader/files/newsreader-latin-500-normal.woff2");font-weight:500}}
@font-face{{font-family:"Instrument Sans";src:url("file://{F}/instrument-sans/files/instrument-sans-latin-400-normal.woff2");font-weight:400}}
@font-face{{font-family:"Instrument Sans";src:url("file://{F}/instrument-sans/files/instrument-sans-latin-600-normal.woff2");font-weight:600}}
@font-face{{font-family:"JetBrains Mono";src:url("file://{F}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2");font-weight:400}}
:root{{--ink:#16201d;--muted:#55625d;--line:#b9c3bf;--hair:#d9dfdc;--shade:#eceff0}}
@page{{size:Letter;margin:0.6in 0.65in 0.7in}} *{{box-sizing:border-box}}
body{{margin:0;font-family:"Instrument Sans",Helvetica,sans-serif;font-size:10.2pt;line-height:1.42;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}}
h1,h2,h3{{font-family:"Newsreader",Georgia,serif;font-weight:500;margin:0;line-height:1.15}} h1{{font-size:32pt}} h2{{font-size:17pt}} h3{{font-size:11.5pt}}
p{{margin:0}} ul{{margin:0;padding-left:14pt}} .small{{font-size:8.8pt;color:var(--muted)}} .mono{{font-family:"JetBrains Mono",monospace}}
.eyebrow{{font-family:"JetBrains Mono",monospace;font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}}
section{{break-before:page}} section:first-of-type{{break-before:auto}} .stack{{display:grid;gap:9pt}}
.lede{{font-size:13pt;color:var(--muted)}} .box2{{border:1px solid var(--line);border-radius:6pt;padding:10pt 12pt;display:grid;gap:6pt}}
.box2 ol{{margin:0;padding-left:14pt;display:grid;gap:3pt}} .facts{{display:flex;gap:18pt;font-family:"JetBrains Mono",monospace;font-size:8.5pt;color:var(--muted)}}
.stagehead{{display:grid;gap:2pt;margin-bottom:6pt}} .scale-key{{font-family:"JetBrains Mono",monospace;font-size:7.5pt;color:var(--muted);margin-bottom:4pt}}
.q{{display:grid;grid-template-columns:22pt 1fr auto;gap:10pt;align-items:center;padding:11pt 0;border-bottom:1px solid var(--hair);break-inside:avoid}}
.qn{{font-family:"JetBrains Mono",monospace;font-size:8.5pt;color:var(--muted);text-align:right}} .qt{{font-size:10.8pt;line-height:1.38}}
.opts{{display:flex;gap:4pt}} .opt{{font-family:"JetBrains Mono",monospace;font-size:8.3pt;width:25pt;height:19pt;border:1px solid var(--line);border-radius:9pt;display:grid;place-items:center}}
table{{border-collapse:collapse;width:100%}}
.tally th,.tally td{{border:1px solid var(--line);padding:5pt 5pt;font-size:8.8pt;vertical-align:middle}}
.tally th{{font-family:"JetBrains Mono",monospace;font-weight:400;background:var(--shade);font-size:7.6pt}}
.tally td.num{{font-family:"JetBrains Mono",monospace;text-align:center;width:30pt}} .tally td.ya{{width:40pt}}
.tally td.on{{font-family:"JetBrains Mono",monospace;text-align:center}} .tk{{padding:0 1pt}}
.tally tr.sub td{{height:22pt;border-top:2px solid var(--ink)}} .sublabel{{font-weight:600;font-size:8.5pt}} td.box{{background:#fff}}
.note{{font-size:8.5pt;color:var(--muted);margin-top:6pt}}
.work th,.work td{{border:1px solid var(--line);padding:4pt 5pt;font-size:8.8pt}} .work th{{background:var(--shade);font-family:"JetBrains Mono",monospace;font-weight:400;font-size:7.3pt}}
.work td.box{{height:20pt}}
.conv th,.conv td{{border:1px solid var(--hair);padding:1pt 6pt;font-size:7.8pt}} .conv th{{background:var(--shade);font-family:"JetBrains Mono",monospace;font-weight:400}}
.conv td.num{{font-family:"JetBrains Mono",monospace;text-align:right}} .conv.scores td,.conv.scores th{{padding:0.6pt 4pt;font-size:7.4pt}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:14pt;align-items:start}}
.cells th,.cells td{{border:1px solid var(--hair);padding:2pt 5pt;font-size:8.6pt;text-align:center;width:31%}}
.cells th{{background:var(--shade);font-family:"JetBrains Mono",monospace;font-weight:400;font-size:7.5pt;width:auto}} .xgrp{{display:grid;gap:3pt}}
.agree th,.agree td{{border:1px solid var(--hair);padding:0.6pt 4pt;font-size:7.3pt;line-height:1.25}} .agree th{{background:var(--shade);font-family:"JetBrains Mono",monospace;font-weight:400;font-size:6.9pt}}
.agree td.num{{text-align:center;font-family:"JetBrains Mono",monospace;width:30pt}} .agree td.box{{width:38pt}} .agree tr.grp td{{background:var(--shade);font-weight:600;font-size:7.6pt}}
.agree tr.you td{{height:16pt;border-bottom:2px solid var(--ink)}} .agree tr.grp td{{padding-top:1.5pt}}
.cards2{{display:grid;grid-template-columns:1fr 1fr;gap:6pt}} .cards3{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5pt}}
.card{{border:1px solid var(--line);border-radius:6pt;padding:6pt 8pt;display:grid;gap:2pt;break-inside:avoid;align-content:start}}
.c50{{font-size:8.3pt;line-height:1.32}} .c50 h3{{font-size:10pt}} .grp-h{{margin-top:6pt}}
.c27{{font-size:8pt;line-height:1.3}} .c27 h3{{font-size:9.6pt}} .c27 .mono{{font-size:7pt;color:var(--muted)}}
.axis{{border-top:1px solid var(--line);padding-top:4pt;display:grid;gap:2pt}} .intro-axes .small{{font-size:8.1pt;line-height:1.3}} .intro-axes h3{{font-size:10.5pt}} .intro-axes b{{font-size:8.8pt}} .tkrow{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10pt}} .tk3{{display:grid;gap:2pt;align-content:start;font-size:9pt}}
.map td,.map th{{border:1px solid var(--hair);padding:1.4pt 4pt;font-family:"JetBrains Mono",monospace;font-size:7.2pt;text-align:center}} .map th{{background:var(--shade);font-weight:400}}
.step{{display:grid;grid-template-columns:20pt 1fr;gap:8pt;align-items:start}}
.stepn{{font-family:"JetBrains Mono",monospace;font-size:9pt;border:1px solid var(--ink);border-radius:50%;width:17pt;height:17pt;display:grid;place-items:center}}
'''

ex = next(i for i in ORDER[:18] if BYID[i]['agreeShiftsToward'] == 'B')
exA, exB = entries(BYID[ex])
axes_block = ''.join(f'''<div class="axis"><h3>{k + 1} · {E(a["name"])}</h3><p class="small">{E(a["question"])}</p>
<div class="two" style="gap:12pt"><div><b>Pole A · {E(a["poleA"])}</b><p class="small">{E(a["poleADesc"])}</p></div><div><b>Pole B · {E(a["poleB"])}</b><p class="small">{E(a["poleBDesc"])}</p></div></div></div>''' for k, a in enumerate(AXES))

doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>AI Worldview Atlas · Paper edition</title><style>{css}</style></head><body>
<section class="stack"><span class="eyebrow">Paper edition with tally scoring · 144 statements</span>
<h1>The AI Worldview Atlas</h1>
<p class="lede">Where you stand on AI and its future: whether an AI system could ever have experiences, how it should be treated, what future it should help build, and who should decide.</p>
<div class="facts"><span>144 statements on 8 axes</span><span>About 25 to 35 minutes to answer</span><span>About 20 minutes to score</span></div>
<div class="box2"><h3>Before you start</h3><ol>
<li>Part 1 has 144 statements, 18 for each of eight axes. For each one, circle the answer closest to your view: <b>SD</b> strongly disagree, <b>D</b> disagree, <b>A</b> agree or <b>SA</b> strongly agree. If you truly have no settled view, circle <b>—</b>.</li>
<li>Every statement has a partner elsewhere on the same page or the next that says the opposite. Answer each one on its own; there are no trick questions and no right answers.</li>
<li>Finish all of Part 1 before turning to Part 2. The scoring grids show which way each answer counts, and seeing them first can change how you answer.</li>
<li>Part 2 walks you through scoring with simple addition and counting. The one division is done for you in a table.</li></ol></div>
<div class="box2"><h3>Two terms used throughout</h3><p><b>AI system</b> means any artificial system that takes in information and acts on it, from a chat assistant to a robot. <b>Robot</b> means an AI system with a physical body.</p>
<p>Some statements are about today's AI and some about what is possible in principle or in the long run. Answer each about what you think is true or right.</p></div></section>
<section class="stack intro-axes" style="gap:6pt"><span class="eyebrow">Introduction</span><h2>The eight axes</h2>
<p>Each axis runs from {MINUS}10 to +10 between two poles. Neither pole is the right answer; each is a position thoughtful people hold. The axes fall into four groups: what AI is (1), how we live with it (2 and 3), what future to build (4 and 5), and who decides and how fast (6 to 8).</p>{axes_block}</section>
{statements_pages()}
<section class="stack"><span class="eyebrow">Part 2 · Scoring</span><h2>How tally scoring works</h2>
<p>Each axis has two columns: one for points toward pole A and one for points toward pole B. Every row is one statement. Its two cells list the answers that score in that column and how many points each is worth. Strong answers are worth twice as much as mild ones. An answer of — scores nothing.</p>
<div class="box2"><h3>Reading one row</h3><p>Statement {PAPER[ex]} has <span class="mono">{" · ".join(f"{l}&nbsp;{p}" for l, p in exA)}</span> under pole A and <span class="mono">{" · ".join(f"{l}&nbsp;{p}" for l, p in exB)}</span> under pole B. Whichever of these you circled for statement {PAPER[ex]}, write it in the <b>Your answer</b> column and circle the matching entry in the row.</p></div>
<div class="stack" style="gap:8pt">
<div class="step"><span class="stepn">1</span><p>On each axis's grid, write your answer to each statement and circle the matching entry.</p></div>
<div class="step"><span class="stepn">2</span><p>Each grid has two blocks, near term and long run. Add the circled numbers in each column of each block, write the four totals, and count your — answers in each block.</p></div>
<div class="step"><span class="stepn">3</span><p>Copy the totals and counts onto the totals page and work out your nets, bases, scores and tiers.</p></div>
<div class="step"><span class="stepn">4</span><p>Look up your core-three archetype, and count which of the 50 archetypes share your sides.</p></div>
<div class="step"><span class="stepn">5</span><p>For the exact archetype match the online quiz gives, enter your 16 nets and 16 counts of — at <b>{URL}</b>.</p></div></div></section>
{grid_pages()}
{totals_page()}
{core_page()}
{agreement_pages()}
{reference_pages()}
{core_reference()}
<section class="stack"><span class="eyebrow">For facilitators</span><h2>About this edition</h2>
<p>This booklet has the same 144 statements and scoring as the online AI Worldview Atlas. Statements appear in a fixed order, shuffled within each axis so that mirrored partners are at least four statements apart; the online version shuffles them for each person.</p>
<p>Tally scoring was checked against the online scoring engine on 3,000 generated answer sheets, with anywhere from none to most statements left as "no settled view". Nets, scores, tiers and core-three archetypes matched on every sheet. The online version also ranks the 50 archetypes by a weighted distance across all eight axes, in which each archetype's defining axes count double, and that takes too much arithmetic for paper; the /paper page gives that ranking from the booklet's 16 nets and counts.</p>
<p>The online version also offers eight optional scenarios and 26 thought experiments. Neither changes anyone's scores.</p>
<h3>Statement numbers in this booklet and their statement IDs online</h3>{map_table()}</section>
</body></html>'''
open(os.path.join(HERE, 'booklet.html'), 'w', encoding='utf-8').write(doc)
print('ok')
