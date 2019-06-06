<template>
  <div :class="$style['consumption-circle']">
    <div :class="$style['consumption-circle__base']">
      <div>
        <div :class="$style['consumption-circle__content']">
          <p>福袋码消耗</p>
          <p>{{ value }}/{{ total }}</p>
        </div>

        <div
          v-if="angleOneVisible"
          :class="[$style['consumption-circle__innter']]"
          :style="`transform: rotate(${angleOne}deg);`">
        </div>
        <div
          v-if="angleTwoVisible"
          :class="[$style['consumption-circle__innter']]"
          :style="`transform: rotate(${angleTwo}deg);`">
        </div>
        <div
          v-if="angleThreeVisible"
          :class="[$style['consumption-circle__innter']]"
          :style="`transform: rotate(${angleThree}deg);`">
        </div>
      </div>
    </div>
    <div :class="$style['consumption-circle__bottom']" />
  </div>
</template>

<script>
export default {
  name: 'consumptionCircle',

  props: {
    value: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },

  data () {
    return {
      angleOne: -106,
      angleTwo: -16,
      angleThree: 74,
    };
  },

  computed: {
    angleOneVisible () {
      return this.angleOne > -106;
    },
    angleTwoVisible () {
      return this.angleTwo > -16;
    },
    angleThreeVisible () {
      return this.angleThree > 74;
    },
  },

  methods: {
    calculate () {
      const angleTotal = this.value / this.total * 212;
      this.angleOne += angleTotal > 90 ? 90 : angleTotal;
      this.angleTwo += angleTotal > 180 ? 90 : angleTotal - 90;
      this.angleThree += angleTotal > 180 ? angleTotal - 180 : 0;
      this.angleThree = angleTotal > 212 ? 106 : this.angleThree;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .consumption-circle {
    height: 132px;
    padding-bottom: 6px;
    position: relative;
    overflow: hidden;
    z-index: 5;

    &__base {
      height: 124px;
      padding-top: 28px;
      background-color: $color-primary;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      overflow: hidden;

      > div:first-child {
        width: 124px;
        height: 124px;
        background-color: rgba(255, 255, 255, .5);
        border-radius: $border-radius-circle;
        overflow: hidden;
        position: relative;
      }
    }

    &__innter {
      position: absolute;
      width: 124px;
      height: 124px;
      // transform: rotate(0deg);
      clip: rect(0, 62px, 62px, 0);
      border-radius: $border-radius-circle;
      background-color: $color-white;
    }

    &__content {
      width: 116px;
      height: 116px;
      border-radius: $border-radius-circle;
      position: absolute;
      top: 4px;
      left: 5px;
      background-color: $color-primary;
      z-index: 10;
      text-align: center;
      line-height: 24px;
      color: $color-white;
      font-size: $font-size-regular;

      > p:first-child {
        margin-top: 22px;
        font-size: $font-size-special;
      }
    }

    &__bottom {
      height: 32px;
      width: 100%;
      background-color: $color-primary;
      position: absolute;
      bottom: 0;
    }
  }
</style>
