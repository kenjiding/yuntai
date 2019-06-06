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
          v-for="(tenant, index) in tenantList"
          :key="index"
          icon="location"
          @click="$emit('cell-click', tenant.ID, tenant.Name)">
        {{tenant.Name}}
        </van-cell>
    </van-list>
  </van-popup>
</template>
<script>
import MarketingStatistic from '@/api/MarketingStatistic';
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
      MarketingStatistic.getTenantList({
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
      }).then(res => {
        if (this.pageIndex === 1) {
          this.tenantList.push({
            Name: '全部门店(' + res.Total + '家)',
            ID: '00000000-0000-0000-0000-000000000000',
          });
        }
        res.Data.forEach(item => {
          this.tenantList.push({
            ...item,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        //console.log(this.totalCount + '||' + res.Data.length + '||' + res.Total);
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

    .van-cell {
      background-color: $color-white;
    }
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
