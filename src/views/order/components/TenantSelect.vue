<template>
  <van-popup
    v-model="popupShow"
    position="bottom"
    @click-overlay="$emit('close')">
    <van-list
      v-model="loading"
      :finished="finished"
      :offset=20
      :class="$style['popup-list']"
      @load="onLoad">
        <van-cell
          v-for="(tenant, index) in tenantList"
          :key="index"
          @click="cellSelectClick(tenant)">
          <van-icon name="checked" v-show="currentSelect === tenant.ID"/>
          <span>{{ tenant.Name }}</span>
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
    visible: {
      type: Boolean,
      default: false,
    },
    tenant: {
      type: String,
      default: '',
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
    currentSelect: {
      get () {
        return this.tenant;
      },
      set (value) {
        this.$emit('update:tenant', value);
      },
    },
    popupShow: {
      get: function () {
        return this.visible;
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
        if (this.pageIndex === 1) {
          this.tenantList.push({
            Name: '全部门店',
            ID: '',
          });
        }
        res.Data.forEach(item => {
          this.tenantList.push({
            ...item,
          });
        });
        this.loading = false;
        this.totalCount += res.Data.length;
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },
    cellSelectClick (tenant) {
      this.currentSelect = tenant.ID;
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .popup-list {
    height: 294px;
    overflow: scroll;

    .van-cell::after {
      width: 90%;
    }

    .van-cell__value {
      text-align: center;
      background-color: $color-white;
      color: $font-color-secondary;

      > i {
        position: relative;
        top: 2px;
        margin-right: 5px;
        color: $color-primary;
      }
    }
  }
</style>
