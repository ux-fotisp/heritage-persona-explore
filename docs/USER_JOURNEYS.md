# CulturaPath User Journeys

> Comprehensive user flow documentation mapping all key journeys through the CulturaPath application.

---

## Table of Contents

1. [Journey Overview](#journey-overview)
2. [Onboarding Journey](#onboarding-journey)
3. [Discovery Journey](#discovery-journey)
4. [Trip Planning Journey](#trip-planning-journey)
5. [Study Enrollment Journey](#study-enrollment-journey)
6. [Evaluation Journey](#evaluation-journey)

---

## Journey Overview

### Primary User Flows

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY MAP                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────┐     ┌───────────┐     ┌──────────┐     ┌─────────────┐    │
│   │ LANDING │────▶│ ONBOARDING│────▶│ DISCOVER │────▶│ TRIP PLAN   │    │
│   └─────────┘     └───────────┘     └──────────┘     └─────────────┘    │
│        │                                   │                │            │
│        │                                   │                ▼            │
│        │                                   │         ┌─────────────┐     │
│        │                                   └────────▶│  EVALUATE   │     │
│        │                                             └─────────────┘     │
│        │                                                    │            │
│        ▼                                                    ▼            │
│   ┌─────────┐                                        ┌─────────────┐     │
│   │ PROFILE │◀───────────────────────────────────────│   STUDY     │     │
│   └─────────┘                                        └─────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Onboarding Journey

### User Goal
Discover personal cultural heritage persona to receive tailored recommendations.

### Journey Table

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 1 | Landing | Clicks "Discover Your Style" | Navigate to Onboarding | Hero CTA Button |
| 2 | Onboarding Welcome | Reviews persona concept | Display persona overview | Info Cards |
| 3 | Onboarding Welcome | Clicks "Start Assessment" | Navigate to Questionnaire | Primary Button |
| 4 | Persona Questionnaire | Answers preference Q1 | Store response, show Q2 | Radio Group |
| 5 | Persona Questionnaire | Answers preference Q2 | Store response, show Q3 | Radio Group |
| 6 | Persona Questionnaire | Answers preference Q3 | Store response, show Q4 | Radio Group |
| 7 | Persona Questionnaire | Answers preference Q4 | Store response, show Q5 | Radio Group |
| 8 | Persona Questionnaire | Answers preference Q5 | Calculate persona scores | Radio Group |
| 9 | Persona Questionnaire | Clicks "See Results" | Navigate to Results | Primary Button |
| 10 | Persona Results | Reviews matched personas | Display top 3 with scores | Persona Cards |
| 11 | Persona Results | Clicks "Continue" | Navigate to Confirmation | Primary Button |
| 12 | Persona Confirmation | Selects 1-2 personas | Highlight selected | Checkbox Cards |
| 13 | Persona Confirmation | Clicks "Confirm Selection" | Save to localStorage | Primary Button |
| 14 | Profile | Views MyPersonaTile | Display selected persona | Persona Tile |

### Alternate Path: Direct Selection

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 3a | Onboarding Welcome | Clicks "I Know My Persona" | Navigate to Selection | Secondary Link |
| 4a | Persona Selection | Browses all 8 personas | Display persona grid | Card Grid |
| 5a | Persona Selection | Selects 1-2 personas | Highlight selected | Checkbox Cards |
| 6a | Persona Selection | Clicks "Confirm" | Save and redirect | Primary Button |

### Journey Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING JOURNEY FLOW                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   START                                                                   │
│     │                                                                     │
│     ▼                                                                     │
│   ┌────────────┐                                                          │
│   │  LANDING   │                                                          │
│   │   PAGE     │                                                          │
│   └─────┬──────┘                                                          │
│         │                                                                 │
│         │ "Discover Your Style"                                           │
│         ▼                                                                 │
│   ┌────────────┐      "I Know My Persona"      ┌─────────────────┐        │
│   │ ONBOARDING │──────────────────────────────▶│ DIRECT PERSONA  │        │
│   │  WELCOME   │                               │   SELECTION     │        │
│   └─────┬──────┘                               └────────┬────────┘        │
│         │                                               │                 │
│         │ "Start Assessment"                            │                 │
│         ▼                                               │                 │
│   ┌────────────┐                                        │                 │
│   │   PERSONA  │                                        │                 │
│   │QUESTIONNAIRE│◄───┐                                  │                 │
│   └─────┬──────┘     │                                  │                 │
│         │            │ More questions                   │                 │
│         │────────────┘                                  │                 │
│         │ All answered                                  │                 │
│         ▼                                               │                 │
│   ┌────────────┐                                        │                 │
│   │  PERSONA   │                                        │                 │
│   │  RESULTS   │                                        │                 │
│   └─────┬──────┘                                        │                 │
│         │                                               │                 │
│         │ "Continue"                                    │                 │
│         ▼                                               │                 │
│   ┌────────────┐                                        │                 │
│   │  PERSONA   │◄───────────────────────────────────────┘                 │
│   │CONFIRMATION│                                                          │
│   └─────┬──────┘                                                          │
│         │                                                                 │
│         │ "Confirm Selection"                                             │
│         ▼                                                                 │
│   ┌────────────┐                                                          │
│   │  PROFILE   │                                                          │
│   │   PAGE     │                                                          │
│   └────────────┘                                                          │
│                                                                           │
│     END                                                                   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Discovery Journey

### User Goal
Find heritage sites that match personal interests and add them to a trip.

### Journey Table

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 1 | Navigation | Clicks "Discover" | Navigate to Discover | Bottom Nav |
| 2 | Discover | Views recommended sites | Display scored site grid | Site Cards |
| 3 | Discover | Clicks persona filter chip | Filter sites by persona | Glass Chips |
| 4 | Discover | Views match scores | Display % badges on cards | Match Badge |
| 5 | Discover | Clicks second persona chip | Apply multi-persona filter | Glass Chips |
| 6 | Discover | Hovers over site card | Show detailed preview | Card Hover |
| 7 | Discover | Clicks "View Details" | Navigate to Site Detail | Card Button |
| 8 | Site Detail | Reviews site information | Display full details | Detail Page |
| 9 | Site Detail | Clicks "Add to Trip" | Open trip selector modal | Primary Button |
| 10 | Trip Modal | Selects existing trip | Add site to trip | Dropdown |
| 11 | Trip Modal | Clicks "Add" | Confirm and close modal | Primary Button |
| 12 | Site Detail | Sees success toast | Display confirmation | Toast |

### Filter Interaction Details

| Filter Action | Sites Shown | Logic |
|---------------|-------------|-------|
| No filter selected | All sites sorted by match score | Default persona-based ranking |
| Single persona selected | Sites matching that persona | OR filter with persona |
| Multiple personas selected | Sites matching ANY selected | OR logic across selections |
| Clear filters | Return to all sites | Reset to default view |

### Journey Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    DISCOVERY JOURNEY FLOW                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌─────────────┐                                                         │
│   │   DISCOVER  │                                                         │
│   │    PAGE     │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          ├───────────────────┐                                            │
│          │                   │                                            │
│          ▼                   ▼                                            │
│   ┌─────────────┐     ┌─────────────┐                                     │
│   │   FILTER    │     │    VIEW     │                                     │
│   │  BY PERSONA │     │   TOGGLE    │                                     │
│   └──────┬──────┘     └──────┬──────┘                                     │
│          │                   │                                            │
│          │                   ├────────────┬────────────┐                  │
│          │                   │            │            │                  │
│          │                   ▼            ▼            ▼                  │
│          │            ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│          │            │   GRID   │ │   MAP    │ │   LIST   │              │
│          │            │   VIEW   │ │   VIEW   │ │   VIEW   │              │
│          │            └────┬─────┘ └────┬─────┘ └────┬─────┘              │
│          │                 │            │            │                    │
│          │                 └────────────┴────────────┘                    │
│          │                              │                                 │
│          ▼                              ▼                                 │
│   ┌─────────────┐                ┌─────────────┐                          │
│   │   REFINED   │                │  SITE CARD  │                          │
│   │   RESULTS   │───────────────▶│    CLICK    │                          │
│   └─────────────┘                └──────┬──────┘                          │
│                                         │                                 │
│                                         ▼                                 │
│                                  ┌─────────────┐                          │
│                                  │ SITE DETAIL │                          │
│                                  │    PAGE     │                          │
│                                  └──────┬──────┘                          │
│                                         │                                 │
│                                         ├──────────────┐                  │
│                                         │              │                  │
│                                         ▼              ▼                  │
│                                  ┌─────────────┐ ┌─────────────┐          │
│                                  │ ADD TO TRIP │ │   FAVORITE  │          │
│                                  └─────────────┘ └─────────────┘          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Trip Planning Journey

### User Goal
Create and organize a multi-day cultural heritage trip with personalized recommendations.

### Journey Table

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 1 | Navigation | Clicks "Plan Trip" | Navigate to Trip Creation | Header CTA |
| 2 | Trip Creation | Enters trip name | Validate and store | Text Input |
| 3 | Trip Creation | Selects destination city | Filter available sites | Dropdown |
| 4 | Trip Creation | Sets number of days | Configure day slots | Number Input |
| 5 | Trip Creation | Clicks "Continue" | Navigate to Site Selection | Primary Button |
| 6 | Site Selection | Views persona recommendations | Display matched sites | Recommendation Panel |
| 7 | Site Selection | Selects sites (multi-select) | Add to trip queue | Checkbox Cards |
| 8 | Site Selection | Reviews estimated duration | Calculate total hours | Duration Badge |
| 9 | Site Selection | Clicks "Auto-Schedule" | Distribute sites across days | Primary Button |
| 10 | Day Scheduler | Reviews day assignments | Display day cards | Day Cards |
| 11 | Day Scheduler | Drags site to different day | Reorder assignments | Drag & Drop |
| 12 | Day Scheduler | Clicks "Save Trip" | Persist to localStorage | Primary Button |
| 13 | Trip Summary | Views complete itinerary | Display full trip | Summary View |
| 14 | Trip Summary | Clicks "Schedule Visit" | Open calendar modal | Secondary Button |

### Trip Duration Calculation

| Sites Selected | Default Hours/Site | Calculation |
|----------------|-------------------|-------------|
| 1-3 sites | 4 hours each | sites × 4 |
| 4-6 sites | 3.5 hours each | sites × 3.5 |
| 7+ sites | 3 hours each | sites × 3 |

### Journey Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    TRIP PLANNING JOURNEY FLOW                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌─────────────┐                                                         │
│   │    TRIP     │                                                         │
│   │  CREATION   │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          │ Enter details                                                  │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │ DESTINATION │                                                         │
│   │  SELECTION  │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          │ Choose city                                                    │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │   PERSONA   │                                                         │
│   │   FILTER    │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          │ Apply persona                                                  │
│          ▼                                                                │
│   ┌─────────────┐     ┌─────────────────────────────────────┐             │
│   │    SITE     │     │      RECOMMENDATION ENGINE          │             │
│   │  SELECTION  │◀────│  • Match sites to persona           │             │
│   │  (MULTI)    │     │  • Sort by score                    │             │
│   └──────┬──────┘     │  • Show duration estimates          │             │
│          │            └─────────────────────────────────────┘             │
│          │                                                                │
│          │ Select sites                                                   │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │    AUTO     │                                                         │
│   │  SCHEDULE   │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          │ Distribute across days                                         │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │    DAY      │                                                         │
│   │ SCHEDULER   │◄───┐                                                    │
│   └──────┬──────┘    │                                                    │
│          │           │ Manual adjustments                                 │
│          │───────────┘                                                    │
│          │                                                                │
│          │ Save trip                                                      │
│          ▼                                                                │
│   ┌─────────────┐                                                         │
│   │    TRIP     │                                                         │
│   │   SUMMARY   │                                                         │
│   └──────┬──────┘                                                         │
│          │                                                                │
│          ├───────────────────┐                                            │
│          │                   │                                            │
│          ▼                   ▼                                            │
│   ┌─────────────┐     ┌─────────────┐                                     │
│   │  SCHEDULE   │     │   SHARE     │                                     │
│   │    VISIT    │     │    TRIP     │                                     │
│   └─────────────┘     └─────────────┘                                     │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Study Enrollment Journey

### User Goal
Enroll in academic research study and complete personality assessment.

### Journey Table

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 1 | Profile | Clicks "Join Study" | Navigate to Enrollment | CTA Banner |
| 2 | Study Enrollment | Reads study overview | Display study info | Info Section |
| 3 | Study Enrollment | Reviews consent items | Show checkbox list | Consent Form |
| 4 | Study Enrollment | Checks all consent boxes | Enable continue button | Checkboxes |
| 5 | Study Enrollment | Clicks "I Consent" | Save consent timestamp | Primary Button |
| 6 | ACUX Questionnaire | Answers aesthetic Q1 | Store response | Likert Scale |
| 7 | ACUX Questionnaire | Answers aesthetic Q2 | Store response | Likert Scale |
| 8 | ACUX Questionnaire | Answers cognitive Q1 | Store response | Likert Scale |
| 9 | ACUX Questionnaire | Answers cognitive Q2 | Store response | Likert Scale |
| 10 | ACUX Questionnaire | Answers behavioral Q1 | Store response | Likert Scale |
| 11 | ACUX Questionnaire | Answers behavioral Q2 | Store response | Likert Scale |
| 12 | ACUX Questionnaire | Answers affective Q1 | Store response | Likert Scale |
| 13 | ACUX Questionnaire | Answers affective Q2 | Store response | Likert Scale |
| 14 | ACUX Questionnaire | Clicks "Submit" | Calculate ACUX type | Primary Button |
| 15 | Profile | Views enrollment badge | Display study status | Status Badge |
| 16 | Study Dashboard | Views scheduled evaluations | Display evaluation cards | Dashboard |

### Consent Requirements

| Consent Item | Required | Description |
|--------------|----------|-------------|
| Data Collection | ✅ Yes | Agree to anonymized data collection |
| Emotion Tracking | ✅ Yes | Agree to emotional response tracking |
| Follow-up Contact | ❌ No | Optional contact for follow-up studies |
| Data Retention | ✅ Yes | Agree to 5-year data retention |

---

## Evaluation Journey

### User Goal
Complete pre-visit, post-visit, and 24h-after evaluations for scheduled trips.

### Journey Table

| Step | Page/Screen | User Action | System Response | UI Element |
|------|-------------|-------------|-----------------|------------|
| 1 | Profile/Dashboard | Clicks pending evaluation | Navigate to Evaluation | Notification Badge |
| 2 | Evaluation Flow | Reads evaluation instructions | Display phase info | Instruction Panel |
| 3 | Evaluation Flow | Clicks "Begin Evaluation" | Start evaluation timer | Primary Button |
| 4 | Geneva Wheel | Selects emotion quadrant | Highlight selection | Wheel Segment |
| 5 | Geneva Wheel | Selects specific emotion | Record selection | Inner Segment |
| 6 | Geneva Wheel | Sets intensity (1-5) | Display intensity | Slider |
| 7 | Geneva Wheel | Clicks "Continue" | Save and proceed | Primary Button |
| 8 | UEQ-S Form | Rates pragmatic Q1 | Store response | Semantic Differential |
| 9 | UEQ-S Form | Rates pragmatic Q2 | Store response | Semantic Differential |
| 10 | UEQ-S Form | Rates hedonic Q1 | Store response | Semantic Differential |
| 11 | UEQ-S Form | Rates hedonic Q2 | Store response | Semantic Differential |
| 12 | UEQ-S Form | Clicks "Submit" | Calculate UX scores | Primary Button |
| 13 | Evaluation Complete | Views thank you message | Mark phase complete | Completion Screen |
| 14 | Profile | Views updated progress | Update phase status | Progress Indicator |

### Evaluation Phases

| Phase | Trigger | Window | Focus |
|-------|---------|--------|-------|
| **Pre-Visit** | Visit scheduled | Up to visit day | Anticipation, expectations |
| **Post-Visit** | Visit date reached | Same day | Immediate impressions |
| **24h-After** | 24 hours elapsed | Next day | Reflected experience |

### Emotion Wheel Categories

| Quadrant | Valence | Arousal | Example Emotions |
|----------|---------|---------|------------------|
| Top-Right | Positive | High | Excitement, Joy, Enthusiasm |
| Top-Left | Negative | High | Anger, Fear, Anxiety |
| Bottom-Right | Positive | Low | Calm, Content, Relaxed |
| Bottom-Left | Negative | Low | Sad, Bored, Tired |

---

## Appendix: State Transitions

### Global Navigation States

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐                                                    │
│   │  INDEX  │ ◄─────────────────────────────────┐                │
│   └────┬────┘                                   │                │
│        │                                        │                │
│   ┌────┴────┬──────────┬──────────┬────────────┤                │
│   │         │          │          │            │                 │
│   ▼         ▼          ▼          ▼            │                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐        │                │
│ │DISCOV│ │PLANNE│ │PROFIL│ │ONBOARDING│        │                │
│ └──┬───┘ └──┬───┘ └──┬───┘ └────┬─────┘        │                │
│    │        │        │          │              │                 │
│    │        │        │          ▼              │                 │
│    │        │        │    ┌───────────┐        │                │
│    │        │        │    │QUESTIONNAI│        │                │
│    │        │        │    └─────┬─────┘        │                │
│    │        │        │          │              │                 │
│    │        │        │          ▼              │                 │
│    │        │        │    ┌───────────┐        │                │
│    │        │        │    │  RESULTS  │        │                │
│    │        │        │    └─────┬─────┘        │                │
│    │        │        │          │              │                 │
│    │        │        │          ▼              │                │
│    │        │        │    ┌───────────┐        │                │
│    │        │        └───▶│CONFIRMATION│───────┘                │
│    │        │             └───────────┘                         │
│    │        │                                                    │
│    │        ▼                                                    │
│    │  ┌──────────┐                                               │
│    │  │   TRIP   │                                               │
│    │  │ CREATION │                                               │
│    │  └────┬─────┘                                               │
│    │       │                                                     │
│    │       ▼                                                     │
│    │  ┌──────────┐                                               │
│    └─▶│  MUSEUM  │                                               │
│       │  DETAIL  │                                               │
│       └──────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

*Documentation generated for CulturaPath academic research project*
