<template>
  <ych-page>
    <div :class="$style.header">
      <searchItem
        @search="searchHandle"
        @input="inputChange"/>
      <div :class="$style['header-main']">
        <div @click="memberAcountMethod">
          <p>会员统计<span :class="$style.icon">》</span></p>
          <p>人数：<span :class="$style['header-span']">{{statisticsData.LeaguerCount}}</span>人</p>
          <p>余币：<span :class="$style['header-span']">{{statisticsData.Coins}}</span>枚</p>
        </div>
        <div>
          <p
            :class="$style['level-setting']"
            @click="$router.push('/level-manager')">
            <van-icon name="shezhi" />
            <span>等级权益</span>
          </p>
        </div>
      </div>
    </div>

    <div :class="$style['date-select']">
      <p>消费排行</p>
      <p>
        <span
          v-for="(key, value) of date"
          :key="value"
          :class="{[$style['active']]: tabActive === value,}"
          @click="changeDate(value)">
          {{ key }}
        </span>
      </p>
    </div>

    <div :class="$style['list-wrap']">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ListItem
          v-for="item in consumptionList"
          :key="item.ID"
          :leaguer-info="item"
          @click.native="goToMemberInfo(item.ID)">
          <div slot="right">
            <p>消费{{item.ConsumeCount}}笔</p>
            <p>共{{item.ConsumeMoney}}元</p>
          </div>
        </ListItem>
      </van-list>
    </div>
  </ych-page>
</template>

<script>
import { Search, List, Toast } from 'vant';
import LeaguerManage from '@/api/LeaguerManage';
import ListItem from './components/ListItem.vue';
import searchItem from './components/SearchItem.vue';

export default {
  name: '',

  components: {
    [Search.name]: Search,
    [List.name]: List,
    ListItem,
    searchItem,
  },

  data (vm) {
    return {
      value: '',
      listFormData: {
        PageIndex: 0,
        PageSize: 10,
        StartTime: vm.$_date().format('YYYY-MM-DD'),
        EndTime: vm.$_date().format('YYYY-MM-DD'),
        SearchKey: '',
      },
      statisticsData: {},
      date: {
        today: '今天',
        yesterday: '昨天',
        oneWeek: '本周',
        oneMonth: '本月',
        lastMonth: '上月',
      },
      tabActive: 'today',
      loading: false,
      finished: false,
      consumptionList: [],
      stopGetData: true,
    };
  },

  created () {
    this.getIndexData();
    this.onLoad();
  },

  methods: {
    inputChange (val) {
      this.listFormData.SearchKey = val;
    },
    searchHandle (val) {
      this.listFormData.StartTime = '';
      this.listFormData.EndTime = '';
      this.tabActive = '';
      this.listFormData.SearchKey = val;
      this.listFormData.PageIndex = 0;
      this.consumptionList = [];
      this.onLoad();
    },
    memberAcountMethod () {
      this.$router.push({
        path: '/member-acount',
        query: {},
      });
    },
    goToMemberInfo (id) {
      this.$router.push({
        path: '/member-info',
        query: {
          ID: id,
        },
      });
    },
    onLoad () {
      if (this.stopGetData) { //禁止重复点击,避免网络缓慢时造成多条重复请求的数据累加
        this.loading = true;
        this.stopGetData = false;
        this.listFormData.PageIndex++;

        LeaguerManage.consumptionRanking(this.listFormData).then((res) => {
          this.loading = false;
          this.stopGetData = true;

          this.consumptionList = this.consumptionList.concat(res.Data);

          if (this.consumptionList.length >= res.Total) {
            this.finished = true;
          }
        }, _ => {
          this.loading = false;
          this.stopGetData = true;
        });
      }
    },
    changeDate (value) {
      let dateFormat = 'YYYY-MM-DD';
      let startTime = '';
      let endTime = '';

      this.finished = false;
      this.listFormData.PageIndex = 0;
      this.tabActive = value;

      let dateObj = {
        today: () => {
          startTime = this.$_date().format(dateFormat);
          endTime = this.$_date().format(dateFormat);
        },
        yesterday: () => {
          startTime = this.$_date().subtract(1, 'day').format(dateFormat);
          endTime = this.$_date().subtract(1, 'day').format(dateFormat);
        },
        oneWeek: () => {
          let today = new Date();
          let weekFirstDay = (today.getDay() === 0 ? 7 : today.getDay()) - 1;
          let start = today.getTime() - 3600 * 24 * weekFirstDay * 1000;
          let end = today.getTime();

          startTime = this.$_date(start).format(dateFormat);
          endTime = this.$_date(end).format(dateFormat);
        },
        oneMonth: () => {
          startTime = this.$_date().startOf('month').format(dateFormat);
          endTime = this.$_date().endOf('month').format(dateFormat);
        },
        lastMonth: () => {
          startTime = this.$_date().startOf('month').subtract(1, 'month').format(dateFormat);
          endTime = this.$_date().endOf('month').subtract(1, 'month').format(dateFormat);
        },
      };

      value && dateObj[value]();
      this.listFormData.StartTime = startTime;
      this.listFormData.EndTime = endTime;

      this.consumptionList = [];
      this.onLoad();
    },
    getIndexData () {
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载...',
        mask: true,
      });
      LeaguerManage.getLeaguerStatistics().then((res) => {
        this.statisticsData = res;
        Toast.clear();
      });
    },
    onSearch () {
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.icon {
  font-size: $font-size-primary;
  margin-left: 5px;
  position: relative;
  top: -1px;
  /* stylelint-disable-next-line */
  color: #83ceff;
}

.list-wrap {
  position: absolute;
  top: 255px;
  bottom: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.active {
  background-color: $color-primary !important;
  color: $color-white !important;
}

.date-select {
  margin-top: 10px;
  height: 44px;
  background-color: $color-white;
  padding-left: 10px;

  p {
    float: left;
    height: 100%;

    &:nth-child(1) {
      line-height: 44px;
      width: 20%;
    }

    &:nth-child(2) {
      width: 80%;
      padding-top: 10px;
      box-sizing: border-box;
      padding-left: 10px;
    }
  }

  span {
    display: inline-block;
    text-align: center;
    line-height: 27px;
    font-size: $font-size-special;
    margin-right: 10px;
    width: 45px;
    height: 25px;
    color: $font-color-secondary;
    /* stylelint-disable-next-line */
    border-radius: 14px;
    /* stylelint-disable-next-line */
    background-color: #f0efef;
  }
}

.level-setting {
  height: 28px;
  border-right: none;
  text-align: center;
  border-radius: $border-radius-bigger 0 0 $border-radius-bigger;
  padding-top: 7px;
  margin-top: 30px;
  /* stylelint-disable-next-line */
  background-color: #83ceff;
  color: $color-white;
  font-size: $font-size-special;

  .van-icon-shezhi {
    margin-right: 6px;
    margin-top: 2px;
    font-size: $font-size-special;
  }
}

.header-span {
  /* stylelint-disable-next-line */
  color: #fdcb09;
  /* stylelint-disable-next-line */
  font-size: 25px;
  padding-right: 5px;
  max-width: 50% !important;
  vertical-align: text-bottom;

  @include ellipsis(1);
}

.header {
  width: 100%;
  height: 170px;
  padding: 10px 0;
  background: url('../../assets/img/member-background.png');

  &-main {
    width: 100%;
    overflow: hidden;
    padding: 10px 0 0 20px;
    box-sizing: border-box;

    div {
      float: left;

      &:nth-child(1) {
        width: 72%;

        p {
          font-size: $font-size-special;
          color: $color-white;
          height: 25px;
          padding: 5px 0;

          &:first-child {
            font-size: $font-size-secondary;
          }
        }
      }

      &:nth-child(2) {
        height: 30px;
        width: 28%;
        text-align: right;
      }
    }
  }
}
</style>
