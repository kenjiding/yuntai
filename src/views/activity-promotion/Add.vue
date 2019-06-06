<template>
  <ych-page :class="$style.page">
    <van-cell-group :class="$style.wrap">
      <van-field
        v-model="formData.Currence"
        placeholder="请输入红包总币数"
        :label="isRandom? '红包总币数' : '单个红包币数'"
        type="number"
        :max="100000"
        :precision="0" />
      <p :class="$style.pText">
        <span>每人领到的币数{{isRandom?'随机':'固定'}}，</span>
        <span :style="{color: '#077AFF',}" @click="change">改为{{isRandom?'固定红包':'拼手气红包'}}</span>
      </p>
      <van-field
        v-model="formData.Num"
        placeholder="请输入红包个数"
        label="红包个数"
        type="number"
        :max="100000"
        :precision="0" />
      <van-field
        v-model="formData.Titlle"
        placeholder="免费领币快乐游玩"
        @input="limitText"
        label="红包标题" />
      <van-field
        v-model="formData.VirtualCoinEffectiveCycle"
        placeholder="请输入有效天数"
        label="币有效期"
        type="number"
        :max="365"
        :precision="0" />
      <van-field
        v-model="formData.ValidityPeriod"
        placeholder="请输入有效天数"
        label="红包有效期"
        type="number"
        :max="365"
        :precision="0" />
    </van-cell-group>
    <p :class="$style.pText"><span @click="show = true">规则说明<van-icon name="question" /></span></p>
    <p
      :class="{[$style.bottomText]: true, [$style.colorText]: allCurrence > 100000}"
      v-show="!isRandom">{{allCurrence}}币</p>
    <p
      :class="$style.error"
      v-show="allCurrence > 100000 && !this.isRandom">红包总币数不能超过100000</p>
    <div :class="$style.button" @click="add">
      <van-button size="large">确定创建</van-button>
    </div>
    <van-popup v-model="show">
      <Description @closePopup="show = false"></Description>
    </van-popup>
  </ych-page>
</template>

<script>
import Promotion from '@/api/Promotion';
import checkData from '@/views/packge/tool/checkFormData';
import { Toast, Popup } from 'vant';
import Description from './components/Description';

export default {
  name: '',

  data () {
    return {
      formData: {
        Currence: '',
        Num: '',
        Titlle: '',
        VirtualCoinEffectiveCycle: '',
        IsRandom: true,
        ValidityPeriod: '',
      },
      value: '',
      isRandom: true,
      show: false,
    };
  },

  components: {
    [Popup.name]: Popup,
    Description,
  },

  computed: {
    allCurrence () {
      return this.formData.Currence * this.formData.Num;
    },
  },

  methods: {
    limitText (val) {
      if (val.length > 10) {
        this.formData.Titlle = val.slice(0, 10);
      }
    },
    change () {
      this.isRandom = !this.isRandom;
      this.formData.IsRandom = this.isRandom;
    },
    add () {
      if (this.allCurrence > 100000 && !this.isRandom) return;
      let dataPass = checkData({
        data: this.formData,
        ignore: ['Titlle'],
        message: {
          Currence: '请填写红包币数',
          Num: '请填写红包个数',
          VirtualCoinEffectiveCycle: '请填写红包有效期',
        },
      });

      dataPass && this.postAdd();
    },
    postAdd () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });
      Promotion.addRedPacketsAsync(this.formData).then(res => {
        this.$router.back();
        Toast.clear();
      });
    },
  },
  created () {},
};
</script>

<style lang='scss' module>
// stylelint-disable
@import "@/styles/them.scss";

.error {
  text-align: center;
  color: #ff4545;
  padding: 10px 0;
  font-size: 12px;
}

.colorText {
  color: #ff4545 !important;
}

.page {
  .van-popup {
    background-color: rgba(0,0,0,0);
  }
}

.button {
  position: fixed;
  bottom: 10px;
  width: 100%;

  .van-button {
    width: 95%;
    display: block;
    margin: 0 auto;
    background-color: #ff4545;
    border-radius: 10px;
    color: $color-white;
  }
}

.bottomText {
  text-align: center;
  color: #999999;
  font-size: 25px;
}

.pText {
  padding: 15px 20px;
  background-color: $color-bg-primary;
  font-size: 13px;
  color: $font-color-secondary;

  .van-icon-question {
    font-size: 13px;
    display: inline-block;
    vertical-align: middle;
    margin: -3px 0 0 5px;
  }
}

.wrap {
  .van-cell {
    border-bottom: 1px solid $border-color;

    input {
      text-align: right;
    }
  }

  [class*=van-hairline]:after {
    content: none;
  }
}
</style>
