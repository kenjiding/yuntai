<template>
  <ych-page>
    <cell-group no-padding>
      <cell
        required
        title="币数："
        cell-type="number"
        v-model="currencyCount"
        placeholder="请输入游戏币数量"
        addon-after="币"
        :disabled="activityState !== 'NotStart'"/>

      <cell
        required
        title="售价："
        cell-type="number"
        v-model="price"
        placeholder="请输入套餐售价"
        addon-after="元"
        :disabled="activityState !== 'NotStart'"/>
    </cell-group>

    <cell-group no-padding>
      <cell
        required
        title="参与人数："
        cell-type="number"
        v-model="personLimit"
        placeholder="请输入参与人数"
        addon-after="人"
        :disabled="activityState !== 'NotStart'"/>
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

    <div :class="$style['option-btn-wrap']">
      <van-button type="danger" :class="$style['confirm-btn']" @click="close" v-if="activityState !== 'Ended' && $route.query.id">
        提前结束
      </van-button>
      <van-button type="primary" :class="$style['confirm-btn']" @click="confirm" v-if="activityState === 'NotStart'">
        确定
      </van-button>
    </div>
  </ych-page>
</template>

<script>
import CurrencyRush from '@/api/CurrencyRush';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Dialog from '@/components/global/dialog';
import { Toast } from 'vant';

export default {
  components: {
    CellGroup,
    Cell,
  },

  data: () => ({
    showGoodsSelect: false,
    currencyCount: '',
    price: '',
    personLimit: '',
    startTime: '',
    endTime: '',
    activityState: 'NotStart',
  }),

  created () {
    this.getData();
  },

  methods: {
    close () {
      Dialog.confirm({
        theme: 'danger',
        message: '确定要提前结束活动吗?',
        callback: (action) => {
          if (action === 'confirm') {
            CurrencyRush.cancel({
              ID: this.$route.query.id,
            }).then(res => {
              console.log(res);
              this.$router.back();
            });
          }
        },
      });
    },

    ruleDesc () {
      Dialog.alert({
        title: '规则说明',
        message: '1. 游戏币抢购套餐不会在C端显示，只能通过活动二维码参与；<br>2. 每个会员每个游戏币抢购活动最多只能参与1次；<br>3. 当活动参与人数达到上限或活动到期后，都将自动结束活动；',
      });
    },

    confirm () {
      let intReg = /^\d+$/;

      if (!this.currencyCount) {
        Toast('游戏币数量不能为空');
        return;
      }

      if (!intReg.test(this.currencyCount)) {
        Toast('游戏币数量只能为整数');
        return;
      }

      if (!this.price) {
        Toast('售价不能为空');
        return;
      }

      if (!this.personLimit) {
        Toast('参与人数不能为空');
        return;
      }

      if (!intReg.test(this.personLimit)) {
        Toast('参与人数只能为整数');
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

        CurrencyRush.edit({
          ID: id,
          CurrencyCount: this.currencyCount,
          Price: this.price,
          PersonLimit: this.personLimit,
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

        CurrencyRush.create({
          CurrencyCount: this.currencyCount,
          Price: this.price,
          PersonLimit: this.personLimit,
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
        document.title = '活动详情';
        Toast.loading({
          message: '加载中...',
          duration: 0,
        });

        CurrencyRush.detail({
          ID: id,
        }).then(res => {
          Toast.clear();
          this.startTime = res.StartTime;
          this.endTime = res.EndTime;
          this.currencyCount = res.CurrencyCount;
          this.price = res.Price;
          this.personLimit = res.PersonLimit;
          this.activityState = res.State;
        });
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
  display: flex;
  flex-direction: row;
  padding: 0 10px;

  .confirm-btn {
    flex: 1;

    &:not(:last-child) {
      margin-right: 15px;
    }
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
