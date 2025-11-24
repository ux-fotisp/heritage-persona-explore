# Cultural Heritage Trip Planning App - Museum Detail Page
## Design & Development Specification

**Example Site:** National Archaeological Museum, Athens, Greece  
**Framework:** React + TypeScript + Tailwind CSS  
**Design System:** CCIM Cultural Heritage (Purple/Sage/Coral Theme)

---

## 1. Design Philosophy

### Core Principles
- **Cultural Authenticity:** Respect the museum's original visual identity while integrating modern UX
- **Personalization First:** Adapt content based on ACUX typology without overwhelming the user
- **Mobile-First Responsive:** Seamless experience across all devices
- **Accessibility:** WCAG 2.1 AA compliant with clear visual hierarchy

### Color Palette (HSL Values)
```css
--primary: 273 65% 70%        /* Purple - Primary actions */
--sage: 95 25% 75%            /* Sage Green - Secondary actions */
--coral: 15 70% 82%           /* Coral - Tertiary accents */
--terracotta: 20 55% 72%      /* Heritage tone for cultural elements */
--background: 273 25% 15%     /* Dark purple background */
--foreground: 0 0% 95%        /* Light text */
```

### Typography
- **Primary Font:** Comfortaa (rounded, approachable)
- **Secondary Font:** Manrope (clean, readable)
- **Headings:** Bold, 2xl-5xl scale
- **Body:** Regular, 14-16px base

---

## 2. Page Structure & Layout

### A. Header (Sticky)
**Purpose:** Navigation and quick actions  
**Height:** 72px  
**Background:** Semi-transparent card with backdrop blur

**Elements:**
- Back button (left)
- Museum name + location (center-left)
- Share button (right)
- Favorite/heart button (right)

**Behavior:**
- Sticky on scroll
- Backdrop blur effect
- Shadow increases on scroll

---

### B. Hero Section
**Height:** 400px mobile, 500px desktop  
**Purpose:** Visual impact and primary information

**Elements:**
1. **Background Image**
   - Full-width hero image
   - Gradient overlay (transparent → background/90)
   - High-quality photograph (min 1920px width)
   - Object-fit: cover

2. **Content Overlay (Bottom)**
   - UNESCO badge (if applicable)
   - Museum name (4xl-5xl heading)
   - Tagline (lg text, muted)
   - Star rating + review count
   - Location indicator

**Image Guidelines:**
- Use authentic, high-resolution museum photography
- Prefer exterior or signature interior shots
- Ensure good contrast for text overlay
- Format: WebP with JPG fallback

---

### C. Personalization Banner (Conditional)
**Display:** Only when user has selected a persona  
**Purpose:** Highlight personalized content

**Design:**
- Gradient background (primary theme)
- Persona icon (emoji, 4xl)
- "Personalized for [Persona Name]" heading
- Brief description
- Trait badges (secondary style)

**Variants by ACUX Persona:**
1. **Art Lover** 🎨
   - Focus: Visual aesthetics, artistic expression
   - Color accent: Primary purple

2. **History Enthusiast** 📚
   - Focus: Historical context, narratives
   - Color accent: Terracotta

3. **Experience Seeker** ✨
   - Focus: Immersive, interactive experiences
   - Color accent: Sage

4. **Social Explorer** 👥
   - Focus: Group activities, sharing
   - Color accent: Coral

5. **Knowledge Collector** 🔍
   - Focus: Deep learning, research
   - Color accent: Olive

---

### D. Main Description
**Purpose:** Informative content about the museum

**Structure:**
- Heading: "About This Heritage Site" (2xl, bold)
- 3 paragraphs:
  1. Overview and significance
  2. History and mission
  3. Collections and highlights
- Typography: prose style, relaxed line-height
- Max-width: Container (prevents overly wide text)

**Content Guidelines:**
- 300-500 words total
- Engaging yet informative tone
- Highlight unique features
- Avoid marketing fluff
- Include specific artifact names when possible

---

### E. Quick Actions (CTA Strip)
**Layout:** 3-column grid (stacks on mobile)  
**Purpose:** Primary user actions

**Buttons:**
1. **Add to Trip** (Hero variant - primary gradient)
   - Icon: Calendar
   - Action: Add to user's itinerary

2. **Get Directions** (Sage variant)
   - Icon: Navigation
   - Action: Open in maps app

3. **Book Tickets** (Coral variant)
   - Icon: Ticket
   - Action: Open official ticket link

**Specs:**
- Height: 56px (h-14)
- Font-size: 16px
- Rounded: 12px
- Shadow: button shadow
- Hover: scale(1.02) + enhanced shadow

---

### F. Visiting Information
**Layout:** 2-column grid (stacks on mobile)  
**Purpose:** Practical visit planning

**Cards:**

1. **Opening Hours**
   - Icon: Clock (primary)
   - Days with times
   - Holiday note

2. **Visit Duration**
   - Icon: Users (sage)
   - Quick tour: 1.5-2h
   - Standard: 3-4h
   - In-depth: Full day

3. **Location & Access**
   - Icon: MapPin (coral)
   - Full address
   - Public transport info
   - Walking distance from station

4. **Admission**
   - Icon: Ticket (primary)
   - General price
   - Reduced price
   - Link to online booking

**Card Design:**
- Padding: 24px
- Background: card color
- Border: border color
- Shadow: card shadow
- Hover: subtle lift

---

### G. Personalized Recommendations
**Display:** Only with active persona  
**Layout:** 2-column grid

**Structure:**
- Section heading with persona reference
- 2 recommendation cards per persona
- Each card includes:
  - Icon (Book/Camera)
  - Title
  - Description
  - Duration badge
  - Location badge (if external)
  - Highlight badge

**Content by Persona:**

**Art Lover:**
- Sculpture Collection Tour (internal)
- Nearby pottery workshop (external)

**History Enthusiast:**
- Chronological journey (internal)
- Acropolis Museum (external)

**Experience Seeker:**
- VR tour (internal)
- Theatrical guided tour (internal)

**Social Explorer:**
- Group discovery tour (internal)
- Photo walk experience (internal)

**Knowledge Collector:**
- Curator-led deep dive (internal)
- Research library access (internal)

---

### H. Connect & Share
**Layout:** 2-column split  
**Purpose:** Social engagement and official links

**Left Column - Official Links:**
- Official website button
- Book tickets button
- External link icons

**Right Column - Social Media:**
- 2x2 grid of social buttons
- Instagram, Facebook, Twitter, Share
- Icon + label format

**Button Style:**
- Outline variant
- Full-width on mobile
- Icon left-aligned
- External link indicator (right)

---

### I. Visitor Tips
**Layout:** 3-column grid  
**Purpose:** Quick, actionable advice

**Cards:**
1. **Best Time to Visit**
   - Border-left: primary (4px)
   - Crowd avoidance tips

2. **Photography**
   - Border-left: sage (4px)
   - Policy and suggestions

3. **Accessibility**
   - Border-left: coral (4px)
   - Facilities and services

**Card Style:**
- Padding: 20px
- Border-left accent
- Compact content
- Icon optional

---

## 3. Responsive Breakpoints

```css
/* Mobile First */
Base: 320px - 767px
- Single column layouts
- Stacked cards
- Touch-friendly buttons (min 44px)
- Collapsed navigation

/* Tablet */
md: 768px - 1023px
- 2-column grids
- Larger hero (450px)
- Side-by-side actions

/* Desktop */
lg: 1024px+
- 3-column grids where applicable
- Full-size hero (500px)
- Wider container (1200px max)
- Hover states active
```

---

## 4. Interactive Elements

### Hover States
- Buttons: Scale(1.02) + shadow enhancement
- Cards: Shadow lift + subtle scale
- Links: Underline or color shift

### Transitions
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-spring: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Loading States
- Skeleton screens for images
- Spinner for data fetch
- Progressive image loading

### Empty States
- Show default content if no persona selected
- Generic recommendations available
- Clear CTA to complete persona assessment

---

## 5. Content Guidelines

### Museum Name
Use official full name, no abbreviations

### Description
- **Tone:** Informative, engaging, respectful
- **Avoid:** Marketing hyperbole, stereotypes
- **Include:** Historical facts, notable collections
- **Length:** 300-500 words

### Visiting Information
- **Accuracy:** Use official sources only
- **Updates:** Flag seasonal variations
- **Links:** Direct to official ticketing
- **Accessibility:** Full disclosure of facilities

### Social Media
- Link to verified official accounts only
- Use current handles and URLs
- Test links regularly

---

## 6. Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly (semantic HTML)

### Interactive Elements
- Minimum touch target: 44x44px
- Clear focus states
- Descriptive link text
- Alt text for all images

### Typography
- Minimum 16px body text
- Line height ≥ 1.5
- Max line length: 80 characters
- Scalable fonts (rem units)

---

## 7. Performance

### Image Optimization
- WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading for below-fold content
- Max 200KB per image

### Code Splitting
- Route-based splitting
- Dynamic imports for heavy components
- Defer non-critical scripts

### Metrics Targets
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.8s

---

## 8. Data Sources

### Required Data Fields
```typescript
interface MuseumDetail {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  description: {
    overview: string;
    history: string;
    collections: string;
  };
  visitInfo: {
    openingHours: { day: string; hours: string }[];
    duration: { quick: string; standard: string; deep: string };
    admission: { general: number; reduced: number; currency: string };
  };
  media: {
    heroImage: string;
    gallery: string[];
  };
  links: {
    website: string;
    ticketing: string;
    social: { platform: string; url: string }[];
  };
  personas: {
    [key: string]: {
      recommendations: Recommendation[];
    };
  };
}
```

### Placeholder Data
When real data is unavailable:
- Use lorem ipsum for descriptions
- Placeholder hours: "9:00 AM - 5:00 PM"
- Generic admission: "€10 / €5"
- Use Unsplash for images with proper attribution

---

## 9. Development Notes

### State Management
- Local state for UI interactions (favorites, share)
- localStorage for persona data
- Context for theme/personalization

### API Integration Points
- Museum details endpoint
- Persona recommendation engine
- Ticketing system (external)
- Maps integration

### Error Handling
- Graceful fallbacks for missing data
- Clear error messages
- Retry mechanisms for failed requests

### Testing
- Unit tests for persona logic
- Integration tests for user flows
- Visual regression tests
- Accessibility audits

---

## 10. Future Enhancements

### Phase 2 Features
- 360° virtual tours
- AR artifact preview
- Multi-language support
- Offline mode (PWA)
- User reviews and ratings
- Trip planning integration

### Analytics
- Track persona engagement
- Monitor CTA conversion
- Heat map user interactions
- A/B test personalization variants

---

## Appendix: ACUX Typology Reference

**ACUX (Aesthetics-Culture-UX) Typology** is a framework for personalizing cultural heritage experiences based on visitor preferences:

1. **Art Lover:** Visual aesthetics, artistic interpretation
2. **History Enthusiast:** Historical narratives, context
3. **Experience Seeker:** Immersive, interactive experiences
4. **Social Explorer:** Group activities, social sharing
5. **Knowledge Collector:** Deep learning, research

Each persona receives tailored recommendations, content emphasis, and UI adaptations to match their cultural engagement style.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintained by:** CulturaPath Design Team
