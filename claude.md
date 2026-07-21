# Project Instructions

## General

- Do not add comments in code unless explicitly requested.

## SCSS

- Always use SCSS nesting instead of repeating parent selectors.
- Do not use BEM style (`&__title`, `&--active`).
- Use `&` only for states and pseudo selectors (`&:hover`, `&.active`, `&::before`).
- Keep child styles nested inside the parent selector.

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
