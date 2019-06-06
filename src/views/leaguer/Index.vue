<template>
  <ych-page>
    <page-header
      slot="header"
      title="会员总数"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="onSettingsClicked">
      <van-icon name="shezhi" slot="right" :class="$style['header-icon']"/>
    </page-header>

    <div :class="$style['header-container']">
      <div :class="$style['leaguer-count']">
        {{leaguerCount.LeaguerCount | number}}
        <span :class="$style['leaguer-count--value']">人</span>
      </div>

      <div :class="$style['level-container']">
        <div
          v-for="level in leaguerLevelList"
          :key="level.ID"
          :class="$style['level-item']">
          <p :class="$style['level-item--title']">
            {{level.LevelName}}
            <span :class="$style['level-item--subtitle']">(人)</span>
          </p>
          <p :class="$style['level-item--value']">
            {{level.LeaguerCount | number}}
          </p>
        </div>
      </div>
    </div>

    <div :class="$style['tenant-container']">
      <div :class="$style['container-title']">会员分布</div>

      <list
        @load="asyncGetTenantList"
        :finished="isTenantListFinish"
        :offset="50"
        :loading="loadingTenantList">

        <div
          v-for="tenantInfo in tenantList"
          :key="tenantInfo.TenantID"
          :class="$style['tenant-list-item']"
          @click="$router.push({path: '/leaguer-of-tenant', query: {tenantId: tenantInfo.TenantID, tenantName: tenantInfo.TenantName}})">
          <van-icon name="mendian" :class="$style['tenant-list-item--icon']"/>
          <div :class="$style['tenant-list-item--titles']">
            <p :class="$style['tenant-list-item--title']">{{tenantInfo.TenantName}}</p>
            <p :class="$style['tenant-list-item--subtitle']">会员人数: {{tenantInfo.LeaguerCount}}</p>
          </div>
          <van-icon name="arrow" :class="$style['tenant-list-item--arrow']"/>
        </div>
      </list>
    </div>
  </ych-page>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import PageHeader from '@/components/PageHeader';
import {
  Toast,
  List,
} from 'vant';
export default {
  components: {
    PageHeader,
    List,
  },

  data: () => ({
    loadingTenantList: false,
    isTenantListFinish: false,
    leaguerCount: {},
    leaguerLevelList: [],
    tenantList: [],
    pageIndex: 1,
  }),

  created () {
    this.asyncGetData();
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中',
        duration: 0,
        mask: true,
      });

      this.asyncGetCount();
      this.asyncGetLeaguerLevel();
      // this.asyncGetTenantList();
    },

    asyncGetCount () {
      Leaguer.leaguerCount().then(res => {
        this.leaguerCount = res;
      });
    },

    asyncGetLeaguerLevel () {
      Leaguer.leaguerLevel().then(res => {
        this.hideLoadingToast();
        this.leaguerLevelList = res.Data;
      });
    },

    asyncGetTenantList () {
      this.loadingTenantList = true;

      Leaguer.tenantList({
        PageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        if (res.Data.length === 0) {
          this.isTenantListFinish = true;
          this.loadingTenantList = false;
          return;
        }
        this.tenantList = this.tenantList.concat(res.Data);
        this.loadingTenantList = false;
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },

    onSettingsClicked () {
      this.$router.push('leaguer-level');
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .header-container {
    width: 375px;
    height: 130px;
    background-image: linear-gradient(0deg, #00b1ff 0%, #007aff 100%); // stylelint-disable-line
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    box-sizing: border-box;
    flex-direction: column;
  }

  .header-icon {
    margin-top: -3px;
  }

  .leaguer-count {
    color: $color-white;
    font-size: $font-size-bigger;
    margin: 0 auto;

    &--value {
      font-size: $font-size-primary;
    }
  }

  .level-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    overflow-x: scroll;
    padding-left: 16px;
  }

  .level-item {
    min-width: 110px;
    height: 56px;
    color: $color-white;

    &--title {
      font-size: $font-size-mini;
      color: rgba(255, 255, 255, .5);
    }

    &--value {
      font-size: $font-size-primary;
      margin-top: 10px;
    }
  }

  .tenant-container {
    margin-top: 15px;
    box-sizing: border-box;

    .container-title {
      font-size: $font-size-special;
      color: $font-color-primary;
      margin-bottom: 10px;
      padding-left: 16px;
    }

    .tenant-list-item {
      padding: 0 0 0 16px;
      height: 64px;
      background-color: $color-white;
      font-size: $font-size-primary;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $border-color;

      &:active {
        background-color: $color-bg-primary;
      }

      &--titles {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      &--title {
        font-size: $font-size-primary;
        color: $font-color-primary;
      }

      &--subtitle {
        color: $font-color-placeholder;
        font-size: $font-size-special;
        margin-top: 10px;
      }

      &--icon {
        font-size: $font-size-regular;
        color: $color-primary;
        margin-top: 15px;
        margin-right: 10px;
      }

      &--arrow {
        color: $color-info;
        margin-top: 15px;
        margin-right: 10px;
      }
    }
  }

</style>
