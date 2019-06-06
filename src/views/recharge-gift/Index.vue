<template>
  <ych-page>
    <div :class="$style['recharge-gift-content']">
      <div :class="$style['recharge-gift-tabs']">
        <van-tabs v-model="active" color="#007AFF" sticky>
          <van-tab
            v-for="tab in tabs"
            :title="tab.title + (size[tab.value] > 0 ? '(' + size[tab.value] +  ')' : '')"
            :key="tab.title">

            <van-list
              v-if="list[tab.value].length > 0"
              v-model="isLoading[tab.value]"
              :finished="isFinished[tab.value]"
              @load="onListLoad"
              :offset="50">
              <activity-list-item
                v-for="data in list[tab.value]"
                :key="data.ID"
                :data="data"
                :tabs="tabs"
                :active="active"/>
            </van-list>

            <div v-else :class="$style['empty-page']">
              <img src="@/assets/img/empty-rg-page.png" :class="$style['icon']"/>
              <div :class="$style['text']">暂无活动记录</div>
            </div>

          </van-tab>
        </van-tabs>
      </div>

      <div :class="$style['options-btns']">
        <van-button plain type="primary" @click="$router.push('recharge-gift-create')">新建</van-button>
        <van-button type="primary" @click="writeOff">
          <van-icon name="qr" />
          核销
        </van-button>
      </div>
    </div>
  </ych-page>
</template>

<script>
import { Toast, List } from 'vant';
import RechargeGift from '@/api/RechargeGift';
import ActivityListItem from './components/ActivityListItem';
import wx from 'weixin-js-sdk';

export default {
  components: {
    ActivityListItem,
    [List.name]: List,
  },

  data: () => ({
    active: 1,
    tabs: [{
      title: '未开始',
      value: 'NotStart',
    }, {
      title: '进行中',
      value: 'OnGoing',
    }, {
      title: '已结束',
      value: 'Ended',
    }],
    isLoading: {
      NotStart: false,
      OnGoing: false,
      Ended: false,
    },
    isFinished: {
      NotStart: false,
      OnGoing: false,
      Ended: false,
    },
    size: {
      NotStart: 0,
      OnGoing: 0,
      Ended: 0,
    },
    list: {
      NotStart: [],
      OnGoing: [],
      Ended: [],
    },
    pageIndex: {
      NotStart: 1,
      OnGoing: 1,
      Ended: 1,
    },
  }),

  watch: {
    active (newVal) {
      let activeName = this.tabs[newVal].value;
      if (this.list[activeName].length === 0) {
        this.firstLoad();
      }
    },
  },

  created () {
    this.firstLoad();
  },

  methods: {
    writeOff () {
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var number = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            _this.$router.push({
              path: 'recharge-gift-write-off',
              query: {
                number,
              },
            });
          },
          fail: function (res) {
            Toast('扫描二维码失败');
          },
        });
      });
    },

    firstLoad () {
      Toast.loading({
        mask: true,
        message: '正在加载中...',
        duration: 0,
      });

      let activeName = this.tabs[this.active].value;
      this.isLoading[activeName] = true;
      this.onListLoad();
    },

    onListLoad () {
      let activeName = this.tabs[this.active].value;
      console.log('执行列表加载', this.isLoading[this.tabs[this.active].value]);
      RechargeGift.activityList({
        State: activeName,
        PageIndex: this.pageIndex[activeName],
        PageSize: 20,
      }).then(res => {
        Toast.clear();
        console.log(res);
        this.isLoading[activeName] = false;
        if (this.list[activeName].length === 0) {
          this.size.NotStart = res['NotStartSize'];
          this.size.OnGoing = res['OnGoingSize'];
          this.size.Ended = res['EndedSize'];
        }

        // 返回的数据列表为0，则取消该列表的Load事件
        if (res.Data.length > 0) {
          this.pageIndex[activeName] += 1;
          this.list[activeName] = this.list[activeName].concat(res.Data);
          this.isFinished[activeName] = false;
        } else {
          this.isFinished[activeName] = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.recharge-gift-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .recharge-gift-tabs {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .van-tabs--line {
      padding-top: 0;
    }

    .van-tab__pane {
      padding-top: 50px;
    }
  }

  .options-btns {
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .van-button {
      width: 165px;
      height: 40px;
    }
  }
}

.empty-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 150px;

  .icon {
    width: 200px;
    height: 180px;
  }

  .text {
    font-size: 14px;
    color: $font-color-secondary;
    text-align: center;
    margin-top: 16px;
    line-height: 20px;
  }

  .point {
    width: 50px;
    height: 100px;
    margin-left: 80px;
    margin-top: 50px;
  }
}

</style>
