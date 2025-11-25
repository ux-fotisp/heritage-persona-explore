# Cultural Heritage Trip-Planning App: Planner Instance Design Specification

## Overview
The Planner instance serves as the central hub for discovering, exploring, and organizing cultural heritage experiences. It integrates personalized recommendations with comprehensive browsing capabilities through a unified interface featuring global search and multiple viewing modes.

---

## 1. Navigation Structure

### Primary Tabs
- **For You**: Personalized recommendations based on user personas (ACUX typology)
- **Browse All**: Comprehensive exploration of heritage sites with grid and map views

### Global Search
- **Position**: Sticky header at the top of the page, below main AppHeader
- **Functionality**: Real-time filtering across all cultural artifacts (museums, sites, restaurants, exhibits)
- **Placeholder**: "Search cultural experiences, museums, sites, restaurants..."
- **Visual Feedback**: Dynamic results counter badge displaying number of matches

---

## 2. Design Philosophy

### Visual Identity
- **Theme**: Dark purple base with pastel accents (sage green, coral)
- **Aesthetic**: Material Design 3 inspired with cultural heritage warmth
- **Color Palette**: 
  - Primary: Purple (`hsl(273, 65%, 70%)`)
  - Secondary Accents: Sage (`hsl(95, 25%, 75%)`), Coral (`hsl(15, 70%, 82%)`)
  - Background: Dark purple (`hsl(273, 25%, 15%)`)
  - Cards: Slightly lighter purple (`hsl(273, 20%, 20%)`)

### Typography
- **Headers**: Bold, clear hierarchy (text-xl, text-lg, text-base)
- **Body**: Readable sans-serif with muted color for secondary text
- **Interactive Elements**: Medium weight (font-medium) for labels and buttons

### Spacing & Layout
- **Mobile-First**: Responsive grid system (1 column mobile, 2 columns desktop)
- **Padding**: Consistent 1rem (p-4) for main containers
- **Gap**: 1rem (gap-4) between cards and elements

---

## 3. Global Search Implementation

### Technical Details
```typescript
// Search state management
const [searchTerm, setSearchTerm] = useState("");

// Real-time filtering
const filteredSites = HERITAGE_SITES.filter(site => {
  const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       site.description.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === "all" || site.category === selectedCategory;
  const matchesCountry = selectedCountry === "all" || site.country === selectedCountry;
  return matchesSearch && matchesCategory && matchesCountry;
});
```

### UI Components
- **Search Icon**: Lucide-react `Search` icon, positioned absolute left
- **Input Field**: Large (h-12), with left padding for icon
- **Results Badge**: Secondary variant, absolute right positioning
- **Container**: Sticky positioning with backdrop blur for depth

### User Experience
- Instant feedback as user types
- Visual counter updates in real-time
- No submission required - filtering is immediate
- Persists across tab switches
- Clear placeholder text guides user intent

---

## 4. Browse All Tab - Dual View System

### View Toggle Controls
**Position**: Top right of Browse All content
**Options**: 
- Grid View (List icon)
- Map View (Map icon)

### Grid View

#### Layout Structure
```
Header: "Explore Heritage Sites"
├── View Toggle Buttons
└── Filters Card
    ├── Category Dropdown
    ├── Country Dropdown
    └── Sites Grid (2 columns on desktop, 1 on mobile)
```

#### Filters
- **Category Filter**: Dropdown with all unique categories from heritage sites
- **Country Filter**: Dropdown with all unique countries
- **Default**: "All Categories" / "All Countries"
- **Styling**: Native select with border, rounded corners, semantic colors

#### Site Cards
Using the `SiteCard` component with:
- Image, name, description
- Location (city, country)
- Duration and rating
- Match score indicator
- "Add to Trip" and "Rate" actions
- Category badge

### Map View

#### Mapbox Integration
```typescript
// Map initialization
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/light-v11',
  center: userLocation || defaultCenter,
  zoom: userLocation ? 14 : 12
});
```

#### Map Features
1. **Interactive Markers**
   - Color: Primary purple (`hsl(var(--primary))`)
   - Size: 32px diameter circles
   - Border: 3px white with shadow
   - Click interaction: Selects site and displays detail card

2. **User Location Marker**
   - Color: Destructive red (`hsl(var(--destructive))`)
   - Size: 20px diameter
   - Visual: Pulsing animation for emphasis
   - Trigger: "Use My Location" button

3. **Navigation Controls**
   - Zoom in/out buttons
   - Compass/rotation control
   - Position: Top right of map

4. **Map Legend**
   - Position: Top left overlay
   - Background: Card with blur backdrop
   - Content: 
     - Heritage sites indicator
     - User location indicator (when active)
     - Total site count

#### Selected Site Card
Displays below map when a marker is clicked:
- Full site details
- Rating and duration
- "Get Directions" button (opens Google Maps)
- "Add to Trip" button
- Favorite button (heart icon)

#### Sites Preview List
- Shows first 6 filtered sites below the map
- Compact card design
- Click to select and highlight on map
- Active state: Ring border in primary color

---

## 5. Personalization Features (For You Tab)

### ACUX Typology Integration
Uses the `PersonaRecommendations` component to display:
- Sites matching user's selected personas
- Confidence scores and match percentages
- Personalized reasoning for recommendations
- Related experiences tailored to persona preferences

### Recommendation Attributes
- **Match Score**: Percentage based on persona alignment
- **Confidence**: Visual indicator (color-coded)
- **Reason**: Explanatory text for the recommendation
- **Tags**: Related themes and interests
- **Estimated Experience**: Duration, best time to visit, crowd levels

---

## 6. User Interactions

### Primary Actions
1. **Add to Trip**
   - Saves site ID to localStorage "plannedSites" array
   - Toast notification confirms action
   - Non-destructive (can add multiple times)

2. **Get Directions**
   - Opens Google Maps with destination coordinates
   - New browser tab/window
   - Uses site's lat/long coordinates

3. **Rate Experience**
   - Navigates to `/rate/:siteId` page
   - Allows pre-visit, during-visit, and post-visit ratings
   - Links to UEQ-S questionnaire flow

4. **Use My Location**
   - Requests geolocation permission
   - Centers map on user's current position
   - Adds user location marker to map
   - Toast feedback for success/failure

5. **Favorite Site**
   - Quick bookmark action
   - Heart icon interaction
   - Toast confirmation

### Secondary Interactions
- **Filter by Category/Country**: Dropdown selections
- **Switch View Modes**: Grid ↔ Map toggle
- **Select Site on Map**: Click marker to view details
- **Search Across Content**: Global search box

---

## 7. Responsive Design Guidelines

### Mobile (< 768px)
- Single column grid layout
- Larger touch targets (min 44px height)
- Bottom navigation for primary actions
- Collapsible filters
- Full-width search input
- Map height: 60vh for optimal viewing

### Tablet (768px - 1024px)
- 2-column grid for site cards
- Side-by-side filters
- Expanded map legend
- Medium-sized touch targets

### Desktop (> 1024px)
- 2-column grid with generous spacing
- Inline filters
- Maximum width constraints for readability (max-w-2xl for search)
- Hover states on all interactive elements
- Enhanced map controls

---

## 8. Accessibility Considerations

### ARIA Labels
- Search input: "Search cultural experiences"
- View toggle buttons: "Switch to grid view" / "Switch to map view"
- Filter dropdowns: "Filter by category" / "Filter by country"
- Action buttons: Descriptive labels for screen readers

### Keyboard Navigation
- Tab order follows logical reading flow
- Focus indicators on all interactive elements
- Enter key triggers primary actions
- Escape key closes modals/overlays

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for body, 3:1 for large text)
- Interactive elements have sufficient contrast in all states
- Color is not the only indicator (icons + text)

### Motion & Animation
- Reduced motion support via prefers-reduced-motion
- Animations are decorative, not functional
- No auto-playing content

---

## 9. Performance Optimization

### Map Loading
- Lazy load map only when Browse All tab is active
- Defer marker creation until map is ready
- Cleanup on component unmount

### Image Optimization
- Lazy loading for site images
- Responsive image sizes
- WebP format with fallbacks

### Search Performance
- Client-side filtering (no API calls for prototype)
- Debouncing not required due to small dataset
- Memoization for filtered results

### State Management
- localStorage for persistent data (planned sites, preferences)
- React state for UI interactions
- Minimal re-renders with proper dependency arrays

---

## 10. Content Guidelines

### Site Descriptions
- **Length**: 100-200 characters
- **Tone**: Informative yet engaging
- **Focus**: Historical significance, unique features, cultural value
- **Avoid**: Marketing language, superlatives without context

### Placeholder Text
- Search: "Search cultural experiences, museums, sites, restaurants..."
- Category: "All Categories"
- Country: "All Countries"
- No results: "No sites match your search. Try different keywords or filters."

### Error Messages
- Location denied: "Location access denied or unavailable"
- Map load failure: "Unable to load map. Please try again later."
- General: Clear, actionable messages with suggested next steps

---

## 11. Data Structure

### Heritage Site Object
```typescript
interface HeritageSite {
  id: string;
  name: string;
  description: string;
  category: string;
  country: string;
  city: string;
  rating: number;
  duration: string;
  coordinates: [number, number]; // [longitude, latitude]
  image: string;
  personas: string[]; // ACUX persona IDs that match
}
```

### Filter State
```typescript
interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedCountry: string;
}
```

---

## 12. Component Architecture

### Planner.tsx (Main Container)
- Manages global search state
- Handles tab navigation
- Coordinates filter state
- Integrates map and grid views

### PersonaRecommendations.tsx
- Fetches user's persona data
- Generates personalized site recommendations
- Displays confidence scores and reasoning

### SiteCard.tsx
- Reusable site display component
- Handles individual site interactions
- Consistent styling across all views

---

## 13. Future Enhancements

### Planned Features
- **Advanced Filters**: Date range, accessibility level, crowd predictions
- **Itinerary Builder**: Drag-and-drop day planning
- **Offline Mode**: PWA capabilities for map and site data
- **Social Sharing**: Share trip plans with friends
- **AR Integration**: Augmented reality site previews
- **Multi-language Support**: i18n for global audience

### Analytics Tracking
- Search term patterns
- Most viewed sites
- Filter usage statistics
- Map vs grid preference
- Conversion to "Add to Trip"

---

## 14. Technical Dependencies

### Required Libraries
- `react-router-dom` - Navigation
- `mapbox-gl` - Interactive maps
- `lucide-react` - Icon system
- `sonner` - Toast notifications
- `@radix-ui/react-tabs` - Tab component
- `tailwindcss` - Styling system

### Browser Requirements
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support
- Geolocation API for user location feature
- LocalStorage for data persistence

---

## 15. Testing Recommendations

### Unit Tests
- Filter logic correctness
- Search term matching
- State management functions
- Data transformation utilities

### Integration Tests
- Tab navigation flow
- Map marker interactions
- Filter + search combination
- Add to trip workflow

### E2E Tests
- Complete user journey from search to trip planning
- Cross-browser compatibility
- Mobile responsive behavior
- Accessibility compliance

### Performance Tests
- Map render time with 100+ markers
- Search responsiveness with large datasets
- Memory usage during extended sessions

---

## Design Assets & Resources

### Icons
- **Source**: Lucide React (https://lucide.dev)
- **Usage**: Search, MapPin, Filter, Map, List, Navigation, Heart, Star, Clock

### Fonts
- **Primary**: System font stack (native OS fonts)
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Color Tokens
All colors must use HSL format and reference CSS variables from `index.css`:
- `hsl(var(--primary))`
- `hsl(var(--background))`
- `hsl(var(--foreground))`
- `hsl(var(--muted))`
- etc.

### Animation Timing
- Default transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Spring effects: `0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
- Pulse animation: 2s infinite

---

## Developer Handoff Notes

### Environment Setup
1. Ensure Mapbox access token is configured (currently using placeholder)
2. Verify all heritage site data includes coordinates
3. Test geolocation permissions in development
4. Configure CORS for production API endpoints

### Code Quality
- Follow existing ESLint configuration
- Use TypeScript for type safety
- Document complex filtering logic
- Maintain consistent component structure

### Deployment Checklist
- [ ] Replace placeholder Mapbox token
- [ ] Optimize images and assets
- [ ] Test on multiple devices and browsers
- [ ] Verify accessibility compliance
- [ ] Load test with realistic data volumes
- [ ] Configure analytics tracking
- [ ] Set up error monitoring

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: CulturaPath Development Team
