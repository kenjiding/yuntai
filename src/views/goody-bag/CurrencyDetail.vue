<template>
  <ych-page :class="$style['container']">
    <cell-group header="基本信息" noPadding>
      <cell
        required
        title="活动名称"
        cell-type="input"
        v-model="detail.Name"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        required
        title="开始时间"
        cell-type="datetime"
        :value="detail.StartTime"
        @dateConfirm="value => setTime(value, 'StartTime')"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        required
        title="结束时间"
        cell-type="datetime"
        :value="detail.EndTime"
        @dateConfirm="value => setTime(value, 'EndTime')"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <van-cell
        title="活动介绍"
        :class="{
          [$style['introduction-cell']]: true,
          [$style['introduction-cell--disable']]: detail.EditState !== 'All'
        }"
        :value="introduction || '请输入'"
        @click="showIntroduction"
        is-link/>
    </cell-group>

    <cell-group header="奖品信息" noPadding>
      <cell
        required
        title="红包模式"
        cell-type="radio-group"
        v-model="detail.ActivityType"
        :radios="currencyRadios"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        required
        v-show="detail.ActivityType === 'CurrencyFixed'"
        title="单个红包币数"
        cell-type="number"
        placeholder="请输入"
        v-model="detail.FixedAmount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <!-- <cell
        v-show="detail.ActivityType === 'CurrencyRandom'"
        title="红包币数"
        cell-type="range"
        :value="[this.detail.MinAmount, this.detail.MaxAmount]"
        placeholder="请输入"
        @change="onAmountChange"
        :disabled="isEdit && detail.EditState !== 'All'"/> -->

      <cell
        required
        title="红包总个数"
        cell-type="number"
        placeholder="请输入"
        v-model="detail.TotalCount"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        required
        v-show="detail.ActivityType === 'CurrencyRandom'"
        title="红包总币数"
        cell-type="number"
        v-model="detail.TotalAmount"
        placeholder="请输入"
        :disabled="isEdit && detail.EditState !== 'All'"/>

      <cell
        required
        title="福袋码总数量"
        cell-type="number"
        placeholder="请输入"
        v-model="detail.TotalCodeCount"
        :disabled="isEdit && detail.EditState !== 'All'"/>
    </cell-group>

    <div :class="$style['currency-detail-bottom']">
      <span v-if="disableSubmit">请先完善表单中具体信息</span>
      <span v-else>您将会获得{{ detail.TotalCodeCount }}个福袋二维码，其中{{ detail.TotalCount }}个是游戏币红包</span>
      <van-button
        type="primary"
        v-if="!isEdit"
        :class="$style.submitButton"
        :disabled="disableSubmit"
        @click="submit">
        确定
      </van-button>

      <div
        :class="$style['button-wrap']"
        v-if="(isEdit && detail.PaymentState !== 'Waiting')
        || detail.EditState === 'Not'">
        <van-button
          type="primary"
          plain
          :class="$style.submitButton"
          v-if="detail.EditState !== 'Not'"
          :disabled="disableSubmit"
          @click="() => acticityUpdate()">
          完成修改
        </van-button>

        <van-button
          type="primary"
          :class="[
            $style.submitButton,
            detail.EditState !== 'All' && $style['disabled']
          ]"
          v-if="detail.EditState !== 'Not'"
          @click="() => activityCancel()">
          {{ detail.EditState === 'All' ? '取消活动' : '结束活动' }}
        </van-button>

        <van-button
          type="primary"
          :class="$style.submitButton"
          v-if="detail.EditState === 'Not'"
          @click="$router.back()">
          返回
        </van-button>
      </div>
    </div>

    <van-popup
      v-model="introductionShow"
      :class="$style['introduction-popup']"
      position="right">
      <Introduction
        @close="closeIntroduction"
        :placeholder="defualtIntroduction"
        placeholder-defualt
        :introduction-show="introductionShow"
        :value="introduction"/>
    </van-popup>

  </ych-page>
</template>

<script>
import { Toast, Popup } from 'vant';
import GoodyBag from '@/api/GoodyBag';
import Dialog from '@/components/global/dialog';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Introduction from '@/components/Introduction';
import { checkCurrencyFormat, checkCurrencyEmpty } from './utils/Check';

export default {
  components: {
    [Popup.name]: Popup,
    CellGroup,
    Cell,
    Introduction,
  },

  created () {
    this.currentAction = this.$route.query.action;
    this.currentID = this.$route.query.id;
    if (this.currentID) {
      this.isEdit = true;
      this.asyncGetDetail();
    }
  },

  data: () => ({
    currentAction: '',
    currentID: '',
    isEdit: false,
    detail: {
      Name: undefined,
      StartTime: undefined,
      EndTime: undefined,
      // Description: undefined,
      ActivityType: 'CurrencyFixed',
      FixedAmount: undefined,
      // MinAmount: undefined,
      // MaxAmount: undefined,
      TotalCount: undefined, // 红包总数量
      TotalAmount: undefined, // 红包总金额
      TotalCodeCount: undefined,
    },
    currencyRadios: [{
      name: '固定币数',
      value: 'CurrencyFixed',
    }, {
      name: '随机币数',
      value: 'CurrencyRandom',
    }],
    introductionShow: false,
    defualtIntroduction: `1.活动对象：所有消费者\n2.活动规则：\na.每个福袋码（二维码）的奖品一经领取，不做退换。\r\nb.获得的奖品不提供发票。\r\nc.通过恶意破解等方式获取的奖品，商家有权利不予以兑奖。\r\n3.活动所有解析权归商家所有。`,
    introduction: '',
  }),

  computed: {
    disableSubmit () {
      return checkCurrencyEmpty(this.detail);
    },
  },

  methods: {
    // 当前模式为红包随机，并且金额发生变化
    // onAmountChange ({min, max}) {
    //   this.detail.MinAmount = min;
    //   this.detail.MaxAmount = max;
    // },

    showIntroduction () {
      if (this.isEdit && this.detail.EditState !== 'All') return;
      this.introductionShow = true;
    },

    acticityUpdate (orderId) {
      // 活动修改
      if (checkCurrencyFormat(this.detail, this.currentAction)) {
        if (this.introduction) {
          this.detail.Description = this.introduction;
        } else {
          this.detail.Description = this.defualtIntroduction;
        }

        Toast.loading({
          message: '正在修改活动',
          duration: 0,
          mask: true,
        });

        GoodyBag.currencyUpdate({
          ID: this.currentID,
          ...this.detail,
        }).then(res => {
          Toast.success('修改成功');
          this.$router.back();
        });
      }
    },

    activityCancel () {
      if (this.currentAction === 'cash' && this.detail.EditState !== 'All') {
        Toast('当前活动不可取消');
        return;
      }

      // 活动取消
      Dialog.alert({
        title: '提示',
        theme: 'primary',
        message: '活动取消后无法恢复，确定需要取消活动吗？',
        showCancelButton: true,
      }).then(() => {
        Toast.loading({
          duration: 0,
          message: '正在取消活动',
          mask: true,
        });

        GoodyBag.cancel({
          ID: this.currentID,
          Type: this.detail.ActivityType,
        }).then(res => {
          Toast.success('活动取消成功');
          this.$router.back();
        });
      });
    },

    submit () {
      if (this.currentOrderId) {
        this.acticityUpdate(this.currentOrderId);
      } else {
        if (checkCurrencyFormat(this.detail)) {
          if (this.introduction) {
            this.detail.Description = this.introduction;
          } else {
            this.detail.Description = this.defualtIntroduction;
          }
          Toast.loading({
            message: '正在创建活动',
            duration: 0,
            mask: true,
          });
          GoodyBag.currencyCreate({
            ...this.detail,
          }).then(res => {
            this.currentOrderId = res.ID;
            this.currentID = res.ID;
            this.isEdit = true;

            Toast.clear();
            Toast.success('活动创建成功');
            this.$router.back();
          });
        }
      }
    },

    setTime (value, field) {
      this.detail[field] = new Date(value).getTime();
    },

    asyncGetDetail () {
      Toast.loading({
        message: '加载中',
        mask: true,
        duration: 0,
      });

      GoodyBag.currencyDetail({
        ID: this.currentID,
      }).then(res => {
        Toast.clear();
        this.detail = res;
        this.introduction = res.Description;
      });
    },

    closeIntroduction (val) {
      this.introductionShow = false;
      if (val) {
        this.introduction = val;
      }
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .container {
    -webkit-overflow-scrolling: touch;
  }

  .submitButton {
    width: 100%;
    border-radius: 0;

    &.disabled {
      background-color: $color-danger;
      border-color: $font-color-secondary;
    }
  }

  .currency-detail-bottom {
    width: 100%;
    color: $font-color-secondary;
    text-align: center;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;

    > span {
      margin-bottom: 10px;
    }
  }

  .button-wrap {
    display: flex;
  }

  .introduction {
    &-popup {
      width: 100%;
      height: 100%;
    }

    &-cell {
      padding-left: 26px;

      > .van-cell__value {
        width: 50px;

        @include ellipsis(1);
      }

      &--disable {
        .van-cell__value {
          color: $font-color-secondary;
        }
      }
    }
  }
</style>
