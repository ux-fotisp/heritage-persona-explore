

# Project Management Plan: Add to Trip System + Persona Questionnaire Enhancements

## Overview

This plan addresses two key improvements to the CulturaPath application:
1. **Add to Trip System**: Complete implementation of the "Add to Trip" functionality across all instances where heritage sites are displayed
2. **Persona Questionnaire Enhancements**: Add numbered scale choices below each slider and make the progress bar sticky

---

## Part 1: Add to Trip System

### Current State Analysis

The application currently has:
- A `Trip` data model in `src/lib/tripStorage.ts` with `selectedSites` array
- An "Add to Trip" button in `SiteCard` component that only shows a toast notification
- A trip creation flow: TripCreation → TripPersonaSelection → PersonaBasedRecommendations
- No modal or selection mechanism when clicking "Add to Trip" from Discover or Planner pages

### Required Components

#### 1.1 Trip Selection Modal Component
**File**: `src/components/trip/AddToTripModal.tsx`

A reusable dialog that:
- Shows a list of user's existing trips (from localStorage)
- Displays trip name, destination, dates, and number of sites already added
- Allows selecting one or multiple trips to add the site to
- Includes a "Create New Trip" quick action
- Shows confirmation with site thumbnail and trip details

#### 1.2 Trip Context/Hook
**File**: `src/hooks/useTrips.tsx`

A custom hook providing:
- `trips`: Array of all user trips
- `currentTrip`: Active trip being planned
- `addSiteToTrip(siteId, tripId)`: Add a site to a specific trip
- `removeSiteFromTrip(siteId, tripId)`: Remove a site from a trip
- `isSiteInTrip(siteId, tripId)`: Check if site is already in trip
- `getSitesForTrip(tripId)`: Get all sites in a trip

#### 1.3 Update tripStorage.ts
**File**: `src/lib/tripStorage.ts`

Add new functions:
- `addSiteToTrip(tripId: string, siteId: string): boolean`
- `removeSiteFromTrip(tripId: string, siteId: string): boolean`
- `isSiteInTrip(tripId: string, siteId: string): boolean`
- `getSiteCountForTrip(tripId: string): number`

### Integration Points

| Location | Current Behavior | New Behavior |
|----------|-----------------|--------------|
| `SiteCard.tsx` | Toast only | Opens AddToTripModal |
| `Discover.tsx` | Console log | Opens AddToTripModal |
| `Planner.tsx` | Saves to localStorage array | Opens AddToTripModal |
| `MuseumDetail.tsx` | Toast only | Opens AddToTripModal |
| `PersonaBasedRecommendations.tsx` | Direct selection for current trip | Keep current + add modal option |

### User Flow

```text
User clicks "Add to Trip" on any SiteCard
           │
           ▼
   ┌───────────────────────────────────┐
   │     AddToTripModal Opens          │
   │  ┌─────────────────────────────┐  │
   │  │ 🗺️ Mediterranean Tour       │  │
   │  │ Athens • Mar 15-22 • 3 sites│  │
   │  │ [Add to this trip]          │  │
   │  ├─────────────────────────────┤  │
   │  │ 🏛️ Greek Adventure          │  │
   │  │ Thessaloniki • Apr 1-5      │  │
   │  │ [Add to this trip]          │  │
   │  ├─────────────────────────────┤  │
   │  │ + Create New Trip           │  │
   │  └─────────────────────────────┘  │
   └───────────────────────────────────┘
           │
           ▼
    Site added → Toast confirmation
    with link to view trip
```

---

## Part 2: Persona Questionnaire Enhancements

### 2.1 Numbered Scale Choices

**File**: `src/components/onboarding/PersonaCard.tsx`

Replace the current scale markers with explicit numbered choices:

Current implementation shows:
```
Strongly Dislike --- Neutral --- Strongly Like
       -5             0              5
```

New implementation will show:
```
How much do you relate to this?
                                    [Strongly Like]

   -5    -4    -3    -2    -1     0     1     2     3     4     5
   (•)   (•)   (•)   (•)   (•)   (•)   (•)   (•)   (•)   (•)   (•)

Strongly                        Neutral                    Strongly
Dislike                                                      Like
```

Changes required:
- Add individual clickable radio-style markers below the slider track
- Display number below each marker
- Highlight the currently selected value
- Add visual feedback (color change based on position)
- Numbers should be clearly visible and touch-friendly

### 2.2 Sticky Progress Bar

**File**: `src/pages/PersonaQuestionnaire.tsx`

Current structure:
```
┌─────────────────────────────┐
│ AppHeader                   │
├─────────────────────────────┤
│ Title Section               │
│ Progress Section (scrolls)  │  ← Currently scrolls away
├─────────────────────────────┤
│ Persona Cards (scrollable)  │
├─────────────────────────────┤
│ Fixed Bottom CTA            │
└─────────────────────────────┘
```

New structure:
```
┌─────────────────────────────┐
│ AppHeader                   │
├─────────────────────────────┤
│ STICKY Progress Section     │  ← Now sticky (top-[header-height])
│ "Your Progress" + bar       │
├─────────────────────────────┤
│ Title Section (scrolls)     │
│ Persona Cards (scrollable)  │
├─────────────────────────────┤
│ Fixed Bottom CTA            │
└─────────────────────────────┘
```

Changes required:
- Move progress section to be sticky below the header
- Add `sticky top-[56px]` positioning (below AppHeader)
- Add background blur and border for visual separation
- Ensure z-index is appropriate (below header, above content)

---

## Technical Implementation Details

### File Changes Summary

| File | Changes |
|------|---------|
| `src/components/trip/AddToTripModal.tsx` | **NEW** - Modal component for trip selection |
| `src/hooks/useTrips.tsx` | **NEW** - Trip management hook |
| `src/lib/tripStorage.ts` | **MODIFY** - Add site management functions |
| `src/components/heritage/SiteCard.tsx` | **MODIFY** - Integrate modal trigger |
| `src/pages/Discover.tsx` | **MODIFY** - Pass modal handler |
| `src/pages/Planner.tsx` | **MODIFY** - Integrate modal |
| `src/pages/MuseumDetail.tsx` | **MODIFY** - Integrate modal |
| `src/components/onboarding/PersonaCard.tsx` | **MODIFY** - Add numbered scale choices |
| `src/pages/PersonaQuestionnaire.tsx` | **MODIFY** - Make progress bar sticky |

### Dependencies

No new dependencies required. Uses existing:
- Radix UI Dialog for modal
- shadcn/ui components (Card, Button, Badge)
- Existing tripStorage utilities

### Estimated Complexity

- **AddToTripModal**: Medium (new component with state management)
- **useTrips hook**: Low-Medium (wrapper around storage functions)
- **tripStorage updates**: Low (simple array operations)
- **SiteCard integration**: Low (add modal trigger)
- **Numbered scale choices**: Medium (UI restructure with accessibility)
- **Sticky progress bar**: Low (CSS positioning change)

