<template>
  <ych-page>
    <van-cell-group :class="$style['setting-header']">
      <van-cell title="游戏机厂商" :value="rateInfo.GameProvider"/>
      <van-cell title="版本号" :value="rateInfo.Version"/>
    </van-cell-group>
    <van-cell-group :class="$style['setting-list']">
      <van-field
        type="number"
        label="游戏时间"
        placeholder="1-255(秒)"
        :min="1"
        :max="255"
        v-model="rateInfo.GameTime"/>
      <van-field
        type="number"
        label="弱爪力度"
        placeholder="1-100(百分比)"
        :min="1"
        :max="100"
        v-model="rateInfo.WeakPower"/>
      <van-field
        type="number"
        label="强爪力度"
        placeholder="1-100(百分比)"
        :min="1"
        :max="100"
        v-model="rateInfo.StrongPower"/>
      <van-cell title="单机中奖概率" :class="$style['rate-field']">
        <van-field
          type="number"
          placeholder="多少局"
          :max="99999"
          v-model="rateInfo.WinCoins"/>
        <p>中奖</p>
        <van-field
          type="number"
          placeholder="多少次"
          :max="99999"
          v-model="rateInfo.WinCount"/>
      </van-cell>
    </van-cell-group>

    <van-button
      type="primary"
      :disabled="saveBtnDisabled"
      :class="$style['submit-btn']"
      @click="saveSettingClick">
      保存
    </van-button>
  </ych-page>
</template>

<script>
import MemberLucky from '@/api/MemberLucky';
import {Toast} from 'vant';

export default {
  data () {
    return {
      saveBtnDisabled: true,
      rateInfo: {
        GameProvider: '加载中...',
        Version: '加载中...',
      },
    };
  },

  created () {
    if (this.$route.query.deviceId) {
      this.asyncGetDeviceRateSetting();
    } else {
      Toast.fail('无效参数');
    }
  },

  methods: {
    asyncGetDeviceRateSetting () {
      Toast.loading({
        message: '正在查询...',
        mask: true,
        duration: 0,
      });

      MemberLucky.getRateSetting({
        DeviceID: this.$route.query.deviceId,
      }).then(res => {
        this.loadResultTime = Date.now();
        this.rateInfo = res;
        Toast.clear();
        this.saveBtnDisabled = false;
      }, () => {
        Toast.clear();
        // Toast.fail('获取机台概率设置失败');
      });
    },

    saveSettingClick () {
      const checkMessage = this.checkInputItems();
      if (checkMessage) {
        Toast(checkMessage);
        return;
      }

      // 保存设置
      Toast.loading({
        message: '正在保存',
        duration: 0,
        mask: true,
      });

      MemberLucky.saveRateSetting({
        DeviceID: this.$route.query.deviceId,
        GameTime: this.rateInfo.GameTime,
        WeakPower: this.rateInfo.WeakPower,
        StrongPower: this.rateInfo.StrongPower,
        WinCoins: this.rateInfo.WinCoins,
        WinCount: this.rateInfo.WinCount,
      }).then(res => {
        Toast.clear();
        Toast.success('修改成功');
      }, () => {
        Toast.clear();
      });
    },

    checkInputItems () {
      if (!this.rateInfo.GameTime) {
        return '游戏时间不能为空';
      }
      if (!this.rateInfo.WeakPower) {
        return '弱爪力度不能为空';
      }
      if (!this.rateInfo.StrongPower) {
        return '强弱爪力度不能为空';
      }
      if (!this.rateInfo.WinCoins || !this.rateInfo.WinCount) {
        return '单机中奖概率的币数和中奖次数不能为空';
      }
      if (this.rateInfo.WeakPower > this.rateInfo.StrongPower) {
        return '弱爪力度不能大于强弱爪力度';
      }
      return '';
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.setting-header {
  .van-cell {
    background-color: $border-color;

    &::after {
      border-bottom-color: $color-bg-regular;
    }
  }
}

.setting-list {
  margin-top: 15px;

  input {
    text-align: right;
  }
}

.rate-field {
  .van-cell__value {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }

  p {
    margin: 0 8px;
  }

  .van-field {
    padding: 0;
    height: 26px;
    width: 60px;
    border: 1px solid $border-color;
    border-radius: $border-radius-small;

    input {
      text-align: center;
    }

    &::after {
      display: none;
    }
  }
}

.submit-btn {
  position: absolute;
  width: 90%;
  margin-left: 5%;
  bottom: 16px;
  border-radius: $border-radius-small;
}

</style>
