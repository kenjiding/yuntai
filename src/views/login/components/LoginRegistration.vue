<template>
    <div :class="$style.registrationStyle">
        <van-cell-group>
            <div v-show="registrationDisable == 'registration'">
                <van-field
                    v-model="zhuceFormData.phone"
                    label="手机号码"
                    type="tel"
                    :error-message="errorText"
                    @input="numberLimit"
                    @blur="checkPhoneNumber(zhuceFormData.phone)" />

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
                    @input="phoneCodePass"
                    v-model="zhuceFormData.phoneCode"
                    :style="{paddingBottom: '70px'}"
                    type="tel">
                    <span
                    slot="label"
                    :class="$style['phoneCodeStyle']"
                    :style="{color:textColor}"
                    @click="getPhoneCode">{{phoneCodeText}}</span>
                </van-field>
            </div>
            <div v-show="registrationDisable == 'next'">
              <van-field
                type="text"
                v-model="zhuceFormData.userName"
                :error-message="nameErrorText"
                label="主体名称"
                @blur="checkName"/>
              <van-field
                type="password"
                v-model="zhuceFormData.passWord"
                label="设置密码"
                @blur="checkRepassword"/>
              <van-field
                type="password"
                v-model="repassWord"
                label="确认密码"
                :error-message="passWordErrorText"
                :style="{paddingBottom: '55px'}"
                @input="checkRepassword" />
            </div>
            <div
              :class="$style.merchantStyle"
              v-show="registrationDisable == 'shanghu'">
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
                    <van-tag type="primary">{{item.IsManager ? '主体' : '子账号'}}</van-tag>
                  </template>
                </van-cell>
            </div>
        </van-cell-group>
        <van-button
          type="default"
          bottom-action
          v-show="isShowButton"
          :class="$style.loginButton"
          :style="{ background: activeColor}"
          :disabled="buttonStatus"
          :loading="stopSubmit"
          @click="whitchLoginMethods">{{buttonText}}</van-button>
    </div>
</template>
<script>
import Users from '@/api/User';
import { Tab, Tabs, CellGroup, Toast, Popup } from 'vant';
import Message from '@/api/Messge';
import Account from '@/api/Account';
import TermsService from '../TermsService';
import { Base64 } from 'js-base64';

export default {
  name: 'loginPage',
  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-cell-group': CellGroup,
    [Popup.name]: Popup,
    TermsService,
  },

  data () {
    return {
      // 注册表单数据
      zhuceFormData: {
        phone: '',
        phoneCode: '',
        passWord: '',
        userName: '',
        Random: '',
      },
      imgText: '',
      repassWord: '',
      isActive: null,
      phoneCodeText: '获取验证码',
      activeColor: null,
      // 判断底部的按钮显示或者隐藏
      buttonStatus: true,
      errorText: null,
      passWordErrorText: null,
      textColor: '#007aff',
      isCodePass: true,
      // 判断登录注册组件的隐藏显示
      registrationDisable: 'registration',
      merchantsList: [],
      isShowButton: true,
      nameErrorText: null,
      imgCodeShow: false,
      imgSrc: '',
      stopSubmit: false,
      globalRandomCode: null,
    };
  },

  mounted () {
    //移动端:active伪类无效的解决方法
    document.body.addEventListener('touchstart', _ => {});
  },

  computed: {
    buttonText () {
      switch (this.registrationDisable) {
      case 'next':
        return '注册';
      case 'shanghu':
        return '继续注册为主体';
      default:
        return '下一步';
      }
    },
  },

  methods: {
    numberLimit (val) {
      if (val.length >= 11) {
        this.zhuceFormData.phone = val.slice(0, 11);
      }
    },
    randomNum (max) {
      let Num = '';
      for (let i = 0; i < max; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    },
    toggle (index, val) {
      let formData;
      this.isActive = index;
      this.$dialog.confirm({
        title: `确认消息`,
        message: `是否跳转到“ ${val.CustomerName} ”`,
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            formData = {
              Phone: this.zhuceFormData.phone,
              CustomerID: val.CustomerID,
              OpenID: this.$store.state.openId,
            };
            Account.loginById(formData).then((res) => {
              this.$store.commit('setUserInfo', {Token: res.Token});

              this.$store.dispatch('asyncfetchUserInfo').then((value) => {
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
    postNextLogin () {
      this.stopSubmit = true;
      Users.checkPhoneCode({
        phone: this.zhuceFormData.phone,
        phoneCode: this.zhuceFormData.phoneCode,
        Random: this.globalRandomCode,
      }).then((res) => {
        this.stopSubmit = false;
        this.$store.commit('setUserInfo', {Token: res.Token});

        if (res.Success) {
          // 获取该手机号绑定的门店列表
          this.getMechantsList();
        } else {
          Toast.fail('手机验证码验证失败');
        }
      }, () => {
        this.stopSubmit = false;
      });
    },
    getMechantsList () {
      Users.merchantList({
        phone: this.zhuceFormData.phone,
        phoneCode: this.zhuceFormData.phoneCode,
      }).then((res) => {
        this.activeColor = null;
        this.buttonStatus = true;
        if (res.MerchantList.length) {
          this.registrationDisable = 'shanghu';
          this.activeColor = '#077AFF';
          this.buttonStatus = false;
          //判断商户类型是否为Manager，如果是就隐藏按钮，不是就显示按钮
          this.isShowButton = !res.MerchantList.some(item => {
            return item.IsManager;
          });
          this.merchantsList = res.MerchantList;
        } else {
          this.registrationDisable = 'next';
        }
      });
    },
    resetFormData (obj) {
      // 重置表单数据
      Object.keys(obj).forEach(element => {
        obj[element] = '';
      });
    },
    postZhuceMethods () {
      this.stopSubmit = true;
      let requestParam = Object.assign({}, this.zhuceFormData);
      requestParam.openId = this.$store.state.openId;
      requestParam.passWord = Base64.encode(requestParam.passWord);

      Users.registration(requestParam).then((res) => {
        this.$store.commit('setUserInfo', {Token: res.Token});

        this.$store.dispatch('asyncfetchUserInfo').then(() => {
          this.$router.replace({
            path: '/',
            query: {
              isShowCreateTenant: 'true',
              TenantID: res.TenantID,
            },
          });
          this.stopSubmit = false;
        });
      }, () => {
        this.stopSubmit = false;
      });
    },
    postmerchantsMethods () {
      this.registrationDisable = 'next';
      this.buttonStatus = true;
      this.activeColor = null;
    },
    whitchLoginMethods () {
      let postMethods = {
        // 检查手机号和手机验证码是否正确
        registration: this.postNextLogin,
        next: this.postZhuceMethods,
        shanghu: this.postmerchantsMethods,
      };
      postMethods[this.registrationDisable]();
    },
    checkName () {
      this.checkRepassword();
      if (this.zhuceFormData.userName === '') {
        this.nameErrorText = '请填写主体名称';
        this.buttonStatus = true;
        this.activeColor = null;
      } else {
        this.nameErrorText = null;
      }
      // this.nameErrorText = this.zhuceFormData.userName === '' ? '请填写主体名称' : null;
    },
    checkPasswordLength () {
      return this.zhuceFormData.passWord.length < 6;
    },
    checkRepassword () {
      //检查第一步：密码为空，不做操作
      if (!this.zhuceFormData.passWord) {
        return;
      }
      //检查第二步：密码长度小于6，禁止提交
      if (this.checkPasswordLength()) {
        Toast('密码长度小于6位数');
        this.buttonStatus = true;
        this.activeColor = null;
        return;
      }
      //检查第三步：检查两次输入的密码是否一致
      if (this.zhuceFormData.passWord !== this.repassWord) {
        this.passWordErrorText = '两次密码不一致';
        this.activeColor = null;
        this.buttonStatus = true;
      } else {
        this.passWordErrorText = null;
        if (this.zhuceFormData.userName === '') {
          return;
        }
        this.activeColor = '#077AFF';
        this.buttonStatus = false;
      }
    },
    phoneCodePass (val) {
      if (val.length === 6) {
        this.activeColor = '#077AFF';
        this.buttonStatus = false;
      } else {
        this.activeColor = null;
        this.buttonStatus = true;
      }
    },
    checkPhoneNumber (phone) {
      //手机号正则
      let phonePass = /^1\d{10}$/.test(phone);

      if (phonePass) {
        this.errorText = null;
      } else {
        this.errorText = '手机号格式错误';
      }
    },

    getImgCodeMethods () {
      this.globalRandomCode = this.randomNum(6);
      Message.getImgCode({randomNum: this.globalRandomCode}).then((res) => {
        this.imgCodeShow = true;
        this.imgSrc = res.src;
      });
    },

    getPhoneCode () {
      let stopTimeOut;
      let time = 60;
      let that = this;
      let phonePass = /^1\d{10}$/.test(this.zhuceFormData.phone);
      if (phonePass && this.isCodePass) {
        //点击，立刻将'获取验证码'颜色变成灰色，并且立刻开始倒计时
        this.textColor = '#999999';
        stopTimeOut = timeWait();
        //标记 获取验证码倒计时
        this.isCodePass = false;
        Message.getPhoneCode({
          phone: this.zhuceFormData.phone,
          randomCode: this.globalRandomCode,
          Code: this.imgText,
        }).then((res) => {
          if (res.success) {
            this.zhuceFormData.Random = this.globalRandomCode;
            Toast.success('验证码发送成功');
          } else {
          // 当发送验证码失败，终止倒计时
            clearTimeout(stopTimeOut);
            time = -1;
            // 终止倒计时，并将字体颜色换成蓝色
            that.textColor = '#007aff';
            that.isCodePass = true;
            Toast.fail('验证码发送失败,请重新获取');
          }
        },
        (res) => {
          // 当发送验证码失败，终止倒计时
          clearTimeout(stopTimeOut);
          time = -1;
          // 终止倒计时，并将字体颜色换成蓝色
          that.textColor = '#007aff';
          that.isCodePass = true;

          if (res.ResponseStatus.ErrorCode === '2023000002' ||
          res.ResponseStatus.ErrorCode === '2023000003') {
            this.getImgCodeMethods();
          }
        });
      }
      function timeWait () {
        return setTimeout(function () {
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
  },
};
</script>
<style lang="scss" module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

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

.registrationStyle {
  height: auto;
  overflow: scroll;

  .van-popup {
    width: 100%;
  }

  .merchantStyle {
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

    // 解决van-cell双层
    .van-cell:not(:last-child)::after {
      content: none;
    }

    .van-cell {
      padding: 12px 10px;
      margin-bottom: 10px;
      border-radius: $border-radius;
      border: 1px solid $border-color;
      color: $font-color-placeholder;

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

  .loginButton {
    position: fixed;
    left: 0;
    bottom: 0;
  }
}
</style>
