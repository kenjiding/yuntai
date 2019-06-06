<template>
  <ych-page>
    <page-header
      left-arrow
      title="搜索结果"
      @click-left="$router.back()"/>

    <div :class="$style['search-container']" @click="showSearchPage = true">
      <div :class="$style['search-bar']">
        <van-icon name="search"/>
        <p :class="$style['search-bar__value']">{{searchKey}}</p>
      </div>
    </div>

    <list
      @load="asyncGetLeaguerList"
      :finished="isLeaguerListFinished"
      :offset="100"
      :loading="isLoadingLeaguerList">

      <leaguer-of-tenant-item
        @click.native="$router.push({path: '/leaguer-detail', query: {leaguerId: leaguerInfo.ID}})"
        v-for="leaguerInfo in leaguerList"
        :key="leaguerInfo.ID"
        :leaguer-info="leaguerInfo"
        show-leaguer-level/>
    </list>

    <search-page
      :visible.sync="showSearchPage"
      search-placeholder="请输入会员ID/昵称/手机号码查询"
      @search="handleSearch"/>
  </ych-page>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import PageHeader from '@/components/PageHeader';
import LeaguerOfTenantItem from './components/LeaguerOfTenantItem';
import SearchPage from '@/components/SearchPage';

import {
  List,
} from 'vant';

export default {
  components: {
    PageHeader,
    LeaguerOfTenantItem,
    List,
    SearchPage,
  },

  data: () => ({
    searchKey: '',
    isLeaguerListFinished: false,
    isLoadingLeaguerList: true,
    leaguerList: [],
    pageIndex: 1,
    showSearchPage: false,
  }),

  created () {
    this.searchKey = this.$route.query.searchKey;
    this.asyncGetLeaguerList();
  },

  methods: {
    asyncGetLeaguerList () {
      this.isLoadingLeaguerList = true;

      Leaguer.leaguerList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
        Sort: 'Currency',
        OrderAsc: true,
        SearchKey: this.searchKey,
        TenantID: this.$route.query.tenantId,
        LevelID: '',
      }).then(res => {
        this.leaguerList = this.leaguerList.concat(res.Data);
        this.isLoadingLeaguerList = false;
        if (this.leaguerList.length === 0) {
          this.isLeaguerListFinished = true;
        }
      });
    },

    handleSearch (searchKey) {
      this.searchKey = searchKey;
      this.pageIndex = 1;
      this.leaguerList = [];
      this.isLoadingLeaguerList = true;
      this.isLeaguerListFinished = false;

      this.asyncGetLeaguerList();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .search-container {
    padding: 10px 16px;
  }

  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    background-color: rgba(142, 142, 147, .24);
    border-radius: $border-radius-small;
    color: $font-color-regular;
    padding-left: 16px;

    &__value {
      flex: 1;
      margin-left: 10px;
      font-size: $font-size-special;
    }
  }
</style>
