<template>
  <div>
    <van-pull-refresh
      v-model="refleshLoading"
      @refresh="getAcountData(indexTenantID)"
      :head-height="100"
      :class="$style['reflesh-style']">
      <div
        :class="$style['home-footer']"
        @click="goToDataPage"
        v-show="dataStatus">
        <p>{{statusText}}</p>
        <van-icon name="close" v-show="closeIcon"/>
      </div>
      <div :class="{
        [$style.main]: true,
        [$style['main--has-warning']]: dataStatus,
      }">
        <home-header
          :all-customer="allCustomer"
          :all-money="allMoney"
          :all-num="allNum"
          ></home-header>

        <moduleContent
          v-if="moduleContentHeight"
          :class="$style['module-content']"
          ref="moduleContent"
          :top-position="topPosition"
          :allTenantCount="isTenantInfo.TenantCount">
        </moduleContent>
      </div>
    </van-pull-refresh>

    <popup-select
      :popup-status.sync="popupStatus"
      :is-loading.sync="isLoading"
      :merchants-list="merchantsList"
      @selectItem="changeTennant">
    </popup-select>
  </div>
</template>

<script>
import { Toast, PullRefresh } from 'vant';
import popupSelect from './PopupSelect';
import PackgeApi from '@/api/Packge';
import CountApi from '@/api/Count';
import moduleContent from './components/ModuleContent';
import homeHeader from './components/HomeHeader';

export default {
  name: '',

  data () {
    return {
      popupStatus: false,
      isLoading: false,
      merchantsList: [],
      allMoney: 0,
      allNum: 0,
      allCustomer: 0,
      //顶部文字是否显示
      dataStatus: false,
      statusText: '',
      //控制填写资料页面是否需要回填
      writeStatus: '',
      //控制主页中部的模块css属性top的高度
      topPosition: false,
      //点击顶部的文字，是否可以跳转页面
      isGoTo: false,
      //点击顶部文字提示，跳转到验证金额页面
      goToMoneyPage: false,
      refleshLoading: true,
      tenantName: '',
      isTenantInfo: {},
      checkMoneyIsEdit: 'false',
      closeIcon: false,
      statusMark: '',

      moduleContentHeight: true,
    };
  },

  watch: {
    dataStatus (val) {
      if (!val) return;
      // 强制重新渲染
      this.moduleContentHeight = false;
      this.$nextTick(() => (this.moduleContentHeight = true));
    },
  },

  components: {
    popupSelect,
    moduleContent,
    homeHeader,
    [PullRefresh.name]: PullRefresh,
  },
  computed: {
    customID () {
      return this.$store.state.userInfo.CustomerID;
    },
    name () {
      return this.isTenantInfo.IsAll ? `全部门店(${this.isTenantInfo.TenantCount}家)` : this.tenantName;
    },
    indexTenantID () {
      return this.$store.state.indexTenantID;
    },
    isMain () {
      return this.$store.state.userInfo.IsMain;
    },
    roleNames () {
      return this.$store.state.userInfo.RoleNames;
    },
  },
  methods: {
    goToMackecting () {
      this.roleNames[0] !== 'Employee' && this.$router.push({
        path: '/marketing-statistic',
        query: {
          tenantCount: this.isTenantInfo.TenantCount,
        },
      });
    },
    goToDataPage () {
      //点击关闭顶部提示，同时设置css属性top为原始值.
      if (this.statusMark === 'Complete') {
        this.dataStatus = false;
        this.topPosition = true;
        window.localStorage.setItem('completeStatus', true);
      }
      this.whitchPage();
    },
    whitchPage () {
      if (this.isGoTo) {
        if (this.goToMoneyPage) {
          this.$router.push({
            path: '/validate-money',
            query: {
              isEdit: this.checkMoneyIsEdit,
            },
          });
        } else {
          this.$router.push({
            path: '/identity',
            query: {
              isFillBack: this.writeStatus,
            },
          });
        }
      }
    },
    changeTennant (val) {
      this.$store.commit('changeTenantID', val.id);
      this.getAcountData(val.id);
    },
    popupShow () {
      this.popupStatus = true;
      this.isLoading = true;
      PackgeApi.getStoreList().then(res => {
        this.merchantsList = res.data;
        this.isLoading = false;
      }, () => { this.isLoading = false; });
    },
    getAcountData (uid) {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      CountApi.getCountInfo({ID: this.indexTenantID || uid}).then((res) => {
        this.allMoney = res.Income;
        this.allNum = res.Transactions;
        this.allCustomer = res.CustomerNum;
        this.tenantName = res.TenantName;
        this.statusMark = res.InfoStatus;
        this.isTenantInfo = {
          IsAll: res.IsAll,
          TenantCount: res.TenantCount,
        };

        // 如果账户是主体，则显示完善资料信息。同时检查审核资料的状态
        this.isMain && this.isComplete(res.InfoStatus);

        this.refleshLoading = false;
        Toast.clear();
      }, () => {
        this.refleshLoading = false;
      });
    },
    isComplete (value) {
      if (window.localStorage.getItem('completeStatus') === 'true') {
        if (value !== 'Complete') {
          this.checkDataStatus(value);
        } else {
          // 当状态为Complete，用户点击关闭提示后，首页顶部就不再出现Complete状态
          this.dataStatus = false;
          this.topPosition = true;
        }
      } else {
        this.checkDataStatus(value);
      }
    },
    checkDataStatus (type) {
      switch (type) {
      case 'Pass':
        this.statusText = '资料审核已通过，请尽快验证打款金额>>';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = true;
        this.goToMoneyPage = true;
        this.topPosition = false;
        this.checkMoneyIsEdit = 'false';
        this.closeIcon = false;
        break;
      case 'ValidateMoneyNotPass':
        this.statusText = '验证款金额填写错误，请填写正确的打款金额>>';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = true;
        this.goToMoneyPage = true;
        this.topPosition = false;
        this.checkMoneyIsEdit = 'true';
        this.closeIcon = false;
        break;
      case 'ValidateMoney':
        this.statusText = '正在验证打款金额，预计24小时内完成';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = false;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      case 'Complete':
        this.statusText = '恭喜您已完成验证';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = false;
        this.topPosition = false;
        this.closeIcon = true;
        break;
      case 'Submit':
        this.statusText = '资料正在审核中，预计1-3个工作日之内完成审核>>';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = true;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      case 'WaitAudit':
        this.statusText = '资料正在审核中，预计1-3个工作日之内完成审核>>';
        this.writeStatus = 'true';
        this.dataStatus = true;
        this.isGoTo = true;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      case 'NotPass':
        this.statusText = '资料审核不通过，点击查看详情>>';
        this.writeStatus = 'true';
        this.isGoTo = true;
        this.dataStatus = true;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      case 'ManagerNone':
        this.statusText = '为保障支付功能正常使用，请完善资料 >>>';
        this.writeStatus = 'true';
        this.isGoTo = true;
        this.dataStatus = true;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      case 'None':
        this.statusText = '为保障支付功能正常使用，请完善资料 >>';
        this.writeStatus = 'false';
        this.dataStatus = true;
        this.isGoTo = true;
        this.topPosition = false;
        this.closeIcon = false;
        break;
      default:
        this.topPosition = true;
        this.dataStatus = false;
        this.closeIcon = false;
      }
    },
  },

  activated () {
    console.log('Test', this.$route.meta);
    if (this.$route.meta.refreshData) {
      console.log('登录成功，刷新数据');
      if (this.$route.query.isShowCreateTenant === 'true') {
        this.$router.replace({
          path: 'write-info',
          query: {
            TenantID: this.$route.query.TenantID,
          },
        });
      } else {
        this.getAcountData();
      }
    }
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.main {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .module-content {
    flex: 1;
    overflow: hidden;
    height: calc(100vh - 40px - 140px);
  }

  &--has-warning {
    height: calc(100vh - 40px);

    .module-content {
      height: calc(100vh - 40px - 40px - 140px);
    }
  }
}

.reflesh-style {
  height: 100%;

  .van-pull-refresh__track {
    height: 100%;
  }
}

.home-top-text {
  margin-left: 10px;
}

.home-top {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: rgba(255, 255, 255, .5);
  background-color: rgb(9, 106, 211);
  position: relative;

  .van-icon-mendian {
    font-size: $font-size-secondary;
    position: relative;
    top: 2px;
  }

  p {
    width: 90%;
    margin: 0 auto;
    font-size: $font-size-special;
  }
}

.ych-page__content {
  height: 100%;
}

.home-footer {
  position: relative;
  width: 100%;
  height: 40px;
  background-color: #fff3e5; // stylelint-disable
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a77364;
  font-size: $font-size-special;

  .van-icon-close {
    display: block;
    position: absolute;
    right: 10px;
    bottom: 12px;
    font-size: $font-size-secondary;
  }
}
</style>
