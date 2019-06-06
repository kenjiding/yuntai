<template>
  <ych-page>
    <page-header
      slot="header"
      title="设备管理"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>
    <div :class="$style.searchWrap">
      <search-item
        :search-value="searchKey"
        inputTitle="可搜索设备编号"
        @click.native="showSearchPage = true">
      </search-item>
    </div>

    <van-cell-group :class="$style['device-list']">
      <van-list
          v-model="listLoading"
          :finished="listFinished"
          @load="getDeviceInfoData"
          :offset="500"
        >
          <van-cell
            v-for="tenantInfo in tenantList"
            :key="tenantInfo.ID"
            is-link
            :title="tenantInfo.Name"
            @click="$router.push({path: '/tenant-detail', query: { tenantId: tenantInfo.ID, searchKey: searchKey }})">
            <van-icon
              name="mendian"
              slot="icon"
              :class="$style['cell-icon']"/>

            <div
              :class="$style['cell-value']">
              离线<span :class="{[$style.spanColor]: tenantInfo.OfflineDeviceCount > 0}">{{tenantInfo.OfflineDeviceCount}}</span>/{{tenantInfo.OfflineDeviceCount+tenantInfo.OnlineDeviceCount}}台
            </div>
          </van-cell>
      </van-list>
    </van-cell-group>

    <search
      :visible.sync="showSearchPage"
      search-placeholder="可搜索设备编号"
      @search="handleSearch"></search>

    <div :class="$style['add-device-btn']" @click="scanQrCode">注册设备</div>

    <ych-dialog
      :value="dialogValue"
      @cancel=" dialogValue =false"
      @confirm="dialogConfirm"
      title="输入设备编码">
      <div :class="$style['dialog-content']">
        <p>请填写设备编码</p>
        <van-field
          v-model="inputGoodsGroupName"
          type="tel" />
      </div>
    </ych-dialog>

  </ych-page>
</template>

<script>
/**
 * 门店列表，场地列表
 */
import Tenant from '@/api/Tenant';
import PageHeader from '@/components/PageHeader';
import search from '@/components/SearchPage';
import searchItem from '@/views/packge/components/SearchItem';

import {
  Toast,
  List,
} from 'vant';

export default {
  name: 'DeviceList',
  components: {
    PageHeader,
    search,
    searchItem,
    [List.name]: List,
  },

  data: () => ({
    searchKey: '',
    tenantList: [],
    pageIndex: 1,
    showSearchPage: false,
    listLoading: false,
    listFinished: false,
    dialogValue: false,
    inputGoodsGroupName: '',
  }),

  created () {
    this.asyncGetTenantList();
  },

  methods: {
    dialogConfirm () {
      if (!this.inputGoodsGroupName) {
        Toast('请输入设备编码');
      } else {
        this.goToDeviceRrgister(this.inputGoodsGroupName);
        this.dialogValue = false;
        this.inputGoodsGroupName = '';
      }
    },
    scanQrCode () {
      console.log('进入微信扫码的地方');
      this.$router.push({
        path: 'device-register-code',
      });
    },
    goToDeviceRrgister (number) {
      this.$router.push({
        path: '/device-register',
        query: {
          number,
        },
      });
    },
    asyncGetTenantList () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
      });
      this.getDeviceInfoData();
    },

    getDeviceInfoData () {
      this.listLoading = true;

      Tenant.tenantList({
        SearchKey: this.searchKey,
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        Toast.clear();
        this.listLoading = false;

        if (res.Data.length === 0) {
          this.listFinished = true;
          return;
        }

        this.tenantList = this.tenantList.concat(res.Data);
      });
    },

    handleSearch (value) {
      this.searchKey = value;
      this.pageIndex = 1;
      this.tenantList = [];
      this.getDeviceInfoData();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .dialog-content {
    width: 75%;
    margin: 0 auto 30px;

    p {
      padding: 20px 0 15px;
      color: $font-color-regular;
    }

    .van-cell {
      background-color: $color-bg-regular;
      border: solid 1px $border-color;
      border-radius: $border-radius-small;

      input {
        background-color: $color-bg-regular;
      }
    }
  }

  .add-device-btn {
    width: 100%;
    height: 50px;
    background-color: $color-primary;
    position: fixed;
    bottom: 0;
    font-size: $font-size-primary;
    text-align: center;
    line-height: 50px;
    color: $color-white;
  }

  .searchWrap {
    width: 100%;
    box-sizing: border-box;
    background-color: $color-white !important;
  }

  .device-list {
    position: absolute;
    top: 110px;
    bottom: 50px;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .van-list {
      padding-bottom: 40px;

      .van-cell {
        background-color: $color-white;
        height: 45px;

        &:last-of-type {
          margin-bottom: 100px;
        }

        .van-cell__title {
          @include ellipsis(1);

          flex: 2;
        }

        .van-cell__value {
          flex: 1;
        }
      }
    }
  }

  .cell-icon {
    font-size: $font-size-secondary;
    color: $color-primary;
    margin-right: 8px;
    display: inline-block;
    height: 20px;
  }

  .spanColor {
    color: $color-danger;
  }

  .cell-value {
    font-size: $font-size-special;

    @include ellipsis(1);
  }
</style>
