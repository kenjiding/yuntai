<template>
  <div :class="$style['container']">
    <div :class="$style['title']">{{ title }}</div>
    <div :class="$style['amount-line']">
      <div :class="$style['amount']">{{ leftAmount | number(amountFmt) }}{{ amountUnit }}</div>
      <div :class="$style['amount']">{{ rightAmount | number(amountFmt) }}{{ amountUnit }}</div>
    </div>
    <div :class="$style['progress-bar']">
      <div :class="$style['old-progress']" v-if="rightAmount > 0"></div>
      <div :class="$style['new-progress']" :style="newStyle" v-if="leftAmount > 0"></div>
    </div>
    <div :class="$style['percent-line']">
      <div :class="$style['percent']">{{ leftPercent }}</div>
      <div :class="$style['percent']">{{ rightPercent }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    leftAmount: {
      type: Number,
      default: 0,
    },

    rightAmount: {
      type: Number,
      default: 0,
    },

    amountFmt: {
      type: String,
      default: '0,0',
    },

    amountUnit: {
      type: String,
      default: null,
    },

    leftPercent: {
      type: String,
      default: '0%',
    },

    rightPercent: {
      type: String,
      default: '0%',
    },
  },

  computed: {
    newStyle () {
      let newPrecent = this.leftAmount / (this.leftAmount + this.rightAmount) * 100 + '%';
      return {
        width: newPrecent,
      };
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    margin-top: 15px;
  }

  .title {
    text-align: center;
    font-size: 16px;
    color: $font-color-primary;
  }

  .amount-line {
    font-size: 12px;
    color: $font-color-secondary;
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .percent-line {
    font-size: 12px;
    color: $font-color-secondary;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  .progress-bar {
    height: 10px;
    background-color: #d8d8d8; // stylelint-disable
    border-radius: 5px;
    margin-top: 8px;
    position: relative;

    .old-progress {
      width: 100%;
      height: 10px;
      background-color: #0c95ff;
      border-radius: 5px;
    }

    .new-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background-color: #ffa142;
    }
  }
</style>
