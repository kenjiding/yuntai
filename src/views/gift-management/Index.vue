<template>
  <ych-page>
    <div slot="header">
      <page-header
        left-arrow
        title="礼品管理"
        @click-left="$router.go(-1)"/>

        <searchItem
          font-color="#999999"
          back-ground="#f6f6f6"
          placeholder="可搜索设备编码/设备唯一码"
          @search="searchHandle"/>

      <van-cell
        :border="false"
        :class="$style.top"
        @click="popupVisiable = true">
        <van-icon slot="icon" name="mendian"></van-icon>
        <p slot="title">
          {{currentTenantName}}
          <span v-show="isAll">
            {{'('+tenantAmount+'家)'}}
          </span>
        </p>
        <p>{{allDeviceNum}}台</p>
        <van-icon
          slot="right-icon"
          name="xiangyou">
        </van-icon>
      </van-cell>
    </div>

    <gift-device-list
      :id="currentTenantID"
      :search-key="searchKey"
      @device-acount="deviceAcount"
      ref="giftDeviceList">
    </gift-device-list>

    <tenant-list
      :list-show="popupVisiable"
      @refTenantAmount="getTenantAmount"
      @cell-click="handleTenantClicked"
      @close="popupVisiable = false">
    </tenant-list>
  </ych-page>
</template>

<script>
// import { Toast } from 'vant';
import PageHeader from '@/components/PageHeader';
import TenantList from './components/TenantList';
import GiftDeviceList from './components/GiftDeviceList';
import searchItem from '@/views/member/components/SearchItem';
//import GiftManagementApi from '@/api/GiftManagement';

export default {
  components: {
    PageHeader,
    TenantList,
    GiftDeviceList,
    searchItem,
  },

  data: () => ({
    currentTenantName: '全部门店',
    currentTenantID: '00000000-0000-0000-0000-000000000000',
    popupVisiable: false,
    tenantAmount: 0,
    allDeviceNum: '',
    searchKey: '',
  }),

  computed: {
    isAll () {
      return this.currentTenantID === '00000000-0000-0000-0000-000000000000';
    },
    // tenantAmount () {
    //   return 0;
    // },
  },

  methods: {
    searchHandle (val) {
      this.searchKey = val;
      this.$nextTick(() => (this.$refs.giftDeviceList.onRefresh()));
    },
    deviceAcount (val) {
      this.allDeviceNum = val;
    },
    handleTenantClicked (tenantId, tenantName) {
      this.popupVisiable = false;
      this.currentTenantID = tenantId;
      this.currentTenantName = tenantName;
      this.$nextTick(() => (this.$refs.giftDeviceList.onRefresh()));
    },
    getTenantAmount (val) {
      this.tenantAmount = val;
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.top {
  color: $color-primary;
  font-size: $font-size-primary;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
  height: 60px;
  padding: 18px 5px 16px 15px;
  margin-bottom: 5px;

  .van-icon {
    margin-top: 1px;
    font-size: $font-size-secondary;
  }

  .van-cell__title {
    line-height: 24px;
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
      color: $font-color-regular;
    }
  }

  .van-cell__value {
    padding-right: 10px;
    color: $font-color-regular;
  }

  .van-icon-xiangyou {
    color: $color-info;
    font-size: $font-size-secondary;
  }
}
</style>
