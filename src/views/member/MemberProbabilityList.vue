<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['content']">
        <div :class="$style['list-container']" v-if="openList.length > 0">
          <div :class="$style['list-header']">
            共
            <span :class="$style['color-primary']">{{ openList.length }}</span>
            台设备<span :class="$style['color-primary']">参与</span>会员概率功能
          </div>
          <div
            :class="$style['list-item']"
            v-for="(item, index) in openList"
            :key="'key_' + index">
            <div :class="$style['list-item__icon']">
              <img src="@/assets/img/machine.png" v-if="item.DeviceType === 'Online'" />
              <img src="@/assets/img/machine-disabled.png" v-else />
            </div>
            <div :class="$style['list-item__info']">
              <div :class="$style['list-item__info-name']">{{ item.DeviceName }} ({{ item.DeviceNum }})</div>
              <div :class="$style['list-item__info-desc']" v-if="item.LuckyState !== -1">
                <span :class="$style['color-primary']">{{ item.PlayCount }}</span>
                币中奖
                <span :class="$style['color-danger']">{{ item.WinCount }}</span>
                次
              </div>
            </div>
            <div :class="[$style['list-item__button'], item.LuckyState === -1 && $style['disabled']]" @click="() => changeDevice(item)">
              <span v-if="item.LuckyState === 1">取消</span>
              <span v-else-if="item.LuckyState === 0">添加</span>
              <span v-else>不支持</span>
            </div>
          </div>
        </div>

        <div :class="$style['list-container']" v-if="closeList.length > 0">
          <div :class="$style['list-header']">
            共
            <span :class="$style['color-danger']">{{ closeList.length }}</span>
            台设备<span :class="$style['color-danger']">不参与</span>会员概率功能
          </div>
          <div
            :class="$style['list-item']"
            v-for="(item, index) in closeList"
            :key="'key_' + index">
            <div :class="$style['list-item__icon']">
              <img src="@/assets/img/machine.png" v-if="item.DeviceType === 'Online'" />
              <img src="@/assets/img/machine-disabled.png" v-else />
            </div>
            <div :class="$style['list-item__info']">
              <div :class="$style['list-item__info-name']">{{ item.DeviceName }} ({{ item.DeviceNum }})</div>
              <div :class="$style['list-item__info-desc']" v-if="item.LuckyState !== -1">
                <span :class="$style['color-primary']">{{ item.PlayCount }}</span>
                币中奖
                <span :class="$style['color-danger']">{{ item.WinCount }}</span>
                次
              </div>
            </div>
            <div :class="[$style['list-item__button'], item.LuckyState === -1 && $style['disabled']]" @click="() => changeDevice(item)">
              <span v-if="item.LuckyState === 1">取消</span>
              <span v-else-if="item.LuckyState === 0">添加</span>
              <span v-else>不支持</span>
            </div>
          </div>
        </div>
      </div>

      <van-button type="primary" @click="$router.back()">
        返回
      </van-button>
    </div>
  </ych-page>
</template>

<script>
import MemberLucky from '@/api/MemberLucky';
import { Toast } from 'vant';

export default {
  data: () => ({
    openState: false,
    openList: [],
    closeList: [],
  }),

  created () {
    this.getList();
  },

  methods: {
    getList () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      MemberLucky.list({
        CustomerID: this.$store.state.userInfo.CustomerID,
      }).then(res => {
        Toast.clear();
        this.openState = res.OpenFlag;
        this.openList = res.OpenList;
        this.closeList = res.CloseList;
      });
    },

    // 改变设备的状态
    changeDevice (device) {
      if (device.LuckyState === -1) return;

      Toast.loading({
        mask: true,
        duration: 0,
        message: '执行中...',
      });

      if (device.LuckyState === 1) {
        // 关闭
        MemberLucky.close({
          CustomerID: this.$store.state.userInfo.CustomerID,
          DeviceID: device.DeviceId,
        }).then(res => {
          Toast.success('取消成功');
          this.getList();
        });
      } else {
        // 开启
        MemberLucky.open({
          CustomerID: this.$store.state.userInfo.CustomerID,
          DeviceID: device.DeviceId,
        }).then(res => {
          Toast.success('添加成功');
          this.getList();
        });
      }
    },

    // 改变会员管理的开关状态
    changeSwitch (value) {
      Toast.loading({
        message: '执行中...',
        duration: 0,
        mask: true,
      });

      MemberLucky.update({
        CustomerID: this.$store.state.userInfo.CustomerID,
        LuckyFlag: value,
      }).then(res => {
        Toast.success('修改成功');
        this.getList();
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.dialog-content {
  width: 75%;
  margin: 20px auto;

  .van-cell {
    background-color: $color-bg-regular;
    border: solid 1px $border-color;
    border-radius: $border-radius-small;

    input {
      background-color: $color-bg-regular;
    }
  }
}

.header-cell {
  height: 45px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: $color-white;
  padding: 0 16px;
}

.list-container {
  margin-top: 15px;

  .list-header {
    padding: 0 16px;
    font-size: 14px;
    color: $font-color-secondary;
    margin-bottom: 10px;
  }

  .color-primary {
    color: $color-primary;
  }

  .color-danger {
    color: $color-danger;
  }

  .list-item {
    height: 80px;
    background-color: $color-white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;

    &:not(:last-child) {
      border-bottom: 1px solid $border-color;
    }

    &__icon img {
      height: 24px;
      width: auto;
    }

    &__info {
      flex: 1;
      margin-left: 16px;

      &-name {
        color: $font-color-primary;
        font-size: 16px;
      }

      &-desc {
        color: $font-color-secondary;
        font-size: 14px;
        margin-top: 10px;
      }
    }

    &__button {
      width: 75px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background-color: $color-primary;
      color: $color-white;
      border-radius: $border-radius-small;
      user-select: none;
      font-size: 14px;

      &:active {
        opacity: .8;
      }

      &.disabled {
        background-color: #cccccc; // stylelint-disable

        &:active {
          opacity: 1;
        }
      }
    }
  }
}
</style>
