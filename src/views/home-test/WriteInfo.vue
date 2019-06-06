<template>
  <ych-page>
    <page-header
      slot="header"
      title="完善资料"
      right-text="跳过"
      @click-right="$router.replace('/')">
    </page-header>
    <div :class="$style['children-info-wrap']">
      <van-cell-group>
        <van-field
          v-model="formData.TenantName"
          label="门店名称"
          type="text"
          placeholder="默认门店"
          />
        <van-field
          v-model="formData.Phone"
          label="客服电话"
          type="tel"
          placeholder="请输入"
          />
        <van-cell
          :title="formData.Area"
          :class="$style.mapStyle"
          icon="location"
          is-link
          @click="selectMap" />
        <!-- <div @click="areaShow = true">
          <van-field
            v-model="formData.Area"
            label="地区"
            type="text"
            placeholder="请输入"
            :disabled="true"
            />
        </div> -->
        <van-field
          v-model="formData.Address"
          label="详细地址"
          type="text"
          placeholder="请选择"
          />
      </van-cell-group>
      <van-button
        :class="$style['login-button']"
        type="default"
        size="large"
        @click="postFormData">提交</van-button>
    </div>
    <ych-area
      :visible="areaShow"
      @cancel="areaShow = false"
      @confirm="selectItem"/>
    <van-popup
      v-model="MapSelectShow"
      position="rigth"
      :overlay="false"
      :class="$style.popupStyle">
      <map-select
        @close-popup="MapSelectShow = false"
        @after-select="mapSelectAfter"
        :screen-info="screenInfo"
        :latlng-loc="formData"></map-select>
    </van-popup>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import Area from '@/components/Area';
import { Toast, Popup } from 'vant';
import User from '@/api/User';
import Person from '@/api/Person';
import checkData from '@/views/packge/tool/checkFormData';
import MapSelect from '@/views/personal-center/MapSelect';

export default {
  name: '',
  data () {
    return {
      popupShow: false,
      formData: {
        TenantName: '',
        Phone: '',
        Area: '请选择地址',
        Address: '',
        Latitude: '',
        Longitude: '',
      },
      areaShow: false,
      stopSubmit: true,
      MapSelectShow: false,
      screenInfo: {
        screenWidth: null,
        screenHeight: null,
      },
    };
  },

  components: {
    PageHeader,
    MapSelect,
    [Area.name]: Area,
    [Popup.name]: Popup,
  },

  mounted () {
    this.screenInfo.screenWidth = document.body.clientWidth;
    this.screenInfo.screenHeight = document.body.clientHeight;
  },

  methods: {
    mapSelectAfter (loc) {
      this.MapSelectShow = false;
      let latStr = loc.latlng.lat.toString();
      let lngStr = loc.latlng.lng.toString();

      let latMark = latStr.indexOf('.') + 6;
      let lngMark = lngStr.indexOf('.') + 6;

      this.formData.Latitude = latStr.slice(0, latMark);
      this.formData.Longitude = lngStr.slice(0, lngMark);
      this.formData.Area = loc.poiaddress;
    },
    selectMap () {
      this.MapSelectShow = true;
    },
    selectItem (val) {
      this.formData.Area = '';
      this.areaShow = false;
      let areaCode = val.some((item) => {
        return item.code === '-1';
      });
      if (areaCode) {
        Toast('请选择完整的地区信息');
        return;
      }
      val.forEach(item => {
        this.formData.Area += item.name;
      });
    },
    postFormData () {
      this.formData.TenantName = this.formData.TenantName.trim() || '默认门店';

      let dataPass = checkData({
        data: this.formData,
        ignore: ['Area', 'Address'],
        message: {
          TenantName: '请填写门店名称',
          Phone: '请填写客户号码',
          Longitude: '请选择地址',
          Latitude: '请选择地址',
        },
      });
      if (dataPass && this.stopSubmit) {
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        });
        this.stopSubmit = false;
        this.formData.IsSkip = false;
        this.formData.ID = this.$route.query.TenantID;
        User.tenantInfo(this.formData).then((res) => {
          this.$router.replace('/', () => {
            Toast.clear();
          });
          this.stopSubmit = true;
        }, () => {
          Toast.clear();
          this.stopSubmit = true;
        });
      }
    },
  },

  created: function () {
    if (this.$route.query.latlng) {
      let latStr = this.$route.query.latlng.latlng.lat.toString();
      let lngStr = this.$route.query.latlng.latlng.lng.toString();

      let latMark = latStr.indexOf('.') + 6;
      let lngMark = lngStr.indexOf('.') + 6;

      this.formData.Latitude = latStr.slice(0, latMark);
      this.formData.Longitude = lngStr.slice(0, lngMark);
      this.formData.Area = this.$route.query.latlng.poiaddress;
    }
    Person.getTenantInfoByID({ID: this.$route.query.TenantID}).then((res) => {
      this.formData.Phone = res.phoneNum;
      // this.formData.Area = res.area;
      this.formData.Address = res.address;
    });
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.popupStyle {
  width: 100%;
}

.mapStyle {
  .van-cell__title {
    padding-left: 0 !important;
  }
}

.login-button {
  position: fixed;
  left: 0;
  bottom: 0;
}

.children-info-wrap {
  position: absolute;
  top: 46px;
  bottom: 0;
  left: 0;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;

  .van-button {
    color: $color-primary;
  }

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;
  }

  .van-cell {
    padding-left: 0;
    padding-right: 0;
    background-color: $color-bg-secondary;
    border-bottom: 1px solid $border-color;
    margin: 20px 0;

    .van-cell__value {
      color: $font-color-placeholder;

      input {
        background-color: $color-bg-secondary;
        text-align: right;
        color: $font-color-placeholder;
      }
    }

    .van-cell__title {
      font-size: $font-size-primary;
      padding-left: 10px;

      .van-cell__label {
        color: $font-color-placeholder;
      }
    }
  }
}
</style>
