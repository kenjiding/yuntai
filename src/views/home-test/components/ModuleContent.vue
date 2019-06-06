<template>
  <div
  :class="{[$style['home-main']]: true, [$style['home-main-top']]: topPosition }">
    <scroll
      ref="scroll"
      :options="scrollOpt">
      <van-row  :class="$style['main-first-row']">

        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('order')"
          @click.native="$router.push('/order')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/order.png">
            <span>订单管理</span>
          </div>
        </van-col>
        <van-col
          :span="~userPremissions.indexOf('order')?12:24"
          v-if="~userPremissions.indexOf('customer-appeal')"
          @click.native="$router.push('/customer-appeal')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/customer-appeal.png">
            <span>客诉处理</span>
          </div>
        </van-col>
      </van-row>

      <van-row :class="$style['home-main-content']">
        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('tenant-list')"
          @click.native="$router.push('/tenant-list')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/device-manage.png">
            <span>设备管理</span>
          </div>
        </van-col>
        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('package')"
          @click.native="$router.push('/package-store-list')">
          <div :class="[
            $style['home-main-icon-wrap'],
            $style['home-main-icon-wrap_special']]">
            <img src="@/assets/img/play-currency.png">
            <span>游戏币套餐</span>
          </div>
        </van-col>

        <van-col
          :span="(~userPremissions.indexOf('gift-management') && ~userPremissions.indexOf('goods'))?12:24"
          v-if="~userPremissions.indexOf('gift-management')"
          @click.native="$router.push('/gift-management')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/gift-management.png">
            <span>礼品管理</span>
          </div>
        </van-col>
        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('goods')"
          @click.native="$router.push('/goods-store-list')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/goods.png">
            <span>商品管理</span>
          </div>
        </van-col>

        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('leaguer')"
          @click.native="routerHandle">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/member.png">
            <span>会员管理</span>
          </div>
        </van-col>
        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('activity')"
          @click.native="$router.push('/activity-promotion')">
          <div :class="$style['home-main-icon-wrap']">
            <img src="@/assets/img/activity.png">
            <span>营销工具</span>
          </div>
        </van-col>

      </van-row>

      <van-row  :class="$style['main-first-row']" v-if="integralMall && integralMallShow">
        <van-col
          :span="12"
          v-if="~userPremissions.indexOf('points-mall')"
          @click.native="jump()">
            <div :class="$style['home-main-icon-wrap']">
              <img src="@/assets/img/integral-mall.png">
              <span>积分商城</span>
            </div>
        </van-col>

        <!-- <van-col
          :span="12"
          v-if="~userPremissions.indexOf('buy-gift')"
          @click.native="jump('https://www.lipinbao.vip/vShop/default')">
          <div :class="[
            $style['home-main-icon-wrap']]">
            <img src="@/assets/img/buy-gift.png">
            <span>礼品采购</span>
          </div>
        </van-col> -->
      </van-row>

    </scroll>
    <ych-dialog
      :value="dialogValue"
      @cancel=" dialogValue =false"
      @confirm="dialogConfirm"
      title="输入设备编码">
      <div :class="$style['dialog-content']">
        <p>请填写设备编码</p>
        <van-field
          v-model="inputGoodsGroupName"
          type="tel" />
      </div>
    </ych-dialog>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Scroll from '@/components/Scroll';
// import dialog from '@/components/global/dialog';
import Promotion from '@/api/Promotion';

export default {
  name: '',

  components: {
    Scroll,
  },

  data () {
    return {
      dialogValue: false,
      inputGoodsGroupName: '',
      scrollOpt: {
        scrollbar: true,
        startY: 0,
      },
      integralMall: false,
      integralMallShow: false,
    };
  },

  computed: {
    userPremissions () {
      return this.$store.getters.getPremissions;
    },
  },

  props: {
    topPosition: Boolean,
    allTenantCount: Number,
  },

  created () {
    // 开发环境展示积分商城
    this.integralMall = window.location.host.indexOf('yuntaidev02.youcaihua.net') > -1;
    this.getData();
  },

  methods: {
    jump () {
      this.getSaasData(false);
    },
    getData () {
      if (!this.integralMall) return;
      ~this.userPremissions.indexOf('points-mall') && this.getSaasData(true);
    },
    getSaasData (flag) {
      Promotion.getSaasURL({IsCheck: flag}).then((res) => {
        if (flag) {
          this.integralMallShow = res.IsShow;
        } else {
          window.location.href = res.URL;
        }
      });
    },
    routerHandle () {
      this.$router.push('/member');

      // if (process.env.NODE_ENV === 'production') {
      //   dialog.alert({
      //     title: '提示',
      //     message: '该功能正在努力建设中，<br/>敬请期待',
      //     theme: 'warning',
      //   });
      // } else {
      //   this.$router.push('/member');
      // }
    },
    dialogConfirm () {
      if (!this.inputGoodsGroupName) {
        Toast('请输入设备编码');
      } else {
        this.goToDeviceRrgister(this.inputGoodsGroupName);
        this.dialogValue = false;
        this.inputGoodsGroupName = '';
      }
    },
    scanQrCode () {
      this.$router.push({
        path: 'device-register-code',
      });
    },
    goToDeviceRrgister (number) {
      this.$router.push({
        path: '/device-register',
        query: {
          number,
        },
      });
    },
    checkPremission (val) {
      return this.userPremissions.findIndex(name => name === val) > -1;
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.dialog-content {
  width: 75%;
  margin: 0 auto 30px;

  p {
    padding: 20px 0 15px;
    color: $font-color-regular;
  }

  .van-cell {
    background-color: $color-bg-regular;
    border: solid 1px $border-color;
    border-radius: $border-radius-small;

    input {
      background-color: $color-bg-regular;
    }
  }
}

.home-main-content {
  .van-col--12 {
    background-color: $color-white;
  }

  .van-col {
    display: flex;
    justify-content: center;
  }
}

.home-main-icon-wrap {
  height: 40px;
  display: flex;
  align-self: center;

  span {
    line-height: 40px;
    font-size: $font-size-primary;
    margin-left: 10px;
  }

  img {
    width: 40px;
    height: 40px;
  }

  &_special {
    position: relative;
    left: 8px;
  }
}

.home-main {
  width: 100%;
  overflow: hidden;
  background-color: $color-bg-primary;

  &-top {
    top: 180px;
  }

  .main-first-row {
    margin: 10px 0;
  }

  .van-row {
    background-color: $color-white;

    &:last-child {
      margin-bottom: 60px;
    }

    .van-col {
      height: 70px;
      display: flex;
      justify-content: center;
      align-content: center;
    }

    .van-col--12 {
      border: 1px solid $border-color;
    }
  }
}
</style>
