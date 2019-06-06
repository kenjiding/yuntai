<template>
  <ych-page :class="$style.main">
    <div>
      <div :class="$style.order">
        <div :class="$style['order-div']">
          <p :class="$style['p-top']">订单金额</p>
          <p :class="$style['p-money']">
            <span
              v-if="!order.IsExchange"
              :class="$style['p-money_unit']">¥ </span>
            <span v-if="!order.IsExchange">{{order.PayMoney | number('0,0.00')}}</span>
            <span v-if="order.IsExchange">{{order.PayMoney | number}}</span>
            <span
              v-if="order.IsExchange"
              :class="$style['p-money_unit']">{{ order.PayType === '游戏币' ? '币' : '积分' }}</span>
          </p>
        </div>
        <div :class="$style['order-info']">
          <div>
            <p>订单编号：</p>
            <p>{{order.OrderNumber}}</p>
          </div>
          <div>
            <p>订单时间：</p>
            <p>{{order.LogTime || +new Date() | date}}</p>
          </div>
          <div>
            <p>支付方式：</p>
            <p>{{order.PayType}}{{ (order.PayType === '积分' || order.PayType === '游戏币') ? '支付' : '' }}</p>
          </div>
          <div>
            <p>支付单号：</p>
            <p>{{order.PayOrderNumber}}</p>
          </div>

          <div>
            <p>购买会员：</p>
            <p>{{order.LeaguerName}}</p>
          </div>
          <div>
            <p>操作员工：</p>
            <p>{{order.Operator}}</p>
          </div>
          <div>
            <p>售卖门店：</p>
            <p>{{order.TenantName}}</p>
          </div>
          <div>
            <p>订单状态：</p>
            <p>{{getStateChs(order.State)}}</p>
          </div>
        </div>
      </div>
      <div >
      <van-cell-group :class="$style.list">
        <template v-for="orderItem in orderItemList">
          <van-cell :key="orderItem.ID" :class="$style['list-cell']">
            <template slot="title">
              <p :class="$style['p-goodsname']">{{orderItem.GoodsName}}</p>
              <p :class="$style.p">
                <span v-if="!order.IsExchange">¥{{orderItem.PayMoney | number('0,0.00')}}</span>
                <span v-else>{{orderItem.PayMoney | number}}{{ order.PayType === '游戏币' ? '币' : '积分' }}</span>
              </p>
              <p
                v-if="orderItem.PayMoney != orderItem.Price"
                :class="$style['p-price']">
                <span v-if="!order.IsExchange">(¥{{orderItem.Price | number('0,0.00')}})</span>
                <span v-else>({{orderItem.Price | number}}{{ order.PayType === '游戏币' ? '币' : '积分' }})</span>
              </p>
            </template>

            <p :class="$style['p-amount']">x{{orderItem.Amount}}</p>
          </van-cell>
        </template>
      </van-cell-group>
      </div>
      <div
      :class="$style['white-space']"
      v-show="order.State=='Completed'||order.State=='Paying'"></div>
    </div>

    <van-button
      type="primary"
      :loading="returning"
      :class="$style['button-return']"
      v-show="order.State=='Completed'"
      @click="onClickReturn">订单退货
    </van-button>
    <ych-dialog
      theme="danger"
      v-model="showReturnDialog"
      title="提示"
      message="是否确认退款？"
      :show-cancel-button="true"
      :show-confirm-button="true"
      cancel-button-text="否"
      confirm-button-text="是"
      :before-close="returnAction">
    </ych-dialog>

    <van-button
      bottom-action
      :loading="returning"
      :class="$style['button-return']"
      v-show="order.State=='Paying'"
      @click="onClickCancel">取消订单
    </van-button>
    <ych-dialog
      theme="danger"
      v-model="showCancelDialog"
      title="提示"
      message="是否确认取消订单？"
      :show-cancel-button="true"
      :show-confirm-button="true"
      cancel-button-text="否"
      confirm-button-text="是"
      :before-close="cancelAction">
    </ych-dialog>
  </ych-page>
</template>

<script>
import Order from '@/api/Order';
import PageHeader from '@/components/PageHeader';
import {Toast} from 'vant';

export default {
  components: {
    PageHeader,
  },

  props: {
  },

  data: () => ({
    returning: false,
    showReturnDialog: false,
    showCancelDialog: false,
    orderItemList: [],
    order: {
      type: Array,
      default: () => [{
        OrderNumber: '',
        PayOrderNumber: '',
        PayMoney: 0.00,
        LogTime: null,
        LeaguerName: '',
        PayType: '',
        Operator: '',
        TenantName: '',
        State: '',
      }],
    },
  }),

  computed: {
    discount () {
      return this.order.Price - this.order.PayMoney;
    },
  },

  created () {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
    this.onLoad();
    this.hideLoadingToast();
  },

  methods: {
    onLoad: function () {
      // this.order = this.$route.query.order;
      Order.getOrderDetail({
        OrderID: this.$route.query.orderID,
      }).then(res => {
        this.order = res;
        res.OrderItemsData.forEach(item => {
          this.orderItemList.push({
            ID: item.ID,
            GoodsName: item.GoodsName,
            PayMoney: item.PayMoney,
            Price: item.Price,
            Amount: item.Amount,
          });
        });
      });
    },

    getStateChs (state) {
      switch (state) {
      case 'Completed':
        return '已完成';
      case 'Canceled':
        return '已取消';
      case 'Returned':
        return '已退货';
      case 'Returning':
        return '退货中';
      case 'Paying':
        return '支付中';
      case 'Unpaid':
        return '待支付';
      case 'WaitForRefund':
        return '待退款';
      case 'Payed':
        return '已支付';
      }
    },

    onClickReturn () {
      this.returning = true;
      this.showReturnDialog = true;
    },

    returnAction: function (action, done) {
      if (action === 'confirm') {
        Order.returnOrder({
          OrderID: this.order.ID,
        }).then(res => {
          if (res.Success) {
            this.order.State = 'Returned';
            Toast('退货成功');
          } else {
            Toast('退货失败');
          }
          this.returning = false;
          this.showReturnDialog = false;
          done();
        }, () => {
          this.returning = false;
          this.showReturnDialog = false;
          done();
        }, () => {
        });
      } else {
        this.returning = false;
        this.showReturnDialog = false;
        done();
      }
    },

    onClickCancel () {
      this.returning = true;
      this.showCancelDialog = true;
    },

    cancelAction: function (action, done) {
      if (action === 'confirm') {
        Order.cancelOrder({
          OrderID: this.order.ID,
        }).then(res => {
          if (res.Success) {
            this.order.State = 'Canceled';
            Toast('取消成功');
          } else {
            Toast('取消失败');
          }
        });
        this.returning = false;
        this.showCancelDialog = false;
        done();
      } else {
        this.returning = false;
        this.showCancelDialog = false;
        done();
      }
    },

    hideLoadingToast () {
      Toast.clear();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .main {
    background-color: $color-bg-primary;
  }

  .order {
    margin: 20px 20px 0;
    border-radius: $border-radius-small;
    background-color: $color-white;
  }

  .order-div {
    height: 60px;
    text-align: center;
    padding: 22px 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    $four-px: 4px;

    .p-top {
      line-height: 24px;
      color: $font-color-secondary;
      font-size: $font-size-special;
    }

    .p-money {
      color: $font-color-primary;
      font-size: $font-size-secondary + $four-px;

      &_unit {
        margin-left: 6px;
        font-size: $font-size-primary;
      }
    }
  }

  .list {
    margin: 10px 20px 20px;
    border-radius: $border-radius-small;
    padding: 0 5px;
    //background-color: $color-white;

    .van-cell {
      height: 70px;
      padding: 10px 15px;
    }

    .van-cell__title {
      flex: 2;
    }

    .p-goodsname {
      width: 100%;
      color: $font-color-regular;
      font-size: $font-size-special;
      line-height: 30px;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .p {
      color: $font-color-regular;
      font-size: $font-size-special;
      float: left;
    }

    .p-price {
      color: $font-color-placeholder;
      font-size: $font-size-special;
      float: left;
      margin-left: 5px;
      text-decoration: line-through;
    }

    .p-amount {
      line-height: 30px;
      color: $font-color-regular;
      font-size: $font-size-special;
      text-align: right;
      float: right;
    }
  }

  .order-info {
    padding: 0 10px;
    color: $font-color-regular;
    font-size: $font-size-special;
    line-height: 32px;

    > div {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      > p {
        @include ellipsis(1);

        &:nth-child(1) {
          width: 80px;
          color: $font-color-secondary;
        }

        &:nth-child(2) {
          color: $font-color-primary;
        }
      }
    }
  }

  .button-return {
    width: calc(100% - 30px);
    position: fixed;
    bottom: 0;
    margin: 5px 15px;
    border-radius: $border-radius-small;
  }

  .white-space {
    height: 40px;
  }
</style>
