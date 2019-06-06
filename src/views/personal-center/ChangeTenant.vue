<template>
   <ych-page>
    <div :class="$style['tenant-wrap']">
      <van-row
        v-for="(item, index) in accountList"
        :key="index"
        :class="{[$style.cellBorderActive] : (isActive == index)}"
        @click.native="toggle(index,item)">
        <van-col :span="5">
          <div
            :class="$style['avator-wrap']">
            <img :src="item.imgSrc" :class="$style['imgSize']" v-if="item.imgSrc" />
            <van-icon name="yuntaixinlingshoulogo" :class="$style['iconSize']" v-if="!item.imgSrc" />
          </div>
        </van-col>
        <van-col :span="16">
          <p>{{item.userName}}</p>
          <p>ID:{{item.Number}}</p>
          <p>{{item.phoneNum}}({{item.isMain ? '主账号' : '子账号'}})</p>
        </van-col>
        <van-col :span="3">
          <van-icon name="save" v-show="item.isDefault" size="25px" color="#007AFF"/>
        </van-col>
      </van-row>
    </div>

    <div :class="$style['package-button']">
      <van-button
        :class="$style['package-delect-button']"
        type="primary"
        @click="deleteTenant">
        退出登录
      </van-button>
    </div>
   </ych-page>

</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast } from 'vant';

export default {
  name: '',
  data () {
    return {
      isActive: null,
      accountList: [],
      userID: '',
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    deleteTenant () {
      this.$dialog.confirm({
        message: '确定退出登录？',
        theme: 'danger',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            // 调用退出登录接口
            this.$store.dispatch('logout').then((res) => {
              //清空token
              this.$store.commit('setUserInfo', {
                Token: null,
              });
              // 清空tenanID
              this.$store.commit('changeTenantID', null);
              this.$router.replace('/', () => done());
              done();
            }, () => done());
          } else {
            done();
          }
        },
      });
    },
    changeTenant () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PersonApi.changeTenantAccount({ID: this.userID}).then((res) => {
        this.$store.commit('setUserInfo', {Token: res.Token});
        // 切换主体后，需要重置vuex状态
        this.$store.commit('changeTenantID', null);

        this.$store.dispatch('asyncfetchUserInfo').then((value) => {
          this.$router.push({
            path: '/',
          }, Toast.clear());
        }, () => Toast.clear());
      }, () => Toast.clear());
    },
    toggle (index, val) {
      this.isActive = index;
      this.userID = val.Id;
      this.changeTenant();
    },
    getAccount () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中...',
        mask: true,
      });
      PersonApi.getTenantList().then((res) => {
        //将账号类型为主体的账号，排在首位
        res.DataList.some((item, index) => {
          if (item.isMain) {
            res.DataList.splice(index, 1);
            res.DataList.unshift(item);
            return true;
          }
        });
        this.accountList = res.DataList;
        Toast.clear();
      }, () => Toast.clear());
    },
  },

  created: function () {
    this.getAccount();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.iconSize {
  font-size: 30px;
  display: block;
  line-height: 50px;
  margin-top: 4px;
  color: $color-primary;
}

.package-button {
  width: 100%;
  position: absolute;
  bottom: 16px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.package-delect-button {
  display: block;
  width: 90%;
}

.imgSize {
  width: 60px;
  height: 60px;
  border-radius: $border-radius-circle;
}

.avator-wrap {
  width: 61px;
  height: 61px;
  text-align: center;
  line-height: 95px;
  margin-top: 5px;
}

.tenant-wrap {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .van-row {
    background-color: $color-white;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid $color-white;
    margin-top: 10px;

    &:last-of-type {
      margin-bottom: 100px;
    }
  }

  .van-col--16 {
    p {
      padding: 3px;
      font-size: $font-size-special;
      color: $font-color-placeholder;
      display: block !important;

      @include ellipsis(1);

      &:nth-child(1) {
        font-size: $font-size-primary;
        color: $color-black;
        margin-top: 3px;
      }
    }
  }

  .van-col--3 {
    height: 100%;
    line-height: 70px;
    text-align: right;
    font-size: $font-size-secondary;
  }
}
</style>
