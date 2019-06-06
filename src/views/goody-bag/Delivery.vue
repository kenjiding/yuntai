<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['content']">
        <div :class="$style['list-item']">
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">收货人：</div>
            <div :class="$style['list-item__item-value']">{{ localData.Consignee }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">手机号：</div>
            <div :class="$style['list-item__item-value']">{{ localData.Telephone }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">收获地址：</div>
            <div :class="$style['list-item__item-value']">{{ localData.Address }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">中奖时间：</div>
            <div :class="$style['list-item__item-value']">{{ localData.Time | date }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">中奖奖品：</div>
            <div :class="$style['list-item__item-value']">{{ localData.GiftName }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">活动名称：</div>
            <div :class="$style['list-item__item-value']">{{ localData.ActivityName }}</div>
          </div>
          <div :class="$style['list-item__item']">
            <div :class="$style['list-item__item-title']">微信昵称：</div>
            <div :class="$style['list-item__item-value']">{{ localData.WechatName }}</div>
          </div>
        </div>

        <div :class="[$style['input-wrap']]">
          <input placeholder="请输入快递号" :class="$style.input" v-model="courierNumber"/>
        </div>

        <div :class="$style['input-wrap']">
          <input placeholder="请输入快递公司名称" :class="$style.input" v-model="courierName"/>
        </div>
      </div>

      <van-button
        :disabled="disableSubmit"
        type="primary"
        :class="$style['bottom-button']"
        @click="submit">
        确定发货
      </van-button>
    </div>
  </ych-page>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { Toast } from 'vant';

export default {
  data: () => ({
    courierNumber: '',
    courierName: '',
  }),

  computed: {
    disableSubmit () {
      return !this.courierNumber || !this.courierName;
    },

    localData () {
      return JSON.parse(this.$route.query.data);
    },
  },

  methods: {
    submit () {
      Toast.loading({
        message: '发货中',
        mask: true,
      });

      GoodyBag.orderDelivery({
        CourierNumber: this.courierNumber,
        CourierName: this.courierName,
        ID: this.localData.ID,
      }).then(res => {
        Toast.success('发货成功');
        this.$router.back();
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
        color: $font-color-secondary;
      }

      &-value {
        color: $font-color-primary;
      }
    }
  }

  .input-wrap {
    border-radius: $border-radius-small;
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;

    .input {
      flex: 1;
      height: 35px;
      border: none;
      padding: 0 10px;

      &::-webkit-input-placeholder {
        color: $font-color-secondary;
      }
    }

    .van-button {
      height: 35px;
      line-height: 35px;
    }
  }
</style>
