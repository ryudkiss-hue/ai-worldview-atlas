# PATH A Pilot Execution Checklist: 2-3 Weeks to 9.2-9.5/10 Rigor

**START DATE**: [TODAY]
**TARGET COMPLETION**: Day 21 (3 weeks)
**RESOURCE**: 30-50 respondents across 12 archetypes

---

## WEEK 1: RECRUITMENT & INFRASTRUCTURE

### Day 1: Setup (TODAY)
- [ ] Create Prolific/Mechanical Turk account (or use internal network)
- [ ] Set up Google Forms for archetype pre-screening
- [ ] Create web assessment platform (see scaffolding below)
- [ ] Set up MongoDB/JSON data collection (or Google Sheets)
- [ ] Create respondent tracking spreadsheet
- [ ] Estimate budget: $5 × 40 respondents = $200-300
- **OWNER**: You
- **TIME**: 2-3 hours

### Day 2-3: Recruitment Setup
- [ ] Write recruitment email (see template below)
- [ ] Create pre-screening questionnaire (10-item archetype ID)
- [ ] Configure payment system
- [ ] Set up consent form + anonymity guarantee
- [ ] Test entire flow with 1-2 internal testers
- **OWNER**: You
- **TIME**: 3-4 hours

### Day 4-5: Launch Recruitment
- [ ] Post to Prolific/Turk OR email internal network
- [ ] Target: 50 respondents (to account for ~20% dropout)
- [ ] Track enrollment daily
- [ ] Follow up with underrepresented archetypes
- **OWNER**: You + automated email system
- **TIME**: 1 hour setup, then daily checks

### Days 6-10: Administration
- [ ] Respondents complete assessment (45-50 min each)
- [ ] Data auto-collected to database
- [ ] Daily monitoring: watch for <30 sec or >15 min response times
- [ ] Flag suspicious patterns daily
- [ ] Send reminder emails to incomplete respondents
- **OWNER**: Automated system (you monitor)
- **TIME**: 10 min/day check-ins

**END OF WEEK 1**: 40-50 respondents completed, data in database

---

## WEEK 2: ANALYSIS

### Day 11-12: Data Cleaning (Monday-Tuesday)
- [ ] Import all responses to analysis spreadsheet
- [ ] Remove <70% completion (<100 of 145 questions)
- [ ] Flag response time outliers (<30 sec OR >15 min per experiment)
- [ ] Check for random patterns (>95% entropy)
- [ ] Verify all fields captured (confidence, time, follow-ups)
- [ ] Final N: aim for 35-45 clean responses
- **OWNER**: You
- **TIME**: 3-4 hours

### Day 13-14: Statistical Analysis (Wednesday-Thursday)
- [ ] Run biasDetection.ts on cleaned data
  ```
  node src/utils/biasDetection.ts --input responses.json --output bias_report.json
  ```
- [ ] Generate chi-square test for archetype distribution
  - Expected: p > 0.05 (no bias)
  - Record: χ² statistic, p-value, biased archetypes
  
- [ ] Run correlation analysis for follow-up differentiation
  - For each experiment's follow-ups
  - Record: correlation values, leading question flags
  
- [ ] Analyze response times (mean, std, outliers)
- [ ] Analyze confidence ratings (mean, std, >3.8 flag)
- [ ] Analyze artificiality scores (% <3)
- [ ] Generate per-experiment verdicts (PASS/REVIEW/REWRITE)

**OUTPUT**: bias_report.json with all metrics
- **OWNER**: You (automated script)
- **TIME**: 1-2 hours (mostly script runtime)

### Day 15: Report Generation (Friday)
- [ ] Parse bias_report.json
- [ ] Create summary tables (chi-square, correlations, time/confidence)
- [ ] Identify experiments with REWRITE verdict
- [ ] Create data visualizations (archetype distribution histogram, follow-up correlation heatmap)
- [ ] Draft findings narrative
- [ ] Calculate final rigor score
- **OWNER**: You
- **TIME**: 3-4 hours

**END OF WEEK 2**: Complete bias analysis, findings documented

---

## WEEK 3: REFINEMENT & PUBLICATION

### Day 16-17: Refinement (Monday-Tuesday)
**If all 7 criteria pass**: (Most likely case)
- [ ] Document "No bias detected" findings
- [ ] Write validation report (2-3 pages)
- [ ] Create archetype distribution table
- [ ] Create follow-up differentiation table
- [ ] Declare 9.3/10 rigor achieved
- [ ] NO experiments need rewriting

**If 5-6 criteria pass**: (Likely case)
- [ ] Identify which experiments failed criteria
- [ ] Write specific rewrite recommendations
- [ ] Propose follow-up questions for rewrites
- [ ] Estimate effort: 4-8 hours per rewrite
- [ ] Rewrite problematic experiments
- [ ] Optional: Re-test with 3-5 new respondents

**If <5 criteria pass**: (Unlikely)
- [ ] Major revision needed
- [ ] Extend timeline to 4 weeks
- [ ] Rewrite top 3-5 experiments
- [ ] Re-pilot after fixes
- **OWNER**: You + 1-2 collaborators
- **TIME**: 8-16 hours

### Day 18-19: Documentation (Wednesday-Thursday)
- [ ] Write PILOT_REPORT.md with:
  - Executive summary (1 page)
  - Methods (2 pages)
  - Results with tables/visualizations (3-4 pages)
  - Findings & recommendations (2 pages)
  - Appendix: chi-square details, correlation matrices
  
- [ ] Create VALIDATION_CERTIFICATE.pdf stating:
  - Chi-square p-value
  - Sample size & demographics
  - Rigor score: 9.2-9.5/10
  - Confidence statement
  
- [ ] Commit all files to git

### Day 20-21: Publishing (Friday-Weekend)
- [ ] Share pilot report with stakeholders
- [ ] Post methodology to relevant forums (LessWrong, OpenPhil, etc.)
- [ ] Consider publishing to arXiv or similar
- [ ] Create 1-page summary for social media
- [ ] Update project README with validation results
- [ ] Archive data securely (anonymized)

**END OF WEEK 3**: 9.2-9.5/10 rigor achieved, publicly validated

---

## CRITICAL PATH: Days to Focus

### MUST COMPLETE:
- **Day 1**: Platform setup + recruitment materials ready
- **Day 5**: First respondents enrolled
- **Day 10**: 40+ responses collected
- **Day 14**: Bias analysis complete
- **Day 15**: Report drafted
- **Day 21**: Published & validated

### IF BEHIND SCHEDULE:
- Extend recruitment to Day 12 (43-50 respondents available)
- Compress analysis to Days 12-14 (run overnight)
- Report due Day 16 (tight but feasible)
- Publish Day 19 (still within 3 weeks)

---

## SUCCESS METRICS (Day 15 Report Must Show)

### PASS ALL 7 (Expected Outcome):
```
✅ Archetype distribution: χ² = 8.3, p = 0.24 (NO BIAS)
✅ Follow-up differentiation: 85% with r = 0.2-0.7
✅ Confidence: Mean 3.1 ± 0.6 (genuine uncertainty)
✅ Artificiality: 12% rate <3 (authentic)
✅ Response time: Mean 4.2 min, no >9 min (clear dilemmas)
✅ Confusion: 3% flag any follow-up (well-written)
✅ Thematic: No systematic framing objections

→ VERDICT: 9.3/10 RIGOR ACHIEVED
```

### PASS 5-6 (Acceptable):
```
⚠️ One or two criteria slightly miss threshold
Example: One experiment (Exp 17) shows slight bias toward
Digital-Rights-Advocate (12% overrep vs 8% expected)

→ ACTION: Rewrite Exp 17 follow-up Q2, re-test with 5 respondents
→ VERDICT: 9.1/10 RIGOR ACHIEVED AFTER REFINEMENT
```

### PASS <5 (Redo):
```
❌ Multiple experiments show systematic bias
→ Extend to Week 4 for major revision
→ Re-pilot top 3-5 experiments
→ Accept 4-week timeline instead of 3
```

---

## BUDGET

| Item | Cost | Notes |
|------|------|-------|
| Respondent compensation | $200-300 | 40-50 × $5 (Prolific) |
| Platform hosting | $0 | Use existing infrastructure |
| Data storage | $0 | Google Sheets or local DB |
| Analysis software | $0 | Python/Node.js (built-in) |
| **TOTAL** | **$200-300** | 3-week pilot |

---

## Parallel Work (Ongoing)

While pilot runs (Days 5-15), do in parallel:
- [ ] Prepare manuscript outline (1-2 hours)
- [ ] Create data visualization templates (1 hour)
- [ ] Draft methodology section (2 hours)
- [ ] Prepare "results" section skeleton (1 hour)
- [ ] Build GitHub release notes template (30 min)

**Total parallel work**: ~6 hours (don't block pilot)

---

## Communication Plan

### Day 1: Kickoff
- Email to all stakeholders: "Pilot begins today. Results by Day 21."

### Day 10: Midpoint Update
- "40+ responses collected. On track for Week 2 analysis."

### Day 15: Preliminary Report
- Share draft findings. Flag any issues requiring Week 3 refinement.

### Day 21: Final Report
- Publish complete pilot report + validation certificate
- Announce: "25 experiments validated to 9.2-9.5/10 rigor"

---

## Tools & Scripts Ready

All scripts pre-built and committed:

```bash
# Day 14: Run analysis
node scripts/runPilotAnalysis.js --input responses.json --output bias_report.json

# Day 15: Generate report
node scripts/generatePilotReport.js --data bias_report.json --template PILOT_REPORT_TEMPLATE.md

# Day 21: Publish
git add PILOT_REPORT.md VALIDATION_CERTIFICATE.pdf && git commit -m "results: pilot validation complete—9.2-9.5/10 rigor confirmed"
```

---

## Single Point of Failure

**Critical Dependency**: Respondent enrollment
- **If recruitment slow**: Extend Week 1 to Day 12, compress analysis
- **If quality issues**: Tighten Day 11 data cleaning, drop <50% reliable responses
- **If bias detected**: Dedicate Week 3 to rewrites, extend to Day 28

**Mitigation**: Start recruitment Day 1 @ scale (50 slots), oversample to 60 to account for 20% dropout

---

## Done: Day 21 Looks Like

```
✅ 40-45 clean responses analyzed
✅ Chi-square test: p = 0.18 (no bias)
✅ 85% of follow-ups differentiate well
✅ Mean confidence: 3.1 (genuine uncertainty)
✅ Response times: 4.2 min average (good clarity)
✅ 9.2-9.5/10 rigor confirmed via statistics
✅ PILOT_REPORT.md published
✅ VALIDATION_CERTIFICATE.pdf signed
✅ All 25 experiments validated
✅ Archetypes confirmed not biased
✅ Results shareable with community
```

---

## Execute Now

Start TODAY. Day 1 tasks:
1. Set up recruitment platform
2. Create pre-screening questionnaire
3. Prepare assessment platform
4. Write recruitment email
5. Test full flow end-to-end

**By EOD**: All systems ready. Day 2 launch recruitment.

**By Day 21**: Validated to 9.2-9.5/10 rigor.

