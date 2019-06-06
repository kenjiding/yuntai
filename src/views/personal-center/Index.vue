<template>
  <ych-page>
    <div :class="$style['personal-header']" @click="settingHandler">
      <div :class="$style['personal-header__avatar']">
        <img :src="avatorSrc" :class="$style['personal-header__avatar-head']"  v-if="avatorShow"/>
        <van-icon name="yuntaixinlingshoulogo" :class="$style['personal-header__avatar-placeholder']" v-else />
      </div>
      <div :class="$style['personal-header__info']">
        <div :class="$style['personal-header__info-name']">{{ tenantName }}</div>
        <div :class="$style['personal-header__info-id']">ID: {{ customerID }}</div>
        <div :class="$style['personal-header__info-phone']">{{ phoneNumber }}【{{ userType }}】</div>
      </div>
      <div :class="$style['personal-header__settings']">
        <span>设置</span>
        <van-icon name="xiangyou" :class="$style['personal-header__settings-icon']"/>
      </div>
    </div>

    <div :class="$style['tile-group']" v-if="settingShow">
      <div :class="$style['tile']" @click="$router.push('/personal-center-children-manage')">
        <img src="@/assets/img/me_account.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">子账号管理</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <div :class="$style['tile']" @click="$router.push('/tenant-manage')">
        <img src="@/assets/img/me_tenant.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">门店管理</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <div :class="$style['tile']" @click="$router.push('/push-message')">
        <img src="@/assets/img/me_push.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">推送设置</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <div :class="$style['tile']" @click="$router.push('/personal-center-paycode')">
        <img src="@/assets/img/me_start.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">付款码启动设置</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>
    </div>

    <div :class="$style['tile-group']" v-if="settingShow">
      <div :class="$style['tile']" @click="$router.push('/wipe-zero-setting')">
        <img src="@/assets/img/me_zero.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">POS抹零设置</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>
      <div :class="$style['tile']" @click="$router.push('/payment-manage')">
        <img src="@/assets/img/me_payment.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">POS支付方式</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <!-- <div :class="$style['tile']" @click="$router.push('/ticket-printer-setting')">
        <img src="@/assets/img/me_print.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">小票打印设置</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div> -->
    </div>

    <div :class="$style['tile-group']">
      <div :class="$style['tile']" @click="$router.push('/integration')">
        <img src="@/assets/img/me_integral.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">积分设置</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <div :class="$style['tile']" @click="$router.push('/network-setting')">
        <img src="@/assets/img/me_net.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">网络规则</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>

      <div :class="$style['tile']" @click="$router.push('/feed-back')">
        <img src="@/assets/img/me_opinion.png" alt="" :class="$style['tile-img']">
        <div :class="$style['tile-name']">意见反馈</div>
        <van-icon name="xiangyou" :class="$style['tile-icon']"/>
      </div>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast } from 'vant';

export default {
  components: {
    PageHeader,
  },

  props: {
    tabActive: Boolean,
  },

  data () {
    return {
      loadPersonData: false,
      settingShow: false,
      tenantName: '',
      phoneNumber: '',
      userType: '',
      customerID: '',
      InfoStatus: '',
      avatorSrc: '',
    };
  },

  computed: {
    avatorShow () {
      return !!this.avatorSrc;
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin;
    },
  },

  watch: {
    tabActive (value) {
      if (value && !this.loadPersonData) {
        this.loadPersonData = true;
        this.getPersonInfoHandler();
      }
    },
  },

  activated () {
    if (this.tabActive) {
      this.getPersonInfoHandler();
    }
  },

  methods: {
    settingHandler () {
      this.$router.push({
        path: '/person-info',
      });
    },

    getPersonInfoHandler () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中...',
        mask: true,
      });
      PersonApi.getPersonalInfo().then((res) => {
        this.tenantName = res.userName;
        this.phoneNumber = res.phoneNum;
        this.avatorSrc = res.imgSrc;
        this.InfoStatus = res.InfoStatus;
        this.userType = res.isMain ? '主账号' : '子账号';
        this.settingShow = (res.isMain || this.isAdmin);
        this.customerID = res.Number;
        Toast.clear();

        sessionStorage.setItem('isMain', res.isMain);
      }, () => Toast.clear());
    },
  },
};

</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.personal-header {
  height: 80px;
  background-color: $color-white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16px;

  &__avatar {
    &-head {
      width: 55px;
      height: 55px;
      border-radius: $border-radius-circle;
    }

    &-placeholder {
      font-size: 30px;
      border-radius: $border-radius-circle;
      color: $color-primary;
    }
  }

  &__info {
    flex: 1;
    color: $font-color-primary;
    font-size: 16px;
    padding: 0 10px;

    &-id,
    &-phone {
      font-size: 14px;
      color: $font-color-secondary;
      margin-top: 5px;
    }
  }

  &__settings {
    color: $font-color-secondary;
    font-size: 14px;

    &-icon {
      font-size: 16px;
      margin-left: 5px;
      margin-top: 5px;
    }
  }
}

.tile-group {
  background-color: $color-white;
  margin-top: 10px;
  padding: 0 16px;

  .tile {
    height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 15px;

    &-img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }

    &-name {
      flex: 1;
      color: $font-color-primary;
    }

    &-icon {
      font-size: 20px;
      color: $font-color-secondary;
      margin-top: -5px;
    }
  }
}
</style>
