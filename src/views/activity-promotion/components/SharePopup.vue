<template>
    <div :class="$style.imgwrap">
      <div
        v-show="whichStep"
        :class="$style.topText">
        <h5>提示：</h5>
        <h5>点击右上角，把红包发给微信朋友</h5>
        <img src="@/assets/img/share.png" />
      </div>

      <div :style="{position: 'relative',}">
        <div id="imgWrap">
          <img
            :src="imgSrc"
            :class="$style['promotion-img']"
            @load="imgLoadComplete"/>
        </div>
        <img
          src='@/assets/img/currence.png'
          :class="$style.img"
          v-show="whichStep"/>
        <div
          :class="$style['img-inline-text']"
          v-show="whichStep">
          <h3><span :style="{color: 'yellow'}">{{itemCurrence}}</span>币</h3>
        <h3>
          <span
            :style="{color: 'yellow'}">{{randomNum}}</span>个{{randomStatus ? '拼手气' : '固定'}}红包</h3>
        </div>
        <p v-show="whichStep">{{qrcodeText ? qrcodeText : '免费领币'}}</p>
        <p
          v-show="whichStep && !qrcodeText"
          :class="$style.pText">{{qrcodeText ? qrcodeText : '快乐游玩'}}</p>
      </div>
      <div
        v-show="!whichStep && imgTextShow"
        :class="$style['bottom-text']">
        <h5>提示：长按保存在手机；</h5>
        <h5>二维码红包可投放到线下或者其他渠道进行引流，用户用微信扫码即可以领取红包</h5>
      </div>
    </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  name: '',

  data () {
    return {
      imgTextShow: false,
      base64Src: null,
    };
  },

  props: {
    qrcodeShow: Boolean,
    obj: Object,
    whichStep: Boolean,
    itemCurrence: [Number, String],
    randomNum: [Number, String],
    qrcodeText: String,
    cacheBase64: String,
    randomStatus: Boolean,
    imgSrc: String,
  },

  watch: {
    cacheBase64 (val) {
      //创建img之前，要再次保证删除之前的img图片
      this.popupClose();
    },
  },

  methods: {
    imgLoadComplete () {
      Toast.clear();
      this.imgTextShow = true;
    },
    createImg () {
      //cacheBase64响应变化后，删除'?dateMark='
      let mark = this.cacheBase64.lastIndexOf('?dateMark=');
      this.base64Src = this.cacheBase64.slice(0, mark);
      //创建img标签，插入到指定位置。目的是避免img标签的onload函数没响应
      let newImg = document.createElement('img');
      newImg.crossOrigin = 'Anonymous';
      newImg.style.width = '100%';
      newImg.id = 'base64Element';

      newImg.onload = () => {
        Toast.clear();
        document.getElementById('imgWrap').appendChild(newImg);
        this.imgTextShow = true;
      };
      newImg.src = this.base64Src;
    },
    popupClose () {
      let parentNode = document.getElementById('imgWrap');
      // let childNode = document.getElementById('base64Element');
      //删除所有img标签
      while (parentNode.hasChildNodes()) {
        parentNode.removeChild(parentNode.firstChild);
      }
      this.createImg();
    },
  },
};
</script>

<style lang='scss' module>
// stylelint-disable
@import "@/styles/them.scss";

.promotion-img {
  width: 100%;
}

.pText {
  top: 70px !important;
}

.bottom-text {
  font-size: 15px;
}

.img-inline-img {
  width: 58%;
  position: absolute;
  left: 50%;
  top: 45%;
  margin: 0 0 0 -85px;
  text-align: center;
  font-size: 30px;
  line-height: 50px;
}

.img-inline-text {
  width: 100%;
  position: absolute;
  top: 50%;
  text-align: center;
  font-size: 30px;
  line-height: 50px;

  span {
    color: $color-warning;
  }
}

.img {
  width: 100%;
  margin: 10px auto 10px auto;
  display: block;
}

.topText {
  position: relative;
  font-size: 15px;

  img {
    position: absolute;
    right: 0;
    width: 30%;
    top: -55px;
  }
}

.imgwrap {
  position: relative;
  color: $color-white;
  line-height: 20px;

  p {
    display: block;
    width: 200px;
    position: absolute;
    top: 25px;
    left: 16%;
    text-align: center;
    font-size: 35px;
    line-height: 35px;
  }

  h5 {
    padding-left: 20px;
  }
}
</style>
