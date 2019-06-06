<template>
  <ych-page :class="$style.newBankCart">
    <page-header
        slot="header"
        title="完善资料"
        left-arrow
        @click-left="$router.push('/')">
    </page-header>
    <div :class="$style.mainContentwrap">
    <div
      v-show="remindTextShow"
      :class="$style['remind-text']">{{topText}}</div>
    <div
      :class="$style.contentWrap">
      <p :class="$style.iconText">商户信息</p>
      <van-cell-group>
        <van-field
          v-model="bankCartFormData.TenantName"
          label="商户名称"
          placeholder="请输入"
          :disabled="allEditStatus"
          required
        />
        <van-field
          v-model="bankCartFormData.BusinessID"
          label="营业执照号"
          placeholder="请输入营业执照注册号"
          :disabled="allEditStatus"
          required
        />
        <van-field
          v-model="bankCartFormData.PhoneNum"
          label="客服电话"
          placeholder="请填写"
          type="tel"
          :disabled="allEditStatus"
          required
        />
        <van-field
          v-model="bankCartFormData.Address"
          label="门店地址"
          placeholder="请输入"
          :disabled="allEditStatus"
          required
        />
      </van-cell-group>
      <p :class="$style.iconText">银行卡账户信息</p>
      <van-cell-group>
        <van-field
          v-model="bankCartFormData.BankName"
          label="开户银行"
          placeholder="请输入"
          disabled
          @click.native="pickerShow = !allEditStatus"
          required
        />
        <van-field
          v-model="bankCartFormData.BankArea"
          label="开户地区"
          placeholder="请输入"
          required
          @click.native="areaShow = !allEditStatus"
          disabled
        />
        <van-field
          v-model="bankCartFormData.BankBranch"
          label="开户支行"
          placeholder="请填写"
          :disabled="allEditStatus"
          required
        />
        <van-field
          v-model="bankCartFormData.BankId"
          label="银行卡卡号"
          placeholder="请输入"
          :disabled="allEditStatus"
          required
        />
      </van-cell-group>
      <p :class="$style.iconText">上传照片</p>
      <div
        :class="$style.uploadImg">
        <p pname>
          <img-upload
            bottom-text="身份证正面"
            :icon-show="addIconShow"
            :mark-text="markTextShow"
            :uploadStatus="allEditStatus"
            :imgSource='PositiveIdCard'
            @afterRead="(file) => postImgData(file, 'PositiveIdCard')"></img-upload>
        </p>
        <p>
          <img-upload
            bottom-text="身份证背面"
            :icon-show="addIconShow"
            :mark-text="markTextShow"
            :uploadStatus="allEditStatus"
            :imgSource='ReverseIdCard'
            @afterRead="(file) => postImgData(file, 'ReverseIdCard')"></img-upload>
        </p>
        <p pname>
          <img-upload
            bottom-text="营业执照"
            :icon-show="addIconShow"
            :mark-text="markTextShow"
            :uploadStatus="allEditStatus"
            :imgSource='BusinessIDSrc'
            @afterRead="(file) => postImgData(file, 'BusinessIDSrc')"></img-upload>
        </p>
        <p>
          <img-upload
            bottom-text="店铺门头照"
            :icon-show="addIconShow"
            :mark-text="markTextShow"
            :uploadStatus="allEditStatus"
            :imgSource='TenantImgSrc'
            @afterRead="(file) => postImgData(file, 'TenantImgSrc')"></img-upload>
        </p>
      </div>
    </div>
    </div>
    <van-button
      :class="$style.loginButton"
      type="default"
      bottom-action
      :style="{ background: activeColor}"
      :disabled="allEditStatus"
      @click="postFormBefore">提交</van-button>
    <van-popup v-model="pickerShow" position="bottom">
      <van-picker
        show-toolbar
        title="选择银行"
        :columns="bankColumns"
        @cancel="pickerShow = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <Area
      :visible="areaShow"
      @cancel="areaShow = false"
      @confirm="selectItem"/>
  </ych-page>
</template>

<script>
import { Toast, Uploader, Picker, Popup } from 'vant';
import imgUpload from './components/ImgUpload';
import checkData from '@/views/packge/tool/checkFormData';
import IdentityApi from '@/api/Identity';
import PageHeader from '@/components/PageHeader';
import columnsData from './config/data';
import Area from '@/components/Area';

export default {
  name: '',
  data () {
    return {
      bankCartFormData: {
        TenantName: '',
        BusinessID: '',
        PhoneNum: '',
        Address: '',
        BankName: '',
        BankArea: '',
        BankBranch: '',
        BankId: '',
        PositiveIdCard: '',
        ReverseIdCard: '',
        BusinessIDSrc: '',
        TenantImgSrc: '',
      },
      PositiveIdCard: '',
      ReverseIdCard: '',
      BusinessIDSrc: '',
      TenantImgSrc: '',
      activeColor: null,
      //控制顶部的提示文字的显示隐藏
      remindTextShow: false,
      // 顶部的提示文字的内容
      topText: '',
      //控制上传组件中间的 + 号icon的显示隐藏
      addIconShow: true,
      //回填信息的时候，控制上传组件底部的文字的显示隐藏
      markTextShow: false,
      //控制上传组件是否禁止使用 , 控制回填信息后，input标签是否可以输入
      editStatus: false,
      bankColumns: columnsData,
      pickerShow: false,
      areaShow: false,
    };
  },

  computed: {
    allEditStatus () {
      if (this.$route.query.isFillBack === 'true') {
        return !this.editStatus;
      } else {
        return false;
      }
    },
  },

  components: {
    'van-uploader': Uploader,
    imgUpload,
    Toast,
    PageHeader,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    Area,
  },
  methods: {
    selectItem (val) {
      this.bankCartFormData.BankArea = '';
      this.areaShow = false;
      let areaCode = val.some((item) => {
        return item.code === '-1';
      });
      if (areaCode) {
        Toast('请选择完整的地区信息');
        return;
      }
      val.forEach(item => {
        this.bankCartFormData.BankArea += item.name;
      });
    },
    onConfirm (val) {
      this.bankCartFormData.BankName = val.text;
      this.pickerShow = false;
    },
    postImgData (file, text) {
      this.bankCartFormData[text] = file;
    },
    postFormBefore () {
      let ignoreArr = ['TenantImgSrc'];
      if (this.$route.query.isFillBack === 'true') {
        ignoreArr.push('PositiveIdCard', 'ReverseIdCard', 'BusinessIDSrc', 'StatusText', 'IsEdit');
      }
      let dataPass = checkData({
        data: this.bankCartFormData,
        ignore: ignoreArr,
        message: {
          TenantName: '请填写商户名称',
          BusinessID: '请填写营业执照',
          PhoneNum: '请填写客服电话',
          Address: '请填写门店地址',
          BankName: '请选择开户银行',
          BankArea: '请选择开户地区',
          BankBranch: '请填写开户支行',
          BankId: '请填写银行卡号',
          PositiveIdCard: '请上传身份证正面照',
          ReverseIdCard: '请上传身份证反面照',
          BusinessIDSrc: '请上传营业执照',
        },
      });

      if (!dataPass) {
        return;
      }

      if (/\d{3}(\s|-)?\d{8}|\d{4}(\s|-)?\d{7}/.test(this.bankCartFormData.PhoneNum) &&
      this.bankCartFormData.PhoneNum.length <= 12) {
        this.postBankCartForm();
      } else {
        if (/^\d{7,12}$/.test(this.bankCartFormData.PhoneNum)) {
          this.postBankCartForm();
        } else {
          Toast('客户电话格式错误!');
        }
      }
    },
    postBankCartForm () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      if (this.editStatus) {
        //发送编辑资料请求
        IdentityApi.editIdentityData(this.bankCartFormData).then((res) => {
          this.$router.push('/', () => Toast.clear());
        }, () => Toast.clear());
      } else {
        //发送完善资料请求
        IdentityApi.postIdentityData(this.bankCartFormData).then((res) => {
          this.$router.push('/', () => Toast.clear());
        }, () => Toast.clear());
      }
    },
    fillBackData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      IdentityApi.getIdentityData().then((res) => {
        this.bankCartFormData.TenantName = res.TenantName;
        this.bankCartFormData.BusinessID = res.BusinessID;
        this.bankCartFormData.PhoneNum = res.PhoneNum;
        this.bankCartFormData.Address = res.Address;
        this.bankCartFormData.BankName = res.BankName;
        this.bankCartFormData.BankArea = res.BankArea;
        this.bankCartFormData.BankBranch = res.BankBranch;
        this.bankCartFormData.BankId = res.BankId;

        this.PositiveIdCard = res.PositiveIdCard;
        this.ReverseIdCard = res.ReverseIdCard;
        this.BusinessIDSrc = res.BusinessIDSrc;
        this.TenantImgSrc = res.TenantImgSrc;

        this.topText = res.StatusText;
        this.editStatus = res.IsEdit;
        this.remindTextShow = !!res.StatusText;
        Toast.clear();
      }, () => {
        Toast.clear();
      });
    },
  },

  created: function () {
    if (this.$route.query.isFillBack === 'true') {
      this.addIconShow = false;
      this.markTextShow = true;
      this.remindTextShow = true;
      this.fillBackData();
    }
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.mainContentwrap {
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.remind-text {
  width: 100%;
  background-color: rgba(229, 75, 94, .2);
  padding: 10px 20px;
  text-align: left;
  box-sizing: border-box;
  line-height: 18px;
  font-size: $font-size-special;
  color: $color-danger;
}

.newBankCart {
  background-color: $color-bg-regular;

  .ych-page__content {
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .loginButton {
    // background: $color-primary;
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .contentWrap {
    width: 90%;
    margin: 0 auto 80px;
    padding: 5px 0;

    .van-row {
      .van-col--12 {
        font-size: $font-size-primary;
      }
    }

    .uploadImg {
      font-size: $font-size-regular;
      display: flex;
      flex-wrap: wrap;

      [pname] {
        margin-right: 8px;
        margin-bottom: 5px;
      }
    }

    .van-cell {
      border-bottom: 1px solid $border-color;

      .van-cell__title {
        color: $font-color-regular;
      }

      .van-cell__value {
        input {
          text-align: right;
          color: $font-color-placeholder;
        }
      }
    }

    [class*="van-hairline"]::after {
      content: none;
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
