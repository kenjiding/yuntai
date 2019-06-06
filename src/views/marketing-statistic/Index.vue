<template>
  <ych-page>
      <div slot="header">
        <page-header
          left-arrow
          :title="tenantName"
          @click-left="$router.go(-1)">
          <div
            slot="right"
            @click="tenantSeletVisible=true">切换</div>
        </page-header>

        <div :class="$style.search">
          <van-tabs
          v-model="active"
          type="card"
          :class="$style['search-tabs']">
            <van-tab v-for="(tab,index) in tabs" :title="tab.Title" :key="index">
            </van-tab>
          </van-tabs>
          <div :class="$style['search-date']">
            <div @click="startDatePickerVisible=true">
              <span>{{startDate | date('YYYY/MM/DD')}} - </span>
              <span>{{endDate | date('YYYY/MM/DD')}}</span>
            </div>
            <van-icon name="search" @click="refrashData"/>
          </div>
          <div :class="$style['date-select']">
            <template v-for="(item,index) in dateSelect">
              <div
              :key="index"
              @click="onDateSelect(item.Value)">
              {{item.Name}}
              </div>
            </template>
          </div>
        </div>
      </div>
      <tenant-analysis
        v-if="active===0"
        ref="tenantAnalysis"
        :visible="active===0"
        :tenantID="tenantID"
        :startDate="startDate"
        :endDate="endDate">
      </tenant-analysis>
      <device-analysis
        v-else-if="active===1"
        ref="deviceAnalysis"
        :visible="active===1"
        :tenantID="tenantID"
        :startDate="startDate"
        :endDate="endDate">
      </device-analysis>
      <customer-analysis
        v-else-if="active===2"
        ref="customerAnalysis"
        :visible="active===2"
        :tenantID="tenantID"
        :startDate="startDate"
        :endDate="endDate">
      </customer-analysis>

      <tenant-select
        :listShow="tenantSeletVisible"
        @close="tenantSeletVisible = false"
        @cell-click="handleTenantSelected">
      </tenant-select>
      <popup
        v-model="startDatePickerVisible"
        position='bottom'>
        <van-datetime-picker
          title="选择开始时间"
          v-model="startDate"
          type="date"
          @cancel="startDatePickerVisible=false"
          @confirm="startDatePickerVisible=false;endDatePickerVisible=true"/>
      </popup>
      <popup
        v-model="endDatePickerVisible"
        position='bottom'>
        <van-datetime-picker
          title="选择结束时间"
          v-model="endDate"
          type="date"
          :min-date="startDate"
          @cancel="endDatePickerVisible=false"
          @confirm="handleEndDatePickerConfim"/>
      </popup>
  </ych-page>
</template>
<script>
/**
 * 设备投币记录/补币记录
 */
import PageHeader from '@/components/PageHeader';
import CustomerAnalysis from './components/CustomerAnalysis';
import TenantAnalysis from './components/TenantAnalysis';
import TenantSelect from './components/TenantSelect';
import DeviceAnalysis from './components/DeviceAnalysis';

import {
  Toast,
  Tabs,
  Tab,
  Popup,
} from 'vant';

export default {
  name: 'MarketingStatistic',

  components: {
    PageHeader,
    'van-tabs': Tabs,
    'van-tab': Tab,
    Popup,
    CustomerAnalysis,
    TenantAnalysis,
    DeviceAnalysis,
    TenantSelect,
  },

  data: () => ({
    active: 0,
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(0, 0, 0, 0)),
    startDatePickerVisible: false,
    endDatePickerVisible: false,
    tenantSeletVisible: false,
    tenantName: '全部门店',
    tenantID: '00000000-0000-0000-0000-000000000000',
    tabs: [
      {
        Title: '经营数据',
      },
      {
        Title: '设备分析',
      },
      {
        Title: '顾客分析',
      },
    ],
    dateSelect: [
      {
        Name: '今天',
        Value: 'Today',
      },
      {
        Name: '昨天',
        Value: 'Yesterday',
      },
      {
        Name: '本周',
        Value: 'Week',
      },
      {
        Name: '本月',
        Value: 'Month',
      },
    ],
  }),

  created () {
    this.tenantName = '全部门店' + (this.$route.query.tenantCount === undefined ? '' : '(' + this.$route.query.tenantCount + '家)');
    //this.asyncGetTenantInfo();
  },

  methods: {
    asyncGetTenantInfo () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
      });

      this.hideLoadingToast();
    },

    hideLoadingToast () {
      Toast.clear();
    },

    refrashData () {
      if (this.startDate.getTime() > this.endDate.getTime()) {
        Toast({
          message: '开始日期不能大于结束日期',
          duration: 1500,
        });
        return;
      }
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      if (this.active === 0) {
        this.$refs.tenantAnalysis.asyncRefreshTenantAnalysisData();
      } else if (this.active === 1) {
        this.$refs.deviceAnalysis.asyncRefreshDeviceAnalysisData();
      } else if (this.active === 2) {
        this.$refs.customerAnalysis.asyncGetCustomerAnalysis();
      }

      //this.hideLoadingToast();
    },

    handleTenantSelected (tenantId, tenantName) {
      this.tenantName = tenantName;
      this.tenantID = tenantId;
      this.tenantSeletVisible = false;
      this.$nextTick(() => this.refrashData());
    },

    onDateSelect (val) {
      let today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      switch (val) {
      case 'Today':
        this.startDate = today;
        this.endDate = today;
        break;
      case 'Yesterday':
        let yesterday = new Date(today.setDate(today.getDate() - 1));
        this.startDate = yesterday;
        this.endDate = yesterday;
        break;
      case 'Week':
        let weekFirstDay = new Date(today - ((today.getDay() === 0 ? 7 : today.getDay()) - 1) * 86400000);
        // let weekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000);
        let weekLastDay = today;
        this.startDate = weekFirstDay;
        this.endDate = weekLastDay;
        break;
      case 'Month':
        let monthFirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        // let monthLastDay = new Date(new Date(today.getFullYear(), today.getMonth() + 1, 1) - 86400000);
        let monthLastDay = today;
        this.startDate = monthFirstDay;
        this.endDate = monthLastDay;
        break;
      }
      this.$nextTick(() => this.refrashData());
    },
    handleEndDatePickerConfim () {
      this.endDatePickerVisible = false;
      this.$nextTick(() => this.refrashData());
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .van-picker__frame {
    position: absolute !important;
  }

  .search {
    height: 115px;
    padding-top: 10px;
    background-color: $color-primary;

    &-tabs {
      .van-tabs__nav--card {
        border-color: $color-white;
        border-radius: $border-radius;
        overflow: hidden;
      }

      .van-tab {
        color: $color-white;
        background-color: $color-primary;
        border-right-color: $color-white;
      }

      .van-tab.van-tab--active {
        color: $color-primary;
        background-color: $color-white;
        border-right-color: $color-primary;
      }
    }

    &-date {
      height: 24px;
      padding: 5px 0;
      margin: 10px 20px;
      border-bottom: 1px solid $color-white;
      font-size: $font-size-primary;
      color: $color-white;

      div {
        width: 90%;
        height: 24px;
        float: left;
        line-height: 20px;
      }

      i {
        font-size: $font-size-regular;
        float: left;
      }
    }
  }

  .date-select {
    margin: 0 20px;

    div {
      float: left;
      width: 60px;
      height: 20px;
      margin-right: 10px;
      text-align: center;
      line-height: 22px;
      color: $color-white;
      font-size: $font-size-special;
      background-color: rgba($color-white, .2);
      border-radius: $border-radius;
    }
  }
</style>
