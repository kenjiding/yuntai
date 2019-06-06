<template>
  <ych-page>
    <van-button @click="$router.push('/tenant-list')">绑定项目</van-button>
    <van-button @click="$router.push('/goods-store-list')">商品模块</van-button>
    <van-button @click="$router.push('/package')">套票模块</van-button>
    <van-button @click="$router.push('/package-store-list')">新版套票模块</van-button>
    <van-button @click="$router.push('/order')">订单模块</van-button>
    <van-button @click="$router.push('/package-store-list')">套票模块</van-button>
    <van-button @click="$router.push('/goods-store-select')">同步门店</van-button>
    <van-button @click="$router.push('/customer-appeal')">客诉</van-button>
    <van-button @click="$router.push('/leaguer')">会员管理</van-button>
     <van-field
      v-model="bankCartFormData.PhoneNum"
      label="客户电话"
      placeholder="请填写"
      required
    />
    <van-button @click="cancel">打开</van-button>
    <van-icon name="tianjia" />
    <router-link to="/about">{{ number | number('0,0.00') }}</router-link>
    <ych-dialog
      theme="danger"
      v-model="dialogShow"
      title="提示"
      message="aaaa"
      :show-cancel-button="true"
      :show-confirm-button="true"
      cancel-button-text="关闭"
      confirm-button-text="确定"
      @confirm="confirm"
      :before-close="beforeClose"
    >
    </ych-dialog>

    <swipe :class="$style.swipe">
      <swipe-item
        v-for="n in 4"
        :class="$style['swipe-item']"
        :key="n">
        {{ n }}
      </swipe-item>
    </swipe>
    <YchArea @click-overlay="cancel" :visible.sync="show" @confirm="cancel"/>
      <img id="show" />
      <img id="img1" src="../../assets/img/currence.png" width="100%" />
      <img id="img2"
        src="http://src.house.sina.com.cn/imp/imp/deal/86/68/4/e51eac8a98c2bd65c6b68bae86c_p1_mk1_wm35.gif"
        width="100%"
        crossOrigin="Anonymous"/>
  </ych-page>

</template>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .test {
    .van-button__text {
      color: $color-black;
    }
  }

  .swipe-item {
    width: 100%;
    height: 200px;
  }

  .swipe {
    width: 100%;
    height: 200px;
    background-color: $color-primary;
  }

  .test-a {
    font-size: 1;
  }
</style>

<script>
import { NumberKeyboard, Popup, Area, Swipe, SwipeItem, Toast } from 'vant';
import YchArea from '@/components/Area';
import listData from '@/components/Area/area.js';
import eventBus from '@/events/goods-detail-refresh';
// import { constants } from 'http2';

export default {
  created () {
    eventBus.on(() => {
    });
  },

  mounted () {
    this.imgtest();
  },

  beforeDestroy () {
    eventBus.off();
  },

  components: {
    NumberKeyboard,
    Area,
    YchArea,
    Popup,
    Swipe,
    SwipeItem,
  },

  data () {
    return {
      datalist: listData,
      number: 123456.123456,
      show: false,
      dialogShow: false,
      username: '',
      password: '',
      text: new Date(),
      bankCartFormData: {
        PhoneNum: '',
      },
    };
  },

  methods: {
    imgtest () {
      var c = document.createElement('canvas');
      var img = document.getElementById('img1');
      var img2 = document.getElementById('img2');
      var ctx = c.getContext('2d');
      c.width = 375;
      c.height = 400;

      ctx.rect(0, 0, c.width, c.height);
      ctx.fillStyle = '#fff';
      ctx.fill();

      img.setAttribute('crossOrigin', 'Anonymous');
      img.onload = function () {
        console.log(1);
        ctx.drawImage(img, 0, 0, 350, 350);
        img2.setAttribute('crossOrigin', 'Anonymous');
        img2.onload = function () {
          console.log(2);
          ctx.drawImage(img2, 0, 0, 200, 200);
          var base64 = c.toDataURL('image/jpeg');
          console.log(base64);
          var img1 = document.getElementById('show');
          img1.setAttribute('src', base64);
        };
      };
    },
    cancel () {
      // console.log('test');
      // this.$toast.loading('加载中...。。');
      if (/\d{3}(\s|-)?\d{8}|\d{4}(\s|-)?\d{7}/.test(this.bankCartFormData.PhoneNum) &&
      this.bankCartFormData.PhoneNum.length <= 12) {
        console.log(888);
      } else {
        if (/^\d{7,12}$/.test(this.bankCartFormData.PhoneNum)) {
          console.log(444);
        } else {
          Toast('客户电话格式错误999!');
        }
      }

      // if (/^\d{7,12}$/.test(this.bankCartFormData.PhoneNum)) {
      //   console.log(888);
      // } else {
      //   Toast('客户电话格式错误999!');
      //   return;
      // }

      // let arr = ['a', 'b'];
      // let tempArr = arr.some((item) => {
      //   console.log(item);
      //   return item === 'a';
      // });

      // console.log(tempArr);
      // console.log(arguments);
    },

    confirm () {
      console.log('confirm');
      // 如果写了confim或者cancel方法，return true可让弹窗关闭，return false弹窗不关闭
      return true;
    },

    open () {
      this.show = true;
      // this.$store.dispatch('login', {data: 1}).then((res) => console.log(res));
      // eventBus.emit('refresh', 'refresh');
      // this.$dialog
      //   .confirm('asd', '提示', {
      //     theme: 'danger',
      //   })
      //   .then(() => {
      //     console.log('confirm');
      //   }, () => {
      //     console.log('cancel');
      //   });
      // this.dialogShow = true;
    },

    onFocus () {
      this.show = true;
      console.log('focus');
    },

    onInput (value) {
      this.$toast(value);
    },
    onDelete () {
      this.$toast('delete');
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        done();
      } else {
        done();
      }
    },
  },
};
</script>
