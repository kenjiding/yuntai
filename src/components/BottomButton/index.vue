<template>
  <div :class="$style.button">
    <div v-if="leftText" :style="{marginRight: '10px'}">
      <van-button
        :class="$style.left"
        size="small"
        @click="$emit('leftClick')">{{leftText}}</van-button>
    </div>

    <div v-if="rightText">
      <van-button
        size="small"
        type="primary"
        @click="$emit('rightClick')">{{rightText}}</van-button>
    </div>

    <van-button
      v-if="text"
      size="small"
      type="primary"
      @click="$emit('confirm')">{{text}}</van-button>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    text: {
      type: String,
      default: '',
    },
    leftText: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
    };
  },
  created () {},

  methods: {},
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.button {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 340px;
  height: 45px;
  margin-left: -170px;
  border-radius: $border-radius;
  display: flex;

  .van-button {
    width: 100%;
    height: 40px;
    font-size: $font-size-special;
  }

  div {
    flex: 1;
  }
}

.left {
  margin-right: 10px;
  border: 1px solid $color-primary;
}

</style>
