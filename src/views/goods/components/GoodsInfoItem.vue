<template>
    <div
      :class="$style['goods']">
      <img :src="goodsInfo.ImgKey" :class="$style['goods-img']"/>
      <div :class="$style['goods-info']">
        <p>
          <span :class="$style['goods-name']">{{goodsInfo.goodsName}}</span>
          <span :class="$style['goods-price']">￥{{goodsInfo.price}}</span>
        </p>
        <p :style="{overflow: 'hidden'}" v-if="goodsInfo.GoodsType === 'Goods'" :class="$style['pText']">
          <span :class="$style['goods-exchange']">{{exchangeTitle(goodsInfo)}}</span>
          <span
            :class="$style['goods-exchange']"
            :style="{textAlign: exchangeTitle(goodsInfo) ? 'right' : 'left'}">{{recoveryTitle(goodsInfo)}}</span>
        </p>
        <p :style="{overflow: 'hidden'}" v-else-if="goodsInfo.GoodsType === 'TicketGoods'">
          <span :class="$style['goods-ticket']">
            包含项目：{{goodsInfo.GoodsDetail.reduce((total, item, index) => total + (index === 0 ? '' : ',') +item.Detail, '')}}
          </span>
          <!-- <span
            v-for="item in goodsInfo.GoodsDetail"
            :key="item.Detail"
            :class="$style['goods-ticket']">{{item.Detail}},</span> -->
        </p>
      </div>
    </div>
</template>

<script>
export default {
  name: '',

  props: {
    goodsInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
    };
  },
  created () {},

  methods: {
    recoveryTitle (info) {
      if (info.recoveryPoints) {
        return `回收价: ${info.recoveryPoints}积分`;
      } else {
        return '';
      }
    },
    exchangeTitle (info) {
      if (info.CurrencyPoins) {
        if (info.points) {
          return `兑换价: ${info.CurrencyPoins}币/${info.points}积分`;
        } else {
          return `兑换价: ${info.CurrencyPoins}币`;
        }
      } else {
        if (info.points) {
          return `兑换价: ${info.points}积分`;
        } else {
          return '';
        }
      }
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.pText {
  height: 15px;
}

.goods {
  width: 100%;
  box-sizing: border-box;
  background-color: $color-white;
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid $border-color;

  &-img {
    width: 50px;
    height: 50px;
    border-radius: $border-radius;
    float: left;
    margin: 0 10px;
  }

  &-ticket {
    font-size: $font-size-mini;
    overflow: hidden;
    display: inline-block;

    @include ellipsis(1);
  }

  &-exchange {
    width: 100%;
    font-size: $font-size-mini;
    overflow: hidden;
    display: inline-block;

    &:nth-child(1) {
      float: left;
      width: 65%;
      text-align: left;

      @include ellipsis(1);
    }

    &:nth-child(2) {
      float: left;
      width: 35%;
      text-align: right;

      @include ellipsis(1);
    }
  }

  &-info {
    overflow: auto;

    p {
      padding: 5px 0;
      color: $font-color-secondary;
    }
  }

  &-name {
    font-size: $font-size-primary;
    color: $color-black;
  }

  &-price {
    font-size: $font-size-primary;
    color: $color-warning;
    float: right;
  }
}

</style>
