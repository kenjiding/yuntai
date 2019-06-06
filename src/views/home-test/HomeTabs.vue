<template>
  <ych-page>
    <div>
      <home v-show="tabBarActive === 0"/>
      <marketing-statistic v-show="tabBarActive === 1" :tab-active="tabBarActive === 1"/>
      <personal-center v-show="tabBarActive === 2" :tab-active="tabBarActive === 2"/>
    </div>

    <div :class="$style['tab-wrap']">
      <div :class="$style['tab-item']" @click.prevent="onTabActiveChanged(0)" >
        <div :class="$style['tab-img']">
          <img src="@/assets/img/home_active.png" v-if="tabBarActive === 0"/>
          <img src="@/assets/img/home.png" v-else/>
        </div>
        <div :class="{[$style['tab-text']]: true, [$style['text-active']]: tabBarActive === 0}">首页</div>
      </div>
      <div :class="$style['tab-item']" @click.prevent="onTabActiveChanged(1)" >
        <div :class="$style['tab-img']">
          <img src="@/assets/img/data_active.png" v-if="tabBarActive === 1"/>
          <img src="@/assets/img/data.png" v-else/>
        </div>
        <div :class="{[$style['tab-text']]: true, [$style['text-active']]: tabBarActive === 1}">数据</div>
      </div>
      <div :class="$style['tab-item']" @click.prevent="onTabActiveChanged(2)" >
        <div :class="$style['tab-img']">
          <img src="@/assets/img/me_active.png" v-if="tabBarActive === 2"/>
          <img src="@/assets/img/me.png" v-else/>
        </div>
        <div :class="{[$style['tab-text']]: true, [$style['text-active']]: tabBarActive === 2}">我的</div>
      </div>
    </div>

    <!-- <van-tabbar v-model="tabBarActive" @change="onTabActiveChanged">
      <van-tabbar-item>
         <template slot="icon" slot-scope="props">
           <img src="@/assets/img/home_active.png" v-if="props.active"/>
           <img src="@/assets/img/home.png" v-else/>
         </template>
          首页
      </van-tabbar-item>
      <van-tabbar-item>
         <template slot="icon" slot-scope="props">
           <img src="@/assets/img/data_active.png" v-if="props.active"/>
           <img src="@/assets/img/data.png" v-else/>
         </template>
          数据
      </van-tabbar-item>
      <van-tabbar-item>
         <template slot="icon" slot-scope="props">
           <img src="@/assets/img/me_active.png" v-if="props.active"/>
           <img src="@/assets/img/me.png" v-else/>
         </template>
          我的
      </van-tabbar-item>
    </van-tabbar> -->
  </ych-page>
</template>

<script>
// import { Tabbar, TabbarItem } from 'vant';
import Home from './Home';
import PersonalCenter from '../personal-center/Index';
import MarketingStatistic from '../marketing-statistic-second/Index';

export default {
  components: {
    // [Tabbar.name]: Tabbar,
    // [TabbarItem.name]: TabbarItem,
    Home,
    PersonalCenter,
    MarketingStatistic,
  },

  data: () => ({
    tabBarActive: 0,
  }),

  beforeRouteEnter (to, from, next) {
    if (from.name === 'login' || from.name === null) {
      to.meta.refreshData = true;
    } else {
      to.meta.refreshData = false;
    }

    next();
  },

  created () {
    this.tabBarActive = this.$store.state.tabActiveIndex;
  },

  activated () {
    if (this.$route.meta.refreshData) {
      this.tabBarActive = this.$store.state.tabActiveIndex;
    }
  },

  methods: {
    onTabActiveChanged (active) {
      this.tabBarActive = active;
      this.$store.commit('changeTabActive', active);
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.tab-wrap {
  width: 100%;
  height: 50px;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: $color-white;
  border-top: 1px solid $border-color;
}

.text-active {
  color: $color-primary;
}

.tab-item {
  text-align: center;
  line-height: 50px;
  height: 50px;
  flex: 1;
}

.tab-img {
  height: 50%;
  line-height: 25px;

  img {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-top: 5px;
    pointer-events: none;
  }
}

.tab-text {
  height: 50%;
  line-height: 25px;
  font-size: $font-size-mini;
  text-align: center;
}
</style>
