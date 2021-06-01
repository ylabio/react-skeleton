---
to: src/api/<%= name %>.js
---
import api from '@src/apo';

export default {
  load: () => {
    return api.get(`/api/v1/<%= name %>`);
  },
};
