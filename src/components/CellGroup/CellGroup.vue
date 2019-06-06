<template>
  <div :class="[$style['cell-group-container'], noPadding && $style['no-padding']]">
    <div :class="$style.header" v-if="header">{{header}}</div>
    <div :class="$style.content">
      <div :class="$style['cell-wrap']">
        <slot></slot>
      </div>
      <div :class="$style.expand" v-if="expand">
        <van-icon :name="expand" color="#077AFF" size="18px" @click="$emit('onExpandClick')"/>
      </div>
    </div>
    <div :class="$style.footer" v-if="footer">{{footer}}</div>
  </div>
</template>

<script>
export default {
  name: 'CellGroup',

  props: {
    header: String,
    footer: String,
    noPadding: {
      type: Boolean,
      default: false,
    },
    expand: String,
  },

  data: () => ({

  }),

  methods: {

  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .cell-group-container {
    padding: 10px 16px;

    &.no-padding {
      padding: 10px 0;
    }
  }

  .header {
    padding: 0 16px 10px;
    font-size: $font-size-mini;
    color: $font-color-placeholder;
  }

  .footer {
    padding: 10px 16px 0;
    font-size: $font-size-mini;
    color: $font-color-placeholder;
  }

  .content {
    display: flex;
    flex-direction: row;

    .cell-wrap {
      flex: 1;
    }

    .expand {
      width: 30px;
      background-color: $color-white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .content > .cell-wrap > div:nth-child(n + 2) {
    border-top: 1px solid $border-color;
  }
</style>
