<template>
  <input
    type="number"
    :class="$style.input"
    class="van-field__control"
    v-model="localValue"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-on="listeners"
  />
</template>

<script>
import account from 'accounting-js';

export default {
  inheritAttrs: false,

  props: {
    value: {
      type: Number | String,
      required: true,
    },

    placeholder: {
      type: String,
      default: '',
    },

    valueType: {
      type: String,
      default: 'number',
      validator (val) {
        return [
          'number',
          'discount',
          'precentage',
        ].includes(val);
      },
    },

    max: {
      type: Number,
      default: 100000000,
    },

    min: {
      type: Number,
      default: 0,
    },

    precision: {
      type: Number,
      default: 2,
    },

    outputType: {
      type: String,
      default: 'Number',
    },
  },

  data () {
    return {
      localValue: null,
    };
  },

  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: this.onInputHandler,
        blur: this.onBlurHandler,
      };
    },

    valueNumber () {
      return this.formatter(this.value);
    },

    outputNumber () {
      return account.formatNumber(this.localValue, this.precision, '');
    },
  },

  watch: {
    valueNumber: {
      immediate: true,
      handler: function (newVal) {
        this.localValue = newVal;
      },
    },
  },

  methods: {
    onInputHandler () {
      this.process(this.localValue);
    },

    onBlurHandler (e) {
      this.$emit('blur', e);
      this.localValue = this.formatter(this.value);
    },

    process (val) {
      val = account.unformat(val);
      if (val >= this.max) this.update(this.max);
      if (val <= this.min) this.update(this.min);
      if (val > this.min && val < this.max) this.update(val);
    },

    update (val) {
      const fixedValue = Number(val).toFixed(this.precision);
      const outputValue = this.parser(fixedValue);
      this.$emit('input', outputValue);
    },

    formatter (val) {
      if (val === null || val === '' || val === undefined) return null;

      let value = Number(val);
      const valueTypeMap = {
        'number': () => value,
        'discount': () => (value * 10),
        'precentage': () => (value * 100),
      };

      const fn = valueTypeMap[this.valueType];
      if (fn) {
        value = fn();
      }
      return parseFloat(this.toFixed(value, 'format'));
    },

    parser (val) {
      let value = Number(val);

      const valueTypeMap = {
        'number': () => value,
        'discount': () => (value / 10),
        'precentage': () => (value / 100),
      };

      const fn = valueTypeMap[this.valueType];
      if (fn) {
        value = fn();
      }

      return parseFloat(this.toFixed(value, 'parser')) || null;
    },

    toFixed (val, type = 'parser') {
      const valueTypeMap = {
        'number': [this.precision, this.precision],
        'discount': [1, 2],
        'precentage': [2, 4],
      };
      const num = valueTypeMap[this.valueType || 'number'];
      let precision = type === 'parser' ? num[1] : num[0];
      return account.toFixed(val, precision);
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .input {
    text-align: right;
    background-color: transparent;
    border: none;

    &.van-field__control:disabled {
      color: $font-color-secondary !important;
    }
  }
</style>
