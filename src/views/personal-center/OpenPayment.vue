<template>
  <ych-page>
    <page-header
      left-arrow
      title="付款码启动设置"
      @click-left="$router.go(-1)">
    </page-header>
    <div :class="$style.wrap">
      <van-field
        v-model="money"
        :class="$style['topTitle']"
        label="币单价"
        placeholder="1币等于多少元"
        :precition="2"
        type="number"
        :max="999"
        :min="0"
      />

      <van-cell :style="{marginTop: '15px'}">
        <template slot="title">
          <span class="van-cell-text">付款码启动设备</span>
        </template>
        <van-switch
          v-model="PayCodeStatus"
          slot="right-icon"
          size="24px" />
      </van-cell>

      <div :class="$style.pText">
        <p>使用场景介绍：</p>

        <p>例如某台设备的启动单价为2币/次，此处设置的币单价为1币=1元，</p>

        <p>那么使用微信付款码在设备上进行反扫支付时则是扣除2元启动设备；</p>
      </div>
    </div>
    <van-button
      size="large"
      :class="{[$style.button]: true,}"
      @click="post">保存</van-button>
  </ych-page>
</template>

<script>
import Person from '@/api/Person';
import PageHeader from '@/components/PageHeader';

import { Toast } from 'vant';

export default {
  name: '',

  data () {
    return {
      PayCodeStatus: false,
      money: '',
      isPass: false,
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    post () {
      if (this.PayCodeStatus) {
        if (!this.money) {
          Toast('兑换价格不能为空');
          return;
        }
      }
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      Person.postPayCodeInfo({
        PayCodeStatus: this.PayCodeStatus,
        Money: this.money,
      }).then(res => {
        Toast.clear();
        this.$router.back();
      });
    },
  },
  created () {
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0,
    });
    Person.getPayCodeInfo().then(res => {
      this.PayCodeStatus = res.PayCodeStatus;
      this.money = res.Money || '';
      Toast.clear();
    });
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.pText {
  padding: 30px 15px;

  p {
    font-size: $font-size-special;
    color: $font-color-secondary;
    line-height: 23px;
  }
}

.button {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: $color-primary;
  color: $color-white;
}

.wrap {
  .van-switch--on {
    background-color: $color-primary;
  }

  .van-checkbox {
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;

    .van-checkbox--checked {
      border-color: $color-primary;
      background-color: $color-primary;
    }
  }
}

.van-cell-text {
  &:nth-child(2) {
    font-size: $font-size-special;
    color: $font-color-placeholder;
  }
}

.topTitle {
  color: $font-color-placeholder;

  .van-cell__title {
    color: $font-color-primary;
    line-height: 23px !important;
    font-size: 14px !important;
  }

  input {
    text-align: right;
  }
}
</style>
