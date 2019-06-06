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
        <div :class="$style.content">
          <div :class="$style.total">
          <div>
            <p>合计收入(元)</p>
            <p :class="$style['p__highlight']">
              <span>{{  $_number(analysisData.TotalIncome).format('0.00').split('.')[0]}}</span>
              <span :class="$style['p-decimal']">.{{$_number(analysisData.TotalIncome).format('0.00').split('.')[1]}}</span>
            </p>
          </div>
          <div>
            <p>交易总数(笔)</p>
            <p>{{analysisData.OrderAmount | number}}
            </p>
          </div>
          <div>
            <p>顾客人数(人)</p>
            <p>{{analysisData.CustomerAmount | number}}
            </p>
          </div>
          <div>
            <p>现金支付(元)</p>
            <p>
              <span>{{  $_number(analysisData.CashIncome).format('0.00').split('.')[0]}}</span>
              <span :class="$style['p-decimal']">.{{$_number(analysisData.CashIncome).format('0.00').split('.')[1]}}</span>
            </p>
          </div>

          <div>
            <p>微信支付(元)</p>
            <p>
              <span>{{  $_number(analysisData.WechatPay).format('0.00').split('.')[0]}}</span>
              <span :class="$style['p-decimal']">.{{$_number(analysisData.WechatPay).format('0.00').split('.')[1]}}</span>
            </p>
          </div>
          <div>
            <p>支付宝支付(元)</p>
            <p>
              <span>{{  $_number(analysisData.AliPay).format('0.00').split('.')[0]}}</span>
              <span :class="$style['p-decimal']">.{{$_number(analysisData.AliPay).format('0.00').split('.')[1]}}</span>
            </p>
          </div>

          <div>
            <p>礼品消耗(个)</p>
            <p>
              {{analysisData.GiftConsumption | number}}
            </p>
          </div>
          <div>
            <p>礼品成本(元)</p>
            <p>
              <span>{{  $_number(analysisData.GiftCost).format('0.00').split('.')[0]}}</span>
              <span :class="$style['p-decimal']">.{{$_number(analysisData.GiftCost).format('0.00').split('.')[1]}}</span>
            </p>
          </div>
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
        <tenant-data-list
          ref="tenantDataList"
          :tenantID="tenantID"
          :startDate="startDate"
          :endDate="endDate"
          :visible="visible"
          :class="$style.detail">
        </tenant-data-list>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
/**
 * 经营统计
 */
import MarketingStatistic from '@/api/MarketingStatistic';
import TenantDataList from './TenantDataList';
import {
  //Toast,
  Tabs,
  Tab,
  Swipe,
  SwipeItem,
} from 'vant';

export default {
  name: 'TenantAnalysis',

  components: {
    Tabs,
    Tab,
    TenantDataList,
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
    this.asyncGetTenantAnalysisData();
  },

  methods: {
    asyncGetTenantAnalysisData () {
      MarketingStatistic.getTenantAnalysis({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(), // 2018-5-6
        EndDate: this.endDate.getTime() + 86400000 - 1, // 2018-5-6
      }).then(res => {
        this.analysisData = res;
      });
    },

    asyncRefreshTenantAnalysisData () {
      //console.log('analysis:' + this.tenantID + '||' + this.startDate + '-' + this.endDate);
      MarketingStatistic.getTenantAnalysis({
        TenantID: this.tenantID,
        StartDate: this.startDate.getTime(),
        EndDate: this.endDate.getTime() + 86400000 - 1,
      }).then(res => {
        this.analysisData = res;

        if (this.$refs.tenantDataList) {
          this.$refs.tenantDataList.onLoadTenantDataList(true, this.startDate, this.endDate);
        }
      });
    },

    swipeToIndex (index) {
      this.$refs.swipe.swipeTo(index);
    },

    getInt (val) {
      if (String(val).indexOf('.') > -1) {
        let deccimal = String(val).split('.');
        return Number(deccimal[0]);
      } else {
        return val;
      }
    },

    getDecimal (val) {
      if (String(val).indexOf('.') > -1) {
        let deccimal = String(val).split('.');
        return '.' + deccimal[1];
      } else {
        return '';
      }
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

  .content {
    display: flex;
    width: inherit;
    overflow: scroll;
  }

  .total {
    display: flex;
    flex-flow: row wrap;
    padding: 15px 20px 10px;
    height: 100%;

    div {
      width: 100%;
      border-left: 4px solid $color-golden;
      padding-left: 16px;

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
