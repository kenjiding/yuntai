<template>
  <ych-page>
    <searchItem
      font-color="#999999"
      @search="searchHandle"/>
    <van-cell
      is-link
      :value="total + '人'"
      @click="selectList">
      <template slot="title">
        <img
          src="../../assets/img/crown.png"
          :class="$style.cellImg"
          :style="{width: '20px'}"/>
        <span class="custom-text">{{ selectText }}</span>
      </template>
    </van-cell>

    <div :class="$style.content">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <ListItem
        v-for="item in leaguerInfo"
        :key="item.ID"
        :leaguer-info="item"
        @click.native="goToMemberInfo(item.ID)">
        <div slot="right">
          <p>{{item.ConsumeDate ? '最近消费' : '从未消费'}}</p>
          <p v-if="item.ConsumeDate">{{item.ConsumeDate}}</p>
        </div>
      </ListItem>
      </van-list>
    </div>
    <van-popup v-model="levelSelect" position="bottom">
      <p :class="$style.popupTitle">选择会员</p>
      <div>
        <van-cell
          title="全部会员"
          is-link
          @click="selectChange('', '全部等级')">
          <p slot="right-icon" :class="$style['levelicon']">
            <img
              src="../../assets/img/crown.png"
              :style="{width: '20px'}"/>
              <van-icon name="arrow" />
          </p>
        </van-cell>

        <van-cell
          v-for="item in list"
          :key="item.LevelID"
          :title="splitLevelName(item.LevelName) === 'L0' ? '会员卡' : item.LevelName"
          is-link
          @click="selectChange(item.LevelID, item.LevelName)">
          <p slot="right-icon" :class="$style['levelicon']">
            <img v-if ="splitLevelName(item.LevelName) === 'L1'" src="../../assets/img/V1.png"/>
            <img v-else-if ="splitLevelName(item.LevelName) === 'L2'" src="../../assets/img/V2.png"/>
            <img v-else-if ="splitLevelName(item.LevelName) === 'L3'" src="../../assets/img/V3.png"/>
            <img v-else-if ="splitLevelName(item.LevelName) === 'L4'" src="../../assets/img/V4.png"/>
            <img v-else-if ="splitLevelName(item.LevelName) === 'L5'" src="../../assets/img/V5.png"/>
            <img
              v-else-if ="splitLevelName(item.LevelName) === 'L0'"
              src="../../assets/img/level-default.png"
              :style="{width: '25px',height: '25px'}"/>
            <van-icon name="arrow" />
          </p>
        </van-cell>
      </div>
    </van-popup>
  </ych-page>
</template>

<script>
import { List, Popup } from 'vant';

import LeaguerManage from '@/api/LeaguerManage';
import searchItem from './components/SearchItem.vue';
import ListItem from './components/ListItem.vue';

export default {
  name: '',

  components: {
    searchItem,
    ListItem,
    [List.name]: List,
    [Popup.name]: Popup,
  },

  data () {
    return {
      selectText: '全部等级',
      levelSelect: false,
      list: [],
      leaguerInfo: [],
      loading: false,
      finished: false,
      listFormData: {
        PageIndex: 0,
        PageSize: 10,
        SearchKey: '',
        LeaguerLevelID: '',
      },
      total: 0,
    };
  },

  methods: {
    goToMemberInfo (id) {
      this.$router.push({
        path: '/member-info',
        query: {
          ID: id,
        },
      });
    },
    selectList () {
      this.levelSelect = true;
      this.getLevelList();
    },

    changeSex (val) {
      let obj = {
        Unknown: '未知',
        Man: '男',
        Woman: '女',
      };
      return obj[val];
    },
    splitLevelName (str = '') {
      return str.split('.')[0];
    },
    getLevelList () {
      LeaguerManage.getLevelList({
        IsInterim: true,
      }).then((res) => {
        this.list = res.Data;
      });
    },
    searchHandle (val) {
      this.listFormData.SearchKey = val;
      this.listFormData.PageIndex = 0;
      this.leaguerInfo = [];
      this.finished = false;
      this.getListData();
    },
    selectChange (val, name) {
      console.log(val, name, 123);
      this.selectText = name;
      this.listFormData.LeaguerLevelID = val;
      this.listFormData.PageIndex = 0;
      this.leaguerInfo = [];
      this.finished = false;
      this.levelSelect = false;
      this.getListData();
    },
    onLoad () {
      this.getListData();
    },
    getListData () {
      this.loading = true;

      this.listFormData.PageIndex++;
      LeaguerManage.consumptionRankingByTime(this.listFormData).then((res) => {
        this.loading = false;
        this.total = res.Total;

        this.leaguerInfo = this.leaguerInfo.concat(res.Data);

        if (this.leaguerInfo.length >= res.Total) {
          this.finished = true;
        }
      }, () => { this.loading = false; });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.levelicon {
  img {
    width: 45px;
    height: 17px;
    margin: 0 5px;
    vertical-align: middle;
  }

  .van-icon-arrow {
    vertical-align: middle;
  }
}

.popupTitle {
  text-align: center;
  font-size: $font-size-regular;
  padding: 15px;
  border-bottom: 1px solid $border-color;
}

.cellImg {
  width: 40px;
  height: 20px;
  vertical-align: sub;
  margin-right: 5px;
}

.content {
  position: absolute;
  top: 100px;
  bottom: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

</style>
