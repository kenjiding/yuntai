<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['content']">
        <div :class="$style['header-cell']">
          <div :class="$style['header-cell-title']">会员概率</div>
          <van-switch v-model="openState" size="24px" @change="changeSwitch" :disabled="!isMain && !isAdmin"/>
        </div>

        <div v-show="openState">
          <van-cell :title="tenantName" icon="mendian" is-link  @click="tenantPopupVisiable = true" :class="$style.cell">
            参与<span :style="{color: 'blue'}">{{attendMachines}}</span>/共{{totalMachines}}台
          </van-cell>

          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            :class="$style['popup-list']"
            @load="getList">
            <div
              :class="$style['list-item']"
              v-for="(item, index) in openList"
              :key="'key_' + index">
              <div :class="$style['list-item__icon']">
                <img src="@/assets/img/machine.png" v-if="item.DeviceType === 'Online'" />
                <img src="@/assets/img/machine-disabled.png" v-else />
              </div>
              <div :class="$style['list-item__info']">
                <div :class="$style['list-item__info-name']">{{ item.DeviceName }} ({{ item.StartCoins }}币/次)</div>
                <div :class="$style['list-item__info-desc']" v-if="item.LuckyState !== -1" @click="() => winSetting(item)">
                  <span :class="$style['color-primary']">{{ handlerText(item) }}</span>
                </div>
              </div>
              <div
                :class="[$style['list-item__button'], item.LuckyState === -1 && $style['disabled']]"
                :style="{backgroundColor: item.LuckyState === 0 ? '#86beff' : null}"
                @click="() => changeDevice(item)">
                <span v-if="item.LuckyState === 1">参与中</span>
                <span v-else-if="item.LuckyState === 0">未参与</span>
                <span v-else>不支持</span>
              </div>
            </div>
          </van-list>
          </div>
      </div>
    </div>

    <ych-dialog
      v-model="updateWinSetting"
      show-confirm-button
      show-cancel-button
      confirmButtonText="保存"
      :before-close="changeWinSetting"
      :class="$style['win-setting-dialog']"
    >

      <div :class="$style['dialog-content']" v-if="itemInfo.GiftName">
        <p :class="$style.pText">中奖所需幸运值：<span>{{luckyValue}}</span></p>
        <p :class="$style.pText">设备编号：<span>{{`(${itemInfo.DeviceName})${itemInfo.DeviceNum}`}}</span></p>
        <p :class="$style.pText">启动单价：<span>{{itemInfo.StartCoins}}币/次</span></p>
        <p :class="$style.pText">礼品名称：<span>{{itemInfo.GiftName}}</span>
          <span :style="{color: '#077AFF',marginLeft: '20px'}" @click="changeGift">更换</span>
        </p>
        <p :class="$style.pText">礼品成本： <span>{{itemInfo.GiftPrice}}</span></p>
        <p :class="$style.pText">
          <span :style="{verticalAlign: 'middle', color: '#666'}">返奖率%：</span>
          <van-field
            v-model="inputWinCoins"
            :precision="0"
            :max="100"
            :min="1"
            :class="$style['dialog-input']"
            type="number" />
        </p>
        <!-- <van-field
          v-model="inputWinCoins"
          placeholder="多少币中奖一次"
          type="tel" /> -->
      </div>
      <p v-else :class="$style.giftText">请先添加礼品</p>
    </ych-dialog>

     <!-- 修改单价的Dialog -->
    <ych-dialog
      v-model="showEditPriceDialog"
      title="填写单价"
      confirm-button-text="保存"
      :before-close="handlePriceUpdated">

      <div>
        <van-field
          v-model="currentPrice"
          :class="$style['topTitle']"
          label="1币等于"
          placeholder="多少元"
          :precition="2"
          type="number"
          :max="999"
          :min="0"
          @blur="clickScrollHandler"
        />
      </div>
    </ych-dialog>
    <!-- 修改单价的Dialog -->

    <van-popup v-model="tenantPopupVisiable" position="bottom">
      <tenant-list
        @cell-click="handleTenantClicked"
        @close="tenantPopupVisiable = false">
      </tenant-list>
    </van-popup>
  </ych-page>
</template>

<script>
import MemberLucky from '@/api/MemberLucky';
import TenantList from './components/SelectTenant';
import Tenant from '@/api/Tenant';
import Person from '@/api/Person';

import { Toast, Popup, List } from 'vant';

export default {
  data: () => ({
    openState: false,
    openList: [],
    updateItemId: '',
    updateWinSetting: false,
    inputWinCoins: null,
    itemInfo: {},
    tenantPopupVisiable: false,
    tenantID: '',
    tenantName: '',
    loading: false,
    finished: false,
    pageIndex: 0,
    totalMachines: '',
    attendMachines: '',
    showEditPriceDialog: false,
    currentPrice: '',
    startCoinPrice: '',
  }),
  components: {
    TenantList,
    [Popup.name]: Popup,
    [List.name]: List,
  },

  computed: {
    isMain () {
      return this.$store.state.userInfo.IsMain;
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin;
    },
    luckyValue () {
      if (
        this.itemInfo.GiftPrice === 0 ||
        this.inputWinCoins === 0 ||
        this.itemInfo.StartCoins === 0
      ) {
        return 0;
      }

      let value = this.itemInfo.GiftPrice / (this.inputWinCoins / 100) / this.startCoinPrice;
      let splitStr = value.toString().indexOf('.') > -1 ? value.toString().split('.') : value;
      let num = typeof splitStr === 'object' ? `${splitStr[0]}.${splitStr[1].slice(0, 3)}` : splitStr;

      return Math.round(Number(num));
    },
  },

  beforeRouteEnter (to, from, next) {
    if (from.path.indexOf('gift-setting') > -1) {
      next(vm => {
        let cacheTenantInfo = JSON.parse(sessionStorage.getItem('tenantInfo'));
        vm.tenantID = cacheTenantInfo.id;
        vm.tenantName = cacheTenantInfo.name;

        vm.getList();
      });
    } else {
      next(vm => {
        vm.firstGetList();
      });
    }
  },

  methods: {
    clickScrollHandler () {
      document.body.scrollTop = document.body.scrollHeight;
    },
    handlePriceUpdated (action, done) {
      if (action === 'cancel') {
        this.openState = false;
        return done();
      }
      if (!this.currentPrice) {
        Toast('兑换价格不能为空');
        return done(false);
      }

      Person.postPayCodeInfo({
        Money: this.currentPrice,
      }).then(res => {
        done();
        this.updateList();
      });
    },
    changeGift () {
      sessionStorage.setItem('tenantInfo', JSON.stringify({
        id: this.tenantID,
        name: this.tenantName,
      }));

      this.$router.push({
        path: '/gift-setting',
        query: {
          DeviceId: this.itemInfo.DeviceId,
        },
      });
    },

    firstGetList () {
      Tenant.tenantList({
        SearchKey: '',
        PageIndex: 1,
        PageSize: 5,
      }).then(res => {
        if (res.Data.length <= 0) return;
        this.tenantID = res.Data[0].ID;
        this.tenantName = res.Data[0].Name;
        this.getList();
      });
    },

    handleTenantClicked (id, name) {
      this.tenantID = id;
      this.tenantName = name;
      this.updateList();
    },

    updateList () {
      this.finished = false;
      this.pageIndex = 0;
      this.openList = [];
      this.getList();
    },

    handlerText (data) {
      if (data.GiftName) {
        if (data.PlayCount === 0) {
          return '未设置返奖率';
        } else {
          return `返奖率 ${data.PlayCount}%`;
        }
      } else {
        return '添加礼品';
      }
    },
    changeWinSetting (action, done) {
      if (action === 'confirm') {
        if (!this.inputWinCoins) {
          Toast('请输入设置值');
          done(false);
          return;
        }
        MemberLucky.setProbability({
          DeviceID: this.updateItemId,
          WinCoins: this.inputWinCoins,
        }).then(_ => {
          done();
          Toast.success('修改成功');
          this.updateList();
        });
      } else {
        done();
      }
    },

    winSetting (item) {
      if (item.LuckyState === -1) return;
      this.itemInfo = item;
      this.updateItemId = item.DeviceId;
      if (!item.GiftName) {
        sessionStorage.setItem('tenantInfo', JSON.stringify({
          id: this.tenantID,
          name: this.tenantName,
        }));

        this.$router.push({
          path: '/gift-setting',
          query: {
            DeviceId: item.DeviceId,
          },
        });
      } else {
        this.inputWinCoins = this.itemInfo.PlayCount;
        this.updateWinSetting = true;
      }
    },

    getList () {
      this.loading = true;

      MemberLucky.list({
        CustomerID: this.$store.state.userInfo.CustomerID,
        TenantID: this.tenantID,
        PageIndex: ++this.pageIndex,
        PageSize: 10,
      }).then(res => {
        if (!res.OpenFlag) {
          return;
        }

        if (!res.CoinPrice) {
          this.showEditPriceDialog = true;
          this.currentPrice = '';
          return;
        }
        this.startCoinPrice = res.CoinPrice;
        this.totalMachines = res.TotalCount;
        this.attendMachines = res.AttendCount;

        this.openState = res.OpenFlag;

        this.loading = false;
        this.openList = this.openList.concat(res.OpenList);

        if (this.openList.length >= res.TotalCount) {
          this.finished = true;
        }
      });
    },

    // 改变设备的状态
    changeDevice (device) {
      if (device.LuckyState === -1) return;

      Toast.loading({
        forbidClick: true,
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
          this.updateList();
        });
      } else {
        if (!device.GiftName) {
          Toast.clear();
          this.$dialog.confirm({
            message: '请先添加礼品',
            showCancelButton: true,
            confirmButtonText: '去添加',
          }).then(() => {
            this.$router.push({
              path: '/gift-setting',
              query: {
                DeviceId: device.DeviceId,
              },
            });
          }).catch(() => {
          });
          return;
        }
        // 开启
        MemberLucky.open({
          CustomerID: this.$store.state.userInfo.CustomerID,
          DeviceID: device.DeviceId,
        }).then(res => {
          Toast.success('参与成功');
          this.updateList();
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
        Toast.clear();
        value && this.updateList();
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.popup-list {
  position: absolute;
  top: 115px;
  bottom: 0;
  width: 100%;
  overflow: auto;
}

.cell {
  margin-top: 15px;

  .van-icon-mendian {
    /* stylelint-disable-next-line */
    font-size: 24px;
    position: relative;
    top: -1px;
    color: $color-primary;
  }

  .van-cell__title {
    @include ellipsis();
  }
}

.giftText {
  font-size: $font-size-primary;
  text-align: center;
  padding: 50px;
}

.pText {
  padding: 5px 10px;
  color: $font-color-regular;
  font-size: $font-size-special;
  line-height: 20px;

  span {
    color: $color-black;
  }
}

.dialog-input {
  display: inline-block;
  width: 80px;
  padding: 0 10px;
  vertical-align: middle;

  input {
    text-align: left;
  }
}

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
  width: 90%;
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

.color-primary {
  color: $color-primary;
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
      display: inline-block;
      color: $font-color-secondary;
      font-size: 14px;
      margin-top: 10px;
      border-bottom: 1px solid $color-primary;
      padding-bottom: 3px;
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
</style>
