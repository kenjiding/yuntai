<template>
  <data-container
    @change="onConditionChanged"
    :tab-active="tabActive">
    <data-header
      title="消费顾客"
      :value="totalCustomerAmount"
      value-fmt="0,0"
      unit="人"
      :storeList="storeList">
    </data-header>

    <div :class="$style['intro']">
      <div :class="$style['intro-title']">顾客构成与交易贡献占比</div>
      <div :class="$style['intro-content']">
        <div :class="$style['intro-item']">
          <div :class="$style['color']"></div>
          <div :class="$style['title']">新顾客</div>
          <div :class="$style['desc']">(30天内注册)</div>
        </div>

        <div :class="$style['intro-item']">
          <div :class="$style['color']"></div>
          <div :class="$style['title']">老顾客</div>
          <div :class="$style['desc']">(30天之前注册)</div>
        </div>
      </div>
    </div>

    <data-progress
      title="消费顾客"
      amount-unit="人"
      :left-amount="customerData.Consumption.NewAmount"
      :right-amount="customerData.Consumption.OldAmount"
      :left-percent="customerData.Consumption.NewPercent"
      :right-percent="customerData.Consumption.OldPercent"/>

    <data-progress
      title="交易金额"
      amount-unit="元"
      :left-amount="customerData.TradingAmount.NewAmount"
      :right-amount="customerData.TradingAmount.OldAmount"
      :left-percent="customerData.TradingAmount.NewPercent"
      :right-percent="customerData.TradingAmount.OldPercent"
      amount-fmt="0,0.00"/>

    <data-progress
      title="交易笔数"
      amount-unit="笔"
      :left-amount="customerData.TradingCount.NewAmount"
      :right-amount="customerData.TradingCount.OldAmount"
      :left-percent="customerData.TradingCount.NewPercent"
      :right-percent="customerData.TradingCount.OldPercent"/>
  </data-container>
</template>

<script>
import { Toast, List } from 'vant';
import DataContainer from './DataContainer';
import DataHeader from './DataHeader';
import MarketingStatistic from '@/api/MarketingStatistic';
import DataProgress from './DataProgress';

export default {
  components: {
    DataContainer,
    DataHeader,
    [List.name]: List,
    DataProgress,
  },

  props: {
    tabActive: Boolean,
  },

  data: () => ({
    storeList: [],
    tenantId: '',
    startDate: 0,
    endDate: 0,
    totalCustomerAmount: 0,
    customerData: {
      Consumption: {},
      TradingAmount: {},
      TradingCount: {},
    },
  }),

  methods: {
    onConditionChanged (tenantId, startDate, endDate) {
      this.tenantId = tenantId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.getCustomerData();
    },

    getCustomerData () {
      Toast.loading({
        message: '加载中',
        duration: 0,
        mask: true,
      });

      MarketingStatistic.getCustomerAnalysis({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
      }).then(res => {
        console.log(res);
        Toast.clear();
        this.totalCustomerAmount = res.CustomerAmount || 0;
        this.customerData.Consumption = res.Consumption || {};
        this.customerData.TradingAmount = res.TradingAmount || {};
        this.customerData.TradingCount = res.TradingCount || {};

        this.storeList = [{
          name: '新顾客/人',
          value: res.NewCustomerAmount,
          valueFmt: '0,0',
        }, {
          name: '老顾客/人',
          value: res.OldCustomerAmount,
          valueFmt: '0,0',
        }, {
          name: '客单价/元',
          value: res.CustomerPrice,
        }];
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .content {
    position: relative;
    padding-top: 130px;
    padding-bottom: 80px;
  }

  .desc-wrap {
    font-size: 14px;
    color: rgba(255, 255, 255, .6); // stylelint-disable

    &__value {
      color: $color-white;
      display: inline-block;
      margin: 0 5px;
    }
  }

  .intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px 0;

    .intro-title {
      color: $font-color-regular;
      font-size: 16px;
    }

    .intro-content {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .intro-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .color {
          width: 22px;
          height: 13px;
          border-radius: 7px;
        }

        .title {
          font-size: 14px;
          color: $font-color-regular;
          margin-left: 5px;
        }

        .desc {
          font-size: 12px;
          color: $font-color-secondary;
          margin-left: 5px;
        }

        &:nth-child(1) .color {
          background-color: #ffa142;
        }

        &:nth-child(2) .color {
          background-color: #0c95ff;
        }
      }
    }
  }
</style>
