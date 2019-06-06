<template>
  <div>
    <van-pull-refresh
    v-model="loading"
    @refresh="onRefresh"
    :class="$style.main">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset=550
        @load="onLoad(false)">
          <div :class="$style['template-content']">
            <template v-for="order in orderList">
              <order-list-item :key="order.ID"
                :order="order"
                :order-type="orderType"
                @click.native="$emit('cell-click',order)" />
            </template>
          </div>
      </van-list>

      <div
        v-show="orderList.length <= 0 && !loading"
        :class="$style['empty-page']">
        <img src="@/assets/img/empty-rg-page.png" :class="$style['icon']"/>
        <div :class="$style['text']">暂无{{ this.orderTypeChs }}</div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import Order from '@/api/Order';
import {List, PullRefresh} from 'vant';
import refreshEvent from '@/events/order-list-refresh';
import OrderListItem from './OrderListItem.vue';

export default {
  name: 'orderList',

  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    OrderListItem,
  },

  props: {
    orderType: {
      type: String,
      default: 'OrderSale',
    },
    searchKey: {
      type: String,
    },
    tenantId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    loading: false,
    finished: false,
    orderList: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    searchType: 'OrderSale',
  }),

  computed: {
    orderTypeChs () {
      const typeChs = {
        'OrderExchange': '兑换单',
        'OrderSale': '售卖单',
        'OrderOnline': '自助设备订单',
      };
      return typeChs[this.orderType];
    },
  },

  created () {
    //this.onLoad(false);
    refreshEvent.on(() => {
      this.onRefresh();
    });
  },

  methods: {
    onLoad: function (refresh) {
      this.pageIndex++;
      Order.getOrderList({
        SearchKey: this.searchKey,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        TenantID: this.tenantId,
        SearchType: this.searchType,
      }).then(res => {
        if (refresh) {
          this.orderList.splice(0, this.orderList.length);
          this.pageIndex = 1;
        }
        res.Data.forEach(item => {
          this.orderList.push({
            ...item,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },
    onRefresh () {
      this.pageIndex = 0;
      this.totalCount = 0;
      this.finished = false;
      this.onLoad(true);
    },
    getLeaguerInfoString (name, phone) {
      if (name) {
        if (phone) {
          return name + '(' + phone + ')';
        } else {
          return name;
        }
      } else {
        return phone || '';
      }
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
    onChangeRefresh (type) {
      if (type) this.searchType = type;
      this.$nextTick(() => {
        this.onRefresh();
      });
    },
  },

  beforeDestroy () {
    refreshEvent.off();
  },

};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .template-content {
    width: 100%;
    overflow: scroll;
    margin-bottom: 20px;
  }

  .template-cell {
    margin: 0 20px 20px;
    border: solid 1px $color-info;
    padding: 6px 8px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    background-color: $color-white;
  }

  .p-content {
    color: $font-color-regular;
    font-size: $font-size-primary;
    line-height: 22px;
    margin: 6px 0 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tip {
    width: 50px;
    height: 20px;
    font-size: $font-size-mini;
    color: $color-white;
    background-color: $color-info;
    border-radius: $border-radius;
    text-align: center;
    line-height: 20px;

    &--complete {
      background-color: $color-success;
    }
  }

  .empty-page {
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 50px;

    .icon {
      width: 200px;
      height: 180px;
    }

    .text {
      font-size: 14px;
      color: $font-color-secondary;
      text-align: center;
      margin-top: 16px;
      line-height: 20px;
    }

    .point {
      width: 50px;
      height: 100px;
      margin-left: 80px;
      margin-top: 50px;
    }
  }
</style>
