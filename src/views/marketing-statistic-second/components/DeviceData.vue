<template>
  <data-container
    @change="onConditionChanged"
    :tab-active="tabActive">
    <data-header
      title="总启动次数"
      :value="totalAmount"
      value-fmt="0,0"
      unit="次"
      :storeList="storeList">
    </data-header>

    <van-list
      :loading="loading"
      :finished="finished"
      @load="getDeviceDataDetail">
      <detail-item
        v-for="(detail, index) in detailList"
        :key="'key_' + index"
        :title="`${detail.DeviceName}号(${detail.DeviceNumber})`"
        :data-list="getDataList(detail)">
        <div slot="value">
          <span style="font-size: 16px;">{{ detail.StartupAmount }}次</span> /
          <span style="font-size: 16px;">{{ detail.GiftConsumption }}个</span>
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
    totalAmount: 0,
    orderAmount: 0,
    customerAmount: 0,
    pageIndex: 1,
    detailList: [],
    loading: true,
    finished: false,
  }),

  created () {

  },

  methods: {
    onConditionChanged (tenantId, startDate, endDate) {
      this.tenantId = tenantId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.getDeviceData();

      this.detailList = [];
      this.loading = true;
      this.finished = false;
      this.pageIndex = 1;
      Toast.loading({
        message: '加载中',
        duration: 0,
        mask: true,
      });
      this.getDeviceDataDetail();
    },

    getDeviceData () {
      MarketingStatistic.getDeviceAnalysis({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
      }).then(res => {
        console.log(res);
        this.totalAmount = res.StartupAmount;

        this.storeList = [{
          name: '总投币数/个',
          value: res.OnlineCoinIn + res.OfflineCoinIn,
          valueFmt: '0,0',
        }, {
          name: '礼品消耗/个',
          value: res.GiftConsumption,
          valueFmt: '0,0',
        }, {
          name: '礼品成本/元',
          value: res.GiftCost,
          valueFmt: '0,0.00',
        }];
      });
    },

    getDeviceDataDetail () {
      this.loading = true;
      MarketingStatistic.getDeviceAnalysisDetail({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
        PageIndex: this.pageIndex++,
        PageSize: 20,
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
      list.push({
        name: '线上投币',
        value: detail.OnlineCoinIn,
        valueSuffix: '币',
        valueFmt: '0,0',
      });

      list.push({
        name: '线下投币',
        value: detail.OfflineCoinIn,
        valueSuffix: '币',
        valueFmt: '0,0',
      });

      list.push({
        name: '礼品消耗',
        value: detail.GiftConsumption,
        valueSuffix: '个',
        valueFmt: '0,0',
      });

      list.push({
        name: '礼品成本',
        value: detail.GiftCost,
        valueSuffix: '元',
      });

      list.push({
        name: '所属门店',
        valueSuffix: detail.BelongToTenant,
      });

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
