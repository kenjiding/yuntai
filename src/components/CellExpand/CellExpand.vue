<template>
  <div :class="$style['cell-expand-container']">
    <div :class="$style.header" v-if="title">
      {{title}}
    </div>

    <div :class="$style.content" v-if="expandType === 'input'">
      <slot name="input">
        <input
          :class="$style.input"
          :value="value"
          @input="e => $emit('input', e.target.value)"
          placeholder="请输入"
          v-bind="attrs"/>
      </slot>

    </div>

    <div :class="$style.content" v-else-if="expandType === 'number'">
      <slot name="input">
        <input-number
          :class="$style.input"
          :value="value"
          @input="(val) => $emit('input', val)"
          placeholder="请输入"
          v-bind="$attrs"/>
      </slot>

    </div>

    <div :class="$style['select-wrap']" v-else-if="expandType === 'select'" @click="showActionsheet = true">
      {{value || '请选择'}}
    </div>

    <div :class="$style.expand" v-if="expand">
      <slot name="default">
        <div>{{expand}}</div>
      </slot>

    </div>

    <actionsheet
      v-if="expandType === 'select'"
      :class="$style['cell-actionsheet']"
      v-model="showActionsheet"
      :title="selectTitle"
      v-bind="$attrs"
      v-on="$listeners">
      <slot name="actions"/>
    </actionsheet>
  </div>
</template>

<script>
import {
  Actionsheet,
} from 'vant';
import InputNumber from '../InputNumber';

export default {
  components: {
    Actionsheet,
    InputNumber,
  },

  props: {
    title: String,
    expand: String,
    value: String | Number,
    selectTitle: String,

    expandType: {
      validator (value) {
        return [
          'input',
          'number',
          'select',
        ].indexOf(value) !== -1;
      },
      default: 'input',
    },
  },

  data: () => ({
    showActionsheet: false,
  }),

  computed: {
    attrs () {
      return {
        ...this.$attrs,
        maxLength: 30,
      };
    },
  },

  methods: {
    close () {
      this.showActionsheet = false;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .cell-expand-container {
    background-color: $color-bg-primary;
    border-radius: $border-radius-small;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
  }

  .header {
    flex: 1;
    color: $font-color-regular;
  }

  .content {
    flex: 1;

    .input {
      width: 100%;
      background-color: $color-bg-primary;
      border: none;
      outline: none;
      text-align: right;
      color: $font-color-placeholder;

      &::-webkit-input-placeholder {
        color: $font-color-secondary;
      }
    }
  }

  .expand {
    margin-left: 10px;
  }

  .select-wrap {
    flex: 1;
    color: $font-color-placeholder;
    text-align: right;
  }
</style>
