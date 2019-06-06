<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      :title="$route.query.tenantName"
      @click-left="$router.back()"
      @click-right="showSearchPage = true">
      <van-icon name="search" slot="right" :class="$style['header-icon']"/>
    </page-header>

    <div :class="$style['header-container']">
      <div :class="$style['header-container__leaguer-count']">
        {{516487913 | number}}
        <span :class="$style['header-container__value']">位会员</span>
      </div>

      <div :class="$style['header-container__leaguer-recharge']">
        会员累计充值(元): {{12345678 | number('0,0.00')}}
      </div>
    </div>

    <div :class="$style['nav-container']" :style="{'margin-left': paddingLeftVw}">
      <div
        v-for="(level, index) in levelList"
        :key="level.ID"
        :class="$style['level-item']"
        @click="switchPage(index)">
        <div>{{level.LevelName}}</div>
        <div>{{level.LeaguerCount | number}} 人</div>
      </div>
    </div>

    <div :class="$style['sort-container']">
      <div :class="[
          $style['sort-container__item'],
          {[$style['sort-container--active']]: sortActive === 0}
        ]"
        @click="sortActive = 0">
        会员余额
      </div>
      <div :class="[
          $style['sort-container__item'],
          {[$style['sort-container--active']]: sortActive === 1}
        ]"
        @click="sortActive = 1">
        会员积分
      </div>
    </div>

    <list
      @load="asyncGetLeaguerList"
      :finished="isLeaguerListFinished"
      :offset="100"
      :loading="isLoadingLeaguerList"
      :class="$style.listWrap">

      <leaguer-of-tenant-item
        @click.native="$router.push({path: '/leaguer-detail', query: {leaguerId: leaguerInfo.ID}})"
        v-for="leaguerInfo in leaguerList"
        :key="leaguerInfo.ID"
        :leaguer-info="leaguerInfo"/>
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
  Toast,
  List,
} from 'vant';

export default {
  components: {
    PageHeader,
    List,
    LeaguerOfTenantItem,
    SearchPage,
  },

  data: () => ({
    levelList: [],
    activeIndex: 0,
    currentLevelId: '',
    paddingLeft: 40,
    sortActive: 0,
    isLeaguerListFinished: false,
    isLoadingLeaguerList: true,
    leaguerList: [],
    pageIndex: 1,
    sortName: 'Currency',
    showSearchPage: false,
  }),

  computed: {
    paddingLeftVw () {
      return this.paddingLeft / 375 * 100 + 'vw';
    },
  },

  created () {
    this.asyncGetData();
  },

  watch: {
    activeIndex () {
      this.pageIndex = 1;
      this.leaguerList = [];
      this.isLeaguerListFinished = false;
      this.isLoadingLeaguerList = true;
      this.asyncGetLeaguerList();
    },

    sortActive (newVal) {
      this.pageIndex = 1;
      this.leaguerList = [];
      this.isLeaguerListFinished = false;
      this.isLoadingLeaguerList = true;
      if (newVal === 0) {
        this.sortName = 'Currency';
      } else {
        this.sortName = 'Integral';
      }
      this.asyncGetLeaguerList();
    },
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      this.asyncGetLevelList();
    },

    asyncGetLevelList () {
      Leaguer.leaguerLevel({
        TenantID: this.$route.query.tenantId,
      }).then(res => {
        this.hideLoadingToast();
        this.levelList = res.Data;
        this.currentLevelId = this.levelList[0].ID;

        // 加载完成等级列表，拥有等级ID才可以获取会员列表
        this.asyncGetLeaguerList();
      });
    },

    asyncGetLeaguerList () {
      this.isLoadingLeaguerList = true;

      Leaguer.leaguerList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
        Sort: this.sortName,
        OrderAsc: true,
        SearchKey: '',
        TenantID: this.$route.query.tenantId,
        LevelID: this.currentLevelId,
      }).then(res => {
        this.isLoadingLeaguerList = false;
        this.leaguerList = this.leaguerList.concat(res.Data);
        if (res.Data.length === 0) {
          this.isLeaguerListFinished = true;
        }
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },

    switchPage (pageIndex) {
      this.paddingLeft += 305 * (this.activeIndex - pageIndex);
      this.activeIndex = pageIndex;
      this.currentLevelId = this.levelList[pageIndex].ID;
    },

    handleSearch (searchKey) {
      this.$router.push({
        path: '/search-result-for-leaguer-of-tenant',
        query: {
          tenantId: this.$route.query.tenantId,
          searchKey: searchKey,
        },
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .listWrap {
    position: absolute;
    top: 260px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .header-icon {
    margin-top: -3px;
  }

  .header-container {
    width: 375px;
    height: 130px;
    background-image: linear-gradient(0deg, #00b1ff 0%, #007aff 100%); // stylelint-disable-line
    display: flex;
    align-items: center;
    padding-top: 15px;
    box-sizing: border-box;
    flex-direction: column;
    color: $color-white;

    &__leaguer-count {
      font-size: $font-size-bigger;
    }

    &__value {
      font-size: $font-size-primary;
      color: rgba(255, 255, 255, .5);
    }

    &__leaguer-recharge {
      font-size: $font-size-special;
      margin-top: 16px;
    }
  }

  .nav-container {
    display: flex;
    overflow-x: hidden;
    margin-top: -30px;
    margin-left: 40px;
    transition: all .3s;
    height: 70px;
  }

  .level-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    width: 295px;
    height: 60px;
    background-color: #e0c48f; // stylelint-disable-line
    border-radius: $border-radius-small;
    color: $color-white;
    font-size: $font-size-special;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    margin-right: 10px;
  }

  .sort-container {
    background-color: $color-white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 295px;
    height: 35px;
    margin: 0 auto;
    border-radius: $border-radius-small;
    color: $font-color-placeholder;
    font-size: $font-size-special;
    margin-bottom: 10px;

    &__item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__icon {
      border-width: 5px;
      border-style: solid;
      border-color: transparent;
      border-top-color: $font-color-placeholder;
      margin-left: 5px;
      margin-top: 5px;
    }

    &--active.sort-container__item {
      color: $font-color-regular;
    }

    &--active > .sort-container__icon {
      border-top-color: $font-color-regular;
    }
  }
</style>
