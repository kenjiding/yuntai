<template>
  <ych-page>
    <cell-group no-padding>
      <cell
        title="充值套餐："
        cell-type="link"
        link-url="/recharge-gift-coin-list"
        placeholder="请选择充值套餐"
        v-model="rechargeData"
        displayName="Name"
        required
        :disabled="activityState !== 'NotStart'"/>

      <cell
        title="赠送商品："
        cell-type="link"
        placeholder="请选择赠送商品"
        :link-url="goodsLinkUrl"
        :link-lazy="goodsLinkLazy"
        v-model="giftData"
        displayName="Name"
        required
        :disabled="activityState !== 'NotStart'"/>

      <cell
        cell-type="number"
        placeholder="请输入商品有效期"
        v-model="expirationDay"
        required
        :disabled="activityState !== 'NotStart'">
        <div :class="$style['goods-title']" slot="title" @click="showExpirationDesc">
          商品有效期：
          <img src="@/assets/img/question.png" :class="$style['icon']"/>
        </div>
      </cell>
    </cell-group>

    <cell-group no-padding>
      <cell
        title="开始时间："
        cell-type="datetime"
        placeholder="请选择开始时间"
        required
        v-model="startTime"
        @dateConfirm="value => startTime = value.getTime()"
        :disabled="activityState !== 'NotStart'"/>

      <cell
        title="结束时间："
        cell-type="datetime"
        placeholder="请选择结束时间"
        required
        v-model="endTime"
        @dateConfirm="value => endTime = value.getTime()"
        :disabled="activityState !== 'NotStart'"/>
    </cell-group>

    <div :class="$style['rule-text']" @click="ruleDesc">
      规则说明
      <img src="@/assets/img/question.png" :class="$style['icon']"/>
    </div>

    <div :class="$style['option-btn-wrap']" v-if="activityState === 'NotStart'">
      <van-button type="primary" :class="$style['confirm-btn']" @click="confirm">
        确定
      </van-button>
    </div>

    <div :class="$style['option-btn-wrap']" v-if="activityState === 'OnGoing'">
      <van-button type="danger" :class="$style['confirm-btn']" @click="close">
        提前关闭
      </van-button>
    </div>

    <van-popup v-model="showGoodsSelect">
      <div :class="$style['select-btns-wrap']">
        <div :class="$style['select-btn']" @click="() => onGoodsSelected('select')">从商品列表获取</div>
        <div :class="$style['select-btn']" @click="() => onGoodsSelected('add')">添加商品</div>
      </div>
    </van-popup>
  </ych-page>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Dialog from '@/components/global/dialog';
import { Popup, Toast } from 'vant';

export default {
  components: {
    CellGroup,
    Cell,
    [Popup.name]: Popup,
  },

  data: () => ({
    showGoodsSelect: false,
    rechargeData: null,
    giftData: null,
    expirationDay: '',
    startTime: '',
    endTime: '',
    goodsLinkUrl: '/recharge-gift-goods-list',
    selectDone: null,
    activityState: 'NotStart',
  }),

  beforeRouteEnter (to, from, next) {
    if (from.name === 'recharge-gift' || from.name === null) {
      to.meta.refreshData = true;
    } else {
      to.meta.refreshData = false;
    }

    next();
  },

  activated () {
    if (this.$route.meta.refreshData) {
      this.getData();
    }
  },

  methods: {
    close () {
      Dialog.confirm({
        theme: 'danger',
        message: '确定要关闭活动吗?',
        callback: (action) => {
          if (action === 'confirm') {
            RechargeGift.close({
              ID: this.$route.query.id,
            }).then(res => {
              console.log(res);
              this.$router.back();
            });
          }
        },
      });
    },

    goodsLinkLazy (done) {
      this.showGoodsSelect = true;
      this.selectDone = done;
    },

    onGoodsSelected (action) {
      switch (action) {
      case 'select':
        this.selectDone('/recharge-gift-goods-list');
        break;
      case 'add':
        this.selectDone('/recharge-gift-gift-create');
        break;
      default:
        this.selectDone(false);
      }

      this.selectDone = null;
      this.showGoodsSelect = false;
    },

    showExpirationDesc () {
      Dialog.alert({
        message: '赠送的商品需要再多少天内进行核销，否则将会过期',
      });
    },

    ruleDesc () {
      Dialog.alert({
        title: '规则说明',
        message: '将某个充值套餐设置为充值则赠送某某商品，当顾客充值该套餐后，即可获得一张礼品券，用户凭券可在门店核销后获得某某商品',
      });
    },

    confirm () {
      if (!this.rechargeData) {
        Toast('充值套餐不能为空');
        return;
      }

      if (!this.giftData) {
        Toast('赠送商品不能为空');
        return;
      }

      if (!this.expirationDay) {
        Toast('商品有效期不能为空');
        return;
      }

      if (!this.startTime) {
        Toast('开始时间不能为空');
        return;
      }

      if (!this.endTime) {
        Toast('结束时间不能为空');
        return;
      }

      // 先检测是否是修改，如果是修改，则调用修改接口，否则调用新建接口
      let id = this.$route.query.id;
      if (id) {
        Toast.loading({
          message: '修改中...',
          duration: 0,
        });

        RechargeGift.edit({
          ID: id,
          RechargeID: this.rechargeData.ID,
          GiftID: this.giftData.ID,
          ExpirationDay: this.expirationDay,
          StartTime: this.startTime,
          EndTime: this.endTime,
        }).then(res => {
          Toast.clear();
          this.$router.back();
        });
      } else {
        Toast.loading({
          message: '保存中...',
          duration: 0,
        });

        RechargeGift.create({
          RechargeID: this.rechargeData.ID,
          GiftID: this.giftData.ID,
          ExpirationDay: this.expirationDay,
          StartTime: this.startTime,
          EndTime: this.endTime,
        }).then(res => {
          Toast.clear();
          this.$router.back();
        });
      }
    },

    getData () {
      let id = this.$route.query.id;
      if (id) {
        document.title = '方案详情';
        Toast.loading({
          message: '加载中...',
          duration: 0,
        });

        RechargeGift.activityInfo({
          ID: id,
        }).then(res => {
          Toast.clear();
          this.startTime = res.StartTime;
          this.endTime = res.EndTime;
          this.expirationDay = res.ExpirationDay;
          this.giftData = res.GiftData;
          this.rechargeData = res.RechargeData;
          this.activityState = res.State;
        });
      } else {
        document.title = '新建方案';
        this.startTime = '';
        this.endTime = '';
        this.expirationDay = '';
        this.giftData = null;
        this.rechargeData = null;
        this.activityState = 'NotStart';
      }
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.van-popup {
  border-radius: $border-radius-small;
}

.select-btns-wrap {
  width: 235px;
  height: 100px;
  border-radius: $border-radius-small;
  background-color: #6cb0ff; // stylelint-disable
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .select-btn {
    flex: 1;
    line-height: 50px;
    text-align: center;
    height: 50px;
    background-color: $color-primary;
    color: $color-white;

    &:first-child {
      margin-bottom: 1px;
      border-top-left-radius: $border-radius-small;
      border-top-right-radius: $border-radius-small;
    }

    &:last-child {
      border-bottom-left-radius: $border-radius-small;
      border-bottom-right-radius: $border-radius-small;
    }
  }
}

.option-btn-wrap {
  position: absolute;
  bottom: 10px;
  box-sizing: border-box;
  width: 100%;

  .confirm-btn {
    width: 345px;
    margin: 0 15px;
  }
}

.goods-title {
  position: absolute;
  display: flex;
  width: 150px;
  margin-left: 10px;

  .icon {
    width: 18px;
    height: 18px;
    margin-top: -2px;
  }
}

.rule-text {
  margin-top: 10px;
  margin-left: 15px;
  font-size: 14px;
  color: $font-color-secondary;
  display: flex;

  .icon {
    width: 18px;
    height: 18px;
    margin-top: -2px;
    margin-left: 5px;
  }
}
</style>
