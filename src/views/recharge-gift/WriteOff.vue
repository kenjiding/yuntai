<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['info-wrap']">
        <div :class="$style['info']">
          <div :class="$style['title']">赠送商品：</div>
          <div :class="$style['value']">{{ infoData.Name }}</div>
        </div>

        <div :class="$style['info']">
          <div :class="$style['title']">赠送活动：</div>
          <div :class="$style['value']">{{ infoData.ActivityName }}</div>
        </div>

        <div :class="$style['info']">
          <div :class="$style['title']">赠送会员：</div>
          <div :class="$style['value']">{{ infoData.UserName }}</div>
        </div>

        <div :class="$style['info']">
          <div :class="$style['title']">状态：</div>
          <div :class="$style['value']">{{ localWriteOffState[infoData.State] }}</div>
        </div>
      </div>

      <div :class="$style['option-btn-wrap']">
        <van-button type="primary" plain @click="$router.back()">返回</van-button>
        <van-button type="primary" :disabled="infoData.State !== 'Waiting'" @click="writeOff">核销</van-button>
      </div>
    </div>
  </ych-page>
</template>

<script>
import RechargeGift from '@/api/RechargeGift';
import { Toast } from 'vant';
import { EnumWriteOffState } from './config/enum';

export default {
  data: () => ({
    infoData: {},
    localWriteOffState: EnumWriteOffState,
  }),

  created () {
    let number = this.$route.query.number;
    if (number) {
      this.getData(number);
    }
  },

  methods: {
    getData (number) {
      Toast.loading({
        message: '加载中...',
        duration: 0,
      });

      RechargeGift.writeOffInfo({
        CardNumber: number,
      }).then(res => {
        Toast.clear();
        this.infoData = res;
      });
    },

    writeOff () {
      RechargeGift.writeOff({
        ID: this.infoData.ID,
      }).then(res => {
        Toast.success('核销成功');

        setTimeout(() => {
          this.$router.back();
        });
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.container {
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  height: 100%;
}

.info-wrap {
  background-color: $color-white;
  padding: 10px;
  box-sizing: border-box;
  border-radius: $border-radius-small;

  .info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    height: 28px;

    .title {
      color: $font-color-secondary;
    }

    .value {
      flex: 1;
    }
  }
}

.option-btn-wrap {
  display: flex;
  justify-content: space-between;

  .van-button {
    width: 165px;
  }
}
</style>
