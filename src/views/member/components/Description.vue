<template>
<van-popup
  v-model="show"
  :close-on-click-overlay="false"
  :class="$style.popup">
  <div :class="$style.content">
    <h3>{{title}}</h3>
    <div :class="$style.main">
      <slot></slot>
    </div>
    <div
      :class="$style.button"
      @click="$emit('update:show', false)">{{determine}}</div>
  </div>
</van-popup>
</template>

<script>
import { Popup } from 'vant';

export default {
  name: '',

  props: {
    show: Boolean,
    title: String,
    determine: String,
  },

  components: {
    [Popup.name]: Popup,
  },

  data () {
    return {
    };
  },

  methods: {},
  created () {},
};
</script>

<style lang='scss' module>
// stylelint-disable
@import "@/styles/them.scss";

.popup {
  border-radius: $border-radius-small;
}

.content {
  width: 270px;
  height: 330px;
  background: $color-white;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;

  .main {
    position: absolute;
    top: 45px;
    bottom: 48px;
    overflow: auto;
    padding-top: 0;
    -webkit-overflow-scrolling: touch;
  }

  h3 {
    text-align: center;
    font-size: 20px;
    padding: 5px 0;
  }

  p {
    margin: 10px 0;
    line-height: 20px;
    color: #626262;
    text-align: left;
  }

  span {
    color: #626262;
    display: block;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }

  div {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #e5e5e5;
    color: $color-primary;
  }
}
</style>
