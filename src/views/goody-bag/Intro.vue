<template>
  <ych-page>
    <div :class="$style['section']">
      <div :class="$style['section-title']">1. 什么是福袋码？</div>
      <div :class="$style['section-content']">
        1）福袋码是奖品二维码，二维码可以绑定实物奖品和微信现金红包。对于实物奖品可以配置邮寄或到店兑换；微信现金红包直接派发到用户微信账户里。<br>
        2）福袋码可以通过福袋码活动功能生成。
      </div>
    </div>

    <div :class="$style['section']">
      <div :class="$style['section-title']">2. 福袋码常用的业务场景</div>
      <div :class="$style['section-content']">
        1）将福袋码打印成二维码卡片放到礼品盒里，再将盒子置入福袋机，口红机等机台里。<br>
        2）消费者在机台消费获得礼品盒，微信扫描里面的二维码获得对应的奖品。
      </div>
    </div>

    <div :class="$style['section']">
      <div :class="$style['section-title']">3. 商户怎么使用福袋码活动功能？</div>
      <div :class="$style['section-content']">
        <img src="@/assets/img/intro.png">
      </div>
    </div>

    <div :class="$style['section']">
      <div :class="$style['section-title']">4. 活动设置错了怎么取消？</div>
      <div :class="$style['section-content']">
        1）如果活动未开始，可以进入活动详情里，点击“取消活动”功能，即可将该活动取消。<br>
        2）如果活动已经开始，实物活动进入活动详情，点击“结束活动”。<br>
        3）如果是微信红包活动，由于微信红包正在派发，无法通过取消活动功能来取消活动，但可以通过修改活动结束时间，来尽快结束活动。
      </div>
    </div>

    <div :class="$style['section']">
      <div :class="$style['section-title']">5. 怎么给用户寄奖品？</div>
      <div :class="$style['section-content']">
        通过“中奖订单”功能，查看待发货的订单信息。商户发货后，录入对应的物流信息后，用户即可知道奖品的发货物流信息。
      </div>
    </div>

    <div :class="$style['section']">
      <div :class="$style['section-title']">6. 还没消耗完的微信红包活动金额怎么办？</div>
      <div :class="$style['section-content']">
        系统会在活动结束后的72小时内，将剩余的红包金额和对应的微信支付服务费原路返回到商户的账户里。
      </div>
    </div>
  </ych-page>
</template>

<script>
export default {

};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .section {
    padding: 16px;

    &-title {
      font-size: 16px;
      color: $color-primary;
    }

    &-content {
      margin-top: 10px;
      font-size: 13px;
      color: $font-color-primary;
      line-height: 18px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }
</style>
