# Design System Specification: Editorial Vitality



## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Digital Concierge."**



Moving away from the rigid, boxy constraints of traditional holiday apps, this system adopts a high-end editorial aesthetic. It treats the mobile screen like a premium travel magazine—dynamic, breathable, and deeply intentional. We reject the "templated" look by utilizing **intentional asymmetry** (e.g., staggering image cards), **overlapping elements** (floating emojis over image corners), and a **high-contrast typography scale** that makes even a simple date picker feel like an invitation to explore.



The goal is a "Sophisticated Playfulness": the energy of Indonesia’s red and white, tempered by the serenity of off-white paper textures and soft, organic depth.



---



## 2. Colors & Surface Philosophy

We use color not just for branding, but to define the physical environment of the app.



### The "No-Line" Rule

**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined exclusively through background color shifts or tonal transitions.

- Use `surface-container-low` (#f7f3ef) for section backgrounds.

- Use `surface-container-lowest` (#ffffff) for the interactive elements sitting atop them.

- This creates a seamless, high-end feel where the UI breathes rather than being "caged" by lines.



### Surface Hierarchy & Nesting

Treat the UI as a series of stacked fine papers.

- **Base Layer:** `surface` (#fdf9f5)

- **Content Sections:** `surface-container` (#f1ede9)

- **Interactive Cards:** `surface-container-lowest` (#ffffff)

- **Nesting:** When placing a detail card inside a section, move one step up the hierarchy. This "Tonal Layering" replaces the need for heavy shadows or strokes.



### The "Glass & Gradient" Rule

To elevate the "Professional yet Energetic" vibe:

- **CTAs:** Use a subtle linear gradient from `primary` (#9e001f) to `primary_container` (#c8102e) at a 135° angle. This adds "soul" and dimension.

- **Floating Overlays:** Use Glassmorphism for navigation bars or floating action buttons. Apply `surface` at 80% opacity with a `20px` backdrop-blur to allow Indonesian landscapes to bleed through the UI.



---



## 3. Typography

We pair two distinct personalities to create an editorial hierarchy.



* **Display & Headlines:** **Plus Jakarta Sans.** This is our "Voice." It is modern, slightly wide, and premium. Use `display-lg` for destination names and `headline-md` for section starts. The wide tracking in Jakarta Sans conveys confidence.

* **Body & Labels:** **Manrope.** This is our "Engine." It is highly legible and functional. Use `body-lg` for descriptions and `label-md` for metadata.



**Hierarchy Strategy:**

Large, bold headlines in `on_surface` (#1c1c19) should contrast sharply against `body-sm` text in `on_surface_variant` (#5c403f). This contrast ensures the app feels "designed" rather than just "filled with text."



---



## 4. Elevation & Depth

We eschew the "Material 2" style of heavy drop shadows in favor of natural, ambient light.



* **The Layering Principle:** Reach for color tokens before shadow tokens. A `surface-container-high` (#ebe7e4) card on a `surface` (#fdf9f5) background provides all the "lift" required for a premium look.

* **Ambient Shadows:** When a shadow is non-negotiable (e.g., a floating "Book Now" bar), use a multi-layered shadow: `0px 10px 30px rgba(158, 0, 31, 0.06)`. Note the use of a `primary` tint in the shadow—this prevents the UI from looking muddy or "dirty."

* **The "Ghost Border":** For input fields or accessibility requirements, use `outline-variant` (#e5bdbb) at **15% opacity**. It should be felt, not seen.



---



## 5. Components



### Buttons

- **Primary:** Gradient-filled (`primary` to `primary_container`), `xl` (3rem) corner radius. Typography: `title-sm` (white, bold).

- **Secondary:** `surface-container-highest` background with `on_surface` text. No border.

- **Tertiary:** Text-only in `primary`, used for low-priority actions like "View Map."



### Cards & Lists

- **The "No-Divider" Rule:** Lists must not use horizontal lines. Use `spacing-6` (2rem) of vertical whitespace to separate items, or wrap items in `surface-container-lowest` cards with `md` (1.5rem) rounded corners.

- **Asymmetric Imagery:** For holiday destination cards, use `DEFAULT` (1rem) rounding on three corners and `lg` (2rem) on the top-right to create a signature, custom look.



### Status Chips (Aman & Pertimbangan)

- **Aman (Safe):** `secondary_container` (#a0f399) background with `on_secondary_container` (#217128) text. Use a 🟢 emoji prefix.

- **Pertimbangan (Consideration):** `tertiary_fixed` (#ffdfa0) background with `on_tertiary_fixed` (#261a00) text. Use a ⚠️ emoji prefix.



### Input Fields

- Background: `surface-container-low` (#f7f3ef).

- Shape: `md` (1.5rem) rounding.

- Focus State: Transition background to `surface-container-lowest` (#ffffff) and add a `primary` "Ghost Border" at 20% opacity.



---



## 6. Do's and Don'ts



### Do

- **Do** use emojis as functional icons (e.g., 🏝️ for Beaches, 🍜 for Culinary). They should be large (24px+) and have ample breathing room.

- **Do** use `spacing-12` (4rem) and `spacing-16` (5.5rem) for top-level page margins to create a high-end feel.

- **Do** overlap elements. Let a "Promo" chip half-hang off the top of a destination image.



### Don't

- **Don't** use pure black (#000000) for text. Use `on_surface` (#1c1c19) to maintain the "off-white paper" warmth.

- **Don't** use `none` or `sm` rounded corners. This system is "Friendly and Accessible"; corners should always be `DEFAULT` (1rem) or higher.

- **Don't** clutter the screen. If a screen feels busy, remove a background color or increase the spacing scale by two increments.