<template>
  <ych-page>
    <div :class="$style['currency-rush-content']">
      <div :class="$style['currency-rush-tabs']">
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
                :active="active"
                @createQr="createQr"/>
            </van-list>

            <div v-else :class="$style['empty-page']">
              <img src="@/assets/img/empty-rg-page.png" :class="$style['icon']"/>
              <div :class="$style['text']">暂无活动记录</div>
            </div>

          </van-tab>
        </van-tabs>
      </div>

      <div :class="$style['options-btns']">
        <van-button type="primary" @click="$router.push('/currency-rush-create')">新建</van-button>
      </div>
    </div>

    <van-popup v-model="activityQrShow" :class="$style['qr-image-popup']">
      <img :src="qrImgUrl"/>
    </van-popup>

    <div v-show="false">
      <canvas width="280" height="400" id="currency-rush-qr"/>
      <img src="@/assets/img/currency_rush_bg.png" id="currency-rush-bg"/>
    </div>
  </ych-page>
</template>

<script>
import { List, Toast, Popup } from 'vant';
import CurrencyRush from '@/api/CurrencyRush';
import ActivityListItem from './components/ActivityListItem';

export default {
  components: {
    ActivityListItem,
    [List.name]: List,
    [Popup.name]: Popup,
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
    qrImgUrl: '',
    activityQrShow: false,
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

  mounted () {
    // this.createCanvas({
    //   QrImgUrl: 'https://user-gold-cdn.xitu.io/2019/3/19/16994f4670a15c69?w=165&h=165&f=png&s=1801',
    //   Name: '100元=无穷币',
    // });
  },

  methods: {
    createQr (id) {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });

      CurrencyRush.qr({
        ID: id,
      }).then(res => {
        this.$nextTick(() => this.createCanvas(res));
      });
    },

    changePixel (context) {
      var devicePixelRatio = window.devicePixelRatio || 1;
      var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
      var ratio = devicePixelRatio / backingStoreRatio;
      return ratio;
    },

    createCanvas (qrInfo) {
      let canvas = document.getElementById('currency-rush-qr');
      let imageBg = document.getElementById('currency-rush-bg');
      let context = canvas.getContext('2d');

      imageBg.crossOrigin = 'Anonymous';
      context.drawImage(imageBg, 0, 0, canvas.width, canvas.height);

      context.font = 'bold 25px STXinwei';
      context.fillStyle = '#fff';
      context.fillText('扫码抢购限时套餐', 40, 130);

      context.font = 'bold 16px STXinwei';
      context.fillStyle = '#fff';
      context.fillText(qrInfo.Name, 95, 170);

      let imageQr = new Image();
      imageQr.crossOrigin = 'Anonymous';
      imageQr.onload = () => {
        Toast.clear();
        context.drawImage(imageQr, 60, 200, 160, 160);
        var base64 = canvas.toDataURL('image/png');
        //添加'?dateMark=' , 强制使得base64Src响应变化
        this.qrImgUrl = base64;
        this.activityQrShow = true;
      };
      imageQr.src = qrInfo.QrImgUrl;
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
      CurrencyRush.list({
        State: activeName,
        PageIndex: this.pageIndex[activeName],
        PageSize: 20,
      }).then(res => {
        Toast.clear();
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

.currency-rush-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .currency-rush-tabs {
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
      width: 345px;
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

.qr-image-popup {
  background-color: transparent;
  overflow: hidden;
}
</style>
