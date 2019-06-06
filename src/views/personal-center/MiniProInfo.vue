<template>
  <ych-page>
    <div :class="$style['container']" v-if="$route.query.name">
      <img :src="$route.query.qr" :class="$style['code']"/>
      <div :class="$style['code-tip']">长按保存到手机</div>

      <div :class="$style['divider-container']">
        <div :class="$style['left']"></div>
        <div :class="$style['divider']"></div>
        <div :class="$style['right']"></div>
      </div>

      <div :class="$style['tip']">
        请将此小程序码下载并打印出来<br>
        贴在游戏机上，用于顾客扫码启动
      </div>
    </div>

    <div :class="$style['tip-container']" v-else>
      您当前品牌还未绑定小程序<br>
      请联系客服进行绑定
    </div>
  </ych-page>
</template>

<script>
export default {

};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.tip-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;  // stylelint-disable
  font-size: 15px;
  text-align: center;
  line-height: 25px;
}

.container {
  width: 290px;
  padding: 30px 0;
  margin: 30px auto;
  background-color: $color-white;
  box-sizing: border-box;
  box-shadow: rgba(152, 152, 152, 0.5) 0px 1px 5px 1px;
  border-radius: $border-radius-small;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .code {
    width: 200px;
    height: 200px;
  }

  .code-tip {
    margin-top: 20px;
    color: $font-color-primary;
    font-size: 16px;
  }

  .divider-container {
    margin-top: 15px;
    width: 290px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .left {
      width: 30px;
      height: 30px;
      background-color: #F6F6F6;
      border-radius: 15px;
      margin-left: -15px;
    }

    .right {
      width: 30px;
      height: 30px;
      background-color: #F6F6F6;
      border-radius: 15px;
      margin-right: -15px;
    }

    .divider {
      flex: 1;
      height: 1px;
      background-color: #F6F6F6;
    }
  }

  .tip {
    margin-top: 15px;
    width: 290px;
    padding: 0 30px;
    color: #999999;
    font-size: 14px;
    box-sizing: border-box;
    text-align: center;
    line-height: 20px;
  }
}
</style>
