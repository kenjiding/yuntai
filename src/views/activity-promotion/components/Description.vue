<template>
  <div :class="$style.content">
    <h3>红包规则说明</h3>
    <div :class="$style.main">
      <p>1.红包内的游戏币默认在当前商户主体下所有门店之间通用；</p>
      <p>2.红包总币数限额10W币；</p>
      <p>3.红包币支持设置有效期；</p>
      <p>4.红包支持设置有效期；</p>
    </div>
    <div @click="$emit('closePopup')" :class="$style.button">我知道了</div>
  </div>
</template>

<script>
export default {
  name: '',

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

.content {
  width: 270px;
  height: 260px;
  background: $color-white;
  border-radius: 5px;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;

  .main {
    position: absolute;
    top: 45px;
    bottom: 48px;
    overflow: auto;
    padding: 0 30px;
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
    font-size: 13px;
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

.button {
  width: 100% !important;
  background-color: #ed4041;
  color: $color-white !important;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
