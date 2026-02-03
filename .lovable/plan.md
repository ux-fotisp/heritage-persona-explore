
# Persona-Based Recommender System with Glass Effect Animations

## Overview
This plan implements a comprehensive recommender system that connects user persona profiling with heritage site exploration. The system features intelligent filtering, dynamic match scoring, and modern glassmorphism UI effects for an engaging user experience.

## Architecture

```text
+------------------------+     +----------------------+     +-------------------+
|   User Persona Data    | --> | Recommendation       | --> | Discover Page     |
|   (from assessment)    |     | Engine (scoring &    |     | (filtered sites   |
|                        |     | filtering)           |     | with glass UI)    |
+------------------------+     +----------------------+     +-------------------+
         |                              |
         v                              v
+------------------------+     +----------------------+
| Persona Traits         |     | Match Confidence     |
| - Likes/Dislikes       |     | - Persona alignment  |
| - Cultural interests   |     | - Category matching  |
| - Travel style         |     | - Weighted scoring   |
+------------------------+     +----------------------+
```

---

## Phase 1: Core Recommendation Engine

### 1.1 Create Recommendation Library
**New File**: `src/lib/recommendationEngine.ts`

This utility calculates match scores between user personas and heritage sites:

- **Input**: User's persona data (from `personaStorage.ts`), all heritage sites (from `heritageSites.ts`)
- **Processing**:
  - Direct persona ID matching (sites have `personas: string[]` field)
  - Category-to-trait affinity scoring
  - Like/dislike weighting system
  - Rating boost for highly-rated sites
- **Output**: Sorted list of sites with confidence scores (0-100%)

Key functions:
- `calculateMatchScore(site, persona)` - Returns 0-100 confidence
- `getPersonaRecommendations(persona, sites, limit)` - Returns sorted recommendations
- `getCategoryAffinityMap()` - Maps personas to preferred categories

### 1.2 Persona-Category Affinity Mapping

Define relationships between the 8 ACUX personas and site categories:

| Persona | High Affinity Categories |
|---------|-------------------------|
| Archaeologist | Archaeological Site, Museum, Historic District |
| Religious Seeker | Religious Site, Sacred spaces |
| Art Seeker | Museum, Performing Arts, Cultural Experience |
| Naturalist | Natural landscapes (if available), Traditional Crafts |
| Gourmand | Food Heritage, Cultural Experience |
| Traditionalist | Traditional Crafts, Historic District, Food Heritage |
| Viral Seeker | Cultural Experience, Performing Arts |
| Leisure Seeker | Maritime Heritage, Fortress (scenic) |

---

## Phase 2: Enhanced Discover Page with Glass Effects

### 2.1 Update Discover Page
**File**: `src/pages/Discover.tsx`

Transform the current static page into a dynamic persona-aware discovery experience:

**New Features**:
- Auto-load user persona on mount
- Calculate match scores for all sites using recommendation engine
- Display persona-based "For You" section at top
- Glass-effect filter chips for personas

**UI Sections**:
1. **Persona Context Banner** - Shows active persona(s) with glass card effect
2. **Persona Filter Chips** - Clickable glass-effect badges to filter by persona
3. **Match Score Display** - Each site card shows calculated match percentage
4. **Highlighted Recommendations** - Top matches with glow effect

### 2.2 Glass Effect CSS Components
**File**: `src/index.css` (additions)

Add glassmorphism utility classes:

```css
/* Glass effect base */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass effect for selected/active state */
.glass-active {
  background: rgba(var(--primary), 0.15);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--primary) / 0.3);
  box-shadow: 0 8px 32px hsl(var(--primary) / 0.15);
}

/* Glass effect with glow animation */
.glass-glow {
  animation: glass-pulse 2s ease-in-out infinite;
}

@keyframes glass-pulse {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
  50% { box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
}
```

### 2.3 Create GlassPersonaChip Component
**New File**: `src/components/discover/GlassPersonaChip.tsx`

A reusable glass-effect chip for persona filtering:

**Props**:
- `persona`: Persona data object
- `isActive`: Boolean for selected state
- `matchCount`: Number of matching sites
- `onClick`: Handler function

**Visual Effects**:
- Frosted glass background with blur
- Glow animation when active
- Smooth scale transition on hover
- Icon + label + count badge

### 2.4 Create PersonaFilterBar Component
**New File**: `src/components/discover/PersonaFilterBar.tsx`

Horizontal scrollable bar showing all 8 personas as glass chips:

**Features**:
- Show user's selected persona(s) first with "Your Style" label
- Show remaining personas as exploration options
- Display match count for each persona
- Multi-select capability (filter by multiple personas)
- "Show All" option to clear filters

---

## Phase 3: Enhanced Site Card with Match Visualization

### 3.1 Update SiteCard Component
**File**: `src/components/heritage/SiteCard.tsx`

Add visual indicators for persona matching:

**New Props**:
- `isRecommended`: Boolean for persona-matched sites
- `matchedPersonaIds`: Array of matching persona IDs

**Visual Enhancements**:
- Glass border glow for recommended sites
- Animated match score badge with gradient
- Show matched persona icons in footer
- Subtle background tint based on match level

### 3.2 Match Score Badge Component
**New File**: `src/components/discover/MatchScoreBadge.tsx`

Circular progress indicator showing match percentage:

**Features**:
- Animated fill on mount
- Color gradient based on score (coral to sage)
- Pulsing glow for high matches (>80%)
- Compact display with percentage

---

## Phase 4: Smart Filtering Logic

### 4.1 Filtering State Management

The Discover page will manage these filter states:
- `activePersonaFilters: string[]` - Selected persona IDs
- `userPersona: PersonaData | null` - User's saved persona
- `sortBy: 'match' | 'rating' | 'name'` - Sort preference
- `showOnlyRecommended: boolean` - Toggle for persona matches only

### 4.2 Filtering Algorithm

```text
1. Load all heritage sites
2. Load user persona from storage
3. For each site:
   a. Calculate match score against user persona
   b. Determine which persona IDs match (from site.personas)
   c. Apply category/country filters
   d. Apply persona chip filters
4. Sort by match score (descending) or selected sort
5. Render with appropriate glass effects
```

### 4.3 Real-time Filter Updates

When user clicks a persona chip:
1. Toggle persona in `activePersonaFilters`
2. Apply glass-active effect with animation
3. Filter sites to show only those with matching personas
4. Update site count badge on each chip
5. Smooth fade transition for site grid

---

## Phase 5: Animation & Micro-interactions

### 5.1 Tailwind Animation Extensions
**File**: `tailwind.config.ts`

Add new keyframes and animations:

```typescript
keyframes: {
  'glass-shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' }
  },
  'glow-pulse': {
    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' }
  },
  'slide-up-fade': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  }
}
```

### 5.2 Interaction Effects

| Interaction | Animation |
|-------------|-----------|
| Persona chip hover | Scale up 1.05x, border glow |
| Persona chip click | Glass-active class, ripple effect |
| Site card recommended | Subtle glow pulse |
| Filter change | Grid items slide-up-fade |
| Match score appear | Count-up animation |

---

## Technical Implementation Details

### File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/lib/recommendationEngine.ts` | Create | Core matching algorithm |
| `src/components/discover/GlassPersonaChip.tsx` | Create | Glass-effect persona filter chip |
| `src/components/discover/PersonaFilterBar.tsx` | Create | Horizontal persona filter bar |
| `src/components/discover/MatchScoreBadge.tsx` | Create | Animated match score indicator |
| `src/pages/Discover.tsx` | Update | Integrate recommendation engine and glass UI |
| `src/components/heritage/SiteCard.tsx` | Update | Add recommendation visual effects |
| `src/index.css` | Update | Add glass effect utility classes |
| `tailwind.config.ts` | Update | Add animation keyframes |

### Data Flow

1. **On Page Load**:
   - Fetch user persona from cookie/localStorage
   - Calculate match scores for all 100 heritage sites
   - Pre-compute persona filter counts

2. **On Persona Chip Click**:
   - Toggle filter state
   - Re-filter site list
   - Animate chip to glass-active state
   - Smooth transition for site grid

3. **On Site Display**:
   - Show match score from pre-computed data
   - Apply glass glow if score > 75%
   - Display matched persona icons

### Performance Considerations

- Match scores computed once on load, cached in state
- Filter operations use memoization
- Animations use CSS transforms (GPU accelerated)
- Lazy loading for site images
- Debounced filter updates for multiple rapid clicks

---

## Visual Preview

### Persona Filter Bar (Glass Effect)
```text
+------------------------------------------------------------------+
| 🎯 Your Style                                                     |
| +----------------+ +----------------+ +----------------+          |
| | 🏛️ Archaeologist| | 🎨 Art Seeker  | | 🍷 Gourmand   |  ...   |
| |    12 sites    | |    8 sites     | |    6 sites    |          |
| +----------------+ +----------------+ +----------------+          |
|  (glass-active)      (glass)            (glass)                  |
+------------------------------------------------------------------+
```

### Site Card with Match Indicator
```text
+----------------------------------------+
| [Image with gradient overlay]          |
| +--------+              +-----------+  |
| | 92%    |              | High      |  |
| | Match  | (glow)       | Access    |  |
| +--------+              +-----------+  |
+----------------------------------------+
| Site Name                              |
| Description...                         |
| 📍 Athens, Greece  ⏱️ 2-3 hours        |
| [Category Badge]   ⭐ 4.8              |
| 👥 🏛️ 🎨 (matched personas)            |
+----------------------------------------+
| [Rate]        [Add to Trip]            |
+----------------------------------------+
```

---

## Success Criteria

1. Users see personalized recommendations immediately on Discover page
2. Glass-effect persona chips provide intuitive filtering
3. Match scores accurately reflect persona-site compatibility
4. Animations are smooth and enhance rather than distract
5. Filter state persists during session
6. Mobile-first responsive design maintained
7. Accessibility preserved (keyboard navigation, screen readers)

