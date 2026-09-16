# GitHub Intelligence Design System

## Visual Source of Truth

The repository contains a screenshot/reference folder with the approved design references.

These screenshots are authoritative for the visual design:

- `screenshots/Design schemes.png`
- `screenshots/Engineering Overview — GitHub Intelligence.png`
- `screenshots/Engineering Analytics — GitHub Intelligence.png`
- `screenshots/Pull Requests Explorer — GitHub Intelligence.png`
- `screenshots/Your Repositories — GitHub Intelligence.png`

Use the actual files present in the repository (`screenshots/`). Do not create alternative design interpretations.

The supplied screenshot folder is the **SINGLE SOURCE OF TRUTH** for the frontend visual design.

---

## Design Rule

The frontend must follow the visual language demonstrated in these screenshots.

Do NOT introduce:

- gradients
- glassmorphism
- neon colors
- purple AI-style palettes
- blue SaaS dashboards
- excessive rounded cards
- excessive shadows
- excessive animations
- generic dashboard templates
- arbitrary colors
- arbitrary typography
- arbitrary spacing systems

Do not redesign the visual language.

Do not "modernize" the design unless explicitly instructed.

Do not replace the design with Material UI's default visual appearance.

Do not use a component library's default theme as the product design.

---

## Approved Color System

Primary:
#B7A16A

Secondary:
#B96858

Tertiary:
#35B98A

Neutral:
#08110F

These colors should be interpreted according to the supplied Design schemes reference.

Use the screenshots to determine:

- surface hierarchy
- text hierarchy
- border treatment
- accent usage
- status colors
- spacing
- component density
- button treatment
- input treatment
- table treatment
- chart treatment
- navigation treatment

---

## Color Roles & Design Characteristics

Background:
#08110F

Primary accent:
#B7A16A (Gold)

Success / positive:
#35B98A (Mint)

Warning:
#B7A16A (Gold)

Danger / negative:
#B96858 (Coral)

Text:
Warm off-white / cream

Muted text:
Desaturated green-gray

Borders:
Very subtle low-contrast borders.

- Backgrounds should use very dark green-black tones (`#08110F`).
- Cards should be slightly lighter than the page background.
- Avoid pure black (`#000000`).
- Avoid pure white (`#FFFFFF`).
- Gold is the primary visual accent.
- Mint represents healthy/successful states.
- Coral represents warnings/errors.

---

## Typography

Typography must visually follow the supplied references.

Use the demonstrated serif/editorial heading character and clean supporting typography:

- **Headings**: Serif or editorial-style display typography where appropriate.
- **Body**: Clean readable sans-serif.
- **Labels / technical metadata**: Monospace may be used selectively.

Typography should create hierarchy without relying entirely on font size.

Do not arbitrarily substitute a completely different visual style.

Typography choices should be centralized so they can be changed globally.

---

## Layout

The application uses a dense engineering intelligence dashboard layout.

Primary structure:

Sidebar
+
Top navigation
+
Main content

The screenshots define the proportions, spacing, density, and hierarchy.

- **Sidebar**: Fixed desktop navigation.
- **Main content**: Fluid content area.
- **Cards**: Use restrained borders and moderate radius. Avoid excessive floating cards.

Do not create oversized empty layouts.

Do not turn the dashboard into a marketing-style layout.

---

## Dashboard Density

This is a data-heavy engineering product.

Prefer:

- compact tables
- clear metrics
- restrained spacing
- strong alignment
- information hierarchy

Do not make every component excessively large.

---

## Components

Reusable components must inherit the design system.

Examples:

- Button
- Card
- MetricCard
- Badge
- StatusBadge
- Input
- Select
- Tabs
- Table
- IconButton
- Chart containers
- Loading states
- Empty states
- Error states

Components should look like they belong to the same product.

---

## Charts

Charts should follow the application palette.

Use:

- muted gold
- mint
- coral
- neutral dark tones

Avoid rainbow charts.

Avoid unnecessary decoration.

Charts should communicate information rather than act as decoration.

---

## Status

Healthy:
Mint (`#35B98A`)

Warning:
Gold (`#B7A16A`)

Error:
Coral (`#B96858`)

Neutral:
Muted gray/green

---

## Interaction

Hover states should be subtle.

Transitions should be short and purposeful.

Avoid excessive animation.

Use animation to communicate:

- loading
- state change
- navigation
- feedback

not decoration.

---

## Dashboard Pages

The following screenshots establish the approved page patterns:

### Engineering Overview:
- KPI metrics
- engineering activity chart
- active repositories
- recent pull requests
- dense information hierarchy

### Analytics:
- KPI cards
- throughput visualization
- cycle-time distribution
- contributor metrics
- analytical tables

### Pull Requests:
- PR metrics
- state filters
- search/filter controls
- dense PR listing
- pagination
- operational summary cards

### Repositories:
- repository metrics
- tracked repositories
- available repositories
- sync state
- repository actions

---

## Important

The screenshots are references for BOTH:

1. visual appearance
2. component/layout patterns

Do not copy fake data from the screenshots into production.

The screenshots show the intended UI structure and visual language, not the backend data.

Real application data must come from the documented FastAPI API.

---

## Landing Page

The landing page and Hero section may use the same visual language, colors and typography.

However, it should NOT invent a separate visual identity.

The Hero must feel like the same GitHub Intelligence product.

---

## Responsive Design

Desktop is the primary reference because all supplied screenshots are desktop designs.

Responsive behavior should preserve the same design language.

Do not create an unrelated mobile design.

---

## Design Priority

When making a visual decision, use this priority:

1. Supplied screenshots
2. Design tokens in this document
3. Existing component patterns
4. Explicit future product instructions

Never use generic SaaS design conventions over the supplied references.

---

## Final Rule

When implementing any UI, first ask:

"Does this look like it belongs in the supplied GitHub Intelligence screenshots?"

If the answer is no, revise it.