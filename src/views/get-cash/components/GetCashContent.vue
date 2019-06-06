<template>
    <div :class="$style.cashWrap">
      <van-nav-bar
        :class="$style.cashWrapNavBar"
        title="提现"
        right-text="记录"
        left-arrow
        @click-left="goBack"
        @click-right="$emit('hideCashContent','showCashLog')"
      />
      <div :class="$style.cashContent">
        <van-row>
          <van-col span="12">体现方式</van-col>
          <van-col span="12">银行卡</van-col>
        </van-row>
        <div v-show="isHasCard == 'hasCard'">
          <van-row>
            <van-col span="6">卡号</van-col>
            <van-col span="18">{{bankCardId}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">用户名</van-col>
            <van-col span="12">{{userName}}</van-col>
          </van-row>
        </div>
        <van-row v-show="isHasCard == 'noCard'">
          <van-col span="12">卡号</van-col>
          <van-col span="12">
            <span
              :class="$style.allIn"
              @click="$emit('hideCashContent','showNewBankCard')">绑定</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8">账户余额</van-col>
          <van-col span="16">￥{{allMoney}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">提现金额</van-col>
          <van-col span="12">
            <span
              :class="$style.allIn"
              @click="allInCash">全部提现</span>
            </van-col>
        </van-row>
        <van-cell-group>
          <van-field
            v-model="getHowMuch"
            label="￥"
            @input="checkButtonPass" />
        </van-cell-group>
        <van-row>
          <van-col span="8">手续费</van-col>
          <van-col span="16">￥{{fees}}</van-col>
        </van-row>
        <van-button
        :class="$style.loginButton"
        type="default"
        bottom-action
        :style="{ background: activeColor}"
        :disabled="buttonStatus"
        @click="postGetCash">提现</van-button>
      </div>
      <van-dialog
        v-model="dialogShow"
        :title="dialogTitle"
        :message="dialogMessage"
        :before-close="beforeClose"
      >
      </van-dialog>
    </div>
</template>

<script>
import { Dialog } from 'vant';
import getCashApi from '@/api/GetCash';

export default {
  name: 'getCashPage',
  data () {
    return {
      value: '',
      activeColor: null,
      buttonStatus: true,
      bankCardId: '',
      userName: '',
      allMoney: '',
      getHowMuch: null,
      rate: '',
      fees: '',
      dialogShow: false,
      dialogTitle: '',
      dialogMessage: '',

    };
  },
  computed: {
    isHasCard () {
      if (this.bankCardId) {
        return 'hasCard';
      } else {
        return 'noCard';
      }
    },
  },

  components: {
    Dialog,
  },
  methods: {
    goBack () {
      window.history.back(-1);
    },
    allInCash () {
      this.getHowMuch = this.allMoney;
      this.checkButtonPass(10);
    },
    checkButtonPass (val) {
      this.fees = this.getHowMuch * parseInt(this.rate);
      if (val.length !== 0) {
        this.activeColor = '#077AFF';
        this.buttonStatus = false;
      } else {
        this.activeColor = null;
        this.buttonStatus = true;
      }
    },
    getCashLog () {
      this.$emit('hideCashContent');
    },
    postGetCash () {
      this.activeColor = null;
      this.buttonStatus = true;

      var getCashFormData = {
        UserID: this.bankCardId,
        howMuchCash: this.getHowMuch,
        cardNum: this.bankCardId,
        fees: this.fees,
      };
      getCashApi.postCashApplication(getCashFormData).then((data) => {
        if (data.success) {
          this.dialogShow = true;
          this.dialogTitle = '提现成功';
          this.dialogMessage = '现金将于48小时内到账，请注意查收！';
        } else {
          this.dialogShow = true;
          this.dialogTitle = '提现失败';
          this.dialogMessage = '请重新提现操作！';
        }
      });
    },
    beforeClose (action, done) {
      this.cashContentInfo();
      done();
    },
    cashContentInfo () {
      getCashApi.getCashInfo().then((res) => {
        this.bankCardId = '';
        this.userName = res.cardName;
        this.allMoney = res.balance;
        this.rate = res.rate;
        this.getHowMuch = null;
        this.fees = '';
      });
    },
  },
  created: function () {
    this.cashContentInfo();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.cashWrap {
  height: 90%;
  width: 100%;
  background-color: $color-bg-regular;

  .van-dialog {
    width: 70%;

    .van-button {
      background-color: $color-primary;
    }
  }

  .loginButton {
    // background: $color-primary;
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .cashContent {
    width: 78%;
    height: auto;
    margin: 30px auto;
    padding: 10px 20px;
    background-color: $color-white;
    border-radius: $border-radius;
    border: 1px solid $border-color;
    position: relative;
    top: 50px;

    .van-cell {
      padding: 10px 0;
      border-bottom: 1px solid $border-color;

      input {
        text-align: right;
      }
    }

    [class*=van-hairline]::after {
      content: none;
    }

    .van-row {
      padding: 12px 0;

      .allIn {
        color: $color-primary !important;
      }

      .van-col {
        color: $font-color-regular;

        &:last-of-type {
          color: $font-color-secondary;
          text-align: right;
        }
      }
    }
  }

  .cashWrapNavBar {
    background-color: $color-primary;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;

    .van-icon {
      color: $color-white;
      font-size: $font-size-regular;
    }

    .van-nav-bar__title {
      color: $color-white;
    }

    .van-nav-bar__text {
      color: $color-white;
    }
  }
}
</style>
