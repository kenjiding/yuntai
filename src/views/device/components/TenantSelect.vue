<template>
  <div :class="$style['tenant-select-container']">
    <page-header
      slot="header"
      left-arrow
      title="门店选择"
      @click-left="$emit('close')">
    </page-header>

    <!-- <div
      :class="$style['search-box']">
      <van-icon name="search" :class="$style['search-box--icon']"/>
      <div
        :class="$style['search-box--key']"
        @click="showSearchPage = true">
        {{searchKey || '请输入门店编码或者门店名称搜索'}}
      </div>
      <van-icon
        name="close"
        :class="$style['search-box--icon']"
        @click="clearSearchKey"/>
    </div> -->
    <Search-item
      @click.native="showSearchPage = true"
      :search-value="searchKey"
      :style="{backgroundColor: '#fff'}"
      name="请输入门店名称"></Search-item>

    <list
      :class="$style['tenant-list']"
      v-model="loading"
      :finished="finished"
      @load="asyncGetTenantList">

      <div
        :class="[
          $style['tenant-item'],
          {
            [$style['tenant-item_active']]: currentActive === index
          }
        ]"
        v-for="(tenantInfo, index) in tenantList"
        :key="tenantInfo.ID"
        @click="selectSave(index)">
        <van-icon
          name="mendian"
          :class="$style['tenant-item--icon']"/>

        <span>{{tenantInfo.Name}}</span>
      </div>
    </list>

    <search-page
      :visible.sync="showSearchPage"
      search-placeholder="请输入门店名称或者门店编码"
      @search="handleSearch"/>
  </div>
</template>

<script>
/**
 * 选择门店列表页面
 */
import Tenant from '@/api/Tenant';
import PageHeader from '@/components/PageHeader';
import SearchPage from '@/components/SearchPage';
import SearchItem from '@/views/goods/components/SearchItem';

import {
  List,
} from 'vant';

export default {
  components: {
    PageHeader,
    List,
    SearchPage,
    SearchItem,
  },

  data: () => ({
    loading: false,
    finished: false,
    tenantList: [],
    currentActive: 0,
    showSearchPage: false,
    searchKey: '',
    pageIndex: 1,
  }),

  props: {
    defaultTenant: String,
  },

  methods: {
    selectSave (index) {
      this.currentActive = index;
      this.$emit('save', this.tenantList[this.currentActive]);
    },
    asyncGetTenantList () {
      Tenant.tenantList({
        TenantKey: this.searchKey,
        PageIndex: this.pageIndex,
        PageSize: 100,
      }).then(res => {
        //选中默认门店
        this.currentActive = res.Data.findIndex(item => item.ID === this.defaultTenant);

        this.tenantList = res.Data;
        this.finished = true;
        this.loading = false;
      });
    },

    clearSearchKey () {
      this.searchKey = '';
      this.tenantList = [];
      this.pageIndex = 1;
      this.asyncGetTenantList();
    },

    handleSearch (searchKey) {
      this.searchKey = searchKey;
      this.tenantList = [];
      this.pageIndex = 1;
      this.asyncGetTenantList();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .tenant-select-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .search-box {
      width: 340px;
      height: 35px;
      margin-left: 17px;
      line-height: 35px;
      background-color: $color-info;
      padding: 0 16px;
      box-sizing: border-box;
      margin-top: 16px;
      border-radius: $border-radius;
      color: $font-color-regular;
      display: flex;
      justify-content: center;
      align-items: center;

      &--key {
        flex: 1;
      }

      &--icon {
        width: 20px;
        height: 35px;
        line-height: 35px;
        margin-top: -3px;
        font-size: $font-size-primary;
      }
    }

    .tenant-list {
      flex: 1;
      overflow-y: auto;
      margin-top: 16px;
    }

    .tenant-item {
      width: 340px;
      height: 50px;
      margin-left: 17px;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      margin-bottom: 8px;
      line-height: 50px;
      font-size: $font-size-primary;
      padding: 0 16px;
      box-sizing: border-box;
      color: $font-color-secondary;

      span {
        @include ellipsis(1);

        width: 90%;
      }

      &--icon {
        margin-right: 8px;
        margin-top: 15px;
        display: block;
        float: left;
        font-size: $font-size-secondary;
      }

      &_active {
        border: 1px solid $color-primary;

        .tenant-item--icon {
          color: $color-primary;
        }
      }
    }
  }
</style>
