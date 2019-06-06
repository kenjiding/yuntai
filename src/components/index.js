import Page from './global/page';
import Dialog from './global/dialog';
import Field from './global/field';
import Uploader from './global/uploader';

const components = [
  Page,
  Dialog,
  Field,
  Uploader,
];

export default {
  install (Vue) {
    components.forEach((component) => {
      Vue.use(component);
    });
  },
};
