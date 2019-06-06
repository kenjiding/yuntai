<template>
  <div
    :class="$style.goodsInfoStyle"
    @click="goToEditPage(data.goodsId)">

    <van-row>
      <van-col :span="4"><van-icon name="cart" /></van-col>
      <van-col :span="20">
        <div><span>{{ data.goodsName }}</span></div>
      </van-col>
    </van-row>
    <van-row :class="$style.infoBottom">
      <van-col :span="8">
        <p>售价</p>
        <p :class="$style.pText">￥{{ data.price }}</p>
      </van-col>
      <van-col :span="8">
        <p>兑换价格</p>
        <p>
          <span :class="$style.spanText">{{ data.points }}</span>
          <span>积分</span>
        </p>
      </van-col>
      <van-col :span="8">
        <p>回收价值</p>
        <p>
          <span :class="$style.spanText">{{ data.recoveryPoints }}</span>
          <span>积分</span>
        </p>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.goodsInfoStyle {
  box-shadow: 0 1px 4px rgba(0, 0, 0, .3);
  margin-bottom: 10px;

  &:first-of-type {
    margin-top: 7px;
  }

  .infoBottom {
    background-color: $color-bg-regular;

    .van-col--8 {
      text-align: left;

      .pText {
        font-size: $font-size-primary;
        color: $font-color-regular;

        @include ellipsis();
      }

      .spanText {
        display: inline-block;
        // width: 60px;
        max-width: 60px !important;
        min-width: 26px;
        font-size: $font-size-primary;
        padding-right: 3px;
        color: $font-color-regular;

        @include ellipsis();
      }

      p {
        padding: 0;
        font-size: 14px;
        color: $font-color-placeholder;

        &:nth-child(1) {
          margin-bottom: 5px;
        }
      }
    }
  }

  .van-row {
    padding: 8px 15px;

    &:first-of-type {
      background-color: $color-white;
    }

    .van-col--4 {
      width: 35px;
      text-align: left;

      .van-icon-cart {
        font-size: 22px;
        color: $color-primary;
      }
    }

    .van-col--20 {
      height: 25px;
      line-height: 28px;

      span {
        font-size: $font-size-regular;
        font-weight: normal;
        font-stretch: normal;
        color: $color-primary;

        @include ellipsis(1);
      }
    }
  }
}
</style>
