<template>
  <ych-page>
    <div :class="$style.wrap">
      <div :class="$style.header">
        <div :class="$style['header-top']">
          <img
            v-if="leaguerInfo.HeadImgUrl"
            :src="leaguerInfo.HeadImgUrl"
            :class="$style['header-top__icon']"/>
          <img
            v-else
            src="../../assets/img/level-default.png"
            :class="$style['header-top__icon']"/>

          <div :class="$style['header-top__title']">
            <p :class="$style['header-top__name']">
              {{ splitLevelName === 'L0' ? '会员卡' : leaguerInfo.NickName}}
              <van-icon
                :name="sexName(leaguerInfo.Sex).name"
                :style="{backgroundColor: sexName(leaguerInfo.Sex).bgcolor}"
                :class="$style.iconBgcolor" />
                <img
                  v-if="splitLevelName === 'L1'"
                  src="../../assets/img/V1.png"
                  :class="$style['header-top__levelicon']"/>
                <img
                  v-else-if="splitLevelName === 'L2'"
                  src="../../assets/img/V2.png"
                  :class="$style['header-top__levelicon']"/>
                <img
                  v-else-if="splitLevelName === 'L3'"
                  src="../../assets/img/V3.png"
                  :class="$style['header-top__levelicon']"/>
                <img
                  v-else-if="splitLevelName === 'L4'"
                  src="../../assets/img/V4.png"
                  :class="$style['header-top__levelicon']"/>
                <img
                  v-else-if="splitLevelName === 'L5'"
                  src="../../assets/img/V5.png"
                  :class="$style['header-top__levelicon']"/>
            </p>

            <p :class="$style['header-top__phone']">
              {{ splitLevelName === 'L0' ?
              ('卡号：'  + leaguerInfo.CardNumber || '') : ('手机号:' + leaguerInfo.Telephone || '')}}
            </p>
          </div>
        </div>
        <div :class="$style['header-bottom']">
          <div :class="$style['header-bottom__item']">
            <p>累计消费/元</p>
            <p>{{ leaguerInfo.TotalConsumption }}</p>
          </div>
          <div :class="$style['header-bottom__item']" @click="goToCurrenceLog">
            <p>游戏币余额/枚</p>
            <p>{{ leaguerInfo.CoinSurplus }}</p>
          </div>
          <div :class="$style['header-bottom__item']" @click="goToIntegralLog">
            <p>积分余额/个</p>
            <p>{{ leaguerInfo.IntegrateSurplus }}</p>
          </div>
        </div>

        <div
          :class="$style['card-num']"
          @click="luckyValueMethods">
          <p>会员卡：{{ leaguerInfo.CartCount }}</p>
          <p
            v-show="luckyValueShow >= 5">幸运值：{{ leaguerInfo.LuckyValue }}</p>
        </div>
      </div>

      <tabs @tab="tabChange"/>

      <div :class="$style['record-content']">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad">
          <recordInfo
            v-for="item in tabTargetData"
            :key="item.OrderNumber"
            :record-info="item"
            :record-type="recordType"/>
        </van-list>
      </div>
    </div>

  </ych-page>
</template>

<script>
import { List, Toast } from 'vant';
import LeaguerManage from '@/api/LeaguerManage';
import Leaguer from '@/api/Leaguer';
import Tabs from './components/Tabs';
import recordInfo from './components/RecordInfo';

export default {
  name: '',

  data (vm) {
    return {
      leaguerInfo: {},
      logFormData: {
        LeaguerID: vm.$route.query.ID,
        PageIndex: 0,
        PageSize: 10,
        UserID: vm.$route.query.ID,
      },
      tabTargetData: [],
      recordType: 'expensesRecord',
      loading: false,
      finished: false,
      total: 0,
      luckyValueShow: 0,
    };
  },

  computed: {
    splitLevelName () {
      return this.leaguerInfo.LevelIndex && this.leaguerInfo.LevelIndex.split('.')[0];
    },
  },

  components: {
    Tabs,
    recordInfo,
    [List.name]: List,
  },

  created () {
    this.getMemberInfoData();
  },

  methods: {
    goToCurrenceLog () {
      this.$router.push({
        path: '/member-currenceLog',
        query: {
          leaguerID: this.$route.query.ID,
        },
      });
    },
    goToIntegralLog () {
      this.$router.push({
        path: '/member-integralLog',
        query: {
          leaguerID: this.$route.query.ID,
        },
      });
    },
    luckyValueMethods () {
      this.luckyValueShow++;
    },

    onLoad () {
      this.loading = true;
      this.logFormData.PageIndex++;

      let tabObj = {
        expensesRecord: this.getExpensesRecordLog,
        exchangeRecord: this.getExchangeRecordLog,
        startRecord: this.getStartRecordLog,
        lotteryRecord: this.getLotteryRecordLog,
      };

      tabObj[this.recordType] && tabObj[this.recordType]();
    },
    tabChange (val) {
      this.logFormData.PageIndex = 0;
      this.finished = false;
      this.tabTargetData = [];
      this.recordType = val;

      Toast.loading({
        message: '加载中...',
        mask: true,
        duration: 0,
      });

      this.onLoad();
    },
    getExpensesRecordLog () {
      Leaguer.consumptionRecord(this.logFormData).then((res) => {
        Toast.clear();
        this.concatLogData(res);
      });
    },
    getExchangeRecordLog () {
      Leaguer.exchangeRecord(this.logFormData).then((res) => {
        Toast.clear();
        this.concatLogData(res);
      });
    },
    getStartRecordLog () {
      Leaguer.startRecord(this.logFormData).then((res) => {
        Toast.clear();
        this.concatLogData(res);
      });
    },
    getLotteryRecordLog () {
      LeaguerManage.getWinningRecords(this.logFormData).then((res) => {
        Toast.clear();
        this.concatLogData(res);
      }, () => { this.loading = false; });
    },

    concatLogData (res) {
      this.loading = false;

      this.tabTargetData = this.tabTargetData.concat(res.Data);
      this.total = res.Total;

      if (this.tabTargetData.length >= res.Total) {
        this.finished = true;
      }
    },

    sexName (val) {
      let className = {
        Man: {name: 'xingbienanxianxing', bgcolor: '#077AFF'},
        Woman: {name: 'xingbienvxianxing', bgcolor: 'red'},
        Unknown: {name: '', bgcolor: ''},
      };
      return className[val || 'Unknown'];
    },
    getMemberInfoData () {
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载...',
        mask: true,
      });
      LeaguerManage.getLeaguerCensusInfo({
        LeaguerID: this.$route.query.ID,
      }).then((res) => {
        this.leaguerInfo = res;
        Toast.clear();
      });
    },
  },

};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.card-num {
  width: 100px;
  height: 90px;
  position: absolute;
  top: 23px;
  right: 10px;
  text-align: center;
  /* stylelint-disable-next-line */
  color: #96d7ff;
  font-size: $font-size-special;

  p {
    margin-bottom: 10px;
  }
}

.record-content {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  top: 220px;
  bottom: 0;
  left: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.header-bottom {
  display: flex;
  padding: 30px 0 0;

  &__item {
    flex: 1;
    /* stylelint-disable-next-line */
    border-right: 1px solid #63c6fe;
    padding: 0 10px;

    p {
      font-size: $font-size-mini;
      margin: 5px 0;
      width: 90px;
      /* stylelint-disable-next-line */
      color: #96d7ff;
      text-align: center;

      &:nth-child(2) {
        font-size: $font-size-secondary;
        /* stylelint-disable-next-line */
        color: #f4c913;

        @include ellipsis(1);
      }
    }

    &:last-child {
      border: none;
    }
  }
}

.iconBgcolor {
  width: 23px;
  height: 15px;
  text-align: center;
  border-radius: $border-radius-small;
  font-size: $font-size-mini;
  color: $color-white;
}

.wrap {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  height: 100%;
}

.header {
  width: 100%;
  height: 145px;
  padding: 10px 0;
  background: url('../../assets/img/member-background.png');
  border-radius: $border-radius-small;
}

.header-top {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;

  &__levelicon {
    width: 45px;
    height: 17px;
    vertical-align: middle;
    margin-left: 5px;
  }

  &__icon {
    width: 55px;
    height: 55px;
    border-radius: $border-radius-circle;
  }

  &__title {
    flex: 1;
    margin-left: 10px;
  }

  &__name {
    font-size: $font-size-special;
    color: $color-white;
  }

  &__phone {
    margin-top: 8px;
    /* stylelint-disable-next-line */
    color: #96d7ff;
    font-size: $font-size-mini;
  }
}

</style>
