<template>
  <ych-page>
    <page-header
      slot="header"
      title="网络设置"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>
    <div :class="$style['person-info-wrap']">
      <van-cell-group>
        <van-cell
          title="WI-FI名称"
          :value="formData.wifiName"
        />
        <van-cell
          title="密码"
          :value="formData.wifiPassWord"
        />
      </van-cell-group>
      <div :class="$style['network-p-text']">
        <p>说明：</p>
        <p>请将用于盒子或卡头联网的路由器WiFi名称和密码设置为以上内容;</p>
        <p>1、自行选购的路由器需要将路由器的WiFi名称和密码设置为以上内容;</p>
        <p>2、在我司选购的路由器已设置完成无需再次设置;</p>
      </div>
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
      formData: {
        wifiName: '',
        wifiPassWord: '',
      },
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    getData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      PersonApi.getNetworkInfo().then((res) => {
        this.formData.wifiName = res.wifiName;
        this.formData.wifiPassWord = res.wifiPassWord;

        Toast.clear();
      });
    },
  },

  created: function () {
    this.getData();
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.network-p-text {
  padding: 0 10px;

  p {
    color: $font-color-placeholder;
    line-height: 20px;
    font-size: $font-size-special;
    margin: 10px 0;
  }
}

.person-info-wrap {
  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .van-cell {
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      .van-cell__value {
        span {
          word-wrap: break-word;
        }
      }
    }
  }

  &-top {
    margin-bottom: 15px;
  }
}
</style>
