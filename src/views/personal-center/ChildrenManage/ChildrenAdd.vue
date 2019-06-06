<template>
  <ych-page>
    <div :class="$style['person-info-wrap']">
      <van-cell-group>
        <p :class="$style.iconText">基础信息</p>
        <van-field
          v-model="formData.name"
          label="姓名"
          placeholder="请输入账号姓名"
        />
        <van-field
          v-model="formData.phoneNum"
          label="手机号"
          type="tel"
          placeholder="请输入11位数的手机号"
          :disabled="phoneInput"
          @input="limitPhone"
          @blur="chckePhoneNum"
        />
        <p :class="$style.iconText">账号权限</p>
        <van-cell
          title="角色"
          :value="formData.role ? roleName : '请选择账号所属角色'"
          @click="popupShow = true"
          is-link/>
        <van-cell
          v-show="formData.role !== 'Admin'"
          title="门店权限"
          :value="(permissionList.length + '家') || '请选择门店权限'"
          @click="StoreSelectPopupShow = true"
          is-link/>
      </van-cell-group>

      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          show-toolbar
          title="角色"
          :columns="columns"
          @cancel="popupShow = false"
          @confirm="onConfirm"
        />
      </van-popup>

      <div :class="$style['person-info-footer']">
        <van-button
          plain
          type="primary"
          :class="$style['package-delect-button']"
          v-show="buttonStatus"
          @click="deleteItem">删除</van-button>

        <van-button
          type="primary"
          :class="{
            [$style['package-save-button']]: true,
            [$style['package-save-button--full']]: !buttonStatus,
          }"
          @click="saveFormData">保存</van-button>
      </div>
    </div>

    <div
      v-show="!buttonStatus"
      :class="$style['placeholder-text']">注: 新增账号后, 密码会通过短信发送到当前账号手机</div>

    <van-popup
      v-model="StoreSelectPopupShow"
      position="right"
      :overlay="false"
      :style="{width: '100%'}">
      <StoreSelect
        @changePopupShow="StoreSelectPopupShow = false"
        :select-show="StoreSelectPopupShow"
        :default-select.sync="permissionList"></StoreSelect>
    </van-popup>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast, Picker, Popup } from 'vant';
import StoreSelect from './StoreSelect';
import checkData from '@/views/packge/tool/checkFormData';

export default {
  name: '',
  data () {
    return {
      formData: {
        name: '',
        phoneNum: '',
        role: '',
      },
      permissionList: [],
      stopSubmit: true,
      titleText: '新增子账号',
      defaultTenant: true,
      buttonStatus: false,
      popupShow: false,
      StoreSelectPopupShow: false,
      phoneInput: false,
      columns: [
        {text: '超级管理员', id: 'Admin'},
        {text: '店长', id: 'Manager'},
        {text: '收银员', id: 'Employee'},
        {text: '合伙人', id: 'Partner'},
      ],
    };
  },
  computed: {
    roleName: {
      get () {
        return this.columns.find((val) => {
          if (val.id === this.formData.role) {
            return val;
          }
        }).text;
      },
    },
  },
  components: {
    PageHeader,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    StoreSelect,
  },
  beforeRouteLeave (to, from, next) {
    Toast.clear();
    next();
  },
  methods: {
    chckePhoneNum () {
      if (!/^1\d{10}$/.test(this.formData.phoneNum)) {
        Toast('手机号码格式错误');
        return false;
      } else {
        return true;
      }
    },
    limitPhone (val) {
      if (val.length >= 11) {
        this.formData.phoneNum = val.slice(0, 11);
      }
    },
    deleteItem () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此子账号？',
        theme: 'danger',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            PersonApi.deleteChildAccount({ID: this.$route.query.uid}).then((res) => {
              done();
              Toast.success('删除成功');
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }, () => done());
          } else {
            done();
          }
        },
      });
    },
    saveFormData () {
      let dataPass = checkData({
        data: this.formData,
        ignore: ['permissionList'],
        message: {
          name: '请填写姓名',
          phoneNum: '请填写手机号',
          role: '请选择角色',
        },
      });

      if (this.formData.role === 'Admin') {
        this.permissionList = [];
      } else if (this.permissionList.length <= 0) {
        Toast('请选择门店权限');
        return;
      }

      if (dataPass && this.chckePhoneNum()) {
        this.$route.query.isEdit === 'true' ? this.edit() : this.add();
      }
    },
    returnManagePage () {
      this.$router.replace('/personal-center-children-manage', _ => Toast.clear());
    },
    edit () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      this.formData.ID = this.$route.query.uid;
      this.formData.permissionList = this.permissionList;
      PersonApi.editChildAccount(this.formData).then((res) => {
        this.returnManagePage();
      });
    },
    add () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });

      this.formData.permissionList = this.permissionList;
      PersonApi.addChildAccount(this.formData).then((res) => {
        this.returnManagePage();
      });
    },
    onConfirm (val) {
      this.formData.role = val.id;
      this.popupShow = false;
    },
    getChildrenData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      PersonApi.getChildAccountInfo({ID: this.$route.query.uid}).then((res) => {
        this.formData.name = res.name;
        this.formData.phoneNum = res.phoneNum;
        this.formData.role = res.role;
        this.permissionList = res.permissionList;
        this.titleText = res.childName;
        Toast.clear();
      });
    },
  },

  created: function () {
    if (this.$route.query.isEdit === 'true') {
      this.buttonStatus = true;
      this.phoneInput = true;
      this.getChildrenData();
    }
  },

};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.placeholder-text {
  margin: 20px 0;
  text-align: center;
  font-size: $font-size-special;
  color: $font-color-placeholder;
}

.iconText {
  position: relative;
  padding: 10px 12px;
  font-size: $font-size-special;
  color: $font-color-placeholder;
}

.header-icon-right {
  font-size: $font-size-secondary;
  margin-top: -3px;
}

.person-info-wrap {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;

  [class*=van-hairline]::after {
    content: none;
  }

  [class*=van-cell]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .van-field--disabled {
      .van-cell__value {
        color: $font-color-placeholder !important;
      }
    }

    .van-cell {
      width: 100vw;
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      input {
        text-align: right;
      }
    }
  }

  &-top {
    margin-bottom: 15px;
  }

  .person-info-footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 5px 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;

    .package-delect-button {
      width: 45%;
      border-radius: $border-radius-small;
    }

    .package-save-button {
      width: 45%;
      border-radius: $border-radius-small;

      &--full {
        width: 95%;
      }
    }
  }
}
</style>
