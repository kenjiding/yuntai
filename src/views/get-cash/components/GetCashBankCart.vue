<template>
  <div :class="$style.newBankCart">
    <van-nav-bar
        :class="$style.cashWrapNavBar"
        :title="stepTitle"
        left-arrow
        @click-left="$emit('closeBankCardPage')"
    />
    <div
      :class="$style.contentWrap">
      <van-row :class="$style.rowCellStyle">
        <van-col :span="12">商户类型</van-col>
        <van-col :span="12">个人</van-col>
      </van-row>
      <p :class="$style.iconText">负责人信息</p>
      <van-cell-group>
        <van-field
          v-model="bankCartFormData.name"
          label="姓名"
          placeholder="请输入真实姓名"
          required
        />
        <van-field
          v-model="bankCartFormData.phoneNum"
          label="手机号码"
          placeholder="请填写手机号码"
          required
        />
        <van-field
          v-model="bankCartFormData.phoneCode"
          placeholder="请填写验证码"
          required
        >
          <span slot="label"
            :style="{color:textColor}"
            @click="getPhoneCodeMethod">{{phoneCodeText}}</span>
        </van-field>
        <van-field
          v-model="bankCartFormData.email"
          label="邮箱"
          placeholder="请输入常用邮箱"
          required
        />
      </van-cell-group>
      <p :class="$style.iconText">经营场地信息</p>
      <van-cell-group>
        <van-field
          v-model="bankCartFormData.aera"
          label="所在地区"
          placeholder="请选择"
          required
          @focus="showAreaList"
        />
        <van-field
          v-model="bankCartFormData.userName"
          label="商户名称"
          placeholder="请填写"
          required
        />
        <van-field
          v-model="bankCartFormData.address"
          label="详细地址"
          placeholder="请填写"
          required
        />
        <van-field
          v-model="bankCartFormData.telePhone"
          label="客服电话"
          placeholder="请输入"
          required
        />
      </van-cell-group>
      <p :class="$style.iconText">银行卡账户信息</p>
      <van-cell-group>
        <van-field
          v-model="bankCartFormData.name"
          label="身份证"
          placeholder="请输入身份证号码"
          required
        />
        <van-field
          v-model="bankCartFormData.name"
          label="开户银行"
          placeholder="请输入"
          required
        />
        <van-field
          v-model="bankCartFormData.phoneNum"
          label="开户地区"
          placeholder="请输入"
          required
        />
        <van-field
          v-model="bankCartFormData.phoneCode"
          label="开户支行"
          placeholder="请填写"
          required
        />
        <van-field
          v-model="bankCartFormData.email"
          label="银行卡卡号"
          placeholder="请输入"
          required
        />
      </van-cell-group>
      <p :class="$style.iconText">上传照片</p>
      <van-row
        :class="$style.uploadImg">
        <van-col
          :span="8">
          <van-uploader
            :after-read="upload_step_one">
            <van-icon name="tianjia" />
          </van-uploader>
        </van-col>
        <van-col
          :span="8">
          <van-uploader
            :after-read="upload_step_two">
            <van-icon name="tianjia" />
          </van-uploader>
        </van-col>
        <van-col
          :span="8">
          <van-uploader
            :after-read="upload_step_three">
            <van-icon name="tianjia" />
          </van-uploader>
        </van-col>
        <van-col
          :span="8">
          <van-uploader
            :after-read="upload_step_four">
            <van-icon name="tianjia" />
          </van-uploader>
        </van-col>
        <van-col
          :span="8">
          <van-uploader
            :after-read="upload_step_five">
            <van-icon name="tianjia" />
          </van-uploader>
        </van-col>
      </van-row>
    </div>
    <van-popup v-model="show">
      <van-area :area-list="areaList" />
    </van-popup>
    <van-button
        :class="$style.loginButton"
        type="default"
        bottom-action
        :style="{ background: activeColor}"
        :disabled="buttonStatus"
        @click="postBankCartForm">提交</van-button>
  </div>
</template>

<script>
import { Area, Popup, Toast, Uploader } from 'vant';
import areaListData from './area.js';
import Message from '@/api/Messge';
import imgUpload from './imgUpload.js';

export default {
  name: '',
  data () {
    return {
      stepTitle: '绑定银行卡',
      bankCartFormData: {
        name: '',
        phoneNum: '',
        phoneCode: '',
        email: '',
        area: '',
        address: '',
        telePhone: '',
        userName: '',
      },
      activeColor: null,
      buttonStatus: true,
      show: false,
      areaList: {},
      phoneCodeText: '获取验证码',
      textColor: '#007aff',
      isCodePass: true,
    };
  },

  components: {
    'van-area': Area,
    'van-popup': Popup,
    'van-uploader': Uploader,
    imgUpload,
  },

  methods: {
    upload_step_one (file) {
      document.getElementsByClassName('van-col-8')[0].style.backgroundImage = `url(${file.content})`;
    },
    upload_step_two (file) {
      document.getElementsByClassName('van-col-8')[1].style.backgroundImage = `url(${file.content})`;
    },
    upload_step_three (file) {
      document.getElementsByClassName('van-col-8')[2].style.backgroundImage = `url(${file.content})`;
    },
    upload_step_four (file) {
      document.getElementsByClassName('van-col-8')[3].style.backgroundImage = `url(${file.content})`;
    },
    upload_step_five (file) {
      document.getElementsByClassName('van-col-8')[4].style.backgroundImage = `url(${file.content})`;
    },
    randomNum (max) {
      var Num = '';
      for (var i = 0; i < max; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    },
    getPhoneCodeMethod () {
      var time = 10;
      var that = this;
      var phonePass = /^1\d{10}$/.test(this.bankCartFormData.phoneNum);
      if (phonePass && this.isCodePass) {
        Message.getPhoneCode({
          phone: this.bankCartFormData.phoneNum,
          randomCode: this.randomNum(6),
        }).then(res => {
          if (res.success) {
            //标记 获取验证码倒计时
            this.isCodePass = false;
            this.textColor = '#999999';
            timeWait(time);
            Toast.success('验证码发送成功');
          } else {
            Toast.fail('验证码发送失败，请重新获取');
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
    postBankCartForm () {},
    showAreaList () {
      this.areaList = areaListData;
      this.show = true;
    },
  },

  mounted: function () {
    this.areaList = areaListData;
    // if (/Android/.test(navigator.appVersion)) {
    //   window.addEventListener('resize', function () {
    //     if (
    //       document.activeElement.tagName === 'INPUT' ||
    //       document.activeElement.tagName === 'TEXTAREA'
    //     ) {
    //       document.activeElement.scrollIntoView();
    //     }
    //   });
    // }
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.newBankCart {
  background-color: $color-bg-regular;
  height: 100%;
  overflow: auto;

  .loginButton {
    // background: $color-primary;
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .contentWrap {
    width: 90%;
    margin: 0 auto 60px;
    padding: 60px 0;

    .van-row {
      .van-col--12 {
        font-size: $font-size-primary;
      }
    }

    .uploadImg {
      font-size: $font-size-regular;
      display: flex;
      flex-wrap: wrap;

      .van-col--8 {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 32%;
        background-color: $color-white;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border: 1px solid $border-color;
        margin: 2px;

        // .van-icon-tianjia {
        //   font-size: 35px;
        //   color: $font-color-placeholder;
        //   text-align: center;

        //   &::after {
        //     content: '';
        //     display: block;
        //     font-size: 11px;
        //     padding-top: 10px;
        //   }
        // }
        .van-icon-tianjia {
          font-size: 35px;
          color: $font-color-placeholder;
          text-align: center;

          &::after {
            display: block;
            font-size: 11px;
            padding-top: 10px;
          }
        }

        &:nth-child(1) {
          .van-icon-tianjia {
            &::after {
              content: '身份证正面';
            }
          }
        }

        &:nth-child(2) {
          .van-icon-tianjia {
            &::after {
              content: '身份证背面';
            }
          }
        }

        &:nth-child(3) {
          .van-icon-tianjia {
            &::after {
              content: '银行卡正面';
            }
          }
        }

        &:nth-child(4) {
          .van-icon-tianjia {
            &::after {
              content: '手持身份证正面';
            }
          }
        }

        &:nth-child(5) {
          .van-icon-tianjia {
            &::after {
              content: '手持身份证背面';
            }
          }
        }
      }
    }

    .van-cell {
      border-bottom: 1px solid $border-color;

      .van-cell__value {
        input {
          text-align: right;
        }
      }
    }

    [class*="van-hairline"]::after {
      content: none;
    }

    .rowCellStyle {
      background: $color-white;

      .van-col {
        padding: 15px;
        border-bottom: 1px solid $border-color;

        &:last-of-type {
          text-align: right;
        }
      }
    }
  }

  .iconText {
    position: relative;
    padding: 10px 15px;
    font-size: $font-size-special;
    font-weight: 550;
    color: $font-color-placeholder;
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
