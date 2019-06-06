<template>
 <ych-page>
    <page-header
      slot="header"
      title="验证金额"
      left-arrow
      @click-left="$router.push('/')">
    </page-header>
    <div
      :class="$style['home-footer']"
      v-show="dataStatus">
      <p>{{statusText}}</p>
    </div>
    <van-cell-group :class="$style['wrap']">
      <van-field
        v-model="money"
        label="验证金额"
        placeholder="请填写"
        type="number"
        :disabled="!inputDisabled"
        @input="checkMoney"
      />
    </van-cell-group>
    <van-button
      :class="{[$style['login-button']]: true ,[$style['button-text']]: colorText }"
      size="large"
      :disabled="buttonStatus"
      @click="postText">提交</van-button>
 </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import IdentityApi from '@/api/Identity';
import {Toast} from 'vant';

export default {
  name: '',
  data () {
    return {
      money: '',
      buttonStatus: true,
      colorText: false,
      statusText: '请填写银行卡账户收到的验证款金额',
      dataStatus: true,
      inputDisabled: true,
    };
  },
  components: {
    PageHeader,
  },

  methods: {
    checkMoney () {
      if (this.money) {
        this.buttonStatus = false;
        this.colorText = true;
      } else {
        this.buttonStatus = true;
        this.colorText = false;
      }
    },
    postText () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      IdentityApi.aysnCheckMoney({money: this.money}).then((res) => {
        this.$router.push('/', () => Toast.clear());
      }, () => Toast.clear());
    },
  },
  created () {
    if (this.$route.query.isEdit === 'true') {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      IdentityApi.getCheckMoney().then((res) => {
        this.money = res.Money;
        this.statusText = res.ErrorText;
        this.dataStatus = !!res.ErrorText;
        this.inputDisabled = res.IsEdit;
        Toast.clear();
      }, () => Toast.clear());
    }
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.wrap {
  margin: 15px;

  .van-cell__value {
    input {
      text-align: right;
    }
  }
}

.home-footer {
  width: 100%;
  height: 40px;
  background-color: rgba(229, 75, 94, .2);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $font-color-special;
  font-size: $font-size-special;
}

.login-button {
  position: fixed;
  left: 0;
  bottom: 0;
  color: $font-color-placeholder;
}

.button-text {
  color: $color-primary;
}
</style>
