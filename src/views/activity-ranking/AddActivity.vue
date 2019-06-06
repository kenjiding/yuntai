<template>
  <ych-page :class="$style.page">
    <van-cell-group :class="$style.group">
      <van-field
        v-model="formData.ActiviyName"
        required
        input-align="right"
        label="活动名称"
        placeholder="请输入"
      />

      <van-cell
        title="活动介绍"
        :value="formData.Introduction || '请输入'"
        @click="introductionShow = true"
        is-link />

      <van-field
        :value="'前' + rankingRewardValue + '名'"
        label="显示名次"
        input-align="right"
        required
        disabled
        @click.native="inputChange"/>

      <van-cell
        v-for="(item, index) in formData.RankingRewardList"
        :key="index"
        :title="`第${item.Num}名奖励`"
        is-link
        :value="item.GoodsName"
        @click="beforeSelectGoods(index)" />

      <div :class="$style['add-item']" @click="addReward">
        <van-icon name="add-o" />
        <span>添加名次奖励</span>
      </div>

      <van-cell
        title="开始时间"
        is-link
        :required="true"
        :value="startTimeValue"
        @click="selectTime('start')" />
      <van-cell
        title="结束时间"
        is-link
        :required="true"
        :value="endTimeValue"
        @click="selectTime('end')" />

    </van-cell-group>
    <p
      :class="$style.rule">
      规则说明：
      <van-icon
        name="shuoming"
        @click="popupShow = true" />
    </p>

    <p :class="$style.status" v-if="isEdit">未开始</p>

    <van-popup
      v-model="datetimeShow"
      position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        @confirm="confirm"
        @cancel="datetimeShow = false"
        type="datetime"
      />
    </van-popup>

    <van-popup
      :class="$style.popup"
      v-model="selectGoodsShow">
      <div>
        <p @click="handleSelectGoods">从商品列表获取</p>
        <p @click="handleAddPrize">添加奖品</p>
      </div>
    </van-popup>

    <GoodsList
      :goods-list-show="goodsListShow"
      @close="goodsSelectAfter"/>

    <NewAddPrize
      :add-prize-show="addPrizeShow"
      :fill-back-data="formData.RankingRewardList[whitchClickMark]"
      @close="closeAddPrize"/>

    <van-popup
      v-model="introductionShow"
      :class="$style.goodsListPopip"
      position="right">
      <Introduction
        @close="closeIntroduction"
        :introduction-show="introductionShow"
        :value="formData.Introduction"/>
    </van-popup>

    <van-dialog
      v-model="dialogShow"
      show-cancel-button
      :before-close="beforeClose">
      <p
        :class="$style['dialog-p']">提示</p>
      <p
        :class="$style['dialog-p']"
        :style="{color: '#999999'}">修改显示名次会清空添加的名次奖励</p>
      <van-field
        v-model.number="formData.RankingReward"
        placeholder="请输入显示名次"
        :class="$style['ranking-input']"
        :error-message="rankingErrorText"
        @blur="scrollPage"/>
    </van-dialog>

    <description
      :show.sync="popupShow"
      title="温馨提示"
      determine="知道了">
      <p>1.进行中的活动只允许有一个；</p>
      <p>2. 新建后会在C端显示一个活动排行的入口</p>
      <p>3.统计活动有效期内的会员中奖记录并按由高到低排序</p>
      <p>4.如何在电视端显示排行</p>
      <span>(1)联系客服下载并安装电视端APP</span>
      <span>(2)打开电视端APP进入扫码登录界面</span>
      <span>(3)在B端活动排行功能下，点击扫码登录即可</span>
    </description>

    <van-button
      size="large"
      type="primary"
      :class="$style.button"
      @click="save">{{isEdit ? '保存修改' : '保存'}}</van-button>
  </ych-page>
</template>

<script>
import { DatetimePicker, Popup, Toast, Dialog } from 'vant';
import GoodsList from './GoodsList';
import ActivityRanking from '@/api/ActivityRanking';
import NewAddPrize from './components/NewAddPrize';
import Introduction from './components/Introduction';
import description from '@/views/member/components/Description';
import Cell from '@/components/Cell';

export default {
  name: 'AddActive',

  components: {
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    GoodsList,
    NewAddPrize,
    description,
    Cell,
    Introduction,
  },

  props: {
    // vue-router配置的props参数
    isEdit: {
      type: Boolean,
    },
  },

  watch: {
    dialogShow (val) {
      if (!val) return;
      this.formData.RankingReward = this.rankingRewardValue;
    },
  },

  data () {
    return {
      formData: {
        ActiviyName: '',
        Introduction: '',
        RankingReward: 10,
        StartTime: '',
        EndTime: '',
        RankingRewardList: [],
      },
      rankingRewardValue: 10,
      popupShow: false,
      rankingErrorText: '',
      introductionShow: false,

      currentDate: new Date(),
      minHour: 10,
      maxHour: 20,
      datetimeShow: false,
      startTimeValue: '请选择',
      endTimeValue: '请选择',
      clickItem: '',
      rankingNum: 0,
      selectGoodsShow: false,
      goodsListShow: false,
      addPrizeShow: false,
      whitchClickMark: null,
      dialogShow: false,
    };
  },

  created () {
    if (this.isEdit) {
      this.getData();
    }
  },

  beforeRouteEnter (to, from, next) {
    //当从添加商品页面返回的时候，回填活动信息
    if (from.fullPath === '/goods-add') {
      next((vm) => {
        let cacheData = vm.$store.state.activityRankingData;
        vm.formData = cacheData;
        vm.startTimeValue = cacheData.StartTime ? vm.$_date(cacheData.StartTime).format('YYYY-MM-DD HH:mm:ss') : '';
        vm.endTimeValue = cacheData.EndTime ? vm.$_date(cacheData.EndTime).format('YYYY-MM-DD HH:mm:ss') : '';
        vm.rankingRewardValue = vm.formData.RankingReward;
        vm.rankingNum = vm.formData.RankingRewardList.length;
      });
    } else {
      next();
    }
  },

  methods: {
    handleAddPrize () {
      this.addPrizeShow = true;
    },
    getData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      ActivityRanking.getActivityInfoByID({
        ID: this.$route.query.ID,
      }).then((res) => {
        Object.assign(this.formData, res);
        this.startTimeValue = this.$_date(res.StartTime).format('YYYY-MM-DD HH:mm:ss');
        this.endTimeValue = this.$_date(res.EndTime).format('YYYY-MM-DD HH:mm:ss');
        this.rankingRewardValue = this.formData.RankingReward;
        this.rankingNum = this.formData.RankingRewardList.length;

        //编辑活动的时候，首先清空奖品图片的key，避免保存修改活动的时候错误覆盖key
        this.formData.RankingRewardList.forEach((item, index) => {
          if (item.GoodsID) {
            this.formData.RankingRewardList[index].Pic = '';
          }
        });
        Toast.clear();
      });
    },

    scrollPage () {
      document.body.scrollTop = document.body.scrollHeight;
    },
    closeIntroduction (val) {
      this.introductionShow = false;
      if (val) {
        this.formData['Introduction'] = val;
      }
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.formData.RankingReward > 10) {
          this.rankingErrorText = '显示名次最多只能输入前10名';
          done(false);
          return;
        } else {
          this.rankingErrorText = '';
        }
        this.rankingNum = 0;
        this.formData.RankingRewardList = [];
        this.rankingRewardValue = this.formData.RankingReward;
      }
      done();
    },
    closeAddPrize (data) {
      this.selectGoodsShow = false;
      this.addPrizeShow = false;
      if (data) {
        this.formData.RankingRewardList[this.whitchClickMark].GoodsID = data.goodsId;
        this.formData.RankingRewardList[this.whitchClickMark].GoodsName = data.name;
        this.formData.RankingRewardList[this.whitchClickMark].Pic = data.key;
      }
    },
    goodsSelectAfter (data) {
      this.goodsListShow = false;
      if (data && !data.needCacheData) {
        this.formData.RankingRewardList[this.whitchClickMark].GoodsName = data.goodsName;
        this.formData.RankingRewardList[this.whitchClickMark].GoodsID = data.goodsId;
      } else {
        //跳转到添加商品页面的时候，缓存活动数据
        this.$store.commit('saveActivityRankingData', this.formData);
      }
    },
    inputChange () {
      this.dialogShow = true;
    },
    handleSelectGoods () {
      this.selectGoodsShow = false;
      this.goodsListShow = true;
    },
    beforeSelectGoods (index) {
      this.selectGoodsShow = true;
      this.whitchClickMark = index;
    },
    addReward () {
      if (this.rankingNum >= this.formData.RankingReward) {
        Toast({
          forbidClick: true,
          message: '添加名次奖励超过设置的显示名次',
        });
        return;
      };

      if (this.isEdit) {
        this.rankingNum = this.formData.RankingRewardList.length;
      }

      this.rankingNum++;
      this.formData.RankingRewardList.push({
        GoodsID: '',
        GoodsName: '',
        Num: this.rankingNum,
        Pic: '',
      });
    },
    save () {
      console.log(this.formData, '123');
      let error = '';
      if (this.formData.ActiviyName === '') {
        error = '请输入活动名称';
      } else if (!this.formData.RankingReward) {
        error = '请输入活动名次排行';
      } else if (this.formData.StartTime === '') {
        error = '请输入活动开始时间';
      } else if (this.formData.EndTime === '') {
        error = '请输入活动结束时间';
      } else {
        // if (this.formData.RankingRewardList.length < this.formData.RankingReward) {
        //   error = '请添加完整的奖励名次';
        // } else {
        // this.formData.RankingRewardList.forEach((item, index) => {
        //   if (!item.GoodsName) {
        //     error = `请选择第${index + 1}名的奖励`;
        //   }
        // });
        // }
      }

      if (error) {
        Toast({
          forbidClick: true,
          message: error,
        });
      } else {
        //如果手动添加的奖品没有修改过图片的，则将Pic字段清空，后台将不会修改之前的图片。
        //没有GoodsID则是手动添加的奖品
        this.formData.RankingRewardList.forEach((item, index) => {
          if (!item.GoodsID && item.Pic.indexOf('http') >= 0) {
            this.formData.RankingRewardList[index].Pic = '';
          }
        });

        let apiPath = 'addActivityRanking';
        if (this.isEdit) {
          apiPath = 'editActivityRanking';
          this.formData.ID = this.$route.query.ID;
        }

        Toast.loading({
          mask: true,
          forbidClick: true,
          message: '保存中...',
        });

        ActivityRanking[apiPath](this.formData).then((res) => {
          Toast.clear();
          this.$router.back();
        });
      }
    },
    selectTime (name) {
      this.datetimeShow = true;
      this.clickItem = name;
    },
    confirm (val) {
      let date = this.$_date(val).format('YYYY-MM-DD HH:mm:ss');
      if (this.clickItem === 'start') {
        this.startTimeValue = date;
        this.formData.StartTime = this.$_date(val).valueOf();
      } else {
        this.endTimeValue = date;
        this.formData.EndTime = this.$_date(val).valueOf();
      }

      if (this.formData.EndTime &&
        this.formData.StartTime &&
        (this.formData.StartTime >= this.formData.EndTime)) {
        this.formData.EndTime = '';
        this.endTimeValue = '';
        return Toast({
          forbidClick: true,
          message: '结束日期要大于开始日期',
        });
      }
      this.datetimeShow = false;
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.ranking-input {
  .van-cell__value--alone {
    padding: 0 20px;
  }

  input {
    text-align: center !important;
    padding: 10px 0;
    border: 1px solid $font-color-secondary;
    border-radius: $border-radius-small;
  }
}

.status {
  text-align: center;
  padding-top: 30px;
  margin-bottom: 130px;
  font-size: $font-size-primary;
  color: $font-color-primary;
}

.dialog-p {
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid $border-color;

  &:nth-of-type(2) {
    border-bottom: 0;
    padding: 20px 0 0;
  }
}

.page {
  .van-cell__value {
    input {
      text-align: right;
    }

    @include ellipsis(1);
  }

  .van-field__error-message {
    text-align: right;
  }
}

.goodsListPopip {
  width: 100%;
  height: 100%;
}

.popup {
  width: 60%;
  border-radius: $border-radius-small;
  background-color: $color-primary;

  p {
    padding: 15px 10px;
    text-align: center;
    color: $color-white;

    &:nth-child(1) {
      border-bottom: 1px solid $font-color-secondary;
    }
  }
}

.button {
  position: fixed;
  bottom: 0;
}

.group {
  background-color: $color-bg-primary;
}

.rule {
  padding: 15px;
  color: $font-color-secondary;
  margin-bottom: 30px;

  .van-icon-shuoming {
    color: $color-warning;
  }
}

.add-item {
  width: 100%;
  height: 45px;
  background-color: $color-white;
  color: $color-primary;
  text-align: center;
  line-height: 45px;
  margin: 10px 0;

  .van-icon-add-o {
    vertical-align: middle;
    margin-right: 5px;
    font-size: $font-size-regular;
  }
}
</style>
