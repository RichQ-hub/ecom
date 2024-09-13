# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Local Development

Running the development server:

```bash
yarn dev
# OR
npm run dev
# OR
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

### HMR (Hot Module Replacement)

Vite provides HMR for real-time updates to modules within a running application without requiring a full page reload, thereby saving valuable time during development.

## Style Guide

### Compponent Folder Layout

- Component
  - Component.tsx
  - index.ts

### File/Folder Naming

- One component per file.
- Prefer functional components over class components.
- Use .tsx extension for React components and .ts for every other file.

### Naming

- `PascalCase` for React components and files.
- `camelCase` for everything else.

### Indentation

Use 2 spaces.

### Quoting

Use single quotes `'...'`.
