# Design System Document

## 1. Overview & Creative North Star
The visual identity of this design system is anchored by the Creative North Star: **"The Radiant Artisan."** 

This concept fuses the technical precision of a global talent marketplace with the warmth and vibrancy of Filipino craftsmanship ("Likha"). We reject the "generic SaaS" look of flat grids and heavy borders. Instead, we embrace a high-end editorial aesthetic defined by **Glassmorphism**, **Tonal Layering**, and **Luminous Depth**. 

By utilizing intentional asymmetry—such as overlapping glass cards and varying typographic scales—we create a platform that feels like a premium digital gallery rather than a database. The interface should breathe, using expansive white space to honor the "Henyo" (genius) of the individuals it features.

---

## 2. Colors
Our palette is a sophisticated nod to heritage, translated into a modern digital language.

### Primary & Accent Roles
- **Primary (`#0048e1`):** A deep, innovative blue that serves as our "Trust Anchor." Used for high-priority actions.
- **Secondary (`#bb0012`):** A vibrant red accent to be used sparingly for critical feedback or "Live" indicators, evoking energy.
- **Tertiary (`#735c00`):** A muted gold that provides warmth and a sense of premium "Henyo" status.

### The "No-Line" Rule
To maintain an airy, sophisticated feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through:
1. **Background Shifts:** Placing a `surface-container-low` section against a `surface` background.
2. **Nesting:** Using `surface-container-highest` for internal card elements to create organic separation.

### The Glass & Gradient Rule
Main CTAs and Hero backgrounds should utilize a "Signature Gradient" transitioning from `primary` to `primary_container`. For floating UI elements (like navigation bars or hovering profile cards), apply a **Glassmorphic Effect**:
- **Fill:** `surface` at 60-80% opacity.
- **Backdrop Blur:** 12px to 20px.
- **Edge:** A "Ghost Border" (see Section 4).

---

## 3. Typography
We use a dual-font system to balance authority with approachability.

- **Headlines (Manrope):** Our "Voice." Manrope’s geometric yet warm curves convey innovation. Use `display-lg` for hero statements with tight letter-spacing (-0.02em) to create a bold, editorial impact.
- **Body (Inter):** Our "Intelligence." Inter is used for all functional text to ensure maximum readability. 

**The Hierarchy Strategy:**
Create high-contrast layouts. Pair a large `display-md` headline with a small, uppercase `label-md` (with 0.05em tracking) acting as a kicker or eyebrow text. This creates an "Editorial" look that guides the eye through the "Likha" (creation) process.

---

## 4. Elevation & Depth
Depth in this system is a result of light and shadow, not lines and boxes.

- **The Layering Principle:** Stack surfaces to create hierarchy. 
    - *Level 0:* `surface` (The base canvas).
    - *Level 1:* `surface-container-low` (Content sections).
    - *Level 2:* `surface-container-lowest` (Cards or interactive elements).
- **Ambient Shadows:** When an element must "float," use a highly diffused shadow:
    - **Blur:** 24px - 48px.
    - **Opacity:** 4% - 8% of the `on-surface` color. 
    - **Note:** Avoid pure black shadows; they feel "dirty" on a bright, airy UI.
- **The "Ghost Border" Fallback:** If a container sits on an identical color background, use the `outline-variant` token at **10% opacity**. This creates a "suggestion" of a border that feels elegant rather than structural.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`) with a `full` roundedness scale. No border. Text color: `on_primary`.
- **Secondary:** Surface-container-highest fill with `on_surface` text.
- **States:** On hover, increase the elevation using an Ambient Shadow; do not change the background color drastically.

### Inputs & Fields
- **Styling:** Use `surface_container_lowest` for the field fill. 
- **Border:** Use the "Ghost Border" (`outline_variant` at 20%). 
- **Focus:** Transition the Ghost Border to a 2px `primary` glow with a soft blur.

### Cards (The "Henyo" Profile)
- **Structure:** Forbid divider lines. Use `spacing.6` (2rem) of vertical white space to separate the freelancer's bio from their skill tags.
- **Depth:** Use Glassmorphism for the "Price" or "Rating" badge to make it pop against the profile image.

### Chips (Skills & Tags)
- **Style:** `surface_container_high` background with `on_surface_variant` text. 
- **Shape:** `rounded-md` (0.75rem) to differentiate from the `full` roundedness of action buttons.

### Additional: The "Trust Glass" Navigation
A fixed header using a backdrop-blur (16px) and `surface` at 70% opacity. This ensures the freelancer's work (the background) is always felt, even while navigating.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Overlap an image slightly over a `surface_container` card to create a high-end, custom-build feel.
- **Embrace White Space:** Use `spacing.16` or `spacing.20` between major sections to let the "Henyo" personality shine.
- **Use Tonal Transitions:** Separate the header from the hero using a subtle shift from `surface` to `surface_container_low`.

### Don't:
- **Don't use 100% opaque borders:** This breaks the airy, "Radiant" aesthetic.
- **Don't use standard "Drop Shadows":** Avoid high-offset, high-opacity shadows that feel dated.
- **Don't use dividers:** Never use a horizontal line to separate list items. Use white space (`spacing.4`) or subtle tonal shifts between rows.
- **Don't crowd the content:** If a layout feels busy, increase the spacing scale by one tier (e.g., from `spacing.8` to `spacing.10`).