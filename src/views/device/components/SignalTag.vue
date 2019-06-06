<template>
  <div :class="{
    [$style['signal-tag']]: true,
    [$style['signal-tag--online']]: state === 'Online'
    }">
    <span>{{ state === 'Online' ? '在线' : '离线' }}</span>
    <div :class="{[$style['signal-highlight']]: range >= 1}"></div>
    <div :class="{[$style['signal-highlight']]: range >= 2}"></div>
    <div :class="{[$style['signal-highlight']]: range >= 3}"></div>
  </div>
</template>

<script>
export default {
  name: 'signalTag',

  props: {
    state: {
      type: String,
      default: 'Offline',
    },
    value: {
      type: Number,
      default: -100,
    },
  },

  created () {
    console.log(this.range);
  },

  computed: {
    range () {
      if (this.value <= -81) return 1;
      if (this.value <= -51) return 2;
      if (this.value >= -50) return 3;
      return 0;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .signal-tag {
    width: 30px;
    height: 24px;
    // padding: 0 5px;
    // border: 1px solid $color-danger;
    // border-radius: $border-radius-small;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-end;

    > span {
      height: 24px;
      line-height: 24px;
      font-size: $font-size-special;
      color: $color-danger;
    }

    &--online {
      width: 54px;
      padding-right: 0;
      border-color: $color-success;
      position: relative;
      top: -4px;

      > span {
        height: 14px !important;
        line-height: 14px !important;
        color: $color-success;
        margin-right: 5px;
      }

      > div:nth-child(n+2) {
        width: 3px;
        margin-right: 3px;
        background-color: $font-color-placeholder;
        // border-radius: $border-radius-small;
      }

      > div:nth-child(2) {
        height: 6px;
      }

      > div:nth-child(3) {
        height: 11px;
      }

      > div:nth-child(4) {
        height: 16px;
      }
    }

    .signal-highlight {
      background-color: $color-success !important;
    }
  }
</style>
