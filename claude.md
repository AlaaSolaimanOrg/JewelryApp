# Project Instructions

## General

- Do not add comments in code unless explicitly requested.

## SCSS

- Always use SCSS nesting instead of repeating parent selectors.
- Do not use BEM style (`&__title`, `&--active`).
- Use `&` only for states and pseudo selectors (`&:hover`, `&.active`, `&::before`).
- Keep child styles nested inside the parent selector.
- Prefer SCSS classes instead of inline styles.
- Avoid using inline styles unless the value is dynamic and cannot be handled with SCSS.

Example:

```scss
.card {
  .title {
    font-size: 18px;
  }

  &:hover {
    opacity: 0.8;
  }
}
```

## React Components

- Use arrow functions when creating new React components.
- Every new component should be created inside its own folder.
- The component folder name should match the component name.
- Add a SCSS file for the component if styling is needed.
- Add a `ComponentName.utils.tsx` file if component-specific utility functions are needed.
- Add a `ComponentName.type.ts` file if component-specific types are needed.

Component structure:

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.scss
├── ComponentName.type.ts
└── ComponentName.utils.tsx
```

Only create files when needed:
- Create `componentName.scss` only if the component requires styling.
- Create `ComponentName.utils.tsx` only if the component requires utility functions.
- Create `componentName.type.ts` only if the component requires component-specific types.

## Libraries

- Use `react-bootstrap` components whenever a suitable component already exists.
- Avoid creating custom implementations when `react-bootstrap` provides the required functionality.
- Use `react-icons` when adding icons.
- Do not use custom SVG icons or other icon libraries unless explicitly requested.