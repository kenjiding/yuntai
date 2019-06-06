import 'reset-css';
// import 'vant/packages/vant-css/src/base.css';
// import 'vant/packages/vant-css/src/button.css';
// import 'vant/packages/vant-css/src/checkbox.css';
// import '@/styles/transition-min.css';
// import 'vueg/css/transition-min.css';
import '@/styles/common.scss';
import {
  Row,
  Col,
  Button,
  Icon,
  Cell,
  SwitchCell,
  CellGroup,
  Loading,
  NavBar,
  Stepper,
  Tag,
  Checkbox,
  CheckboxGroup,
  Field,
  RadioGroup,
  Radio,
  Switch,
  Actionsheet,
  DatetimePicker,
  Dialog,
  Picker,
  Toast,
  Tabs,
  Tab,
  Circle,
} from 'vant';

const components = [
  Row,
  Col,
  Button,
  Icon,
  Cell,
  SwitchCell,
  CellGroup,
  Loading,
  NavBar,
  Stepper,
  Tag,
  Checkbox,
  CheckboxGroup,
  Field,
  RadioGroup,
  Radio,
  Switch,
  Actionsheet,
  DatetimePicker,
  Dialog,
  Picker,
  Toast,
  Tabs,
  Tab,
  Circle,
];

export default {
  install (Vue) {
    components.forEach((component) => Vue.use(component));
  },
};
