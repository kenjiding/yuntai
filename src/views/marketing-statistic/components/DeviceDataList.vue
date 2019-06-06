<template>
  <div :class="$style.main">
    <van-collapse v-model="activeNames">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset=20
        @load="onLoadDeviceDataList(false)">
        <van-collapse-item
            v-for="(item,index) in DeviceDataList"
            :key="index"
            :name="index"
            :class="$style['collapse-item']">
          <div
            slot="title"
            :class="$style['collapse-item--titile']">
            <div :class="$style.tag"></div>
            <div :class="$style.title">{{item.DeviceName}}({{item.DeviceNumber}})</div>
            <div :class="$style.money">{{item.StartupAmount}}次</div>
          </div>
          <van-cell-group :class="$style.content">
            <van-cell title="投币数量">{{item.TotalCoinIn | number}}币</van-cell>
            <van-cell title="礼品消耗">{{item.GiftConsumption | number}}个</van-cell>
            <van-cell title="礼品成本">{{item.GiftCost | number}}元</van-cell>
            <van-cell title="所在门店">{{item.BelongToTenant}}</van-cell>
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
  name: 'DeviceDataList',

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
    DeviceDataList: [],
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
    onLoadDeviceDataList: function (refresh, pStartDate, pEndDate) {
      if (!this.visible && !this.fristLoad) {
        this.loading = false;
        return;
      }
      if (refresh) {
        this.pageIndex = 0;
        this.totalCount = 0;
        this.DeviceDataList = [];
        this.startDate = pStartDate;
        this.endDate = pEndDate;
      }
      this.fristLoad = false;
      this.pageIndex++;
      MarketingStatistic.getDeviceAnalysisDetail({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.DeviceDataList.push({
            ...item,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
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
    .van-collapse-item__content {
      background-color: $color-bg-primary;
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: 10px solid $border-color;
    }

    .van-collapse-item__title {
      padding-top: 15px;
      height: 60px;
    }

    .van-cell {
      background-color: $color-bg-primary;
    }

    i {
      margin: 0;
      width: 0;
      visibility: hidden;
    }

    .van-hairline--top-bottom::after {
      border-width: 0;
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
    //background-color: $color-bg-primary;

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
