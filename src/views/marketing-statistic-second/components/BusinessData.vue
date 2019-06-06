<template>
  <div>
    <data-container
      @change="onConditionChanged"
      :tab-active="tabActive"
      v-if="dataActive == 0">
      <data-header
        title="合计收入"
        :value="totalIncome"
        unit="元"
        :storeList="storeList">
        <div :class="$style['desc-wrap']">
          交易共<span :class="$style['desc-wrap__value']">{{ orderAmount }}</span>笔
          &nbsp;&nbsp;
          顾客共<span :class="$style['desc-wrap__value']">{{ customerAmount }}</span>人
        </div>
        <div slot="power-comp" :class="$style['data-header-power-comp']" @click="dataActive = 1" v-if="cashierShow">
          <van-icon name="maichong" />
          收银员视图
        </div>
      </data-header>

      <van-list
        :loading="loading"
        :finished="finished"
        @load="getBusinessDataDetail">
        <detail-item
          v-for="(detail, index) in detailList"
          :key="'key_' + index"
          :title="detail.TenantName"
          :tag="detail.DeviceAmount + '台'"
          :value="detail.TotalIncome"
          value-prefix="¥"
          value-fmt="0,0.00"
          :data-list="getDataList(detail)"/>
      </van-list>
    </data-container>

    <data-container
      @change="onConditionChanged"
      :tab-active="tabActive"
      :condition-items="['account']"
      v-if="dataActive == 1">
      <data-header
        title="销售汇总"
        :value="[cashierTotalCount, cashierTotalMoney]"
        :unit="['个', '元']"
        :valueFmt="['0,0', '0,0.00']"
        :storeList="cashierStoreList"
        :storeTouchable="true"
        @onStoreItemClick="handleStoreClick">
        <div slot="power-comp" :class="$style['data-header-power-comp']" @click="dataActive = 0">
          <van-icon name="maichong" />
          门店视图
        </div>
      </data-header>

      <van-list
        :loading="cashierLoading"
        :finished="cashierFinished"
        @load="getCashierDataDetail">
        <detail-item
          v-for="(detail, index) in cashierDetailList"
          :key="'key_' + index"
          :title="detail.GoodsName"
          :value="detail.TotalIncome"
          value-prefix="¥"
          value-fmt="0,0.00"
          :data-list="getCashierDataList(detail)">
          <div slot="value">
            <span style="font-size: 16px;">售卖{{detail.Count - detail.ReturnCount}}个</span> /
            <span style="font-size: 16px;">{{ (detail.Money - detail.ReturnMoney) | number('0,0.00') }}元</span>
          </div>
        </detail-item>
      </van-list>
    </data-container>
  </div>
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
    dataActive: 0, // 0: 普通营收视图，1: 收银员视图
    storeList: [],
    cashierStoreList: [],
    tenantId: '00000000-0000-0000-0000-000000000000',
    accountId: '00000000-0000-0000-0000-000000000000',
    startDate: 0,
    cashierStartDate: 0,
    endDate: 0,
    cashierEndDate: 0,

    totalIncome: 0,
    orderAmount: 0,
    customerAmount: 0,
    cashierTotalCount: 0,
    cashierTotalMoney: 0,

    pageIndex: 1,
    cashierPageIndex: 1,
    detailList: [],
    cashierDetailList: [],
    loading: true,
    cashierLoading: true,
    finished: false,
    cashierFinished: false,
    cashierStatisType: 'Coin',
    cashierShow: false,
  }),

  computed: {
    isAdmin () {
      return this.$store.getters.getIsAdmin;
    },
  },

  watch: {
    dataActive (value) {
      if (value === 1) {
        this.onConditionChanged(this.accountId, this.startDate, this.endDate);
      } else if (value === 0) {
        this.onConditionChanged(this.tenantId, this.cashierStartDate, this.cashierEndDate);
      }
    },

    tabActive (value) {
      if (value) {
        let userInfo = JSON.parse(localStorage.getItem('user-info'));
        this.cashierShow = sessionStorage.getItem('isMain') === 'true' || userInfo.IsMain || this.isAdmin;
      }
    },
  },

  activated () {
    this.dataActive = 0;
  },

  methods: {
    onConditionChanged (tenantId, startDate, endDate) {
      if (this.dataActive === 0) {
        this.tenantId = tenantId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.getBusinessData();

        this.detailList = [];
        this.loading = true;
        this.finished = false;
        this.pageIndex = 1;
        Toast.loading({
          message: '加载中',
          duration: 0,
          mask: true,
        });
        this.getBusinessDataDetail();
      } else {
        this.accountId = tenantId; // 其实在这里是账户Id
        this.cashierStartDate = startDate;
        this.cashierEndDate = endDate;
        this.getCashierData();

        this.cashierDetailList = [];
        this.cashierLoading = true;
        this.cashierFinished = false;
        this.cashierPageIndex = 1;
        Toast.loading({
          message: '加载中',
          duration: 0,
          mask: true,
        });
        this.getCashierDataDetail();
      }
    },

    getBusinessData () {
      MarketingStatistic.getTenantAnalysis({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
      }).then(res => {
        console.log(res);
        this.totalIncome = res.TotalIncome;
        this.orderAmount = res.OrderAmount;
        this.customerAmount = res.CustomerAmount;
        this.storeList = res.IncomeData.map(item => {
          return {
            name: `${item.PaymentName}/元`,
            value: item.Income,
          }
          ;
        });
      });
    },

    getCashierData () {
      MarketingStatistic.getCashierAnalysis({
        UserID: this.accountId,
        StartDate: this.cashierStartDate,
        EndDate: this.cashierEndDate,
      }).then(res => {
        console.log('收银员视图数据', res);
        this.cashierTotalCount = res.TotalCount;
        this.cashierTotalMoney = res.TotalMoney;
        this.cashierStoreList = [{
          name: '游戏币',
          value: [res.CoinCount, res.CoinMoney],
          valueFmt: ['0,0', '0,0.00'],
          unit: ['个', '元'],
        }, {
          name: '商品',
          value: [res.GoodsCount, res.GoodsMoney],
          valueFmt: ['0,0', '0,0.00'],
          unit: ['个', '元'],
        }];
      });
    },

    getBusinessDataDetail () {
      this.loading = true;
      MarketingStatistic.getTenantAnalysisDetail({
        TenantID: this.tenantId,
        StartDate: this.startDate,
        EndDate: this.endDate + 3600 * 24 * 1000 - 1,
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        Toast.clear();
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

    getCashierDataDetail () {
      this.cashierLoading = true;
      MarketingStatistic.getCashierAnalysisDetail({
        UserID: this.accountId,
        StartDate: this.cashierStartDate,
        EndDate: this.cashierEndDate + 3600 * 24 * 1000 - 1,
        PageIndex: this.cashierPageIndex++,
        PageSize: 20,
        StatisType: this.cashierStatisType,
      }).then(res => {
        Toast.clear();
        this.cashierDetailList = this.cashierDetailList.concat(res.Data);
        this.cashierLoading = false;
        if (this.cashierDetailList.length >= res.Total) {
          this.cashierFinished = true;
        }
      }, res => {
        Toast.clear();
        this.cashierLoading = false;
        this.cashierFinished = true;
      });
    },

    getDataList (detail) {
      let list = [];
      detail.IncomeData.forEach(item => {
        list.push({
          name: item.PaymentName,
          value: item.Income,
          valueSuffix: '元',
        });
      });

      list.push({
        name: '订单笔数',
        value: detail.OrderAmount,
        valueSuffix: '笔',
        valueFmt: '0,0',
      });

      list.push({
        name: '顾客人数',
        value: detail.CustomerAmount,
        valueSuffix: '人',
        valueFmt: '0,0',
      });

      return list;
    },

    getCashierDataList (detail) {
      return [{
        name: '售卖数量',
        value: detail.Count,
        valueSuffix: '个',
        valueFmt: '0,0',
      }, {
        name: '售卖金额',
        value: detail.Money,
        valueSuffix: '元',
      }, {
        name: '退货数量',
        value: detail.ReturnCount,
        valueSuffix: '个',
        valueFmt: '0,0',
      }, {
        name: '退货金额',
        value: detail.ReturnMoney,
        valueSuffix: '元',
      }];
    },

    handleStoreClick (index) {
      if (index === 0) {
        this.cashierStatisType = 'Coin';
      } else {
        this.cashierStatisType = 'Goods';
      }
      this.cashierPageIndex = 1;
      this.cashierFinished = false;
      this.cashierDetailList = [];
      this.getCashierDataDetail();
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

  .data-header-power-comp {
    position: absolute;
    top: 20px;
    right: 0px;
    color: $color-white;
    font-size: 12px;
    border: 1px solid $color-white;
    border-right-color: transparent;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    padding: 5px 10px;
  }
</style>
