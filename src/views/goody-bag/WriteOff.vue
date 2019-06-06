<template>
  <ych-page>
    <div :class="$style.container">
      <div :class="$style.content">
        <div :class="$style['list-item']">
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">中奖时间：</div>
            <div :class="$style['list-item__item-value']">{{ data.Time | date }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">中奖奖品：</div>
            <div :class="$style['list-item__item-value']">{{ data.GiftName }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">兑奖地址：</div>
            <div :class="$style['list-item__item-value']">{{ data.TicketAddress }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">活动名称：</div>
            <div :class="$style['list-item__item-value']">{{ data.ActivityName }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">微信昵称：</div>
            <div :class="$style['list-item__item-value']">{{ data.WechatName }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">状态：</div>
            <div :class="$style['list-item__item-value']">{{ localWriteOffState[data.State] }}</div>
          </div>
        </div>
      </div>

      <div :class="$style.controls">
        <van-button type="primary" plain v-if="data.State === 'Waiting'" @click='writeOff'>核销</van-button>
        <div style="width: 15px;" v-if="data.State === 'Waiting'"></div>
        <van-button type="primary" @click="$router.back()">返回</van-button>
      </div>
    </div>
  </ych-page>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { Toast } from 'vant';
import { EnumWriteOffState } from './config/enum';

export default {
  data: () => ({
    data: {},
    localWriteOffState: EnumWriteOffState,
  }),

  created () {
    this.getWriteOffData();
  },

  methods: {
    writeOff () {
      // 执行核销
      Toast.loading({
        message: '正在核销',
        mask: true,
      });

      GoodyBag.writeOff({
        RecordID: this.data.RecordID,
      }).then(res => {
        Toast.success('核销成功');
      });
    },

    getWriteOffData () {
      GoodyBag.winingInfo({
        Code: this.$route.query.code,
      }).then(res => {
        this.data = res;
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .container {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    box-sizing: border-box;

    .content {
      flex: 1;
    }

    .controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .van-button {
        flex: 1;
      }
    }
  }

  .list-item {
    position: relative;
    width: 343px;
    background-color: $color-white;
    border-radius: $border-radius-small;
    padding: 15px;
    box-sizing: border-box;

    &__item {
      display: flex;
      font-size: 14px;
      line-height: 30px;

      &-title {
        width: 80px;
        color: $font-color-secondary;
      }

      &-value {
        flex: 1;
        color: $font-color-primary;
      }
    }
  }
</style>
