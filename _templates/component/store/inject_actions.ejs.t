---
inject: true
to: src/store/actions.js
skip_if: <%= name %>
append: true
---
export { default as <%= name %> } from './<%= name %>/actions';