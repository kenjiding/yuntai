<template>
  <van-cell-group :class="$style.grounp">
    <van-cell
      v-if="recordType === 'expensesRecord' || recordType === 'exchangeRecord'"
      :title="recordInfo.OrderNumber"
      :value="orderNum"
      :class="$style.title" />
    <van-cell
      v-else-if="recordType === 'startRecord'"
      :title="recordInfo.Number"
      :value=" '-' + recordInfo.Price + '币'"
      :class="$style.title" />
    <van-cell
      v-else-if="recordType === 'lotteryRecord'"
      :title="recordInfo.ProductName"
      :value="recordInfo.Count"
      :class="$style.title"/>

    <van-cell
      v-if="recordType === 'expensesRecord'"
      title="支付方式"
      :class="$style['no-line']"
      :value="changePaymentName(recordInfo.PaymentMethod)"/>
    <van-cell
      title="支付号"
      v-if="recordType === 'expensesRecord'"
      :value="recordInfo.PaymentNumber"
      :class="$style['record-item']"/>

    <van-cell
      v-else-if="recordType === 'lotteryRecord'"
      title="设备"
      :value="`${recordInfo.DeviceName} (${recordInfo.Number})`"/>

    <van-cell title="门店" :value="recordInfo.TenantName"/>
    <van-cell title="时间" :value="createTime | date()"/>

    <van-cell
      v-if="ComputeProductName"
      title="商品"
      :value="recordInfo.GoodsInfo"/>

    <van-cell
      v-if="ComputeOrderShow"
      title="状态"
      :value="ComputeOrderStatus()"/>

  </van-cell-group>
</template>

<script>
export default {
  name: '',

  props: {
    recordInfo: {
      type: Object,
      default: () => ({}),
    },
    recordType: {
      type: String,
      default: '',
    },
  },

  computed: {
    orderNum () {
      return this.recordType === 'expensesRecord'
        ? ('￥' + this.recordInfo.Price)
        : ('-' + this.recordInfo.Price + (this.recordInfo.ExchangeType === 'Integer' ? '积分' : '币'));
    },
    createTime () {
      if (this.recordType === 'startRecord') {
        return this.recordInfo.OrderTime;
      } else if (this.recordType === 'lotteryRecord') {
        return this.recordInfo.WinDate;
      } else {
        return this.recordInfo.OrderTime;
      }
    },

    ComputeOrderShow () {
      return this.recordType === 'exchangeRecord' ||
      this.recordType === 'expensesRecord' ||
      this.recordType === 'startRecord';
    },
    ComputeProductName () {
      return this.recordType === 'exchangeRecord' ||
      this.recordType === 'expensesRecord';
    },
  },

  data () {
    return {
      tabType: {
        expensesRecord: this.getExpensesRecordLog,
        exchangeRecord: this.getExchangeRecordLog,
        startRecord: this.getStartRecordLog,
        lotteryRecord: this.getLotteryRecordLog,
      },
    };
  },
  created () {},

  methods: {
    changePaymentName (val) {
      let obj = {
        Wechat: '微信支付',
        Alipay: '支付宝支付',
        Card: '银行卡支付',
        Cash: '现金支付',
        WeChatCodePay: '微信付款码',
        AlipayCodePay: '支付宝付款码',
        Integral: '积分',
      };
      return obj[val];
    },
    ComputeOrderStatus () {
      let expensiveStatus = {
        Unpaid: '未支付',
        Paying: '支付中',
        Completed: '已完成',
        Canceled: '已取消',
        Returned: '已退货',
        Returning: '退货中',
      };

      let startStatus = {
        Completed: '已完成',
        Returning: '正在退币',
        Returned: '已退币',
      };

      let type = {
        expensesRecord: () => {
          return expensiveStatus[this.recordInfo.State];
        },
        exchangeRecord: () => {
          return expensiveStatus[this.recordInfo.State];
        },
        startRecord: () => {
          return startStatus[this.recordInfo.State];
        },
        lotteryRecord: () => {
          return '';
        },
      };

      return type[this.recordType] && type[this.recordType]();
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.title {
  color: $font-color-primary !important;
  font-size: $font-size-primary !important;
  border-bottom: 1px solid $border-color;
  padding: 10px 15px !important;

  .van-cell__title {
    flex: 7;
  }

  .van-cell__value {
    flex: 3;
    /* stylelint-disable-next-line */
    color: #fba145 !important;
    text-align: right;
  }
}

.grounp {
  border-radius: $border-radius-small;
  margin-bottom: 10px;
  padding-bottom: 5px;

  .van-cell {
    color: $font-color-secondary;
    font-size: $font-size-special;
    padding: 2px 15px;

    &:not(:last-child)::after {
      content: none;
    }

    .van-cell__value {
      color: $font-color-primary;

      @include ellipsis(1);
    }
  }
}
</style>
