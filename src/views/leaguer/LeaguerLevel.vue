<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      title="会员等级"
      @click-left="$router.go(-1)"
      @click-right="$router.push('/leaguer-level-create')">
      <div slot="right">新增</div>
    </page-header>

    <div :class="$style['level-container']">
      <div
        v-for="(level, index) in levelList"
        :key="level.ID"
        :class="$style['level-item']"
        @click="$router.push({path: '/leaguer-level-create', query: {levelId: level.ID}})">

        <div :class="$style['level-item--left']">
          <p :class="$style['level-item--left-title']">{{level.LevelName}}</p>
          <p :class="$style['level-item--left-subtitle']">
            {{level.LeaguerCount | number}}
            <span :class="$style['level-item--left-value']">人</span>
          </p>
        </div>

        <div :class="$style['level-item--right']">
          {{index + 1}}
          <span :class="$style['level-item--right-value']">
            {{index > 2 ? 'th' : ['st', 'nd', 'rd'][index]}}
          </span>
        </div>
      </div>
    </div>
  </ych-page>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import PageHeader from '@/components/PageHeader';
import {
  Toast,
} from 'vant';

export default {
  components: {
    PageHeader,
  },

  data: () => ({
    levelList: [],
  }),

  created () {
    this.asyncGetData();
  },

  methods: {
    asyncGetData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Leaguer.leaguerLevel().then(res => {
        this.hideLoadingToast();

        this.levelList = res.Data;
      });
    },

    hideLoadingToast () {
      Toast.clear();
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .level-container {
    padding: 16px;
  }

  .level-item {
    height: 90px;
    background-image: linear-gradient(180deg,#edd3a0 0%,#c2a26a 100%); // stylelint-disable-line
    border-radius: $border-radius-small;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
    align-items: center;

    &--left {
      color: $color-white;

      &-title {
        font-size: $font-size-special;
      }

      &-subtitle {
        font-size: $font-size-secondary;
        margin-top: 16px;
      }

      &-value {
        font-size: $font-size-special;
        margin-left: 8px;
      }
    }

    &--right {
      font-size: 60px; // stylelint-disable-line
      color: rgba(255, 255, 255, .3);

      &-value {
        font-size: $font-size-bigger;
        margin-left: -10px;
        margin-right: 10px;
        width: 25px;
        display: inline-block;
      }
    }
  }
</style>
