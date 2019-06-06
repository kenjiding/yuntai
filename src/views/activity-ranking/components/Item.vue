<template>
  <div :class="$style.wrap">
    <div :class="$style['wrap_left']">
      <img v-if="leftImg" :src="leftImg" :class="$style.img">
      <slot name="left" v-else></slot>
    </div>
    <div :class="$style['wrap_middle']">
      <slot name="middle">
        <p>
          <span :class="$style['middle-title']">{{title}}</span>
          <van-icon
            :name="middleIcon"
            :class="$style['middle-icon']"
            :style="{color: iconColor}" />
          <img
            v-if="levelIcon === 1"
            :class="$style['middle-levelicon']"
            src="../../../assets/img/V1.png"/>
          <img
            v-else-if ="levelIcon === 2"
            :class="$style['middle-levelicon']"
            src="../../../assets/img/V2.png"/>
          <img
            v-else-if ="levelIcon === 3"
            :class="$style['middle-levelicon']"
            src="../../../assets/img/V3.png"/>
          <img
            v-else-if ="levelIcon === 4"
            :class="$style['middle-levelicon']"
            src="../../../assets/img/V4.png"/>
          <img
            v-else-if ="levelIcon === 5"
            :class="$style['middle-levelicon']"
            src="../../../assets/img/V5.png"/>
        </p>
        <p :class="$style['middle-info']">{{info}}</p>
      </slot>
    </div>
    <div :class="$style['wrap_right']">
      <span v-if="rightText" :class="$style['right-text']" :style="{color: rightTextColor}">{{rightText}}</span>
      <van-icon v-if="isLink" name="arrow" :class="$style['right-icon']"/>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    title: String,
    rightTextColor: String,
    isLink: Boolean,
    info: String,
    middleIcon: String,
    levelIcon: Number,
    iconColor: String,
    rightText: {
      type: String,
      default: '',
    },
    leftImg: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
    };
  },
  created () {},

  methods: {

  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.middle-levelicon {
  width: 45px;
  height: 17px;
  vertical-align: sub;
}

.middle-icon {
  font-size: $font-size-regular;
  font-weight: 600;
  vertical-align: initial;
  margin: 0 3px;
}

.middle-title {
  color: $color-black;
  font-size: $font-size-primary;
  max-width: 110px !important;

  @include ellipsis(1);
}

.right-text {
  width: 70px;
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;

  @include ellipsis(1);
}

.img {
  width: 50px;
  height: 50px;
  border-radius: $border-radius-circle;
}

.wrap {
  width: 100%;
  height: 70px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  background-color: $color-white;
  border-bottom: 1px solid $border-color;

  div {
    height: 100%;
  }

  &_left {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &_middle {
    flex: 6;

    p {
      padding: 5px;
      color: $font-color-secondary;
      font-size: $font-size-special;

      &:nth-child(2) {
        padding: 0 5px !important;
      }
    }
  }

  &_right {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-primary;
    color: $font-color-secondary;
  }
}
</style>
