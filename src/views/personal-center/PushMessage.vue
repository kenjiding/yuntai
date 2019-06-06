<template>
  <ych-page>
    <page-header
      slot="header"
      title="推送设置"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="checkData">
      <van-icon
        name="save"
        slot="right"/>
    </page-header>
    <div :class="$style['person-info-wrap']">
      <van-cell-group :style="{ marginBottom: '50px'}">
        <div :class="$style.selectItem">
          <van-cell>
            <template slot="title">
              <span class="van-cell-text">每日经营数据</span>
              <span class="van-cell-text">(次日8:00)</span>
            </template>
            <van-switch v-model="formData.manageData" slot="right-icon" size="26px" />
          </van-cell>
          <van-cell
            :class="$style['topTitle']"
            title="请选择推送人"
            v-show="formData.manageData"
            is-link :value="ManageAcount+'推送人'"
            @click="messageHandle" />
        </div>
        <div :class="$style.selectItem">
          <van-cell>
            <template slot="title">
              <span class="van-cell-text">设备离线通知</span>
              <span class="van-cell-text">(8:00-22:00推送)</span>
            </template>
            <van-switch
              v-model="formData.deviceStatus"
              slot="right-icon"
              size="26px" />
          </van-cell>
          <van-cell
            :class="$style['topTitle']"
            v-show="formData.deviceStatus"
            title="请选择推送人"
            is-link :value=" DeviceAcount + '推送人'"
            @click="deviceHandle" />
        </div>
        <div
          :class="$style.selectItem">
          <van-cell>
            <template slot="title">
              <span class="van-cell-text">礼品库存预警通告</span>
              <span class="van-cell-text">(8:00-22:00推送)</span>
            </template>
            <van-switch v-model="formData.giftStatus" slot="right-icon" size="26px" />
          </van-cell>
          <van-cell
            :class="$style['topTitle']"
            title="请选择推送人"
            v-show="formData.giftStatus"
            is-link :value="GiftAcount + '推送人'"
            @click="giftHandle" />
        </div>

        <div :class="$style.selectItem">
          <van-cell>
            <template slot="title">
              <span class="van-cell-text">福袋活动通知</span>
              <span class="van-cell-text">(8:00-22:00推送)</span>
            </template>
            <van-switch
              v-model="formData.goodyBagStatus"
              slot="right-icon"
              size="26px" />
          </van-cell>
          <van-cell
            :class="$style['topTitle']"
            v-show="formData.goodyBagStatus"
            title="请选择推送人"
            is-link :value=" GoodyBagAcount + '推送人'"
            @click="goodyBagHandle" />
        </div>
      </van-cell-group>
    </div>
    <van-popup v-model="popupshow" position="right" :class="$style.popup">
      <select-people
        :default-user="defaultUser"
        :account-list="accountList"
        @closePoupu="popupshow = false"
        @returnResult="selectNum"></select-people>
    </van-popup>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast, Checkbox, CheckboxGroup, Popup } from 'vant';
import selectPeople from './components/SelectMessagePeople';
import User from '@/api/User';

export default {
  name: '',
  data () {
    return {
      formData: {
        manageData: false,
        deviceStatus: false,
        giftStatus: false,
        goodyBagStatus: false,
        manageUserIDs: [],
        deviceUserIDs: [],
        giftUserIDs: [],
        goodyBagUserIDs: [],
      },
      popupshow: false,
      defaultUser: [],
      witchStep: null,
      DeviceAcount: null,
      ManageAcount: null,
      GiftAcount: null,
      GoodyBagAcount: null,
      accountList: [],
    };
  },

  components: {
    PageHeader,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Popup.name]: Popup,
    selectPeople,
  },
  methods: {
    selectNum (res) {
      this.popupshow = false;
      if (this.witchStep === 'message') {
        this.ManageAcount = res.length;
        this.formData.manageUserIDs = res;
      } else if (this.witchStep === 'device') {
        this.DeviceAcount = res.length;
        this.formData.deviceUserIDs = res;
      } else if (this.witchStep === 'gift') {
        this.GiftAcount = res.length;
        this.formData.giftUserIDs = res;
      } else {
        this.GoodyBagAcount = res.length;
        this.formData.goodyBagUserIDs = res;
      }
    },
    messageHandle () {
      this.popupshow = true;
      this.defaultUser = this.formData.manageUserIDs;
      this.witchStep = 'message';
    },
    deviceHandle () {
      this.popupshow = true;
      this.defaultUser = this.formData.deviceUserIDs;
      this.witchStep = 'device';
    },
    giftHandle () {
      this.popupshow = true;
      this.defaultUser = this.formData.giftUserIDs;
      this.witchStep = 'gift';
    },
    goodyBagHandle () {
      this.popupshow = true;
      this.defaultUser = this.formData.goodyBagUserIDs || [];
      this.witchStep = 'goodyBag';
    },
    checkData () {
      if (this.formData.manageData && this.formData.manageUserIDs.length < 1) {
        Toast('请选择每日经营数据推送人');
        return;
      }
      if (this.formData.deviceStatus && this.formData.deviceUserIDs.length < 1) {
        Toast('请选择设备离线推送人');
        return;
      }
      if (this.formData.giftStatus && this.formData.giftUserIDs.length < 1) {
        Toast('请选择礼品库存警告推送人');
        return;
      }
      if (this.formData.goodyBagStatus && this.formData.goodyBagUserIDs.length < 1) {
        Toast('请选择福袋吗推送设置推送人');
        return;
      }

      this.saveFormData();
    },
    saveFormData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });

      PersonApi.pushMessage(this.formData).then((res) => {
        Toast.clear();
        Toast.success('保存成功');
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      });
    },
    getData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
        mask: true,
      });
      this.getAccountList();
      PersonApi.getPushMessage().then(res => {
        this.formData = res;
        if (!this.formData.goodyBagUserIDs) {
          this.formData.goodyBagUserIDs = [];
        }

        this.ManageAcount = res.manageUserIDs.length;
        this.DeviceAcount = res.deviceUserIDs.length;
        this.GiftAcount = res.giftUserIDs.length;
        this.GoodyBagAcount = res.goodyBagUserIDs ? res.goodyBagUserIDs.length : 0;
        Toast.clear();
      });
    },
    getAccountList () {
      User.getAllAccountList().then((res) => {
        this.accountList = res.Data;
      });
    },
  },

  created: function () {
    this.getData();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.popup {
  width: 100%;
  height: 100%;
}

.topTitle {
  color: $font-color-placeholder;

  .van-cell__title {
    line-height: 23px !important;
    font-size: 14px !important;
  }
}

.selectItem {
  margin-bottom: 10px;
}

.person-info-wrap {
  height: 100%;
  background-color: $color-bg-secondary;
  overflow: auto;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;

  .van-checkbox-group {
    .van-cell__value {
      color: $font-color-placeholder;
      flex: none;
      width: 30%;
      text-align: center;

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

    .van-cell__title {
      font-size: $font-size-primary;
      flex: none;
      width: 70%;
      color: $font-color-placeholder;
    }
  }

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .van-cell {
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      .van-switch {
        margin-top: 3px;
      }

      .van-switch--on {
        background-color: $color-primary;
      }

      &:nth-child(5) {
        margin-bottom: 15px;
      }

      .van-cell__title {
        line-height: 32px;
        font-size: $font-size-primary;

        .van-cell-text {
          &:nth-child(2) {
            font-size: $font-size-special;
            color: $font-color-placeholder;
          }
        }
      }

      .van-cell__value {
        color: $font-color-placeholder;

        input {
          text-align: right;
        }
      }
    }
  }

  &-top {
    margin-bottom: 15px;
  }
}
</style>
