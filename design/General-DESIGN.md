---
name: Warm Editorial Culinary PWA
colors:
  surface: '#fff8f5'
  surface-dim: '#e3d8d3'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf1ec'
  surface-container: '#f8ebe6'
  surface-container-high: '#f2e6e1'
  surface-container-highest: '#ece0db'
  on-surface: '#201a18'
  on-surface-variant: '#59413c'
  inverse-surface: '#352f2c'
  inverse-on-surface: '#faeee9'
  outline: '#8c716a'
  outline-variant: '#e0bfb8'
  surface-tint: '#ac3417'
  primary: '#9b280b'
  on-primary: '#ffffff'
  primary-container: '#bd4022'
  on-primary-container: '#ffe7e2'
  inverse-primary: '#ffb4a3'
  secondary: '#476552'
  on-secondary: '#ffffff'
  secondary-container: '#c9ebd3'
  on-secondary-container: '#4d6b58'
  tertiary: '#873d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#a95211'
  on-tertiary-container: '#ffe7dc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#8a1c00'
  secondary-fixed: '#c9ebd3'
  secondary-fixed-dim: '#adceb8'
  on-secondary-fixed: '#032112'
  on-secondary-fixed-variant: '#304d3c'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753400'
  background: '#fff8f5'
  on-background: '#201a18'
  surface-variant: '#ece0db'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-cooking-large:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 30px
  body-default:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-muted:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-prominent:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-compact:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system translates the sensory, deliberate quality of modern boutique culinary publishing—reminiscent of Alison Roman, Ottolenghi, and *The Kinfolk Table*—into an iOS-tailored progressive web application. 

The aesthetic is tactile, warm, and distinctly editorial: pairing literary typography and parchment-tinted surfaces with modern iOS interaction patterns. The goal is an atmosphere of kitchen calm—a digital cookbook that feels like an heirloom volume, built specifically for glanceable arm's-length legibility on kitchen counters alongside flour-dusted hands.

Key design tenants:
- **Quiet Authority:** Surfaces favor creamy natural cardstocks over sterile digital whites. Gradients are restrained, mimicking ambient kitchen illumination and printed matte paper.
- **Arm’s-Length Utility:** Generous tap targets (minimum 44–48px), stark contrast ratios for ingredient checklists, and prominent preparation timers prevent frustration mid-cook.
- **Editorial Warmth:** High-contrast serif headlines evoke food writing culture, paired with utilitarian, geometric sans-serif body copy optimized for variable lighting.

## Colors

The palette balances warm earthen gastronomy tones with functional UI clarity.

### Light Mode (Default)
- **Primary Canvas (`#FAF8F5`):** A warm parchment ground providing low eye strain under harsh kitchen pendants.
- **Elevated Surfaces (`#FFFFFF`):** Reserved for ingredient sheets, card containers, and active step-by-step cooking drawers.
- **Paprika Accent (`#BD4022`):** Primary interactive elements, focused states, and callout moments.
- **Toasted Herb (`#4F6D5A`):** Secondary interactive actions, dietary flags, and completed checklist states.
- **Soft Amber (`#D97736`):** Timing alerts, prep metrics, and interactive video badges.
- **Text & Contrast (`#2C2623`):** High-density roasted espresso tone for crisp text hierarchy without the harshness of pure black.
- **Subtle Partition (`#EAE4DC`):** Warm hairline dividers and border boundaries that evoke deckled edges.

### Dark Mode
- **Canvas Base (`#181513`):** Rich, deep espresso grounding.
- **Elevated Surfaces (`#24201D`):** Warm charcoal-toned sheet cards.
- **Accent Shift (`#E06A50`):** Soft terracotta calibrated for lower-glare contrast in evening settings.
- **Secondary Shift (`#6A8A77`):** Elevated herbal tint maintaining AA accessibility.
- **Warm White Readability (`#F5EFEB`):** Milk-white text tone providing anti-fatigue contrast.
- **Border Trim (`#36302B`):** Muted earthen hairbars.

## Typography

The type system creates an authentic tension between classic print editorial standards and iOS utility.

- **Editorial Serifs (Headlines):** `Playfair Display` governs dish names, narrative introductions, and chapter marks. Headlines project culinary warmth, heritage, and distinction.
- **Functional Body Text:** `Inter` handles operational kitchen copy. Its geometric clarity guarantees unambiguous legibility for units of measurement (`tbsp`, `tsp`, `g`, `ml`) and fractional numbers.
- **Cook Mode Scale (`body-cooking-large`):** Scaled intentionally to 19px with generous 30px line spacing to allow glanceable reading from the kitchen counter without leaning down toward the handset.
- **Metadata & Indicators:** Uppercase or high-contrast label tokens are letter-spaced with extra tracking for immediate recognition across timestamps and yield metrics.

## Layout & Spacing

The layout is built around mobile-first touch zones honoring iOS safe areas (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`), scaled fluidly for iPad propping stands and desktop pantry browsing.

- **Mobile Rhythm (PWA Handset):** A 4-column fluid layout bounded by a minimum 16px screen edge margin. Bottom sheet actions and persistent cook navigation clear the iOS home indicator bar by 24px.
- **Tablet / Counter Stand (600px - 1024px):** Reflows to an 8-column layout. In cooking mode, this splits into a fixed 3-column ingredient checklist pinned to the left, paired with a 5-column paginated step instruction card on the right.
- **Desktop (1025px+):** Max layout width is clamped to 1180px with 12 columns, mirroring a two-page open cookbook spread.
- **Touch-First Guardrails:** All tappable controls, step toggles, and badge filters require minimum target dimensions of 48px by 48px, preventing mis-taps during active meal prep.

## Elevation & Depth

To sustain the tactile, editorial feel, visual hierarchy relies on warm low-contrast borders combined with natural ambient paper drop shadows. Harsh synthetic drop shadows and cold blurs are avoided.

- **Level 0 (Parchment Foundation):** Background canvas (`#FAF8F5` / `#181513`). No shadow.
- **Level 1 (Card & Paper Surfaces):** Elevated recipe index cards and step containers use a warm-tinted hairline border (`1px solid #EAE4DC`) combined with an ultra-soft paper elevation shadow: `box-shadow: 0 4px 16px -2px rgba(44, 38, 35, 0.05)`.
- **Level 2 (Cooking Drawers & Overlays):** Modal sheets, timer popovers, and ingredient slide-overs sit higher: `box-shadow: 0 12px 32px -4px rgba(44, 38, 35, 0.12)`.
- **Level 3 (Tactile Push):** Depressed active states feature an inner shadow (`inset 0 1px 3px rgba(44, 38, 35, 0.15)`) providing tactile reassurance when toggling steps with quick taps.
- **Glass Accents:** Bottom navigation and floating header bars use a high-saturation frosted parchment filter (`backdrop-filter: blur(20px) saturate(180%); background-color: rgba(250, 248, 245, 0.85)` in light mode, and `rgba(24, 21, 19, 0.85)` in dark mode).

## Shapes

The design system uses a balanced corner radius (`roundedness: 2`) to echo contemporary iOS interfaces without feeling overly playful or bubbly. 

- **Containers & Recipe Cards:** 16px (`1rem`) border radius gives cards a neat, tailored, recipe-binder slip feel.
- **Interactive Buttons & Badges:** Use a true pill profile (`border-radius: 9999px`) for metadata markers (e.g., prep duration, yield, category tags) to contrast visually against rectangular recipe content.
- **Checkboxes:** 8px (`0.5rem`) radius creates an accessible, easily targeted micro-plate for striking through ingredients.
- **Bottom Drawers & Modals:** Standardized iOS corner radii of 24px (`1.5rem`) on top-left and top-right margins.

## Components

### Buttons
- **Primary Cook Mode Button:** Full-width pill or 48px height. Solid Paprika (`#BD4022`) background with warm cream text (`#FAF8F5`). Active tap triggers a subtle scale compression (`scale(0.98)`).
- **Secondary Actions:** Herb-tinted ghost buttons (`border: 1.5px solid #4F6D5A; color: #4F6D5A`).
- **Tertiary / Utility:** Text-only with an accent underline or subtle muted fill (`rgba(79, 109, 90, 0.08)`).

### Pill Badges & Metadata Chips
- Non-interactive metadata chips (cook time, servings, difficulty) feature an amber or herb wash (`background: rgba(217, 119, 54, 0.12); color: #B3581B`) with 12px font size, uppercase tracking, and 28px height.
- **YouTube Media Badges:** Curated recipe pills with a subtle YouTube red accent marker, displaying run time and instant embedded modal trigger.

### Recipe Step Lists & Checkboxes
- **Tactile Cooking Checkbox:** 28px square with a 6px radius. Inactive state: 1.5px border in `#EAE4DC`. Active state: deep herb fill (`#4F6D5A`) showing a crisp milk-white check icon.
- Tapping toggles step completion, applying a gentle 40% opacity strike-through to the corresponding ingredient line without completely hiding it from view.

### Input Fields & Import Banners
- **Inputs:** 48px height minimum. Bordered with warm muted grey-sand (`#EAE4DC`), shifting to `#BD4022` on focus with no glowing ring—only a 1.5px crisp highlight.
- **Non-blocking Import Banner:** Floating banner at top safe-area with Level 2 elevation. Detects copied URLs from clipboard with non-intrusive action buttons ("Import Recipe" vs "Dismiss") that auto-collapse to a thin pill icon after 6 seconds.

### Recipe Cards
- Vertical layout with a 4:3 food photography mask at the top, soft card divider, prominent serif title, and pill metadata cluster below. High-contrast typography ensures readability against diverse photography.