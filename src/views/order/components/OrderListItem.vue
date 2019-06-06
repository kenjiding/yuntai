<template>
  <div :class="$style['order-list-item']">
    <div>
      <div :class="$style['item-number']">订单：{{order.OrderNumber}}</div>
      <div :class="$style['item-state']">{{ orderState }}</div>
    </div>
    <div>
      <div style="padding-top: 10px;">商品：</div>
      <div :class="$style['item-goods-list']">
        <template v-for="item in order.OrderItems">
          <div :key="item.ID">
            <div>{{ item.GoodsName }}</div>
            <div>x{{ item.Amount }}</div>
          </div>
        </template>
      </div>
    </div>
    <div>
      <div :class="$style['item-info']">
        <p v-if="orderType === 'OrderOnline'">门店：{{ order.TenantName }}</p>
        <p v-else>会员：{{ order.LeaguerName }}{{ order.LeaguerTelephone?`(${order.LeaguerTelephone})`:'' }}</p>
        <p>时间：{{ order.LogTime | date }}</p>
      </div>
      <div
        v-if="cashType"
        :class="$style['item-price']">
        <span style="font-size: 14px;">￥</span>{{ order.PayMoney | number('0,0.00') }}
      </div>
      <div
        v-else
        :class="$style['item-price']">
        {{ order.PayMoney | number('0') }} <span style="font-size: 14px;">{{ payTypeChs }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderListItem',

  props: {
    order: {
      type: Object,
      default: () => {},
    },
    orderType: {
      type: String,
      default: 'OrderSale',
    },
  },

  computed: {
    orderState () {
      const stateChs = {
        'Completed': '已完成',
        'Canceled': '已取消',
        'Returned': '已退货',
        'Returning': '退货中',
        'Paying': '支付中',
        'Unpaid': '待支付',
        'WaitForRefund': '待退款',
        'Payed': '已支付',
      };
      return stateChs[this.order.State];
    },
    payTypeChs () {
      const payChs = {
        Alipay: '支付宝支付',
        AlipayCodePay: '支付宝付款码',
        Card: '银行卡支付',
        Cash: '现金支付',
        Currency: '币',
        Integral: '积分',
        Unknown: '未知',
        WeChat: '微信支付',
        WeChatCodePay: '微信付款码',
      };
      return payChs[this.order.PayType];
    },
    cashType () {
      return ['Currency', 'Integral'].indexOf(this.order.PayType) < 0;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .order-list-item {
    margin: 10px 15px 0;
    padding: 0 10px;
    background-color: $color-white;
    border-radius: $border-radius-small;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;

    > div {
      min-height: 24px;
      padding: 10px 0;
      font-size: $font-size-special;
      color: $font-color-primary;
      line-height: 24px;
      border-top: 1px solid $border-color;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }

    > div:first-child {
      border-top: 0;
    }

    > div:nth-child(2) {
      padding: 0;
    }

    .item {
      &-number {
        overflow: hidden;

        @include ellipsis(1);
      }

      &-state {
        width: 120px;
        text-align: right;
      }

      &-info {
        overflow: hidden;
        height: 48px;
        max-width: 60%;
        color: $font-color-secondary;
        line-height: 22px;

        > p {
          width: 100%;

          @include ellipsis(1);
        }
      }

      &-price {
        flex: 2;
        font-size: $font-size-secondary;
        color: $color-warning;
        text-align: right;
        line-height: 48px;
      }

      &-goods-list {
        flex: 2;

        > div {
          height: 24px;
          padding: 10px 0;
          border-top: 1px solid $border-color;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
        }

        > div:first-child {
          border-top: 0;
        }
      }
    }
  }
</style>
