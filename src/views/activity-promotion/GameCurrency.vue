<template>
  <ych-page>
    <div :class="$style.wrap">
      <div :class="$style.header">
        <p><span @click="tipsShow = true">规则说明<van-icon name="question" /></span></p>
        <div :class="$style['header-main']">
          <p>共发出</p>
          <p>{{GameCurrenceData.AllCurrence | number}}币</p>
        </div>
        <div  :class="$style['header-bottom']">
          <p>已领取{{GameCurrenceData.GetCurrenced | number}}币</p>
          <p>参与人数{{GameCurrenceData.AllParticipate | number}}人</p>
        </div>
        <div :class="$style['select-date']" @click="popupShow = true">
          <p>{{GameCurrenceData.Date | date('YYYY-MM')}}</p>
          <van-icon name="xiangyou" />
        </div>
      </div>
      <div :class="$style.content">
      <van-list
        v-model="listLoading"
        :finished="listFinished"
        @load="getData"
        :offset="500"
        >
        <div
          :class="$style['content-item']"
          v-for="item in GameCurrenceData.CurrenceItem"
          :key="item.ID">
          <div @click="currenceInfo(item.ID)">
            <van-cell :title="item.CurrenceName || '免费领币，快乐游玩！'" :value="item.Num + '币'" />
            <van-cell
              :title="`${item.Name}(${item.Phone})`"
              :label="item.Date | date()"
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
            <!-- <span @click="shareFriend(item)">发送给朋友</span> -->
          </div>
          <van-icon :name="statusHandle(item.IsExpired)" :class="$style.iconfont"/>
        </div>
      </van-list>
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
        :overlay-style="{backgroundColor: 'rgba(0,0,0,.9)'}"
        @click-overlay="popupClose">
        <SharePopup
          ref="SharePopup"
          :which-step="whichStep"
          :item-currence="itemCurrence"
          :random-num="randomNum"
          :random-status="randomStatus"
          :qrcode-text="qrCodeText"
          @closePopup="qrcodeShow=false"
          :img-src="base64Src"></SharePopup>
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
import { Cell, CellGroup, Icon, DatetimePicker, Popup, Toast, List } from 'vant';
import Promotion from '@/api/Promotion';
import wx from 'weixin-js-sdk';
import SharePopup from './components/SharePopup';
import Description from './components/Description';
import dayjs from 'dayjs';

export default {
  name: '',

  data () {
    return {
      GameCurrenceData: {
        CurrenceItem: [],
        AllCurrence: null,
        GetCurrenced: null,
        Date: null,
        AllParticipate: null,
      },
      popupShow: false,
      currentDate: new Date(),
      qrcodeShow: false,
      qrCodeText: '',
      whichStep: null,
      itemCurrence: '',
      randomNum: '',
      tipsShow: false,
      base64Src: null,
      baseImg: '',
      randomStatus: true,
      pageIndex: 1,
      listLoading: false,
      listFinished: false,
      imgOnloadDone: false,
    };
  },

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [List.name]: List,
    SharePopup,
    Description,
  },

  mounted () {
    this.baseImg = document.getElementById('img1').src;
  },

  methods: {
    popupClose () {
      this.base64Src = '';
      // this.$refs.SharePopup.closePupop();
      // if (this.whichStep) return;
      // let parentNode = document.getElementById('imgWrap');
      // // let childNode = document.getElementById('base64Element');
      // //删除所有img标签
      // while (parentNode.hasChildNodes()) {
      //   parentNode.removeChild(parentNode.firstChild);
      // }
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
      c.style.borderRadius = '50px solid red';

      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, c.width, c.height);
      img.crossOrigin = 'Anonymous';
      ctx.drawImage(img, 0, 0, change(1034), change(1271));
      let img2 = new Image();
      img2.crossOrigin = 'Anonymous';
      img2.onload = () => {
        ctx.drawImage(img2, change(190), change(560), change(654), change(654));
        ctx.font = 'bold ' + change(110) + 'px STXinwei';
        ctx.fillStyle = '#fff';
        if (this.qrCodeText) {
          ctx.fillText(this.qrCodeText.slice(0, 5), change(240), change(165));
          ctx.fillText(this.qrCodeText.slice(5), change(240), change(315));
        } else {
          ctx.fillText('免费领币', change(300), change(165));
          ctx.fillText('快乐游玩', change(300), change(315));
        }

        var base64 = c.toDataURL('image/jpeg');
        //添加'?dateMark=' , 强制使得base64Src响应变化
        this.base64Src = base64 + '?dateMark=' + (+new Date());
      };
      img2.src = src;
    },
    statusHandle (val) {
      if (val === 'Expire') {
        return 'yiguoqi';
      } else if (val === 'Period') {
        return 'yilingwan';
      }
    },
    shareFriend (val) {
      this.sharaNet(val);
      this.qrCodeText = val.CurrenceName;
      this.itemCurrence = val.Num;
      this.randomNum = val.Acount;
      this.randomStatus = val.IsRandom;
      this.qrcodeShow = true;
      this.whichStep = true;
    },
    sharaNet (val) {
      wx.ready(() => {
      // 分享给朋友接口
        wx.onMenuShareAppMessage({
          title: val.CurrenceName || '免费领币，快乐游玩！',
          desc: `赶快点击，领取${val.IsRandom ? '随机' : '固定'}大红包`,
          link: val.ShareSrc,
          imgUrl: this.baseImg,
        });
        wx.onMenuShareTimeline({
          title: val.CurrenceName || '免费领币，快乐游玩！',
          link: val.ShareSrc,
          imgUrl: this.baseImg,
        });
      });
    },
    createQrcode (val) {
      Toast.loading({
        message: '加载中...',
        mask: true,
        loadingType: 'circular',
      });
      this.base64Src = val.QrcodeSrc;

      this.qrCodeText = val.CurrenceName;
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
    selectDate () {
      this.popupShow = false;
      let date = Date.parse(this.currentDate);
      //当选择日期后，重置列表和pageIndex
      this.pageIndex = 1;
      this.GameCurrenceData.CurrenceItem = [];
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
      date = date && dayjs(date).format('YYYY-MM');
      this.listLoading = true;
      Promotion.getGameCurrenceInfoAsync({
        Date: date,
        pageIndex: this.pageIndex++,
        PageSize: 20,
      }).then(res => {
        this.listLoading = false;
        Toast.clear();
        // this.GameCurrenceData = Object.assign({}, res);
        this.GameCurrenceData.Date = res.Date;
        if (this.pageIndex === 2) {
          this.GameCurrenceData.AllCurrence = res.AllCurrence;
          this.GameCurrenceData.GetCurrenced = res.GetCurrenced;
          this.GameCurrenceData.AllParticipate = res.AllParticipate;
        }

        if (res.CurrenceItem.length === 0) {
          this.listFinished = true;
          return;
        }
        // this.GameCurrenceData.CurrenceItem = this.GameCurrenceData.CurrenceItem.concat(res.CurrenceItem);
        let concatArr = this.GameCurrenceData.CurrenceItem.concat(res.CurrenceItem);
        let newArr = [];
        let overArr = [];
        let uselessArr = [];

        function compare (name) {
          return function (a, b) {
            var value1 = a[name];
            var value2 = b[name];
            return value2 - value1;
          };
        }

        concatArr.forEach((item) => {
          if (item.IsExpired === 'Having') {
            newArr.push(item);
          } else if (item.IsExpired === 'Expire') {
            overArr.push(item);
          } else if (item.IsExpired === 'Period') {
            uselessArr.push(item);
          }
        });

        //对newArr，根据时间倒序
        newArr.sort(compare('Date'));
        this.GameCurrenceData.CurrenceItem = newArr.concat(overArr, uselessArr);
      }, _ => {
        this.GameCurrenceData.Date = +new Date();
        this.listLoading = false;
        this.listFinished = true;
        Toast.clear();
      });
    },
  },
  created () {
    Toast.loading({
      message: '加载中...',
      duration: 0,
      mask: true,
    });
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
  bottom: 0;
  width: 100%;

  .van-button {
    width: 100%;
    display: block;
    margin: 0 auto;
    background-color: #ff4545;
    color: $color-white;
  }
}

.content {
  padding: 7px;
  position: absolute;
  top: 163px;
  bottom: 43px;
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
      width: 100%;
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
