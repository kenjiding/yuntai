<template>
  <div :class="$style['header']" :style="headerStyle">
    <div :class="$style['date-range-wrap']" v-if="!hiddenHeader">
      <div
        v-for="(item, index) in dateRangeItems"
        :key="'range_key_' + index"
        :class="[$style['date-range-item'], dateRangeActive === index && $style['active']]"
        @click="() => switchDateRange(item, index)">
        {{ item.title }}
      </div>
    </div>

    <div :class="$style['select-section-wrap']" v-if="!hiddenHeader">
      <div :class="$style['select-section-title']">时间：</div>
      <div :class="$style['select-section-value']" @click="startDatePickerVisible = true">
        <span>{{ startDate | date('YYYY-MM-DD') }}</span>
        <span v-if="startDate === endDate && startDate === new Date().setHours(0, 0, 0, 0)"> 今天</span>
        <span v-else-if="startDate === endDate"></span>
        <span v-else> 至 {{ endDate | date('YYYY-MM-DD') }}</span>
      </div>
      <div :class="$style['select-section-icon']">
        <van-icon name="search" />
      </div>
    </div>

    <div :class="$style['select-section-wrap']" @click="showTenantSelectPicker = true" v-if="!hiddenHeader && conditionItems.includes('tenant')">
      <div :class="$style['select-section-title']">门店：</div>
      <div :class="$style['select-section-value']">{{ selectedTenantName }}</div>
      <div :class="$style['select-section-icon']">
        <van-icon name="arrow-down" />
      </div>
    </div>

    <div :class="$style['select-section-wrap']" @click="showCashierSelectPicker = true" v-if="!hiddenHeader && conditionItems.includes('account')">
      <div :class="$style['select-section-title']">收银：</div>
      <div :class="$style['select-section-value']">{{ selectedCashierName }}</div>
      <div :class="$style['select-section-icon']">
        <van-icon name="arrow-down" />
      </div>
    </div>

    <div :class="$style['hidden-button']" v-if="!hiddenHeader" @click="$emit('close')">
      收起
    </div>

    <div :class="$style['hidden-wrap']" v-else @click="() => { $emit('open') }">
      <span>{{ startDate | date('YYYY-MM-DD') }}</span>
      <span v-if="startDate === endDate && startDate === new Date().setHours(0, 0, 0, 0)"> 今天</span>
      <span v-else-if="startDate === endDate"></span>
      <span v-else> 至 {{ endDate | date('YYYY-MM-DD') }}</span>
      <span style="font-weight: bold;"> · </span>
      <span v-if="conditionItems.includes('tenant')">{{ selectedTenantName }}</span>
      <span v-if="conditionItems.includes('account')">{{ selectedCashierName }}</span>

      <van-icon name="arrow-down" :class="$style['hidden-icon']"/>
    </div>

    <van-popup
      v-model="startDatePickerVisible"
      position='bottom'>
      <van-datetime-picker
        title="选择开始时间"
        :value="new Date(startDate)"
        @input="val => startDate = val.getTime()"
        type="date"
        @cancel="startDatePickerVisible = false"
        @confirm="startDatePickerVisible = false; endDatePickerVisible = true"/>
    </van-popup>
    <van-popup
      v-model="endDatePickerVisible"
      position='bottom'>
      <van-datetime-picker
        title="选择结束时间"
        :value="new Date(endDate)"
        @input="val => endDate = val.getTime()"
        type="date"
        :min-date="new Date(startDate)"
        @cancel="endDatePickerVisible = false"
        @confirm="handleDatePicker"/>
    </van-popup>

    <tenant-select-popup
      :visible="showTenantSelectPicker"
      @close="showTenantSelectPicker = false"
      @click="handleTenantSelected"/>

    <cashier-select-popup
      :visible="showCashierSelectPicker"
      @close="showCashierSelectPicker = false"
      @click="handleCashierSelected"/>
  </div>
</template>

<script>
import { Popup } from 'vant';
import TenantSelectPopup from './TenantSelectPopup';
import CashierSelectPopup from './CashierSelectPopup';

export default {
  components: {
    [Popup.name]: Popup,
    TenantSelectPopup,
    CashierSelectPopup,
  },

  props: {
    hiddenHeader: Boolean,
    tabActive: Boolean,
    conditionItems: {
      type: Array,
      default: () => ['tenant'],
    },
  },

  data: () => ({
    tabActiveChanged: false,
    startDate: new Date().setHours(0, 0, 0, 0), // 筛选条件，默认今天
    endDate: new Date().setHours(0, 0, 0, 0), // 筛选条件，默认今天
    startDatePickerVisible: false,
    endDatePickerVisible: false,
    showTenantSelectPicker: false,
    showCashierSelectPicker: false,
    dateRangeActive: 0,
    dateRangeItems: [{
      title: '今日',
      value: 'today',
    }, {
      title: '昨日',
      value: 'yesterday',
    }, {
      title: '本周',
      value: 'week',
    }, {
      title: '本月',
      value: 'month',
    }, {
      title: '上月',
      value: 'lastMonth',
    }],
    selectedTenantId: '00000000-0000-0000-0000-000000000000', // 筛选条件
    selectedTenantName: '全部门店', // 筛选条件
    selectedAccountId: '00000000-0000-0000-0000-000000000000',
    selectedCashierName: '线上销售',
  }),

  computed: {
    headerStyle () {
      if (this.hiddenHeader) {
        return {
          height: '45px',
        };
      } else {
        return null;
      }
    },
  },

  watch: {
    tabActive (value) {
      if (value && !this.tabActiveChanged) {
        this.tabActiveChanged = true;
        this.$emit('change', this.selectedTenantId, this.startDate, this.endDate);
      }
    },
  },

  created () {
    if (this.tabActive) {
      this.$emit('change', this.selectedTenantId, this.startDate, this.endDate);
    }
  },

  activated () {
    this.tabActiveChanged = false;
  },

  methods: {
    handleTenantSelected (tenantId, tenantName) {
      this.selectedTenantId = tenantId;
      this.selectedTenantName = tenantName;
      this.showTenantSelectPicker = false;
      this.$emit('change', this.selectedTenantId, this.startDate, this.endDate);
    },

    handleCashierSelected (accountId, accountName) {
      this.selectedAccountId = accountId;
      this.selectedCashierName = accountName;
      this.showCashierSelectPicker = false;
      this.$emit('change', this.selectedAccountId, this.startDate, this.endDate);
    },

    handleDatePicker () {
      this.endDatePickerVisible = false;
      this.dateRangeActive = -1;
      this.$emit('change', this.selectedTenantId, this.startDate, this.endDate);
    },

    switchDateRange (dateItem, index) {
      this.dateRangeActive = index;
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      switch (dateItem.value) {
      case 'today':
        this.startDate = today.getTime();
        this.endDate = this.startDate;
        break;
      case 'yesterday':
        this.startDate = today.setDate(today.getDate() - 1);
        this.endDate = this.startDate;
        break;
      case 'week':
        let weekFirstDay = (today.getDay() === 0 ? 7 : today.getDay()) - 1;
        this.startDate = today.getTime() - 3600 * 24 * weekFirstDay * 1000;
        this.endDate = today.getTime();
        break;
      case 'month':
        let monthFirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        this.startDate = monthFirstDay.getTime();
        this.endDate = today.getTime();
        break;
      case 'lastMonth':
        let lastMonthFirstDay = null;
        let lastMonthLastDay = null;
        if (today.getMonth() === 1) {
          lastMonthFirstDay = new Date(today.getFullYear() - 1, 12, 1);
          lastMonthLastDay = new Date(today.getFullYear() - 1, 12, 31);
        } else {
          lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          lastMonthLastDay = new Date(new Date(today.getFullYear(), today.getMonth(), 1) - 3600 * 24 * 1000);
        }
        this.startDate = lastMonthFirstDay.getTime();
        this.endDate = lastMonthLastDay.getTime();
        break;
      }

      console.log(this.startDate, this.endDate);
      if (this.conditionItems.includes('tenant')) {
        this.$emit('change', this.selectedTenantId, this.startDate, this.endDate);
      } else if (this.conditionItems.includes('account')) {
        this.$emit('change', this.selectedAccountId, this.startDate, this.endDate);
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .header {
    width: 100%;
    height: 175px;
    box-sizing: border-box;
    background-color: $color-white;
    z-index: 10;
    position: fixed;
    top: 44px;
  }

  .content {
    padding-bottom: 80px;
    box-sizing: border-box;
    padding-top: 130px;
  }

  .date-range-wrap {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid $border-color;
    padding: 0 10px;

    .date-range-item {
      width: 50px;
      height: 25px;
      background-color: #f0efef; // stylelint-disable
      color: $font-color-secondary;
      border-radius: 13px;
      line-height: 25px;
      text-align: center;
      font-size: 14px;

      &.active {
        background-color: $color-primary;
        color: $color-white;
      }
    }
  }

  .select-section-wrap {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    font-size: 14px;
    color: $font-color-secondary;
    border-bottom: 1px solid $border-color;

    .select-section-title {
      width: 50px;
    }

    .select-section-value {
      flex: 1;
      color: $color-primary;
    }
  }

  .hidden-button {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: $color-primary;
  }

  .hidden-wrap {
    position: relative;
    color: $color-primary;
    line-height: 45px;
    text-align: center;
    font-size: 14px;

    .hidden-icon {
      position: absolute;
      right: 15px;
      top: 12px;
      color: $font-color-secondary;
    }
  }
</style>
