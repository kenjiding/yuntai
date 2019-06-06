<template>
  <data-container
    @change="onConditionChanged"
    :tab-active="tabActive">
    <data-header
      title="消耗总数"
      :value="totalConsumption"
      value-fmt="0,0"
      unit="个"
      :storeList="storeList"
      :storeTouchable="true"
      @onStoreItemClick="handleStoreClick">
      <div :class="$style['desc-wrap']">
        售卖收入<span :class="$style['desc-wrap__value']">{{ saleConsumptionAmount }}</span>元
      </div>
    </data-header>

    <van-list
      :loading="loading"
      :finished="finished"
      @load="getGoodsDataDetail">
      <detail-item
        v-for="(detail, index) in detailList"
        :key="'key_' + index"
        :title="`${detail.GoodsName}`"
        :data-list="getDataList(detail)">
        <div slot="value" v-if="consumptionMethodIndex === 0">
          <span style="font-size: 16px;">售卖{{detail.Count - detail.ReturnCount}}个</span> /
          <span style="font-size: 16px;">{{ (detail.Price - detail.ReturnPrice) | number('0,0.00') }}元</span>
        </div>
        <div slot="value" v-else style="font-size: 16px;">
          <span v-if="consumptionMethodIndex === 1" style="font-size: 14px;">兑换</span>
          <span v-if="consumptionMethodIndex === 2" style="font-size: 14px;">消耗</span>
          <span v-if="consumptionMethodIndex === 1">{{ detail.Count - detail.ReturnCount | number('0,0') }}</span>
          <span v-if="consumptionMethodIndex === 2">{{ detail.Count | number('0,0') }}</span>
          <span style="font-size: 14px;">个</span>
        </div>
      </detail-item>
    </van-list>

  </data-container>
</template>

<script>
import { Toast, List } from 'vant';
import DataContainer from './DataContainer';
import DataHeader from './DataHeader';
import MarketingStatistic from '@/api/MarketingStatistic';
import DetailItem from './DetailItem';

export default {
  components: {
    DataContainer,
    DataHeader,
    DetailItem,
    [List.name]: List,
  },

  props: {
    tabActive: Boolean,
  },

  data: () => ({
    storeList: [],
    tenantId: '',
    startDate: 0,
    endDate: 0,
    totalConsumption: 0,
    saleConsumptionAmount: 0,
    customerAmount: 0,
    pageIndex: 1,
    detailList: [],
    loading: true,
    finished: false,
    consumptionMethod: ['Sale', 'Exchange', 'Device'],
    consumptionMethodIndex: 0,
  }),

  created () {

  },

  methods: {
    handleStoreClick (index) {
      console.log(index);
      this.consumptionMethodIndex = index;
      this.pageIndex = 1;
      this.finished = false;
      this.detailList = [];
      this.getGoodsDataDetail();
    },

    onConditionChanged (tenantId, startDate, endDate) {
      this.tenantId = tenantId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.getGoodsData();

      this.detailList = [];
      this.loading = true;
      this.finished = false;
      this.pageIndex = 1;
      Toast.loading({
        message: '加载中',
        duration: 0,
        mask: true,
      });
      this.getGoodsDataDetail();
    },

    getGoodsData () {
      MarketingStatistic.getGoodsAnalysis({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
      }).then(res => {
        console.log(res);
        this.totalConsumption = res.TotalConsumption;
        this.saleConsumptionAmount = res.SaleConsumptionAmount;

        this.storeList = [{
          name: '售卖消耗/个',
          value: res.SaleConsumptionCount,
          valueFmt: '0,0',
        }, {
          name: '兑换消耗/个',
          value: res.ExchangeConsumption,
          valueFmt: '0,0',
        }, {
          name: '设备消耗/个',
          value: res.DeviceConsumption,
          valueFmt: '0,0',
        }];
      });
    },

    getGoodsDataDetail () {
      this.loading = true;
      MarketingStatistic.getGoodsAnalysisDetail({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
        PageIndex: this.pageIndex++,
        PageSize: 20,
        ConsumptionMethod: this.consumptionMethod[this.consumptionMethodIndex],
      }).then(res => {
        Toast.clear();
        console.log(res);
        this.detailList = this.detailList.concat(res.Data);
        this.loading = false;
        if (this.detailList.length >= res.Total) {
          this.finished = true;
        }
      }, res => {
        Toast.clear();
        this.loading = false;
        this.finished = true;
      });
    },

    getDataList (detail) {
      let list = [];
      if (this.consumptionMethodIndex === 0) {
        list = [{
          name: '售卖数量',
          value: detail.Count,
          valueSuffix: '个',
          valueFmt: '0,0',
        }, {
          name: '售卖金额',
          value: detail.Price,
          valueSuffix: '元',
        }, {
          name: '退货数量',
          value: detail.ReturnCount,
          valueSuffix: '个',
          valueFmt: '0,0',
        }, {
          name: '退货金额',
          value: detail.ReturnPrice,
          valueSuffix: '元',
        } ];
      } else if (this.consumptionMethodIndex === 1) {
        let incomePrice = '';
        if (detail.Price > 0 && detail.Integral > 0) {
          incomePrice = `${detail.Price} 币 & ${detail.Integral} 积分`;
        } else if (detail.Price > 0) {
          incomePrice = `${detail.Price} 币`;
        } else if (detail.Integral > 0) {
          incomePrice = `${detail.Integral} 积分`;
        } else {
          incomePrice = '0';
        }

        let returnPrice = '';
        if (detail.ReturnPrice > 0 && detail.ReturnIntegral > 0) {
          returnPrice = `${detail.ReturnPrice} 币 & ${detail.ReturnIntegral} 积分`;
        } else if (detail.ReturnPrice > 0) {
          returnPrice = `${detail.ReturnPrice} 币`;
        } else if (detail.ReturnIntegral > 0) {
          returnPrice = `${detail.ReturnIntegral} 积分`;
        } else {
          returnPrice = '0';
        }

        list = [{
          name: '兑换数量',
          value: detail.Count,
          valueSuffix: '个',
          valueFmt: '0,0',
        }, {
          name: '兑换金额',
          value: incomePrice,
          disableFmt: true,
        }, {
          name: '退货数量',
          value: detail.ReturnCount,
          valueSuffix: '个',
          valueFmt: '0,0',
        }, {
          name: '退货金额',
          value: returnPrice,
          disableFmt: true,
        } ];
      } else {
        list = detail.Data.map(item => {
          return {
            name: `${item.Name}(${item.Number})`,
            value: `消耗${item.ConsumptionCount}个`,
            disableFmt: true,
          };
        });
      }

      return list;
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
</style>
