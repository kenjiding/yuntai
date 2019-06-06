<template>
  <ych-page>
    <page-header
      slot="header"
      left-arrow
      title="会员页"
      @click-left="$router.back()"/>

    <div :class="$style['leaguer-info-container']">
      <div :class="$style['leaguer-info-card']">
        <div :class="$style['leaguer-info-card__top']">
          <img :src="leaguerInfo.HeadImageUrl" :class="$style['info-image']"/>
          <div :class="$style['info-title']">
            <p :class="$style['info-title__name']">{{leaguerInfo.LeaguerName}}</p>
            <p :class="$style['info-title__phone']">手机号: {{leaguerInfo.Telephone}}</p>
          </div>
        </div>
        <div :class="$style['leaguer-info-card__bottom']">
          <div :class="$style['leaguer-balance-item']">
            <p :class="$style['leaguer-balance-item__label']">累计消费(元)</p>
            <p :class="$style['leaguer-balance-item__value']">
              {{leaguerInfo.AccumulativeConsumption | number}}
            </p>
          </div>

          <div :class="$style['leaguer-balance-item']">
            <p :class="$style['leaguer-balance-item__label']">游戏币余额(币)</p>
            <p :class="$style['leaguer-balance-item__value']">
              {{leaguerInfo.CurrencyBalance | number}}
            </p>
          </div>

          <div :class="$style['leaguer-balance-item']">
            <p :class="$style['leaguer-balance-item__label']">积分余额</p>
            <p :class="$style['leaguer-balance-item__value']">
              {{leaguerInfo.IntegralBalance | number}}
            </p>
          </div>
        </div>
      </div>

      <div :class="$style['leaguer-info-level']">
        <p>{{leaguerInfo.LevelName}}</p>
      </div>
    </div>

    <tabs type="card" :class="$style.tabs">
      <tab
        v-for="(value, key) in recordGroup"
        :key="key"
        :title="value">

        <record-list
          :action="key"/>
      </tab>
    </tabs>
  </ych-page>
</template>

<script>
import Leaguer from '@/api/Leaguer';
import PageHeader from '@/components/PageHeader';
import RecordList from './components/LeaguerRecordList';
import {
  Toast,
  Tab,
  Tabs,
} from 'vant';

export default {
  components: {
    PageHeader,
    Tab,
    Tabs,
    RecordList,
  },

  data: () => ({
    leaguerInfo: {},
    recordGroup: {
      consumptionRecord: '消费记录',
      exchangeRecord: '兑换记录',
      startRecord: '启动记录',
    },
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

      Leaguer.leaguerDetail({
        LeaguerID: this.$route.query.leaguerId,
      }).then(res => {
        this.hideLoadingToast();

        this.leaguerInfo = res;
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

  .leaguer-info-container {
    padding: 10px 25px;
    position: relative;
  }

  .leaguer-info-card {
    height: 150px;
    background-image: linear-gradient(0deg, #00b1ff 0%, #007aff 100%); // stylelint-disable-line
    border-radius: $border-radius-small;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__top {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }

    &__bottom {
      display: flex;
      padding: 10px 16px;
      justify-content: space-between;
    }
  }

  .info-image {
    width: 50px;
    height: 50px;
    border-radius: $border-radius-circle;
  }

  .info-title {
    flex: 1;
    margin-left: 10px;
    color: $color-white;

    &__name {
      font-size: $font-size-primary;
    }

    &__phone {
      color: rgba(255, 255, 255, .8);
      font-size: $font-size-special;
      margin-top: 8px;
    }
  }

  .leaguer-balance-item {
    color: $color-white;
    margin-right: 16px;

    &__label {
      color: rgba(255, 255, 255, .5);
      font-size: $font-size-special;
    }

    &__value {
      font-size: $font-size-primary;
      margin-top: 8px;
    }
  }

  .leaguer-info-level {
    position: absolute;
    top: 25px;
    right: 15px;
    background-color: #e0c48f; // stylelint-disable-line
    width: 60px;
    height: 30px;
    color: $color-white;
    font-size: $font-size-mini;
    line-height: 30px;
    text-align: center;
  }

  .tabs {
    .van-tab {
      border-color: $color-primary;
      color: $color-primary;
    }

    .van-tabs__nav--card {
      border-color: $color-primary;

      .van-tab.van-tab--active {
        background-color: $color-primary;
      }
    }

    .van-tab__pane {
      padding-top: 10px;
    }
  }
</style>
