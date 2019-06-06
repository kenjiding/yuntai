<template>
  <div :class="[$style['list-item'], tabs[active].value === 'Ended' && $style['ended-bg']]">
    <div :class="$style['list-item-top']" @click="$emit('click', {id: data.ID, type: data.Type})">
      <div :class="$style['list-item-top__name']">{{ data.Name }}</div>
      <div :class="$style['list-item-top__type']">{{ typeName }}</div>
      <div :class="$style['state-tip']" v-if="data.PaymentState === 'Waiting' && tabs[active].value !== 'Ended'">
        待支付
      </div>
    </div>

    <div :class="$style['list-item-content']" @click="$emit('click', {id: data.ID, type: data.Type})">
      <div :class="$style['list-item-content__info']">
        <div :class="$style['list-item-content__info-item']">有效期: {{ data.StartTime | date('YYYY.MM.DD HH:mm')}} - {{ data.EndTime | date('YYYY.MM.DD HH:mm')}}</div>
        <div :class="$style['list-item-content__info-item']">由【{{ data.Creator }}】于【{{ Number(data.CreateTime) | date('YYYY.MM.DD HH:mm')}}】创建</div>
      </div>

      <van-icon :class="$style['list-item-content__arrow']" name='arrow' color="#999999" size="22px"/>
      <!-- <img src="@/assets/img/ended.png" :class="$style['list-item-content__icon']" v-if="tabs[active].value === 'Ended'"/> -->
    </div>

    <div :class="$style['list-item-bottom']">
      <div :class="$style['list-item-bottom__item']" v-if="tabs[active].value !== 'Ended'" @click="downloadCode">
        {{ data.DownloadPath ? '下载二维码' : '生成二维码' }}
      </div>
      <div :class="$style['list-item-bottom__item']" v-if="tabs[active].value !== 'NotStart'" @click="goConsumeInfo">消耗概况</div>
    </div>

    <div :class="$style['list-item-hidden']" v-if="isOpened">
      <div :class="$style['list-item-hidden__item']">
        <div :class="$style['list-item-hidden__item-title']">名称</div>
        <div :class="$style['list-item-hidden__item-value']">总数量/已消耗</div>
      </div>

      <div :class="[$style['list-item-hidden__item'], $style['info']]" v-for="item in data.ConsumeList" :key="item.Name">
        <div :class="$style['list-item-hidden__item-title']">{{ item.Name }}</div>
        <div :class="$style['list-item-hidden__item-value']">{{ item.TotalCount }}/{{ item.ConsumeCount }}</div>
      </div>
    </div>

    <ych-dialog
      v-model="downloadDialog"
      confirmButtonText="复制链接"
      :before-close="copy">
      <div :class="$style['dialog-content']">
        <div :class="$style['title']">打开下面链接，下载二维码压缩包</div>
        <div :class="$style['url']">{{ data.DownloadPath || downloadPath }}</div>
        <div :class="$style['url']">解压密码：<span :class="$style['password']">{{ data.DownloadPassword || downloadPassword }}</span></div>
      </div>
    </ych-dialog>
  </div>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { Toast } from 'vant';
import { EnumRefundState } from '../config/enum';
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        Type: '',
      }),
    },
    tabs: {
      type: Array,
      default: () => ([]),
    },
    active: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    isOpened: false,
    localRefundState: EnumRefundState,
    downloadDialog: false,
    downloadPath: '',
    downloadPassword: '',
  }),

  computed: {
    typeName () {
      const typeNameEnum = {
        ItemMail: '实物礼品',
        ItemInvite: '实物礼品',
        CashFixed: '微信红包',
        CashRandom: '微信红包',
        CurrencyFixed: '游戏币红包',
        CurrencyRandom: '游戏币红包',
      };
      return typeNameEnum[this.data.Type];
    },
  },

  methods: {
    downloadCode () {
      if (this.tabs[this.active].value === 'Ended') {
        Toast('本次活动已结束');
        return;
      }

      if (this.data.DownloadPath) {
        this.downloadDialog = true;
      } else {
        // 生成二维码
        Toast.loading({
          duration: 0,
          message: '正在生成',
          mask: true,
        });

        GoodyBag.generateCode({
          ID: this.data.ID,
          ActivityType: this.data.Type,
        }).then(res => {
          this.downloadDialog = true;
          Toast.clear();
          this.downloadPath = res.DownloadPath;
          this.downloadPassword = res.Password;
        });
      }
    },

    copy (action, done) {
      if (action === 'confirm') {
        let downloadPath = this.data.DownloadPath || this.downloadPath;
        this.$copyText(downloadPath).then(() => {
          Toast('复制成功');
          done();
        }).catch(() => {
          Toast('复制失败，请手动操作选中链接复制');
          done();
        });
      } else {
        done();
      }
    },

    goConsumeInfo () {
      this.$router.push({
        path: '/goody-consumption-query',
        query: {
          id: this.data.ID,
          type: this.data.Type,
        },
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .list-item {
    margin: 0;
    margin-top: 10px;
    border-radius: $border-radius-small;
    box-sizing: border-box;
    width: 100%;
    background-color: $color-white;

    &-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 36px;
      padding: 0 15px;
      position: relative;

      &__name {
        font-size: 16px;
        color: $font-color-primary;
      }

      &__icon {
        width: 21px;
        height: 21px;
      }

      &__type {
        font-size: $font-size-special;
        color: $font-color-secondary;
      }
    }

    &-content {
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: relative;
      $two-px: 2px;

      &__info {
        flex: 1;
        font-size: 14px;
        color: $font-color-secondary;

        &-item {
          margin-top: 10px;
          line-height: 20px;
        }

        &-date {
          color: $color-danger;
          margin-top: 15px;
        }
      }

      &__arrow {
        position: absolute;
        top: 8px;
        right: 15px;
        font-size: $font-size-secondary + $two-px !important;
      }

      &__icon {
        width: 70px;
        height: 70px;
        position: absolute;
        right: 30px;
        bottom: -26px;
      }
    }

    &-bottom {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-top: 1px solid $border-color-secondary;
      margin-top: 10px;
      height: 44px;

      &__item {
        flex: 1;
        text-align: center;
        height: 100%;
        line-height: 45px;
        color: $color-primary;
        font-size: $font-size-primary;

        &:nth-child(1) {
          border-right: 1px solid $border-color-secondary;
        }

        &.disabled {
          color: $font-color-secondary;
        }
      }
    }
  }

  .list-item.ended-bg {
    background: url('@/assets/img/ended.png') no-repeat;
    background-size: 70px 70px;
    background-color: $color-white;
    background-position: 280px 55px;
  }

  .list-item-hidden {
    border-top: 1px solid $border-color-secondary;

    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      div {
        flex: 1;
        text-align: center;
        color: $font-color-primary;
        line-height: 40px;
      }
    }

    &__item.info {
      div {
        color: $font-color-secondary;
        line-height: 35px;
      }
    }
  }

  .state-tip {
    line-height: 12px;
    text-align: right;
    color: $color-danger;
    font-size: 12px;
    position: absolute;
    top: 28px;
    right: 15px;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;

    .title {
      font-size: 16px;
      color: $font-color-primary;
      margin-bottom: 10px;
      text-align: center;
    }

    .url {
      margin-top: 10px;
      font-size: 14px;
      color: $font-color-secondary;
      text-align: center;
      word-wrap: break-word;
      width: 100%;
      padding: 0 16px;
    }

    .password {
      font-size: 14px;
      color: $font-color-primary;
    }
  }
</style>
