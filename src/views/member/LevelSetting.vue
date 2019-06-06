<template>
  <ych-page :class="$style.wrap">
      <van-field
        v-model="formData.LevelName"
        label="等级名称"
        input-align="right"
        placeholder="请输入等级名称"/>

      <p
        :class="$style.title">
        升降级策略
        <van-icon
          name="gantanhao1"
          @click="popupShow = true" />
      </p>

      <van-field
        v-model="formData.Money"
        label="消费满/元"
        input-align="right"
        disabled
        :style="{backgroundColor: '#DFDFDF'}" />

        <SwitchInput
          title="生日送币"
          :checked.sync="formData.BirthdayGift.IsOpen"
          @change="switchChange">
          <van-field
            v-model="formData.BirthdayGift.Num"
            label="送币数量"
            type="number"
            :max="9999"
            :precision="0"
            placeholder="请输入数量"/>
          <van-field
            v-model="formData.BirthdayGift.ValidityPeriod"
            label="币有效期"
            type="number"
            :precision="0"
            :max="999"
            placeholder="请输入有效期天数"/>
        </SwitchInput>

        <div :class="$style.group">
          <SwitchInput
            title="消费满送币"
            :checked.sync="switchExpensiveGift">

            <van-field
              v-for="item in formData.ExpensiveGift"
              :key="item.ConsumeMoney"
              v-model="item.GivenCoin"
              :label="`单笔消费满${item.ConsumeMoney}元送`"
              type="number"
              :max="9999"
              :precision="0"
              placeholder="请输入送币数量"/>
          </SwitchInput>
        </div>

      <description
        :show.sync="popupShow"
        title="温馨提示"
        determine="知道了">
        <p>1.每消费1元获得1成长值</p>
        <p>2. 会员等级的结算周期为一个季度，每季度初始月份第一天将成长值清零，重新开始新季度的成长值统计</p>
        <p>3.若本季度累计成长值达到升级条件，会员将实时升级并开始享有新等级权益，直到下季度末</p>
        <p>4.若本季度累计成长值达到当前等级所需成长值，下季度将继续保持当前等级；若未达到，下季度将会降一级</p>
      </description>
      <van-button
        size="large"
        type="primary"
        :class="$style.button"
        :loading="saveLoading"
        @click="saveBefore">保存</van-button>
  </ych-page>
</template>

<script>
import { Toast } from 'vant';
import LeaguerManage from '@/api/LeaguerManage';
import SwitchInput from './components/SwitchInput';
import description from './components/Description';

export default {
  name: '',

  components: {
    SwitchInput,
    description,
  },

  watch: {
    switchExpensiveGift (val) {
      if (val) return;
      this.formData.ExpensiveGift.forEach((item, index) => {
        item.GivenCoin = '';
      });
    },
  },

  data () {
    return {
      popupShow: false,
      switchExpensiveGift: false,
      saveLoading: false,
      formData: {
        LevelName: '',
        Money: '',
        LevelID: '',
        BirthdayGift: {
          Num: '',
          ValidityPeriod: '',
          IsOpen: null,
        },
        ExpensiveGift: [],
      },
    };
  },
  created () {
    this.getFormData();
  },

  methods: {
    switchChange (val) {
      if (val) return;
      this.formData.BirthdayGift.ValidityPeriod = '';
      this.formData.BirthdayGift.Num = '';
    },
    getFormData () {
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载...',
        mask: true,
      });
      LeaguerManage.getLevelSettingData({
        ID: this.$route.query.levelID,
      }).then((res) => {
        Object.assign(this.formData, res);
        this.formData.BirthdayGift.IsOpen = res.BirthdayGift.IsOpen;

        //处理数据
        this.combinationData(res);
      });
    },
    combinationData (res) {
      let baseData = [{
        ID: null,
        ConsumeMoney: 20,
        GivenCoin: '',
      }, {
        ID: null,
        ConsumeMoney: 50,
        GivenCoin: '',
      }, {
        ID: null,
        ConsumeMoney: 100,
        GivenCoin: '',
      }, {
        ID: null,
        ConsumeMoney: 200,
        GivenCoin: '',
      }, {
        ID: null,
        ConsumeMoney: 500,
        GivenCoin: '',
      }];

      //回填满送数据
      baseData.forEach((item, index) => {
        this.formData.ExpensiveGift.forEach((value, key) => {
          if (item.ConsumeMoney === value.ConsumeMoney) {
            Object.assign(item, value);
          }
        });
      });

      this.formData.ExpensiveGift = baseData;

      //控制满送的开关
      this.switchExpensiveGift = !!this.formData.ExpensiveGift.find((item) => {
        return item.GivenCoin;
      });

      Toast.clear();
    },
    saveBefore () {
      let errorText = '';
      if (!this.formData.LevelName) {
        errorText = '请输入等级名称';
      }

      if (this.formData.LevelName.length > 4) {
        errorText = '等级名称最多只能输入4个字符';
      }

      if (this.formData.BirthdayGift.IsOpen) {
        if (!this.formData.BirthdayGift.Num) {
          errorText = '请输入送币数量';
        }

        if (!this.formData.BirthdayGift.ValidityPeriod) {
          errorText = '请输入送币有效期';
        }
      }

      if (this.switchExpensiveGift) {
        let cache = this.formData.ExpensiveGift;
        let objValue = cache.find((item) => item.GivenCoin);

        if (!objValue) {
          errorText = '至少填写一项送币数量';
        }
      }

      if (errorText) {
        Toast(errorText);
        return;
      }

      this.save();
    },
    save () {
      this.saveLoading = true;
      this.formData.ExpensiveGift.forEach((item) => {
        if (item.GivenCoin === '') item.GivenCoin = null;
      });
      LeaguerManage.postLevelSetting(this.formData).then((res) => {
        this.saveLoading = false;
        this.$router.back();
      }, _ => { this.saveLoading = false; });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.group {
  padding-bottom: 60px;

  .van-cell__title {
    max-width: none;
    flex: 6;
  }

  .van-cell__value {
    max-width: none;
    flex: 4;
  }
}

.button {
  position: absolute;
  bottom: 0;
}

.wrap {
  .ych-page__content {
    min-height: 100%;
  }

  .van-field {
    input {
      text-align: right;
    }
  }
}

.title {
  padding: 15px;
  color: $font-color-secondary;

  .van-icon-gantanhao1 {
    color: $color-warning;
  }
}

</style>
