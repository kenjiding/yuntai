<template>
  <ych-page>
    <page-header
      slot="header"
      title="门店详情"
      left-arrow
      @click-left="returnTenantPage"
      @click-right="postTenantHandler">
      <van-icon
        name="save"
        slot="right"
        :class="$style['header-icon-right']"/>
    </page-header>
    <div :class="$style['person-info-wrap']">
      <van-cell-group>
        <!-- <van-field
          :class="$style['person-info-wrap-top']"
          v-model="this.$store.state.userInfo.CustomerName"
          label="主体"
          placeholder="请填写"
          disabled
        /> -->
        <van-field
          required
          v-model="tenantFormData.tenantName"
          label="门店名称"
          placeholder="请输入名称"
        />
        <van-field
          v-model="tenantFormData.phoneNum"
          label="客服电话"
          type="tel"
          placeholder="请输入电话"
        />
        <!-- <van-cell
          :title="tenantFormData.area"
          icon="location"
          is-link
          @click="selectMap" /> -->
        <van-cell
          title="门店地址">
          <div
            @click="selectMap"
            slot="right-icon"
            :class="$style.location">
            <van-icon name="location"/>
            <div :class="[
              $style['custom-text'],
              tenantFormData.area === '请选择地址' && $style['placeholder']
            ]">{{ tenantFormData.area }}</div>
            <van-icon
              @click.stop="clearArea"
              :class="$style.closeIcon"
              name="close"
              v-if="tenantFormData.area !== '请选择地址'"/>
          </div>
        </van-cell>

        <van-field
          v-model="tenantFormData.address"
          label="详细地址"
          placeholder="请填写详细地址"
        />
        <van-cell
          title="门店有效期">
          <div slot="right-icon" @click="showStartTimeSelect = true">
            <span v-if="tenantFormData.ValidityStartTime">
              {{ tenantFormData.ValidityStartTime | date('YYYY-MM-DD') }} 至 {{ tenantFormData.ValidityEndTime | date('YYYY-MM-DD') }}
              <van-icon
                :class="$style.closeIcon"
                name="close"
                @click.stop="clearDate"/>
            </span>
            <span v-else :class="$style.placeholder">
              请选择门店租约有效期
            </span>
          </div>
        </van-cell>
        <van-cell
          title="默认门店">
          <van-switch
            v-model="tenantFormData.isDefault"
            size="26px"
            slot="right-icon" />
        </van-cell>
      </van-cell-group>
      <van-button
        :class="$style['package-delect-button']"
        v-show="deleteButton"
        @click="deleteTenant">删除</van-button>
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
        :latlng-loc="tenantFormData"
        :screen-info="screenInfo"></map-select>
    </van-popup>

    <van-popup
      v-model="showStartTimeSelect"
      position="bottom">
      <van-datetime-picker
        :value="new Date()"
        type="date"
        title="选择开始时间"
        @cancel="showStartTimeSelect = false"
        @confirm="(value) => {
          this.tenantFormData.ValidityStartTime = value
          this.showStartTimeSelect = false;
          this.showEndTimeSelect = true;
        }"
      />
    </van-popup>

    <van-popup
      v-model="showEndTimeSelect"
      position="bottom">
      <van-datetime-picker
        :value="new Date()"
        type="date"
        title="选择结束时间"
        @cancel="() => {
          this.tenantFormData.ValidityStartTime = 0
          this.showEndTimeSelect = false
        }"
        @confirm="value => {
          this.tenantFormData.ValidityEndTime = value
          this.showEndTimeSelect = false
        }"
      />
    </van-popup>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast, Popup, DatetimePicker } from 'vant';
import checkData from '@/views/packge/tool/checkFormData';
import Area from '@/components/Area';
import MapSelect from './MapSelect';

export default {
  name: '',
  data () {
    return {
      isBackMap: 0,
      iconName: 'arrow',
      tenantFormData: {
        tenantName: '',
        phoneNum: '',
        area: '请选择地址',
        address: '',
        isDefault: false,
        Longitude: '',
        Latitude: '',
        ValidityStartTime: 0,
        ValidityEndTime: 0,
      },
      deleteButton: false,
      areaShow: false,
      MapSelectShow: false,
      screenInfo: {
        screenWidth: null,
        screenHeight: null,
      },
      showStartTimeSelect: false,
      showEndTimeSelect: false,
    };
  },

  computed: {
    areaName () {
      return this.tenantFormData.area;
    },
  },

  components: {
    PageHeader,
    [Area.name]: Area,
    [Popup.name]: Popup,
    MapSelect,
    [DatetimePicker.name]: DatetimePicker,
  },

  watch: {
    areaName (val) {
      this.iconName = val ? 'close' : 'arrow';
    },
  },

  mounted () {
    this.screenInfo.screenWidth = document.body.clientWidth;
    this.screenInfo.screenHeight = document.body.clientHeight;
  },

  methods: {
    clearArea () {
      this.tenantFormData.Latitude = '';
      this.tenantFormData.Longitude = '';
      this.tenantFormData.area = '请选择地址';
    },
    clearDate () {
      this.tenantFormData.ValidityEndTime = 0;
      this.tenantFormData.ValidityStartTime = 0;
    },
    mapSelectAfter (loc) {
      this.isBackMap++;
      console.log(this.isBackMap, 'history');
      this.MapSelectShow = false;
      let latStr = loc.latlng.lat.toString();
      let lngStr = loc.latlng.lng.toString();

      let latMark = latStr.indexOf('.') + 6;
      let lngMark = lngStr.indexOf('.') + 6;

      this.tenantFormData.Latitude = latStr.slice(0, latMark);
      this.tenantFormData.Longitude = lngStr.slice(0, lngMark);
      this.tenantFormData.area = loc.poiaddress;
      this.iconName = 'close';
    },
    selectMap () {
      this.MapSelectShow = true;
    },
    selectItem (val) {
      this.tenantFormData.area = '';
      this.areaShow = false;
      let areaCode = val.some((item) => {
        return item.code === '-1';
      });
      if (areaCode) {
        Toast('请选择完整的地区信息');
        return;
      }
      val.forEach(item => {
        this.tenantFormData.area += item.name;
      });
    },
    deleteTenant () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此门店？',
        theme: 'danger',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            PersonApi.deleteTenant({ID: this.$route.query.id}).then((res) => {
              done();
              this.$router.go(-1);
            }, (res) => {
              let errorArr = [{
                text: '该门店存在未解绑设备',
                error: '2021000007',
              }, {
                text: '该门店存在消费记录',
                error: '2021000008',
              }, {
                text: '子账号没有该权限',
                error: '2021000006',
              }, {
                text: '必须存在一家门店',
                error: '2005000009',
              }, {
                text: '当前门店已绑定设备不可删除',
                error: '2005000010',
              }, {
                text: '门店信息不存在',
                error: '2005000003',
              } ];
              done();
              errorArr.some(item => {
                if (item.error === res.ResponseStatus.ErrorCode) {
                  Toast(`${item.text}，不能删除`);
                  return true;
                }
              });
            });
          } else {
            done();
          }
        },
      });
    },
    returnTenantPage () {
      Toast.clear();
      // 打开地图选择窗口，并且选择了地址后，router会自动将地图的src压进历史记录，导致返回的时候出现问题
      let num = this.isBackMap;
      if (this.isBackMap === 1) {
        this.$router.go(-(num + 1));
      } else if (this.isBackMap > 1) {
        this.$router.go(-(num + 1));
      } else {
        this.$router.go(-1);
      }
    },
    addTenantMethods () {
      let params = {
        ...this.tenantFormData,
        ValidityStartTime: this.tenantFormData.ValidityStartTime ? this.tenantFormData.ValidityStartTime.getTime() : 0,
        ValidityEndTime: this.tenantFormData.ValidityEndTime ? this.tenantFormData.ValidityEndTime.getTime() : 0,
      };

      params.area = this.tenantFormData.area === '请选择地址' ? '' : this.tenantFormData.area;
      PersonApi.addTenant(params).then((res) => {
        this.returnTenantPage();
      });
    },
    editTenantMethods () {
      let params = {
        ...this.tenantFormData,
        ValidityStartTime: this.tenantFormData.ValidityStartTime ? this.tenantFormData.ValidityStartTime.getTime() : 0,
        ValidityEndTime: this.tenantFormData.ValidityEndTime ? this.tenantFormData.ValidityEndTime.getTime() : 0,
        ID: this.$route.query.id,
      };

      params.area = this.tenantFormData.area === '请选择地址' ? '' : this.tenantFormData.area;
      PersonApi.editTenant(params).then((res) => {
        this.returnTenantPage();
      });
    },
    postTenantHandler () {
      let dataPass = checkData({
        data: this.tenantFormData,
        ignore: ['area', 'phoneNum', 'address', 'Longitude', 'Latitude', 'address', 'ValidityStartTime', 'ValidityEndTime'],
        message: {
          tenantName: '请填写门店名称',
        },
      });

      if (!dataPass) {
        return;
      }

      if (this.tenantFormData.ValidityStartTime) {
        if (this.tenantFormData.ValidityStartTime.getTime() > this.tenantFormData.ValidityEndTime.getTime()) {
          Toast('开始时间必须小于结束时间');
          return;
        }
      }

      if (!this.tenantFormData.Latitude) {
        this.tenantFormData.area = '请选择地址';
      }

      let telReg = /^\d{7,12}$/;
      let phoneReg = /\d{3}(\s|-)?\d{8}|\d{4}(\s|-)?\d{7}/;
      if (this.tenantFormData.phoneNum) {
        if (!(this.tenantFormData.phoneNum.length === 11 && phoneReg.test(this.tenantFormData.phoneNum))) {
          Toast('客服电话格式错误');
          return;
        } else if (!telReg.test(this.tenantFormData.phoneNum)) {
          Toast('客服电话格式错误');
          return;
        }
      }

      this.postTenantData();
    },
    postTenantData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      this.$route.query.isEdit === 'true'
        ? this.editTenantMethods()
        : this.addTenantMethods();
    },
    fillBackData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中...',
        mask: true,
      });

      PersonApi.getTenantInfoByID({ID: this.$route.query.id}).then((res) => {
        // this.tenantFormData.userName = res.userName;
        this.tenantFormData.tenantName = res.tenantName;
        this.tenantFormData.phoneNum = res.phoneNum;
        this.tenantFormData.area = res.area || '请选择地址';
        this.tenantFormData.address = res.address;
        this.tenantFormData.isDefault = res.isDefault;

        this.tenantFormData.Latitude = res.Latitude;
        this.tenantFormData.Longitude = res.Longitude;

        this.tenantFormData.ValidityStartTime = res.ValidityStartTime ? new Date(res.ValidityStartTime) : 0;
        this.tenantFormData.ValidityEndTime = res.ValidityEndTime ? new Date(res.ValidityEndTime) : 0;
        Toast.clear();
      });
    },
  },

  created: function () {
    if (this.$route.query.isEdit === 'true') {
      this.deleteButton = true;
      this.fillBackData();
    }
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.closeIcon {
  font-size: 12px;
  margin-left: 10px;

  &::after {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: rgba(0, 0, 0, .2);
    overflow: hidden;
    color: transparent;
    left: -2px;
    top: -1px;
    border-radius: $border-radius-circle;
  }
}

.placeholder {
  color: $font-color-placeholder;
}

.arrowIcon {
  padding-top: 6px;
}

.location {
  display: flex;

  .custom-text {
    max-width: 230px;
  }

  .van-icon-location {
    font-size: 15px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .van-icon {
    margin-top: 4px;
  }
}

.popupStyle {
  width: 100%;
}

.header-icon-right {
  font-size: $font-size-secondary !important;
  margin-top: -3px;
}

.package-delect-button {
  width: 90%;
  position: fixed;
  bottom: 20px;
  border-radius: $border-radius;
  border: 1px solid $font-color-special;
  color: $font-color-special;
  margin-left: 5%;
}

.person-info-wrap {
  position: absolute;
  top: 46px;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;

  .van-switch--on {
    background-color: $color-primary;
  }

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .van-cell:not(:last-child)::after {
      content: none;
    }

    .van-cell {
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      &:nth-child(5) {
        margin-bottom: 15px;
      }

      .van-cell__value {
        input {
          text-align: right;

          &::-webkit-input-placeholder {
            color: $font-color-placeholder;
          }
        }
      }
    }
  }

  &-top {
    margin-bottom: 15px;
  }
}
</style>
