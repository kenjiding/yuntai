<template>
  <div :class="$style.main">
    <van-collapse v-model="activeNames">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset=20
        @load="onLoadTenantDataList(false)">
        <van-collapse-item
            v-for="(item,index) in tenantDataList"
            :key="index"
            :name="index"
            :class="$style['collapse-item']">
          <div
            slot="title"
            :class="$style['collapse-item--titile']">
            <div :class="$style.tag"></div>
            <div :class="$style.title">{{item.TenantName}}</div>
            <div :class="$style.money">¥{{item.TotalIncome | number('0,0.00')}}</div>
          </div>
          <van-cell-group :class="$style.content">
            <van-cell title="机台总数">{{item.DeviceAmount | number}}台</van-cell>
            <template v-for="(payment,index) in item.IncomeData">
              <van-cell
                :key="index"
                :title="payment.paymentName">¥{{payment.Income | number('0,0.00')}}</van-cell>
            </template>
            <van-cell title="订单笔数">{{item.OrderAmount | number}}笔</van-cell>
            <van-cell title="顾客人数">{{item.CustomerAmount | number}}人</van-cell>
            <van-cell title="总投币数">{{item.TotalCoinIn | number}}币</van-cell>
            <van-cell title="礼品消耗">{{item.GiftConsumption | number}}个</van-cell>
            <van-cell title="礼品成本">{{item.GiftCost | number('0,0.00')}}元</van-cell>
          </van-cell-group>
        </van-collapse-item>
      </van-list>
    </van-collapse>
  </div>
</template>
<script>
import MarketingStatistic from '@/api/MarketingStatistic';
import {
  Toast,
  List,
  Popup,
  Collapse,
  CollapseItem,
} from 'vant';

export default {
  name: 'TenantDataList',

  components: {
    [List.name]: List,
    [Popup.name]: Popup,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },

  data: () => ({
    fristLoad: true,
    loading: false,
    finished: false,
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    activeNames: [],
    // startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    // endDate: new Date(new Date().setHours(0, 0, 0, 0)),
    tenantDataList: [],
  }),

  props: {
    tenantID: '',
    visible: {
      type: Boolean,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },

  methods: {
    onLoadTenantDataList: function (refresh, pStartDate, pEndDate) {
      if (!this.visible && !this.fristLoad) {
        this.loading = false;
        return;
      }
      if (refresh) {
        this.pageIndex = 0;
        this.totalCount = 0;
        this.tenantDataList = [];
        this.startDate = pStartDate;
        this.endDate = pEndDate;
      }
      //console.log('list:' + this.tenantID + '||' + this.startDate + '-' + this.endDate);
      this.fristLoad = false;
      this.pageIndex++;
      MarketingStatistic.getTenantAnalysisDetail({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.tenantDataList.push({
            ...item,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        //console.log(this.totalCount + '||' + res.Data.length + '||' + res.Total);
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
        Toast.clear();
      }, res => {
        this.loading = false;
        this.finished = true;
        Toast.clear();
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .main {
    // height: 490px;
    overflow-y: auto;
  }

  .collapse-item {
    i {
      margin: 0;
      width: 0;
      visibility: hidden;
    }

    .van-collapse-item__title {
      padding-top: 15px;
      height: 60px;
    }

    .van-collapse-item__content {
      background-color: $color-bg-primary;
      padding-top: 0;
      padding-right: 0;
      padding-bottom: 0;
      border-bottom: 10px solid $border-color;
    }

    .van-hairline--top-bottom::after {
      border-width: 0;
    }

    .van-cell {
      background-color: $color-bg-primary;
    }
  }

  .collapse-item--titile {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    flex-basis: auto;

    .tag {
      height: 26px;
      width: 4px;
      background-color: $color-golden;
      margin-right: 10px;
    }

    .title {
      font-size: $font-size-primary;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-grow: 1;
    }

    .money {
      font-size: $font-size-primary;
      color: $color-primary;
      text-align: right;
      line-height: 26px;
      white-space: nowrap;
      flex-grow: 1;
    }
  }

  .content {
    .van-cell {
      font-size: $font-size-special;
    }

    .van-cell__title {
      color: $font-color-regular;
    }

    .van-cell__value {
      color: $font-color-placeholder;
    }
  }

</style>
