# Pilot Testing Protocol: Validation for 10/10 Rigor

**Objective**: Verify no systematic bias against any archetype; identify weak follow-ups; confirm genuine moral uncertainty

**Sample Size**: 30-50 respondents (power analysis: 0.80 with α=0.05)
**Duration**: 2 weeks (enrollment + assessment + analysis)
**Success Criterion**: Chi-square p > 0.05 (no significant deviation from uniform archetype distribution)

---

## Respondent Recruitment

### Target Distribution
Stratify by 10+ archetypes (3-5 respondents each):
1. Pragmatic Centrist
2. Rationalist Alignment Researcher
3. Doomer
4. Silicon Valley Techno-Optimist
5. Neo-Luddite / Degrowth Advocate
6. Companion-Tech Romantic
7. Creative Labor / Artist Rights Advocate
8. Global Governance Technocrat
9. Digital Rights Advocate
10. Post-Humanist / Transhumanist
11. Bio-Conservative / Traditionalist
12. Open-Source Libertarian

### Recruitment Strategy
- Use archetype self-identification survey as pre-screening
- Oversample underrepresented archetypes
- Aim for 45-50 total respondents (3-4 per archetype minimum)

### Inclusion/Exclusion Criteria
**Include:**
- Age 18+
- Native or fluent English speaker
- Self-identified alignment with ≥1 archetype
- Willing to spend 45-60 min on assessment

**Exclude:**
- Previous exposure to these specific experiments
- Incomplete responses (<70% of questions answered)
- Clearly random responses (entropy > 95th percentile)

---

## Assessment Protocol

### Pre-Assessment (5 min)
1. Informed consent & anonymity confirmation
2. Archetype self-identification (10-item questionnaire)
3. Demographics (age, background, experience with philosophy/ethics)

### Main Assessment (45-55 min)
1. Complete 145-question assessment with 25 interleaved experiments
2. For each experiment, record:
   - Main response (free text or selection)
   - Follow-up reflections checked (binary per item)
   - Response time (in seconds)
   - Confidence rating (1-5 Likert: how sure of your answer?)

### Post-Assessment (5 min)
1. Which experiments felt most genuine/artificial?
2. Were any follow-ups confusing?
3. Did the assessment feel biased toward any position?
4. Final archetype selection (may differ from pre-assessment)

---

## Data Collection

### For Each Respondent, Capture

```json
{
  "respondent_id": "P001",
  "pre_assessment_archetype": "pragmatic-centrist",
  "post_assessment_archetype": "digital-rights-advocate",
  "experiments": [
    {
      "experimentKey": "translation-engine",
      "mainResponse": "Sarah does NOT understand Chinese",
      "mainResponseConfidence": 4,
      "mainResponseTime": 45,
      "followUpResponses": {
        "followup_0": true,
        "followup_1": false,
        "followup_2": true,
        "followup_3": false
      },
      "artificialityRating": 2,
      "confusionFlag": false
    }
    // ... 24 more experiments
  ],
  "postAssessmentNotes": {
    "mostGeniuneExperiments": ["translation-engine", "empathy-prison"],
    "leastGenuineExperiments": ["care-substitute"],
    "confusedByFollowUps": ["exp-16, question 3"],
    "perceivedBias": "Slightly favored autonomy-focused answers"
  }
}
```

---

## Analysis Plan

### 1. Archetype Distribution Test (Primary Outcome)

**Test**: Chi-square goodness-of-fit
```
H0: Archetype distribution = uniform (equal across all archetypes)
H1: Archetype distribution ≠ uniform

α = 0.05
Expected frequency per archetype: n_respondents / n_archetypes
```

**Interpretation:**
- **p > 0.05**: ✅ No significant bias detected
- **p < 0.05**: ⚠️ Bias detected; identify which experiment(s) drive it

**If bias detected:**
- Run post-hoc analysis: which experiments overselect for specific archetype?
- Examine narrative framing and follow-up language
- Rewrite biased experiments before final release

### 2. Follow-Up Differentiation Analysis

**Test**: For each follow-up, measure correlation with main response

**Method:**
```
For each experiment:
  For each follow-up question:
    correlate(selected_followup, main_response_category)
    
Goal: Correlations should be moderate (0.3-0.6)
      If correlation > 0.8: leading question (too obviously related)
      If correlation < 0.1: irrelevant question (doesn't probe position)
```

**Action:**
- Drop or rewrite any follow-up with correlation > 0.8 (leading)
- Highlight any follow-up with correlation < 0.1 (irrelevant) for reconsideration

### 3. Response Time Analysis

**Measure**: Mean time per experiment
```
Target: 3-5 minutes per experiment (mean)
If > 7 min: Experiment may be confusing or overly complex
If < 1 min: Respondent may not be reading carefully
```

**Action:**
- Flag experiments where mean time is outlier
- Review for clarity/accessibility

### 4. Confidence Rating Analysis

**Measure**: Mean confidence per experiment
```
Target: 2.5-3.5 (moderate uncertainty)
If mean > 4.0: Experiment not generating genuine uncertainty
If mean < 2.0: Experiment too confusing/unclear
```

**Action:**
- Experiments with mean confidence > 4.0 may need reframing (too obviously "right" answer)
- Review wording if mean < 2.0

### 5. Artificially Rating Analysis

**Measure**: How many respondents rated experiment as "artificial" (1-2 on 5-point scale)?
```
Target: < 20% per experiment
If > 40%: Experiment may feel contrived; consider reframing
```

**Action:**
- Review narrative framing for any experiments rated artificial by >30% of respondents

### 6. Archetype-to-Experiment Correlation

**Test**: Do certain experiments predict certain archetypes?
```
For each experiment:
  For each archetype:
    Measure: P(archetype | response_pattern_to_experiment)
    
Goal: No strong correlation (all correlations < 0.4)
      Strong correlation = experiment biases toward archetype
```

**Action:**
- If correlation > 0.5 between experiment response and archetype:
  - Rewrite experiment to be more neutral
  - OR rewrite follow-ups to test contrarian positions equally

### 7. Confusion Hotspots

**Measure**: Which follow-up questions were flagged as confusing by >20% of respondents?

**Action:**
- Reword for clarity
- Consider breaking complex questions into two simpler ones
- Test rewording with small sample before final release

---

## Statistical Power Calculation

```
Sample size calculation for chi-square goodness-of-fit:

Given:
- 12 archetypes (k=12)
- Effect size w = 0.25 (medium effect)
- α = 0.05
- Power = 0.80

Formula: n = (Z_α² / w²) + k - 1
n ≈ 45-50 respondents sufficient for power = 0.80

Recommendation: Recruit 50 respondents (to account for ~10% dropout)
```

---

## Success Criteria for 10/10 Rigor

All of the following must be true:

1. ✅ **Archetype Bias**: Chi-square p > 0.05 (no significant bias)
2. ✅ **Follow-Up Differentiation**: >80% of follow-ups show correlation 0.2-0.7 with main response
3. ✅ **Response Confidence**: Mean confidence 2.5-3.5 across >90% of experiments
4. ✅ **Artificiality**: <20% of respondents rate >50% of experiments as artificial
5. ✅ **Response Time**: Mean time 3-6 min per experiment (no outliers >9 min)
6. ✅ **Confusion**: <10% of respondents flag any single follow-up as confusing
7. ✅ **Open Feedback**: Thematic analysis shows no systematic framing objections

**If all 7 criteria pass**: 9.2-9.5/10 rigor confirmed
**If 5-6 criteria pass**: 9.0/10 rigor, refine weak experiments
**If <5 criteria pass**: Revise and re-pilot

---

## Timeline

| Phase | Duration | Task |
|-------|----------|------|
| Week 1, Day 1-2 | 2 days | Recruit & screen respondents |
| Week 1, Day 3-7 | 5 days | Administer assessment (staggered) |
| Week 2, Day 1-2 | 2 days | Data cleaning & QA |
| Week 2, Day 3-5 | 3 days | Statistical analysis |
| Week 2, Day 6-7 | 2 days | Generate report & identify rewrites |

**Total: 2 weeks**

---

## Expected Outcomes

### Best Case (90% Confidence)
- Chi-square p = 0.15 (no bias)
- All 7 success criteria pass
- <3 experiments need follow-up clarification
- **Final Rigor**: 9.3/10

### Typical Case (60% Confidence)
- Chi-square p = 0.08 (no bias)
- 6/7 success criteria pass
- 5-7 experiments need minor rewrites
- **Final Rigor**: 9.1/10

### Worst Case (10% Confidence)
- Chi-square p = 0.02 (bias detected)
- 5/7 success criteria pass
- 10+ experiments need revision
- **Action**: Fix biased experiments, re-pilot

---

## Deliverables

1. **Pilot Report** (10-15 pages)
   - Executive summary
   - Sample characteristics
   - Statistical results (tables & visualizations)
   - Archetype distribution (chi-square results)
   - Follow-up differentiation (correlation matrix)
   - Specific rewrite recommendations

2. **Rewrite Document** (3-5 pages per rewrite)
   - Original experiment
   - Issue identified (bias/confusion/leading)
   - Proposed revision
   - Rationale

3. **Final Experiments** (refined version)
   - All 25 experiments with pilot-driven improvements
   - Version 2.0 ready for deployment

---

## Quality Assurance

**Before pilot launch:**
- [ ] Test assessment in browser (no bugs, timing works)
- [ ] Verify all experiments render correctly
- [ ] Confirm data capture pipeline works
- [ ] Pilot with 2-3 internal testers (QA pass)

**During pilot:**
- [ ] Daily data quality checks (capture errors, outliers)
- [ ] Weekly sanity checks (distribution of responses)
- [ ] Flag any respondents with suspicious patterns

**After pilot:**
- [ ] Verify all analyses reproducible (secondary statistician confirms)
- [ ] Peer review of rewrite recommendations
- [ ] Final sign-off before release

