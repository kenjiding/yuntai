<template>
  <ych-page>
    <van-cell-group :class="$style.group">

      <van-field label="活动名称" v-model="info.ActiviyName" :disabled="inputDisabled"/>
      <van-field label="活动介绍" v-model="info.Introduction" :disabled="inputDisabled"/>
      <van-field label="显示名次" :value="`前 ${info.RankingReward} 名`" :disabled="inputDisabled"/>

      <van-field
        v-for="(item, index) in info.RankingRewardList"
        :key="index"
        :label="`第${item.Num}名`"
        v-model="item.GoodsName"
        :disabled="inputDisabled" />
    </van-cell-group>

    <van-cell
      title="开始时间"
      :style="{marginTop: '10px'}"
      :value="info.StartTime | date"
      :disabled="inputDisabled"
      @click="selectTime('start')" />

    <van-cell
      title="结束时间"
      :disabled="inputDisabled"
      :value="info.EndTime | date"
      @click="selectTime('end')" />

    <p
      :class="$style.rule">
      规则说明：
      <van-icon
        name="shuoming"
        @click="popupShow = true" />
    </p>

    <p :class="$style.status"> {{activityStatus}} </p>

    <van-button
      v-if="this.info.Status !== 'Close'"
      size="large"
      type="danger"
      :class="$style.button"
      :loading="buttonLoading "
      @click="closeActivity">{{ buttonText }}</van-button>

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
  </ych-page>
</template>

<script>
import { DatetimePicker, Toast, Popup } from 'vant';
import ActivityRanking from '@/api/ActivityRanking';
import description from '@/views/member/components/Description';

export default {
  name: '',
  components: {
    description,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
  },
  data () {
    return {
      info: {},
      popupShow: false,
      buttonLoading: false,
      datetimeShow: false,
      currentDate: new Date(),
      clickItem: '',
    };
  },

  created () {
    this.getData();
  },

  computed: {
    inputDisabled () {
      return this.info.Status !== 'NotStart';
    },
    buttonText () {
      if (this.info.Status === 'Processing' || this.info.Status === 'NotStart') {
        return '提前结束';
      } else if (this.info.Status === 'Over') {
        return '关闭';
      }
    },
    activityStatus () {
      let obj = {
        Processing: '进行中',
        Over: '已结束',
        NotStart: '未开始',
        Close: '已关闭',
      };
      return obj[this.info.Status];
    },
  },

  methods: {
    confirm (val) {
      let date = this.$_date(val).format('YYYY-MM-DD HH:mm:ss');
      if (this.clickItem === 'start') {
        this.startTimeValue = date;
        this.formData.startTime = this.$_date(val).valueOf();
      } else {
        this.endTimeValue = date;
        this.formData.endTime = this.$_date(val).valueOf();
      }
      this.datetimeShow = false;
    },
    selectTime (name) {
      if (this.inputDisabled) return;
      this.datetimeShow = true;
      this.clickItem = name;
    },
    closeActivity () {
      this.buttonLoading = true;
      ActivityRanking.closeActivity({
        ID: this.$route.query.ID,
        CloseTye: this.info.Status !== 'Processing',
      }).then(() => {
        this.buttonLoading = false;
        this.$router.back();
      }, () => {
        this.buttonLoading = false;
      });
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
        Toast.clear();
        this.info = res;
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.group {
  .van-cell {
    input {
      text-align: right;
    }
  }
}

.button {
  position: fixed;
  bottom: 0;
}

.rule {
  padding: 15px;
  color: $font-color-secondary;

  .van-icon-shuoming {
    color: $color-warning;
  }
}

.status {
  text-align: center;
  padding-top: 30px;
  margin-bottom: 130px;
  font-size: $font-size-primary;
  color: $font-color-primary;
}

</style>
