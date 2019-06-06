<template>
  <ych-page>
    <page-header
      slot="header"
      title="门店管理"
      right-text="新增"
      left-arrow
      @click-left="$router.back()"
      @click-right="$router.push('/tenant-info')">
    </page-header>
    <div :class="$style['tenant-manage-wrap']">
      <div v-if="defualtTenantShow">
        <p :class="$style.iconText">默认门店</p>
        <van-panel
          :title="defaultItem.tenantName"
          :desc="defaultItem.address"
          :status="defaultItem.deviceNum + '台'"
          @click.native="goToTenantInfoPage(defaultItem.ID)">
          <div>{{defaultItem.phoneNum}}</div>
          <div><van-icon name="checked" /><span>默认门店</span></div>
        </van-panel>
        <div :class="$style.line"></div>
      </div>
      <p :class="$style.iconText">其他门店</p>
      <van-panel
        v-for="(item,index) in manageInfo"
        :key="index"
        :title="item.tenantName"
        :desc="item.address"
        :status="item.deviceNum + '台'"
        @click.native="goToTenantInfoPage(item.ID)">
        <div>{{item.phoneNum}}</div>
      </van-panel>
    </div>
  </ych-page>
</template>

<script>
import { Panel, Toast } from 'vant';
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';

export default {
  name: '',
  data () {
    return {
      manageInfo: [],
      defaultItem: {
        tenantName: '',
        address: '',
        phoneNum: '',
        deviceNum: '',
        ID: '',
      },
      defualtTenantShow: false,
    };
  },

  components: {
    PageHeader,
    [Panel.name]: Panel,
  },

  methods: {
    goToTenantInfoPage (uid) {
      this.$router.push({
        path: '/tenant-info',
        query: {isEdit: 'true', id: uid},
      });
    },
    getTenantData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中...',
        mask: true,
      });
      PersonApi.tenantOperation().then((res) => {
        //找到默认门店，并且从门店列表剪切出来，单独显示
        let defaultVal = res.DataList.find((item, index) => {
          if (item.isDefault) {
            res.DataList.splice(index, 1);
            return item;
          }
        });
        if (defaultVal) {
          this.defualtTenantShow = true;
          this.defaultItem = defaultVal;
        }

        this.manageInfo = res.DataList;
        Toast.clear();
      });
    },
  },

  created: function () {
    this.getTenantData();
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

[class*=van-hairline]::after {
  content: none;
}

.tenant-manage-wrap {
  background-color: $color-bg-secondary;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  overflow: auto;

  .line {
    width: 100%;
    height: 10px;
    background-color: $border-color;
    margin: 10px 0;
  }

  .van-cell-group {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    margin-bottom: 10px;

    &:last-of-type {
      margin-bottom: 50px;
    }

    .van-panel__content {
      background-color: $color-bg-secondary;
      padding: 5px 10px;
      height: 20px;
      color: $font-color-placeholder;
      font-size: $font-size-special;
      line-height: 20px;

      div {
        float: left;

        &:nth-child(1) {
          width: 70%;
        }

        &:nth-child(2) {
          width: 30%;
          text-align: right;
          color: $color-warning;

          .van-icon-checked {
            display: inline-block;
            margin-right: 5px;
            position: relative;
            top: 2px;
          }
        }
      }
    }

    .van-cell {
      padding: 5px 10px;

      .van-cell__title {
        flex: none;
        width: 70%;
        font-size: $font-size-primary;

        span {
          display: block !important;

          @include ellipsis(1);
        }

        .van-cell__label {
          font-size: $font-size-special;
          padding-top: 3px;
          padding-bottom: 3px;
          color: $font-color-placeholder;
          display: block;

          @include ellipsis(1);
        }
      }

      .van-cell__value {
        flex: none;
        width: 30%;
        color: $color-primary;
        font-size: $font-size-regular;
        padding-top: 5px;
      }
    }
  }

  .iconText {
    position: relative;
    padding: 5px 12px 10px;
    font-size: $font-size-special;
    color: $font-color-placeholder;
  }
}
</style>
