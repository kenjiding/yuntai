<template>
  <ych-page>

    <van-cell
      v-if="!hideSwitch"
      :style="{marginBottom: '10px'}">
      <template slot="title">
        <span class="custom-text">自动升降级策略</span>
        <van-icon
          name="gantanhao1"
          :class="$style.warning"
          @click="popupShow = true" />
      </template>
      <van-switch
        v-model="upGradeOpen"
        size="25px"
        slot="right-icon"
        :disabled="disabled"
        @change="changeSwitch"/>
    </van-cell>

    <van-cell
      v-for="item in list"
      :key="item.LevelID"
      :title="item.LevelName"
      @click="routerHandle(item.LevelID)">
      <p slot="right-icon" :class="$style['levelicon']">
        <img v-if ="splitLevelName(item.LevelName) === 'L1'" src="../../assets/img/V1.png"/>
        <img v-else-if ="splitLevelName(item.LevelName) === 'L2'" src="../../assets/img/V2.png"/>
        <img v-else-if ="splitLevelName(item.LevelName) === 'L3'" src="../../assets/img/V3.png"/>
        <img v-else-if ="splitLevelName(item.LevelName) === 'L4'" src="../../assets/img/V4.png"/>
        <img v-else-if ="splitLevelName(item.LevelName) === 'L5'" src="../../assets/img/V5.png"/>
        <van-icon name="arrow" />
      </p>
    </van-cell>

    <description
      :show.sync="popupShow"
      title="温馨提示"
      determine="知道了">
      <p>1.每消费1元获得1成长值</p>
      <p>2. 会员等级的结算周期为一个季度，每季度初始月份第一天将成长值清零，重新开始新季度的成长值统计</p>
      <p>3.若本季度累计成长值达到升级条件，会员将实时升级并开始享有新等级权益，直到下季度末</p>
      <p>4.若本季度累计成长值达到当前等级所需成长值，下季度将继续保持当前等级；若未达到，下季度将会降一级</p>
    </description>
  </ych-page>
</template>

<script>
import cellGroup from '@/components/CellExpand/index.js';
import LeaguerManage from '@/api/LeaguerManage';
import { Dialog } from 'vant';
import description from './components/Description';

export default {
  name: '',

  components: {
    cellGroup,
    description,
    [Dialog.name]: Dialog,
  },

  data () {
    return {
      list: [],
      upGradeOpen: false,
      disabled: false,
      popupShow: false,
      hideSwitch: true,
    };
  },
  created () {
    this.getListData();
  },

  methods: {
    changeSwitch (val) {
      if (val) {
        Dialog.confirm({
          title: '提醒  ',
          message: '开启后将不允许再关闭！请确认是否开启',
        }).then(() => {
          LeaguerManage.updateLevelFlag({
            IsOpenLevelFlag: true,
          }).then(_ => {
            this.disabled = true;
          });
        }).catch(() => {
          this.upGradeOpen = false;
        });
      }
    },
    splitLevelName (str) {
      return str.split('.')[0];
    },
    getListData () {
      LeaguerManage.getLevelList({
        IsInterim: false,
      }).then((res) => {
        this.list = res.Data;
        this.upGradeOpen = res.IsOpenLevelFlag;
        this.hideSwitch = res.IsOpenLevelFlag;
      });
    },
    routerHandle (id) {
      this.$router.push({
        path: '/level-setting',
        query: {
          levelID: id,
        },
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.warning {
  color: $color-warning;
  margin-left: 5px;
}

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
</style>
