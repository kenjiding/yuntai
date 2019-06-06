<template>
  <p :class="$style.tabs">
    <span
      v-for="(key, value) in tabObj"
      :key="value"
      :class="{[$style['active']]: active === value}"
      @click="tabClick(value)">{{ key }}</span>
  </p>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      active: 'expensesRecord',

      tabObj: {
        expensesRecord: '消费记录',
        exchangeRecord: '兑换记录',
        startRecord: '启动记录',
        lotteryRecord: '中奖记录',
      },
    };
  },
  created () {},

  methods: {
    tabClick (val) {
      console.log(val, 777);
      this.active = val;
      this.$emit('tab', val);
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.active {
  background-color: $color-primary !important;
  color: $color-white !important;
}

.tabs {
  display: flex;
  margin: 10px 0;

  span {
    font-size: $font-size-special;
    display: inline-block;
    text-align: center;
    color: $color-primary;
    line-height: 32px;
    flex: 1;
    height: 32px;
    background-color: $color-white;
    border: 1px solid $color-primary;

    &:nth-child(1) {
      border-right: none;
      border-top-left-radius: $border-radius-small;
      border-bottom-left-radius: $border-radius-small;
    }

    &:nth-child(2) {
      border-right: none;
    }

    &:nth-child(4) {
      border-left: none;
      border-top-right-radius: $border-radius-small;
      border-bottom-right-radius: $border-radius-small;
    }
  }
}

</style>
