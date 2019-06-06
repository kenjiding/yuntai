<template>
  <div :class="$style.main">
    <van-swipe
      :class="$style.swipe"
      :duration="300"
      :loop="false"
      :touchable="false"
      :show-indicators="false"
      ref="swipe">
      <van-swipe-item>
        <div :class="$style.total">
          <div>
            <p>总启动次数(次)</p>
            <p>{{analysisData.StartupAmount | number}}</p>
          </div>
          <div>
            <p>礼品消耗(个)</p>
            <p>{{analysisData.GiftConsumption | number}}</p>
          </div>
          <div>
            <p>总投币数(币)</p>
            <p>{{analysisData.TotalCoinIn | number}}</p>
          </div>
        </div>
        <div
          :class="$style['swipe-pagination']"
          @click="swipeToIndex(1)" >
          <span>
            切换到明细<br><br>&gt;&gt;
          </span>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div
          :class="$style['swipe-pagination']"
          @click="swipeToIndex(0)" >
          <span>
            切换到汇总<br><br>&lt;&lt;
          </span>
        </div>
        <device-data-list
          :class="$style.detail"
          ref="deviceDataList"
          :tenantID="tenantID"
          :startDate="startDate"
          :endDate="endDate"
          :visible="visible">
        </device-data-list>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
/**
 * 设备分析
 */
import MarketingStatistic from '@/api/MarketingStatistic';
import DeviceDataList from './DeviceDataList';

import {
  Toast,
  Tabs,
  Tab,
  Swipe,
  SwipeItem,
} from 'vant';

export default {
  name: 'DeviceAnalysis',

  components: {
    Tabs,
    Tab,
    DeviceDataList,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
  },

  props: {
    visible: {
      type: Boolean,
    },
    tenantID: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },

  data: () => ({
    analysisData: {},
  }),

  created () {
    this.asyncGetDeviceAnalysisData();
  },

  methods: {
    asyncGetDeviceAnalysisData () {
      MarketingStatistic.getDeviceAnalysis({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
      }).then(res => {
        this.analysisData = res;
      });
    },

    asyncRefreshDeviceAnalysisData () {
      MarketingStatistic.getDeviceAnalysis({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
      }).then(res => {
        this.analysisData = res;
        if (this.$refs.deviceDataList) {
          this.$refs.deviceDataList.onLoadDeviceDataList(true, this.startDate, this.endDate);
        }
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },

    swipeToIndex (index) {
      this.$refs.swipe.swipeTo(index);
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .swipe {
    flex: 1;
  }

  .total {
    padding: 20px 20px 10px;
    width: inherit;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    height: 100%;

    div {
      width: 100%;
      border-left: 4px solid $color-golden;
      padding-left: 16px;
      height: 120px;

      p:first-child {
        font-size: $font-size-primary;
        color: $font-color-placeholder;
        line-height: 22px;
      }

      p:last-child {
        font-size: $font-size-bigger;
        color: $font-color-regular;
        line-height: 42px;
      }

      .p__highlight {
        color: $color-primary !important;
      }

      .p-decimal {
        font-size: $font-size-secondary;
      }
    }
  }

  .detail {
    width: inherit;
  }

  .van-swipe-item {
    height: 100%;
    display: flex;
    justify-content: flex-start;

    .swipe-pagination {
      width: 50px;
      background-color: $color-white;

      span {
        font-size: $font-size-primary;
        color: $color-primary;
        width: 16px;
        height: 96px;
        position: absolute;
        top: 50%;
        margin-left: 10px;
        margin-top: -48px;
      }
    }
  }
</style>
