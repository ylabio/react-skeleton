---
inject: true
to: src/api/index.js
skip_if: <%= name %>
append: true
---
export { default as <%= name %> } from './<%= name %>.js';