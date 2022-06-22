---
inject: true
to: src/api/index.tsx
skip_if: <%= name %>
append: true
---
export { default as <%= name %> } from './<%= name %>.js';