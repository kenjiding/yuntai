<template>
    <div :class="$style.main">
      <van-row>
        <van-col span="14">新顾客
          <span :class="$style.summary">(注册时间少于30天)</span>
        </van-col>
        <van-col
          span="10"
          :class="$style['van-col-right']">老顾客
        </van-col>
      </van-row>
      <template v-for="(item,index) in analysisData">
        <div
          :key="index"
          :class="$style['template-cell']">
          <van-row>
            <van-col
              span="24"
              :class="$style.chart">
            <div :class="$style['chart-title']">{{item.Title}}</div>
            <div
             :class="$style['chart_left']"
             :style="{'width': calculatePercentage(item.LeftValue, item.LeftValue+item.RightValue)+'%'}">
            </div>
            <div
             :class="$style['chart_right']"
             :style="{'width': calculatePercentage(item.RightValue, item.LeftValue+item.RightValue)+'%'}">
            </div>
            </van-col>
          </van-row>
          <van-row v-if="item.Unit==='元'">
            <van-col span="12">{{item.LeftValue | number('0,0.00')}}{{item.Unit}}</van-col>
            <van-col span="12" :class="$style['van-col-right']">{{item.RightValue | number('0,0.00')}}{{item.Unit}}</van-col>
          </van-row>
          <van-row v-else>
            <van-col span="12">{{item.LeftValue | number}}{{item.Unit}}</van-col>
            <van-col span="12" :class="$style['van-col-right']">{{item.RightValue | number}}{{item.Unit}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              {{calculatePercentage(item.LeftValue, item.LeftValue+item.RightValue)}}%
            </van-col>
            <van-col span="12" :class="$style['van-col-right']">
              {{calculatePercentage(item.RightValue, item.LeftValue+item.RightValue)}}%
            </van-col>
          </van-row>
        </div>
      </template>
    </div>
</template>
<script>
/**
 * 顾客分析
 */
import MarketingStatistic from '@/api/MarketingStatistic';

import {
  Toast,
  Tabs,
  Tab,
} from 'vant';

export default {
  name: 'CustomerAnalysis',

  components: {
    Tabs,
    Tab,
  },

  props: {
    // visible: {
    //   type: Boolean,
    // },
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
    analysisData: [],
  }),

  created () {
    this.asyncGetCustomerAnalysis();
  },

  methods: {
    asyncGetCustomerAnalysis () {
      MarketingStatistic.getCustomerAnalysis({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
      }).then(res => {
        this.analysisData = res.Data;
        Toast.clear();
      });
    },

    calculatePercentage (val, total) {
      if (total === 0) {
        return 0;
      } else {
        return (val / total * 100).toFixed(2);
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .main {
    padding: 20px;

    .van-col {
      font-size: $font-size-primary;
      line-height: 22px;

      &-right {
        text-align: right;
      }
    }

    .summary {
      font-size: $font-size-special;
      color: $font-color-placeholder;
    }
  }

  .template-cell {
    color: $font-color-placeholder;
    margin-bottom: 8px;
  }

  .chart {
    margin: 8px 0;
    position: relative;
    height: 30px;
    background-color: $color-info;

    div {
      position: relative;
    }

    &-title {
      width: inherit;
      text-align: center;
      color: $color-white;
      line-height: 30px;
      z-index: 10;
    }

    &_left {
      float: left;
      height: 30px;
      background-color: $color-golden;
      top: -30px;
    }

    &_right {
      float: left;
      height: 30px;
      background-color: $color-warning;
      top: -30px;
    }
  }

</style>
