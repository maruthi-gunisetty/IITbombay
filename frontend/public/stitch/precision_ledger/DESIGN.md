---
name: Precision Ledger
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#824500'
  on-tertiary: '#ffffff'
  tertiary-container: '#a65900'
  on-tertiary-container: '#ffede1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an institutional-grade, modern fintech aesthetic calibrated for small business financial operations, automated cashflow forecasting, and multi-currency reconciliation. It blends the structural clarity of Modern Corporate design with crisp, tactile micro-surfaces to instill institutional trust and frictionless day-to-day utility.

### Visual Character
- **Aesthetic Direction:** Elevated Modern Corporate with crisp micro-borders and soft ambient diffusion.
- **Tone:** Authoritative, transparent, highly responsive, and meticulously organized.
- **Form Factor Philosophy:** Density without visual friction. Information-heavy financial panels maintain generous legibility through strict mathematical rhythm, discrete card groupings, and subtle surface separation rather than heavy line work.

## Colors

The color architecture enforces a high-trust hierarchy optimized for data clarity and accessibility compliance (WCAG AAA for text, AA for controls).

### Palette Roles
- **Canvas Base (`#F8FAFC`):** Crisp cool off-white that prevents screen glare during prolonged financial analysis while grounding elevated surfaces.
- **Surfaces (`#FFFFFF` & `#F1F5F9`):** Pure white for foreground operational cards, tables, and floating panels; slate-100 (`#F1F5F9`) reserved for inset wells, search inputs, active table headers, and structural division.
- **Text Layers:** Primary charcoal (`#0F172A`) ensures unmistakable legibility for ledger figures and critical metrics. Secondary slate (`#475569`) is used for meta-labels and structural descriptions. Muted slate (`#94A3B8`) handles placeholder text, inactive pagination, and subtle dividers.
- **Action & Accent:**
  - **Brand Royal Blue (`#2563EB`):** Primary interactions, focus states, and primary balance summaries.
  - **Positive / Growth (`#059669`):** Cash-in events, positive runway projections, and verified reconciliation markers.
  - **Warning (`#D97706`):** Projected invoice delays, tax escrow warnings, and pending bank approvals.
  - **Danger / Critical (`#DC2626`):** Negative balance triggers, overdue AR aging alerts, and payment rejections.

## Typography

The typographic hierarchy pairs the contemporary geometric personality of **Plus Jakarta Sans** for dashboards, page titles, and KPI values with the rigorous utility of **Inter** for dense transactional lists, data grids, and form controls.

### Tabular Numerals & Monetary Formatting
All monetary representations, currency symbols (₹, $, €, £), timestamp records, and percentage metrics must enable OpenType tabular figures (`font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1`). This ensures perfect vertical alignment down balance ledgers and account reconciliation tables.

## Layout & Spacing

This design system uses a strict 8pt spatial grid (`0.5rem = 8px`) paired with a 12-column responsive fluid grid container bounded by a maximum layout width of `1440px`.

### Responsive Layout Strategy
- **Desktop (>= 1280px):** 12 columns, `1.5rem` gutters, `2rem` outer margins. Side navigation remains fixed at `260px` width. Multi-column financial widgets span 3, 4, 6, or 12 columns.
- **Tablet (768px - 1279px):** 8 columns, `1.25rem` gutters, `1.5rem` margins. Side navigation collapses to an icon rail (`72px`). Metric cards fold into 2-by-2 arrangements.
- **Mobile (< 768px):** 4 columns, `1rem` gutters, `1rem` outer margins. Full vertical stack. Fixed bottom sheet or drawer transitions for filters and financial ledger drill-downs.

## Elevation & Depth

Visual hierarchy relies on structural tonal contrast paired with hairline outlines and multi-stop ambient shadows. Heavy drop shadows are strictly avoided to maintain a light, crisp enterprise feel.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Applied to background layouts (`#F8FAFC`). No shadow.
- **Level 1 (Card & Section Containers):** Pure white surface (`#FFFFFF`) framed with a subtle border `1px solid #E2E8F0` and an ambient diffuse shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hovered Cards & Actionable Panels):** Elevated resting states on interactive elements: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`, retaining the `1px solid #CBD5E1` border.
- **Level 3 (Dropdowns, Popovers & Context Menus):** `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` with `1px solid #E2E8F0`.
- **Level 4 (Modals & Slide-out Drawers):** `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`, placed above an overlay backdrop of `rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(4px)`.

## Shapes

The design system standardizes on modern medium rounding (`roundedness: 2`), applying `0.5rem` (8px) as the structural constant for inputs, buttons, and individual line items.

### Radius Scale Applications
- **Base Components (`0.5rem` / 8px):** Buttons, text inputs, dropdown triggers, selection chips, and ledger rows.
- **Containers & Cards (`1rem` / 16px - `rounded-lg`):** Financial overview cards, chart containers, data tables, and quick-action panels.
- **Modals & Drawers (`1.5rem` / 24px - `rounded-xl`):** Dialog overlays, detail panels, and onboarding sheets.
- **Pills / Full Rounding (`9999px`):** Status badges, numerical count chips, and avatar indicators.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, font weight 600. Hover: `#1D4ED8`. Active: `#1E40AF`. Focus: 2px offset ring `rgba(37, 99, 235, 0.35)`.
- **Secondary / Outline:** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **Tertiary / Ghost:** Background transparent, text `#475569`. Hover: background `#F1F5F9`, text `#0F172A`.

### Status Badges & Chips
- Designed with high-legibility muted fills and deep text contrast:
  - **Success / Paid:** Background `#ECFDF5`, text `#047857`, border `1px solid #A7F3D0`.
  - **Pending / Warning:** Background `#FFFBEB`, text `#B45309`, border `1px solid #FDE68A`.
  - **Overdue / Critical:** Background `#FEF2F2`, text `#B91C1C`, border `1px solid #FECACA`.
  - **Neutral / Draft:** Background `#F1F5F9`, text `#475569`, border `1px solid #E2E8F0`.

### Data Grids & Ledger Lists
- **Header:** Background `#F8FAFC`, text `#475569`, uppercase `label-sm`, bottom border `1px solid #E2E8F0`.
- **Rows:** Background `#FFFFFF`, bottom border `1px solid #F1F5F9`. Hover state shifts surface to `#F8FAFC` smoothly over `150ms ease`.
- **Numeric Cells:** Right-aligned, formatted in tabular figures with currency sign prefixes anchored to the left or adjacent to the figure based on locale conventions.

### Form Inputs & Select Fields
- Height: `40px` (`2.5rem`), padding: `0 12px`, border: `1px solid #CBD5E1`, background: `#FFFFFF`, radius: `0.5rem`.
- Focus state: border color `#2563EB`, outer ring: `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- Error state: border color `#DC2626`, outer ring: `0 0 0 3px rgba(220, 38, 38, 0.15)`.

### Cards & KPI Tiles
- Base: Surface `#FFFFFF`, border `1px solid #E2E8F0`, radius `1rem`, padding `1.5rem`.
- Micro-interaction: Interactive metric cards shift upward by `-2px` on hover with elevation transition to Level 2 over `200ms cubic-bezier(0.16, 1, 0.3, 1)`.
- Trend Pill: Integrated within metric titles using small green/red indicator chips with directional glyphs (`↑` / `↓`).