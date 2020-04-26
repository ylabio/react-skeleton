---
inject: true
to: src/store/reducers.js
skip_if: <%= name %>
append: true
---
export { default as <%= name %> } from './<%= name %>/reducer';