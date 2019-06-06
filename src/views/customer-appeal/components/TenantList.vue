<template>
  <van-popup v-model="popupShow" position="bottom" @click-overlay="$emit('close')">
    <van-cell title="请选择门店" :border="false" :class="$style['popup-title']">
      <van-icon slot="right-icon" name="close" @click="$emit('close')"/>
    </van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      :offset=20
      :class="$style['popup-list']"
      @load="onLoad">
        <van-cell
          v-for="tenant in tenantList"
          :key="tenant.ID"
          icon="location"
          @click="$emit('cell-click', tenant.ID, tenant.Name)">
        {{tenant.Name}}
        </van-cell>
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
  },
  data: () => ({
    loading: false,
    finished: false,
    tenantList: [],
    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
  }),
  computed: {
    popupShow: {
      get: function () {
        return this.listShow;
      },
      set: function (v) {
        return v;
      },
    },
  },
  methods: {
    onLoad: function () {
      this.pageIndex++;
      CustomerAppeal.getTenantList({
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        res.Data.forEach(item => {
          this.tenantList.push({
            Name: item.Name,
            ID: item.ID,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .popup-list {
    height: 244px;
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
</style>
