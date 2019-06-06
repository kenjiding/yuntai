<template>
  <ych-page>
    <template slot="header">
      <page-header
        left-arrow
        title="参数设置"
        @click-left="goBack"
        @click-right="editDeviceSetting">
        <van-icon name="save" slot="right" :class="$style['header-icon-right']"/>
      </page-header>

      <div :class="$style.plan">
        <van-tabs
          v-if="presetPlans.length > 0"
          v-model="tabsActiveIndex"
          :swipe-threshold="2">
          <van-tab
            v-for="(item, index) in plans"
            :key="index"
            >
            <span
              slot="title"
              :class="$style['plan-tag']">
              <template v-if="index < 2">投币方案{{ index + 1 }}</template>
              <template v-else>自定义方案</template>
            </span>

            <cell-group :class="$style['setting-group']">
              <van-cell
                :is-link="index === plans.length - 1"
                title="脉冲间隔(ms)"
                icon="maichong"
                @click="handleEditCellClick('PulseInterval')">
                <div :class="$style.value">
                  {{item.PulseInterval}}
                </div>
              </van-cell>

              <van-cell
                :is-link="index === plans.length - 1"
                title="脉冲宽度(ms)"
                icon="kuaidu"
                @click="handleEditCellClick('PulseWidth')">

                <div :class="$style.value">
                  {{item.PulseWidth}}
                </div>
              </van-cell>

            </cell-group>

            <cell-group>
              <cell
                v-model="item.IsHighLevel"
                cell-type="switch"
                :disabled="index !== plans.length - 1"
                title="高电平"
                icon="dian">
              </cell>
            </cell-group>

          <van-panel v-show="index > 1">
            <van-row slot="header" :class="$style['close-button']">
              <van-col :span="12" :class="$style['close-button-item']"><span>高级设置</span></van-col>
              <van-col :span="12" :class="$style['close-button-item']">
                <van-switch
                  size="24px"
                  v-model="item.AdvancedSettings"
                  :disabled="inputDisabled"
                  />
              </van-col>
            </van-row>
            <van-field
              :class="$style.showInput"
              v-model="item.PulseNum"
              v-show="item.AdvancedSettings"
              type="number"
              :precision="0"
              :disabled="inputDisabled"
              placeholder="每局脉冲数" />
            </van-panel>
          </van-tab>
        </van-tabs>

      </div>
    </template>

    <div :class="$style.tips">
      <p>说明：</p>
      <p>①请选择投币方案后进行投币测试，判断该方案是否是适用；</p>
      <p>②若默认方案不能适用，请选择自定义方案自行调整参数值；</p>
    </div>

    <van-button
      @click="payCoinTest"
      :class="$style.footer"
      :loading="payCoinTestLoading"
      slot="footer"
      size="large">
      投币测试（10币）
    </van-button>

    <!-- 设置Dialog -->
    <pules-dialog
      v-model="showEditDialog"
      @confirm="currentSetting[currentEditSettingName] = arguments[0]"
      :title="dialogTitle"
      :placeholder="'请输入' + dialogTitle"
      :input-value="editDialogValue"
      :other-value="editDialogOtherValue"/>
    <!-- 设置Dialog -->

    <!-- 确认退出的Dialog -->
    <ych-dialog
      v-model="showConfimBackDialog"
      message="本页数据还没有保存，确定退出吗？"
      confirm-button-text="保存数据"
      cancel-button-text="继续退出"
      @confirm="editDeviceSetting"
      @cancel="$router.go(-1)">
    </ych-dialog>
    <!-- 确认退出的Dialog -->

    <!-- 投币测试结果弹窗 -->
    <pay-coin-test-dialog
      v-model="payCoinTestDailog"
      :data="currentSetting"
      @confirm="editDeviceSetting"
    />
  </ych-page>

</template>

<script>
/**
 * 参数设置界面
 */
import Device from '@/api/Device';
import PageHeader from '@/components/PageHeader';
import PulesDialog from './components/PulseDialog';
import PayCoinTestDialog from './components/PayCoinTestDialog';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import { Toast, Panel } from 'vant';

export default {
  name: 'DeviceSetting',

  components: {
    PageHeader,
    PulesDialog,
    PayCoinTestDialog,
    CellGroup,
    Cell,
    [Panel.name]: Panel,
  },

  created () {
    this.asyncGetDeviceSetting();
  },

  data: () => ({
    oldSetting: {
      PulseInterval: 0,
      PulseWidth: 0,
      IsHighLevel: false,
      AdvancedSettings: false,
      PulseNum: '',
    },

    inputDisabled: false,

    presetPlans: [],
    customPlan: {
      PulseInterval: 0,
      PulseWidth: 0,
      IsHighLevel: false,
      AdvancedSettings: false,
      PulseNum: 0,
    },

    tabsActiveIndex: 0,

    showEditDialog: false,

    editDialogValue: null,
    editDialogOtherValue: null,

    currentEditSettingName: '',
    dialogTitle: '',
    showConfimBackDialog: false,

    payCoinTestLoading: false,

    payCoinTestDailog: false,

  }),

  computed: {
    testCoin () {
      if (!this.currentSetting.PulseNum || !this.currentSetting.AdvancedSettings) {
        return 10;
      } else {
        return this.currentSetting.PulseNum;
      }
    },
    currentSetting () {
      return this.plans[this.tabsActiveIndex] || {};
    },

    plans () {
      return [...this.presetPlans, this.customPlan];
    },

    deviceId () {
      return this.$route.query.deviceId;
    },
  },

  methods: {
    goBack () {
      if (this.planIsEqual(this.oldSetting, this.currentSetting)) {
        this.$router.go(-1);
      } else {
        this.showConfimBackDialog = true;
      }
    },

    planIsEqual (plan, otherPlan) {
      if (plan.PulseInterval === otherPlan.PulseInterval && plan.PulseWidth === otherPlan.PulseWidth) {
        return true;
      }

      return false;
    },

    asyncGetDeviceSetting () {
      this.$toast.loading({
        message: '加载中...',
        duration: 0,
      });

      Device.deviceSetting({
        ID: this.deviceId,
      }).then(res => {
        this.hideToastLoading();
        res.Current.PulseInterval = res.Current.PulseInterval ? res.Current.PulseInterval : '';
        res.Current.PulseWidth = res.Current.PulseWidth ? res.Current.PulseWidth : '';

        Object.assign(this.oldSetting, res.Current);

        this.presetPlans.push(...res.Presets);

        let tempIndex = -1;
        tempIndex = res.Presets.findIndex((item, index) => {
          const isEqual = this.planIsEqual(res.Current, item);
          if (this.planIsEqual(res.Current, item)) {
            this.tabsActiveIndex = index;
          }
          return isEqual;
        });

        if (!~tempIndex) {
          this.tabsActiveIndex = 2;
          Object.assign(this.customPlan, res.Current);
        }
      });
    },

    hideToastLoading () {
      this.$toast.clear();
    },

    payCoinTest () {
      let cacheObj = Object.assign({}, this.currentSetting);
      if (this.currentSetting.AdvancedSettings && !this.currentSetting.PulseNum) {
        Toast('每局脉冲数不能为空');
        return;
      }
      cacheObj.PulseNum = 10;

      // if (!this.currentSetting.AdvancedSettings) {
      //   cacheObj.PulseNum = 10;
      // }

      this.$toast.loading({
        mask: true,
        message: '投币中...',
        duration: 0,
      });

      Device
        .coinTest({
          ID: this.deviceId,
          ...cacheObj,
        })
        .then(() => {
          this.hideToastLoading();
          this.$nextTick(() => this.$toast.success('投币完成'));
          this.payCoinTestDailog = true;
        });
    },

    handleEditCellClick (value) {
      if (this.tabsActiveIndex !== 2) return;
      if (value === 'PulseInterval') {
        this.dialogTitle = '脉冲间隔';
        this.editDialogValue = Number(this.currentSetting.PulseInterval);
        this.editDialogOtherValue = Number(this.currentSetting.PulseWidth);
      } else if (value === 'PulseWidth') {
        this.dialogTitle = '脉冲宽度';
        this.editDialogValue = Number(this.currentSetting.PulseWidth);
        this.editDialogOtherValue = Number(this.currentSetting.PulseInterval);
      }

      this.showEditDialog = true;
      this.currentEditSettingName = value;
    },

    editDeviceSetting () {
      if (this.currentSetting.PulseInterval === this.currentSetting.PulseWidth) {
        Toast('脉冲间隔和脉冲宽度相同');
        return;
      }

      if (this.oldDeviceSetting === JSON.stringify(this.currentSetting)) {
        return this.$router.go(-1);
      }

      if (this.tabsActiveIndex >= 2 && this.currentSetting.AdvancedSettings) {
        if (!this.currentSetting.PulseNum) {
          Toast('每局脉冲数不能为空');
          return;
        }
      }

      if (this.currentSetting.AdvancedSettings &&
        this.currentSetting.PulseNum === this.$route.query.price) {
        Toast('每局脉冲数与每局币单价一致时，请关闭高级设置');
        return;
      }

      this.$toast.loading({
        duration: 0,
      });

      const isCustom = this.tabsActiveIndex === 2;
      return Device.deviceSettingEdit({
        ID: this.deviceId,
        IsCustom: isCustom,
        ...this.currentSetting,
      }).then(res => {
        this.afterEditDeviceSetting();
      });
    },

    afterEditDeviceSetting () {
      this.$toast.success('保存成功');
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.close-button {
  .van-switch--on {
    background-color: $color-primary;
  }

  .close-button-item {
    font-size: $font-size-special;

    &:first-of-type {
      height: 33px;
      line-height: 33px;
    }

    &:last-of-type {
      text-align: right;
      margin-top: 5px;
    }
  }
}

.header-icon-right {
  font-size: $font-size-secondary;
  margin-top: -3px;
}

.setting-group {
  margin-top: 70px;

  .icon {
    font-size: $font-size-secondary;
    margin-right: 8px;
  }
}

.plan {
  width: 100%;
  // height: 60px;
  background-color: $color-bg-primary;
  box-sizing: border-box;

  .van-panel {
    padding: 7px 15px;
    margin: 10px 16px;
    border-bottom: 2px solid $color-bg-regular;

    .van-panel__content {
      .showInput {
        padding: 0;
        margin-top: 10px;

        input {
          background-color: $color-bg-regular;
          padding: 10px;
          margin-bottom: 10px;
        }
      }
    }

    .close-button {
      .van-switch--on {
        background-color: $color-primary;
      }

      .close-button-item {
        font-size: $font-size-special;

        &:first-of-type {
          height: 33px;
          line-height: 33px;
        }

        &:last-of-type {
          text-align: right;
          margin-top: 5px;
        }
      }
    }
  }

  .van-tabs__wrap {
    padding: 10px 0;
    background-color: $color-white;
  }

  .van-tab__pane {
    overflow: hidden;
  }

  .van-tabs--line {
    padding-top: 0;
    // display: none;
  }

  .van-tab {
    flex: none;
    min-width: none;

    &:last-child {
      margin-right: 28px;
    }

    &:first-child {
      margin-left: 28px;
    }

    .plan-tag {
      width: 100px;
      line-height: 40px;
      text-align: center;
      font-size: $font-size-primary;
      padding: 0 14px;
      border: 1px solid;
      border-color: $color-info;
      color: $color-info;
      border-radius: $border-radius;

      &:nth-child(n + 2) {
        margin-left: 10px;
      }
    }

    &.van-tab--active .plan-tag {
      border-color: $color-primary;
      color: $color-primary;
    }
  }

  .van-tabs__line {
    display: none;
  }

  .van-hairline--top-bottom::after {
    border-width: 0;
  }

  .van-tabs__nav--line {
    padding: 0;
  }
}

.plan-wrap {
  height: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding: 0 28px;
}

.tips {
  font-size: $font-size-primary;
  color: $font-color-placeholder;
  padding: 30px 22px 0;
  line-height: 1.5;

  > p:nth-child(n + 2) {
    margin-top: 20px;
  }
}

.footer {
  color: $color-primary;
}
</style>
