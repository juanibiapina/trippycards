# Color Guide for Travel Cards

This document defines the allowed Tailwind CSS color classes for the Travel Cards application to ensure a consistent, professional gray-centric design.

## Primary Color Palette

### Gray Palette (Primary)
The application uses Tailwind's gray palette as the primary color scheme:

- **Backgrounds**:
  - `bg-gray-50` - Light page backgrounds
  - `bg-gray-100` - Alternative light backgrounds
  - `bg-white` - Card backgrounds (primary)

- **Buttons & Interactive Elements**:
  - `bg-gray-700` - Primary button background
  - `bg-gray-900` - Alternative primary button background
  - `hover:bg-gray-800` - Primary button hover state
  - `hover:bg-gray-950` - Alternative button hover state
  - `bg-gray-200` - Secondary button background
  - `hover:bg-gray-300` - Secondary button hover state

- **Headers & Navigation**:
  - `bg-gray-800` - Primary header background
  - `bg-gray-900` - Alternative header background
  - `text-white` - Header text color

- **Text Colors**:
  - `text-gray-900` - Primary text
  - `text-gray-800` - Secondary text
  - `text-gray-700` - Tertiary text
  - `text-gray-600` - Muted text
  - `text-gray-500` - Subtle text
  - `text-white` - Text on dark backgrounds

- **Borders & Dividers**:
  - `border-gray-300` - Standard borders
  - `border-gray-200` - Light borders

- **Focus States**:
  - `focus:ring-gray-500` - Focus ring color
  - `focus:ring-gray-600` - Alternative focus ring color

## Limited Color Usage

### Green/Red (Limited Usage)
These colors are **only** allowed for specific interactive elements when needed:

- **Green (Success/Positive actions)**:
  - `bg-green-600` - Success button active state
  - `hover:bg-green-700` - Success button hover state
  - `text-green-600` - Success text/indicators
  - `bg-green-500` - Success progress indicators

- **Red (Error/Negative actions)**:
  - `bg-red-600` - Error button active state
  - `hover:bg-red-700` - Error button hover state
  - `text-red-600` - Error text/indicators
  - `bg-red-500` - Error progress indicators

## Prohibited Colors

The following color families are **not allowed** in the application:

- Blue colors (`bg-blue-*`, `text-blue-*`, etc.)
- Teal colors (`bg-teal-*`, `text-teal-*`, etc.)
- Indigo colors (`bg-indigo-*`, `text-indigo-*`, etc.)
- Any gradient backgrounds (`bg-gradient-*`)
- Any other color families not explicitly listed above

## Usage Guidelines

1. **Cards**: Always use `bg-white` with `shadow-lg` for consistency
2. **Buttons**: Primary buttons should use `bg-gray-700` or `bg-gray-900` with `text-white`
3. **Backgrounds**: Use `bg-gray-50` or `bg-gray-100` for page backgrounds
4. **Headers**: Use `bg-gray-800` or `bg-gray-900` with `text-white`
5. **Interactive Elements**: Only use green/red colors for success/error states when needed
6. **Focus States**: Use `focus:ring-gray-500` or `focus:ring-gray-600` consistently

## Component-Specific Guidelines

### Button Component
- Primary: `bg-gray-700 hover:bg-gray-800 text-white`
- Secondary: `bg-gray-200 hover:bg-gray-300 text-gray-700`

### Card Component
- Background: `bg-white`
- Shadow: `shadow-lg`
- Border: `border-gray-200` (if needed)


### Page Backgrounds
- Main background: `bg-gray-50`
- Alternative: `bg-gray-100`
- Headers: `bg-gray-800` or `bg-gray-900`

This color guide ensures a unified, professional appearance throughout the application while maintaining clear visual hierarchy and accessibility.