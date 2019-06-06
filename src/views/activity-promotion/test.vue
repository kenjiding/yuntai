<template>
  <ych-page>
    <div :class="$style.wrap">
      <div :class="$style.header" @click="vibration">
        <p @click="tipsShow = true">规则说明<van-icon name="question" /></p>
        <div :class="$style['header-main']">
          <p>共发出</p>
          <p>{{GameCurrenceData.AllCurrence | number}}币</p>
        </div>
        <div  :class="$style['header-bottom']">
          <p>已领取{{GameCurrenceData.GetCurrenced | number}}币</p>
          <p>参与人数{{GameCurrenceData.AllParticipate | number}}人</p>
        </div>
        <div :class="$style['select-date']" @click="test">
          <p>{{TimestampChangeDate(GameCurrenceData.Date).harfDate}}</p>
          <van-icon name="xiangyou" />
        </div>
      </div>
      <div :class="$style.content">
        <div
          :class="$style['content-item']"
          v-for="(item,index) in GameCurrenceData.CurrenceItem"
          :key="item.ID">
          <div @click="currenceInfo(item.ID)">
            <van-cell :title="item.CurrenceName || '免费领币，快乐游玩！'" :value="item.Num + '币'" />
            <van-cell
              :title="`${item.Name}(${item.Phone})`"
              :label="TimestampChangeDate(item.Date).fullDate"
              :class="$style['content-item-info']">
              <div slot="right-icon" :class="$style['cell-value']">
                <p>{{'已领取：' + item.AlreadyGet + '币'}}</p>
                <span>{{'参与人数：' + item.Participate + '人'}}</span>
              </div>
            </van-cell>
          </div>
          <div
            :class="$style['content-bottom']"
            v-show="item.IsExpired === 'Having'">
            <span @click="createQrcode(item)">生成二维码</span>
            <span @click="shareFriend(item)">发送给朋友</span>
          </div>
          <img :id="'QrcodeSrc'+index" src="../../assets/img/get-currence.png" width="100%" v-show="false"/>
          <van-icon :name="statusHandle(item.IsExpired)" :class="$style.iconfont"/>
        </div>
      </div>
      <div :class="$style.button" @click="$router.push('./add-currence')">
        <van-button size="large">创建红包</van-button>
      </div>
      <van-popup v-model="popupShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          @confirm="selectDate"
          @cancel="popupShow = false"
        />
      </van-popup>
      <van-popup
        v-model="qrcodeShow"
        :class="$style.popup"
        :overlay-style="{backgroundColor: 'rgba(0,0,0,.9)'}">
        <SharePopup
          :which-step="whichStep"
          :item-currence="itemCurrence"
          :random-num="randomNum"
          :qrcode-text="qrCodeText"
          @closePopup="qrcodeShow=false"
          :base64-src="base64Src"></SharePopup>
      </van-popup>
      <van-popup v-model="tipsShow">
        <Description @closePopup="tipsShow = false"></Description>
      </van-popup>
      <div v-show="false">
        <img id="img1" src="../../assets/img/currence.png" width="100%" />
      </div>
    </div>
  </ych-page>
</template>

<script>
import { Cell, CellGroup, Icon, DatetimePicker, Popup, Toast } from 'vant';
import Promotion from '@/api/Promotion';
import wx from 'weixin-js-sdk';
import SharePopup from './components/SharePopup';
import Description from './components/Description';

export default {
  name: '',

  data () {
    return {
      GameCurrenceData: {},
      popupShow: false,
      currentDate: new Date(),
      qrcodeShow: false,
      qrCodeText: '',
      whichStep: null,
      itemCurrence: '',
      randomNum: '',
      tipsShow: false,
      base64Src: null,
    };
  },

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    SharePopup,
    Description,
  },

  mounted () {
  },

  methods: {
    vibration () {

      // if (navigator.vibrate) {
      //   // 支持
      //   alert('支持设备震动！');
      //   navigator.vibrate([500, 300, 400, 300]);
      // } else {
      //   navigator.vibrate([500, 300, 400, 300]);
      //   alert('不支持设备震动！');
      // }
      // navigator.vibrate([500, 300, 400, 300]);
    },
    changePixel (context) {
      var devicePixelRatio = window.devicePixelRatio || 1;
      var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
      var ratio = devicePixelRatio / backingStoreRatio;
      return ratio;
    },
    imgtest (src) {
      let change = (num) => this.changePixel(ctx) * num;
      var c = document.createElement('canvas');
      var img = document.getElementById('img1');
      var ctx = c.getContext('2d');
      c.width = change(1034);
      c.height = change(1271);

      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, c.width, c.height);
      img.crossOrigin = 'Anonymous';
      ctx.drawImage(img, 0, 0, change(1034), change(1271));
      let img2 = new Image();
      img2.crossOrigin = 'Anonymous';
      img2.src = src;
      // img2.src = 'https://nos.netease.com/easyread/fle/a0df1d4009c7a2ec5fee/1524215500140/avatar.png?' + (+new Date());
      img2.onload = () => {
        let w = img2.width;
        let h = img2.height;
        ctx.drawImage(img2, change(220), change(580), change(w / 2), change(h / 2));
        ctx.font = 'small-caps bold ' + change(110) + 'px STXinwei';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.qrCodeText.slice(0, 5), change(268), change(165));
        ctx.fillText(this.qrCodeText.slice(5), change(268), change(315));
        var base64 = c.toDataURL('image/jpeg');
        this.base64Src = base64;
        console.log(base64);
      };
    },
    statusHandle (val) {
      if (val === 'Expire') {
        return 'yiguoqi';
      } else if (val === 'Period') {
        return 'yilingwan';
      }
    },
    shareFriend (val) {
      this.qrCodeText = val.CurrenceName;
      this.itemCurrence = val.Num;
      this.randomNum = val.Acount;
      this.qrcodeShow = true;
      this.whichStep = true;
      this.sharaNet(val);
    },
    sharaNet (val) {
      wx.ready(function () {
        // 分享给朋友接口
        wx.onMenuShareAppMessage({
          title: val.CurrenceName,
          desc: '扫码领取',
          link: val.ShareSrc,
          imgUrl: val.QrcodeSrc,
          trigger: function (res) {
            alert('用户点击发送给朋友');
          },
          success: function (res) {
            alert('已分享');
          },
          cancel: function (res) {
            alert('已取消');
          },
          fail: function (res) {
            alert(JSON.stringify(res));
          },
        });
      });
      // <%--处理失败验证--%>
      wx.error(function (res) {
        alert('error: ' + res.errMsg);
      });
    },
    createQrcode (val) {
      this.imgtest(val.QrcodeSrc);

      this.qrCodeText = val.CurrenceName || '免费领币，快乐游玩！';
      this.qrcodeShow = true;
      this.whichStep = false;
    },
    currenceInfo (id) {
      this.$router.push({
        path: '/currence-item-info',
        query: {
          ID: id,
        },
      });
    },
    test () {
      this.popupShow = true;
    },
    selectDate () {
      this.popupShow = false;
      let date = Date.parse(this.currentDate);
      this.getData(date);
    },
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    getData (date) {
      date = date && this.TimestampChangeDate(date).harfDate;
      console.log(this.TimestampChangeDate(date).harfDate, 123);
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });
      Promotion.getGameCurrenceInfoAsync({Date: date}).then(res => {
        this.GameCurrenceData = Object.assign({}, res);
        console.log(this.TimestampChangeDate(this.GameCurrenceData.Date).harfDate, '筛选日期', this.GameCurrenceData.Date);
        Toast.clear();
      });
    },
    TimestampChangeDate (timestamp) {
      var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear();
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      var D = date.getDate();
      var h = date.getHours();
      var m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1);
      var s = (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds() + 1) : date.getSeconds() + 1);

      let fullDate = `${Y}年${M}月${D}日 ${h}:${m}:${s}`;
      let harfDate = `${Y}年${M}月`;
      return {fullDate, harfDate};
    },
  },
  created () {
    this.getData(null);
  },
};
</script>

<style lang='scss' module>
// stylelint-disable
@import "@/styles/them.scss";

.iconfont {
  position: absolute;
  left: 48%;
  top: 5%;
  font-size: 70px;
  color: $font-color-placeholder;
}

.popup {
  width: 80%;
  background: rgba(0,0,0,0);
}

.cell-value {
  padding-top: 3px;
  text-align: right;

  p {
    line-height: 15px;
  }
}

.button {
  position: fixed;
  bottom: 10px;
  width: 100%;

  .van-button {
    width: 95%;
    display: block;
    margin: 0 auto;
    background-color: #ff4545;
    border-radius: 10px;
    color: $color-white;
  }
}

.content {
  padding: 7px;
  position: absolute;
  top: 163px;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .content-item-info {
    font-size: 13px;
    padding-top: 0;
  }

  &-item {
    border: 1px solid #bfbfbf;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    position: relative;

    &:last-of-type {
      margin-bottom: 70px;
    }
  }

  [class*=van-hairline]:after {
    content: none;
  }

  &-bottom {
    background-color: $color-white;

    span {
      display: inline-block;
      width: 50%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      box-sizing: border-box;
      color: $color-primary;
      border-top: 1px solid $border-color;
      font-size: $font-size-special;

      &:nth-child(1) {
        border-right: 1px solid $border-color;
      }
    }
  }
}

.select-date {
  position: absolute;
  top: 50%;
  margin-top: -22px;
  right: 0;
  width: 22%;
  height: 40px;
  border: 1px solid $border-color;
  border-right: none;
  text-align: center;
  border-radius: 30px 0 0 30px;

  .van-icon-xiangyou {
    transform:rotate(90deg);
    font-size: 25px;
    position: relative;
    top: -10px;
    left: 6px;
    color: $color-white;
  }

  p {
    padding: 7px 0 !important;
  }
}

.header-bottom {
  text-align: center;
  margin-top: 20px;

  p {
    padding: 3px !important;
    font-size: 13px !important;
  }
}

.wrap {
  .van-popup {
    background-color: rgba(0,0,0,0);
  }

  .header {
    width: 100%;
    height: 160px;
    background-color: #ff4545;
    position: relative;

    &-main {
      width: 100%;

      p {
        width: 100%;
        text-align: center;
        font-size: 20px;
      }
    }

    p {
      box-sizing: border-box;
      color: $color-white;

      &:nth-child(1) {
        padding: 10px;
        font-size: 13px;

        .van-icon-question {
          font-size: 13px;
          display: inline-block;
          vertical-align: middle;
          margin: -3px 0 0 5px;
        }
      }
    }
  }
}
</style>
