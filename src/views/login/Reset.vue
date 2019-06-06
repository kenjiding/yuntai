<template>
  <div :class="$style.wrap">
    <van-tabs
      v-model="active"
      :line-width="15">
        <van-tab
          title="设置新密码">
          <van-cell-group>
            <van-field
              v-model="resetFormData.Account"
              label="手机号码"
              type="tel"
              :error-message="errorText"
              @input="numberLimit"
              @blur="checkPhoneNumber" />

            <van-field
                v-show="imgCodeShow"
                :class="$style['img-input']"
                v-model="imgText">
                <img
                  :src="'data:image/png;base64,' + imgSrc"
                  slot="label"
                  :class="$style['img-code']"
                  @click="getImgCodeMethods"/>
            </van-field>

            <van-field
              v-model="resetFormData.phoneCode"
              type="tel">
              <span slot="label"
                :style="{color:textColor}"
                :class="$style.phoneCodeStyle"
                @click="getPhoneCodeMethod">{{phoneCodeText}}</span>
            </van-field>
            <van-field
              type="password"
              v-model="resetFormData.Password"
              @blur="checkRepassword"
              label="设置密码" />
            <van-field
              v-model="resetFormData.repassword"
              label="确认密码"
              type="password"
              :error-message="isRightText"
              @input="checkRepassword" />
          </van-cell-group>
        <van-button
          type="default"
          bottom-action
          :class="$style['login-button']"
          :style="{ color: activeColor}"
          :disabled="buttonStatus"
          @click="postResetPassWord">确认</van-button>
          </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, CellGroup, Toast } from 'vant';
import Account from '@/api/Account';
import Message from '@/api/Messge';
import { Base64 } from 'js-base64';

export default {
  name: 'loginPage',
  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-cell-group': CellGroup,
  },

  data () {
    return {
      // 注册表单数据
      resetFormData: {
        Account: '',
        phoneCode: '',
        Password: '',
        repassword: '',
      },
      imgText: '',
      imgSrc: '',
      imgCodeShow: false,
      phoneCodeText: '获取验证码',
      activeColor: null,
      buttonStatus: true,
      errorText: null,
      isRightText: null,
      active: 1,
      textColor: '#007aff',
      isCodePass: true,
      testnum: '',
      globalRandomCode: null,
    };
  },

  mounted () {
    //移动端:active伪类无效的解决方法
    document.body.addEventListener('touchstart', _ => {});
  },

  methods: {
    numberLimit (val) {
      if (val.length >= 11) {
        this.resetFormData.Account = val.slice(0, 11);
      }
    },
    postResetPassWord () {
      if (this.resetFormData.Password.length < 6) {
        Toast('密码长度小于6位');
        return;
      }

      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      let forgetData = {
        Telephone: this.resetFormData.Account,
        Code: this.resetFormData.phoneCode,
        NewPassword: Base64.encode(this.resetFormData.Password),
      };

      Account.forgetPassword(forgetData).then((res) => {
        this.$store.commit('setUserInfo', {Token: res.Token});

        Toast.success('密码修改成功');
        this.$store.dispatch('asyncfetchUserInfo').then(() => {
          this.$router.replace('/', () => {
            Toast.clear();
          });
        });
      });
    },
    randomNum (max) {
      let Num = '';
      for (let i = 0; i < max; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    },
    checkRepassword () {
      if (!this.resetFormData.Password) {
        return;
      }

      if (this.resetFormData.repassword !== this.resetFormData.Password) {
        this.isRightText = '两次密码不一致';
        this.activeColor = null;
        this.buttonStatus = true;
      } else {
        this.isRightText = null;
        this.activeColor = '#077AFF';
        this.buttonStatus = false;
      }
    },
    getImgCodeMethods () {
      this.globalRandomCode = this.randomNum(6);
      Message.getImgCode({randomNum: this.globalRandomCode}).then((res) => {
        this.imgCodeShow = true;
        this.imgSrc = res.src;
      });
    },
    getPhoneCodeMethod () {
      let time = 60;
      let that = this;
      let phonePass = /^1\d{10}$/.test(this.resetFormData.Account);
      if (phonePass && this.isCodePass) {
        Message.getPhoneCode({
          phone: this.resetFormData.Account,
          randomCode: this.globalRandomCode,
          Code: this.imgText,
        }).then((res) => {
          if (res.success) {
            //标记 获取验证码倒计时
            this.isCodePass = false;
            this.textColor = '#999999';
            timeWait(time);
            Toast.success('验证码发送成功');
          } else {
            Toast.fail('验证码发送失败，请重新获取');
          }
        },
        (res) => {
          if (res.ResponseStatus.ErrorCode === '2023000002' ||
          res.ResponseStatus.ErrorCode === '2023000003') {
            this.getImgCodeMethods();
          }
        });
      }

      function timeWait (time) {
        setTimeout(function () {
          if (time >= 0) {
            that.phoneCodeText = `获取中(${time}秒)`;
            time--;
            timeWait(time);
          } else {
            that.isCodePass = true;
            that.textColor = '#007aff';
            that.phoneCodeText = `获取验证码`;
          }
        }, 1000);
      }
    },
    checkPhoneNumber (phone) {
      //手机号正则
      let phonePass = /^1\d{10}$/.test(this.resetFormData.Account);

      if (phonePass) {
        this.errorText = null;
      } else {
        this.errorText = '手机号格式错误';
      }
    },
  },
};
</script>

<style lang="scss" module>
// background: #077AFF;
@import "@/styles/them.scss";

.phoneCodeStyle {
  user-select: none;

  &:active {
    color: $font-color-special !important;
  }
}

.img-input {
  input {
    height: 100%;
  }
}

.img-code {
  width: 80px;
  height: 35px;
}

.wrap {
  margin-top: -42px;

  .van-tabs--line {
    padding-top: 0;
  }

  .login-button {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: $color-white;
  }

  [class*="van-hairline"]::after {
    content: none;
  }

  .van-tabs__nav {
    background-color: rgba(0, 0, 0, 0);

    .van-tabs__line {
      bottom: 20px;
      height: 3px;
      background-color: $color-white;
    }

    .van-tab {
      background-color: rgba(0, 0, 0, 0);
      color: $font-color-placeholder;
    }

    .van-tab--active {
      color: $color-white !important;
    }
  }

  .van-col--24 {
    height: 20px;
    text-align: right;
    font-size: $font-size-special;
    margin-top: 30px;
    color: $font-color-secondary;
  }

  .van-tabs__content {
    padding: 47px 40px 0;
    margin-bottom: 60px;

    .van-cell-group {
      background-color: $color-bg-primary;

      &::after {
        content: none;
      }
    }

    .van-hairline::after {
      content: none;
    }

    .van-field__control {
      text-align: right;
    }

    .van-cell__title {
      span {
        color: $font-color-secondary;
      }
    }

    .registrationClick {
      .van-cell__title {
        span {
          color: $color-primary !important;
        }
      }
    }
  }

  .van-field__error-message {
    text-align: right;
  }

  // 解决van-cell双层
  .van-cell:not(:last-child)::after {
    content: none;
  }

  .van-cell {
    padding: 15px 10px;
    background-color: $color-bg-primary;

    .van-cell__value {
      border-bottom: 1px solid $border-color;

      input {
        background-color: $color-bg-primary;
      }
    }
  }
}

</style>
