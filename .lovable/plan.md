

# Sticky Progress Bar and Viewport-Safe Buttons for Persona Questionnaire

## Problem
1. The progress bar is already positioned with `sticky top-[56px]`, but the AppHeader is not sticky itself -- it scrolls away, making `top-[56px]` incorrect once the header leaves the viewport. The progress bar needs to collapse/reduce when scrolling.
2. The bottom CTA button and scale choice buttons inside persona cards may be cut off or obscured by the fixed bottom bar.

## Changes

### 1. Make AppHeader Sticky on This Page
**File: `src/pages/PersonaQuestionnaire.tsx`**
- Wrap the AppHeader in a sticky container (`sticky top-0 z-40`) so it stays at the top.
- This ensures the progress bar's `sticky top-[56px]` works correctly as you scroll.

### 2. Reduce/Compact the Progress Bar When Scrolling
**File: `src/pages/PersonaQuestionnaire.tsx`**
- Add a scroll listener (`useEffect` + `useState`) that tracks whether the user has scrolled past a threshold (e.g., 100px).
- When scrolled, switch the progress section to a compact mode:
  - Remove the text labels ("Your Progress", "X of 8 rated")
  - Reduce vertical padding (`py-3` to `py-1.5`)
  - Shrink the progress bar height (`h-3` to `h-2`)
  - Hide the step indicators
- This gives the user more viewport space for content while keeping progress visible.

### 3. Ensure Bottom CTA Buttons Are Fully Visible
**File: `src/pages/PersonaQuestionnaire.tsx`**
- The bottom CTA is `fixed bottom-0` with `pt-6 pb-8` -- this is fine, but the persona list needs enough bottom padding to prevent the last card's scale buttons from being hidden behind it.
- Change `pb-48` on the personas list container to a calculated value using `pb-[180px]` to match the actual height of the fixed bottom bar (button + footer text + padding).

### 4. Ensure Scale Buttons Are Not Clipped
**File: `src/components/onboarding/PersonaCard.tsx`**
- No structural changes needed -- the 11-point grid is already within the card. The bottom padding fix above ensures the last card's buttons are visible above the fixed CTA.

## Technical Details

```text
Scroll State Logic:
  const [isCompact, setIsCompact] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
```

Layout structure after changes:
```text
+-------------------------------+
| AppHeader (sticky top-0 z-40) |
+-------------------------------+
| Progress (sticky top-[56px])  |  <-- reduces to compact on scroll
|   Compact: thin bar only      |
+-------------------------------+
| Title Section (scrolls)       |
| Persona Cards (scrolls)       |
|   ...                         |
|   (pb-[180px] bottom padding) |
+-------------------------------+
| Fixed Bottom CTA (z-50)       |
| Button + footer text          |
+-------------------------------+
```

### Files Modified
| File | Change |
|------|--------|
| `src/pages/PersonaQuestionnaire.tsx` | Add scroll listener for compact mode, make header area sticky, adjust bottom padding |

