---
to: src/api/<%= name %>.js
---
import api from '@api';

export default {
  load: () => {
    return api.get(`/api/v1/<%= name %>`);
  },
};
