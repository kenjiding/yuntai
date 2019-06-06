<template>
  <ych-page>
    <page-header
      slot="header"
      title="修改密码"
      right-text="跳过"
      @click-right="$router.replace('/')">
    </page-header>
    <div :class="$style['children-info-wrap']">
      <van-cell-group>
        <van-field
          v-model="oldPassword"
          label="旧密码"
          type="password"
          placeholder="请输入"
          />
        <van-field
          v-model="Password"
          label="新密码"
          type="password"
          placeholder="请输入"
          :error-message="limitText"
          @blur="limitPhone"
          />
        <van-field
          v-model="rePassword"
          label="确认密码"
          type="password"
          placeholder="请输入"
          :error-message="passWordErrorText"
          @input="checkPassword"
          />
      </van-cell-group>
      <van-button
        :class="$style['login-button']"
        :style="{backgroundColor: textColor}"
        type="default"
        size="large"
        :disabled="disabledButton"
        @click="postFormBefore">提交</van-button>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import { Toast } from 'vant';
import Account from '@/api/Account';
import { Base64 } from 'js-base64';

export default {
  name: '',
  data () {
    return {
      oldPassword: '',
      Password: '',
      rePassword: '',
      passWordErrorText: null,
      limitText: null,
      disabledButton: true,
      textColor: null,
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    limitPhone () {
      if (this.Password.length < 6) {
        this.limitText = '新密码长度小于6位';
        this.disabledButton = true;
        this.textColor = null;
      } else {
        this.limitText = null;
        this.checkPassword();
      }
    },
    checkPassword () {
      if (this.rePassword !== this.Password) {
        this.passWordErrorText = '两次密码不一致';
        this.disabledButton = true;
        this.textColor = null;
      } else {
        this.passWordErrorText = null;
        this.disabledButton = false;
        this.textColor = '#077AFF';
        this.limitPhone();
      }
    },
    postFormBefore () {
      if (this.oldPassword === '') {
        Toast('旧密码为空');
        return;
      }
      if (this.Password === '') {
        Toast('新密码为空');
        return;
      }
      if (this.rePassword === '') {
        Toast('确认密码为空');
        return;
      }

      this.postFormData();
    },
    postFormData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      Account.resetPassword({
        OldPassword: Base64.encode(this.oldPassword),
        NewPassword: Base64.encode(this.Password),
      }).then((res) => {
        this.$router.replace('/');
        Toast.clear();
      });
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.login-button {
  position: fixed;
  left: 0;
  bottom: 0;

  .van-button__text {
    color: $color-white;
  }
}

.children-info-wrap {
  position: absolute;
  top: 46px;
  bottom: 0;
  left: 0;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;

  .van-button {
    color: $color-primary;
  }

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;
  }

  .van-cell {
    padding-left: 0;
    padding-right: 0;
    background-color: $color-bg-secondary;
    border-bottom: 1px solid $border-color;
    margin: 20px 0;

    .van-cell__value {
      color: $font-color-placeholder;

      .van-field__error-message {
        text-align: right;
      }

      input {
        background-color: $color-bg-secondary;
        text-align: right;
        color: $font-color-placeholder;
      }
    }

    .van-cell__title {
      font-size: $font-size-primary;
      padding-left: 10px;

      .van-cell__label {
        color: $font-color-placeholder;
      }
    }
  }
}
</style>
