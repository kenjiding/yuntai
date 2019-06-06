import dateFormat from './date-format';
import numberFormat from './number-format';

const filters = [
  dateFormat,
  numberFormat,
];

export default {
  install (Vue) {
    filters.forEach((filter) => Vue.use(filter));
  },
};
