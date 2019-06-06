<template>
    <div :class="$style['login-wrap']">
      <van-tabs
        v-model="active"
        :line-width="15">
          <van-tab
            title="登录">
              <div :style="{height: '100%'}">
                <div
                  v-show="whichStep">
                  <van-cell-group>
                    <cellInput
                      @changeValue="changeValue"
                      @fillBackData="fillBackAccount"/>

                    <van-field
                      v-model="loginFormData.Password"
                      type="password"
                      label="登录密码"
                      @input="checkPassWord"
                      @blur="scrollPage"/>

                    <van-field
                        v-show="imgCodeShow"
                        :class="$style['img-input']"
                        v-model="loginFormData.ImgCode"
                        @input="imgCheck">
                        <img
                          :src="'data:image/png;base64,' + imgSrc"
                          slot="label"
                          :class="$style['img-code']"
                          @click="getImgCodeMethods"/>
                    </van-field>
                  </van-cell-group>
                  <van-row>
                    <van-col :span="24"><span><router-link to="/login/reset-pass-word">忘记密码？</router-link></span></van-col>
                  </van-row>
                </div>
                <div
                  :class="$style.merchantStyle"
                  v-show="!whichStep">
                  <h3>此手机号已经关联以下商户</h3>
                  <h3>请选择登录</h3>
                    <van-cell
                      v-for="(item,index) in merchantsList"
                      icon="mendian"
                      :class="{[$style.cellBorderActive] : (isActive == index)}"
                      :title="item.CustomerName"
                      :key="index"
                      @click="toggle(index,item)"
                      >
                      <template slot="right-icon">
                        <van-tag type="primary">{{item.IsManager ? '主账号' : '子账号'}}</van-tag>
                      </template>
                    </van-cell>
                </div>
                <van-button
                  :class="$style['login-button']"
                  type="default"
                  bottom-action
                  v-show="buttonShow"
                  :disabled="loginButtonStatus"
                  @click="postLogin">登录</van-button>
              </div>
              <!-- <registration
                v-show="index==2">
              </registration> -->
          </van-tab>
          <p :class="$style['terms-service']">登录即代表同意<span @click="popupShow = true">《服务条款》</span></p>
      </van-tabs>
      <van-popup  v-model="popupShow" position="right" :overlay="false">
        <TermsService @closePopup="popupShow = false"></TermsService>
      </van-popup>
    </div>
</template>

<script>
import { Tab, Tabs, CellGroup, Toast, Popup } from 'vant';
import registration from './components/LoginRegistration';
import cellInput from './components/CellInput';

import TermsService from './TermsService';
import Message from '@/api/Messge';
// import Users from '@/api/User';
import Account from '@/api/Account';
import { Base64 } from 'js-base64';

export default {
  name: 'loginPage',
  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-cell-group': CellGroup,
    [Popup.name]: Popup,
    registration,
    TermsService,
    cellInput,
  },

  data () {
    return {
      //登录表单数据
      loginFormData: {
        Account: '',
        Password: '',
        ImgCode: '',
        ImgCodeID: '',
      },
      loginButtonStatus: true,
      buttonStatus: true,
      loginErrorText: null,
      active: 0,
      imgSrc: '',
      imgCodeShow: false,
      whichStep: true,
      merchantsList: [],
      isActive: null,
      buttonShow: true,
      popupShow: false,
      loginData: null,
    };
  },
  methods: {
    fillBackAccount (data) {
      if (data) {
        this.loginFormData.Account = data.phone;
        this.loginFormData.Password = data.password;
        this.loginButtonStatus = false;
      }
    },
    changeValue (val) {
      this.loginFormData.Account = val;
    },
    scrollPage () {
      document.body.scrollTop = document.body.scrollHeight;
    },
    imgCheck (val) {
      this.loginButtonStatus = !(val.length > 0);
      return this.loginButtonStatus;
    },
    getTenantList () {
      this.merchantsList = this.loginData.MerchantList;
      if (this.merchantsList.length > 1) {
        this.buttonShow = false;
        this.whichStep = false;
        Toast.clear();
      } else {
        this.$store.commit('setUserInfo', this.loginData);
        this.$router.push({
          path: '/',
          query: {tenantID: this.merchantsList[0].TenantID},
        }, () => {
          Toast.clear();
        });
      }
      // Users.merchantList({phone: this.loginFormData.Account}).then((res) => {
      //   this.merchantsList = res.MerchantList;
      //   if (this.merchantsList.length > 1) {
      //     this.buttonShow = false;
      //     this.whichStep = false;
      //     Toast.clear();
      //   } else {
      //     this.$router.push({
      //       path: '/',
      //       query: {tenantID: this.merchantsList[0].TenantID},
      //     }, () => {
      //       Toast.clear();
      //     });
      //   }
      // });
    },
    randomNum (max) {
      let Num = '';
      for (let i = 0; i < max; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    },
    getImgCodeMethods () {
      let number = this.randomNum(6);
      Message.getImgCode({randomNum: number}).then((res) => {
        this.imgCodeShow = true;
        this.imgSrc = res.src;
        this.loginFormData.ImgCodeID = number;
      });
    },

    saveHistoryPhone () {
      let phoneList = null;

      if (localStorage.getItem('phoneHistory')) {
        phoneList = JSON.parse(localStorage.getItem('phoneHistory'));
        let index = phoneList.findIndex((item) => {
          return item.phone === this.loginFormData.Account;
        });
        index > -1 && phoneList.splice(index, 1);
      } else {
        phoneList = [];
      }

      phoneList.push({
        phone: this.loginFormData.Account,
        password: this.loginFormData.Password,
      });

      localStorage.setItem('phoneHistory', JSON.stringify(phoneList));
    },

    postLogin () {
      if (this.checkPhoneNumber()) {
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        });
        let requestParam = Object.assign({}, this.loginFormData);
        requestParam.openId = this.$store.state.openId;
        requestParam.Password = Base64.encode(requestParam.Password);
        this.$store.dispatch('login', requestParam).then((res) => {
          this.saveHistoryPhone();

          this.loginData = res;
          // this.$store.commit('setUserInfo', {Token: res.Token});
          if (res.FirstLogin) {
            this.$store.commit('setUserInfo', this.loginData);
            this.$router.push('/first-login');
            Toast.clear();
          } else {
            this.getTenantList();
          }
        },
        (res) => {
          let errorArr = ['2009000002', '2023000003', '2009000011'];
          if (errorArr.indexOf(res.ResponseStatus.ErrorCode) > -1) {
            //禁用提交按钮，同时清空图形验证码表单
            this.loginButtonStatus = true;
            this.loginFormData.ImgCode = '';
            this.getImgCodeMethods();
          } else {
            Toast.clear();
          }
        });
      }
    },
    checkPhoneNumber () {
      if (/^1\d{10}$/.test(this.loginFormData.Account)) {
        this.loginErrorText = null;
        return true;
      } else {
        this.loginErrorText = '手机号格式错误';
        return false;
      }
    },
    checkPassWord () {
      if (this.imgCodeShow) {
        if (this.imgCheck(this.loginFormData.ImgCode)) {
          this.loginButtonStatus = true;
        } else {
          this.loginButtonStatus = this.loginFormData.Password.length < 5;
        }
      } else {
        this.loginButtonStatus = this.loginFormData.Password.length < 5;
      }
    },
    toggle (index, val) {
      let formData;
      this.isActive = index;
      this.$dialog.confirm({
        title: `确认消息`,
        message: `是否跳转到“ ${val.CustomerName} ”`,
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            this.$store.commit('setUserInfo', this.loginData);
            formData = {
              Phone: this.loginFormData.Account,
              CustomerID: val.CustomerID,
              OpenID: this.$store.state.openId,
            };
            Account.loginById(formData).then((res) => {
              this.$store.commit('setUserInfo', {Token: res.Token});

              this.$store.dispatch('asyncfetchUserInfo').then((value) => {
                // window.location.href = `/${process.env.VUE_APP_BASE_URL}/`;
                // done();
                this.$store.commit('changeTabActive', 0);
                this.$router.push({
                  path: '/',
                  // query: {CustomerID: val.CustomerID},
                }, () => done());
              }, () => done());
            }, () => done());
          } else {
            done();
          }
        },
      });
    },

  },
  mounted: function () {
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.terms-service {
  margin-top: 10px;
  text-align: center;
  width: 100%;
  font-size: $font-size-special;
  color: $font-color-secondary;

  span {
    color: $color-primary;
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

.login-wrap {
  width: 100%;
  margin-top: -42px;
  position: absolute;
  top: 170px;
  bottom: 0;

  .van-popup {
    width: 100%;
  }

  .van-tabs {
    padding-top: 0;
    height: 100%;
  }

  .login-button {
    position: fixed;
    left: 0;
    bottom: 0;
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
    margin-top: 20px;

    a {
      color: $font-color-secondary;
    }
  }

  .van-tabs__content {
    padding: 47px 40px 0;
    margin-bottom: 60px;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    top: 0;
    bottom: 0;

    .van-tab__pane {
      height: 90%;
      overflow: auto;
      padding-top: 25px;
      box-sizing: border-box;
    }

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

  .merchantStyle {
    height: 90%;
    overflow: scroll;

    h3 {
      text-align: center;
      padding: 5px 0;
      color: $font-color-primary;
      font-size: $font-size-regular;
    }

    .van-cell-group {
      margin-top: 26px;
    }

    .cellBorderActive {
      border: 1px solid $color-primary !important;
      color: $color-primary !important;
    }

    .van-cell {
      padding: 12px 10px;
      margin-bottom: 10px;
      border-radius: $border-radius;
      border: 1px solid $border-color;
      color: $font-color-placeholder;
      position: relative;

      .van-icon-mendian {
        font-size: $font-size-regular;
        position: relative;
        top: -2px;
      }

      &:first-of-type {
        margin-top: 25px;
      }

      .van-tag {
        line-height: 25px;
        padding: 0 16px;
        width: 50px;
        height: 25px;
        text-align: center;
      }

      .van-cell__title {
        @include ellipsis(1);
      }
    }
  }
}
</style>
