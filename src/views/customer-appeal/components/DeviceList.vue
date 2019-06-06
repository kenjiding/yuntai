<template>
  <van-popup v-model="listShow" position="bottom" :class="$style['popup']">
    <van-cell
    :title="tenantName"
    :border="false"
    :class="$style['popup-title']">
      <van-icon slot="right-icon" name="close" @click="$emit('close')"/>
    </van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      :offset="100"
      :class="$style['popup-list']"
      @load="onLoad(false)">
        <div :class="$style['template-content']">
          <template v-for="device in deviceList">
            <div
            :key="device.ID"
            :class="$style['template-cell']">
              <div
              :class="$style['template-inside']"
              @click="$emit('cell-click',device.Name,device.Number,device.ID,device.State)">
                <img src="@/assets/img/machine.png" v-if="device.State=='Online'"/>
                <img src="@/assets/img/machine-disabled.png" v-else/>
                <div :class="$style['font-inside']">{{device.Name}}</div>
              </div>
              <div :class="$style['font-outside']">{{device.Number}}</div>
            </div>
          </template>
        </div>
    </van-list>
  </van-popup>
</template>
<script>
import CustomerAppeal from '@/api/CustomerAppeal';
import {List, Popup} from 'vant';

export default {
  components: {
    [List.name]: List,
    [Popup.name]: Popup,
  },

  props: {
    listShow: {
      type: Boolean,
      default: false,
    },
    tenantID: '',
    tenantName: '',
  },
  data: () => ({
    loading: false,
    finished: false,
    deviceList: [],
    pageIndex: 0,
    pageSize: 15,
    totalCount: 0,
    firstLoad: true,
  }),

  watch: {
    listShow (newVal) {
      if (newVal === false) {
        this.init();
      }
    },
  },
  // computed: {
  //   tenantName: function () {
  //     return this.tenantInfo.Name;
  //   },
  // },
  methods: {
    init () {
      this.pageIndex = 0;
      this.totalCount = 0;
      this.deviceList = [];
      this.finished = false;
    },

    onLoad: function (refresh) {
      if (this.firstLoad) {
        this.loading = false;
        this.firstLoad = false;
        return;
      }
      if (refresh) {
        this.init();
      }
      //防止点击跳转后再请求，待优化
      if (this.tenantID === '' || this.tenantID == null) {
        this.finished = true;
        return;
      }
      this.pageIndex++;
      CustomerAppeal.getDeviceListByTenant({
        TenantID: this.tenantID,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.deviceList.push({
            ID: item.ID,
            Name: item.Name,
            Number: item.Number,
            State: item.State,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },
    onBindSearchResult (result) {
      this.init();
      this.deviceList = result;
      this.loading = false;
      this.finished = true;
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .popup {
    height: 100%;
  }

  .popup-list {
    height: inherit;
    overflow: scroll;
  }

  .popup-title {
    //margin-top: 5px;
    font-size: 20px;
    height: 56px;
    padding-top: 15px;
    padding-right: auto;
    padding-left: auto;
  }

  .template-content {
    width: 355px;
    margin-top: 18px;
    margin-right: auto;
    margin-left: auto;
  }

  .template-cell {
    width: 105px;
    height: 127px;
    margin-right: 5px;
    margin-left: 5px;
    margin-bottom: 20px;
    float: left;
    text-align: center;
  }

  .template-inside {
    border: 1px solid;
    border-color: $border-color;
    border-radius: $border-radius;
    padding-top: 15px;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }

  .template-inside img {
    width: 37px;
    height: 50px;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 7px;
  }

  .font-inside {
    color: $color-primary;
    font-size: $font-size-secondary;
  }

  .font-outside {
    color: $font-color-regular;
    font-size: $font-size-primary;
  }
</style>
