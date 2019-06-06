<template>
  <div>
    <van-cell title="门店选择" :border="false" :class="$style['popup-title']">
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
          icon="mendian"
          :class="{[$style['van-cell__active']]:tenant.ID === currentTenantID}"
          @click="onCellClick(tenant.ID, tenant.Name)">
        {{tenant.Name}}
        </van-cell>
    </van-list>
  </div>
</template>
<script>
import Tenant from '@/api/Tenant';

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
    currentTenantID: '',
  }),

  created () {
    this.onLoad();
  },
  methods: {
    onLoad: function () {
      this.loading = true;

      Tenant.tenantList({
        PageIndex: ++this.pageIndex,
        PageSize: 10,
      }).then(res => {
        this.tenantList = this.tenantList.concat(res.Data);
        this.loading = false;
        this.$emit('refTenantAmount', res.TotalSize);
        if (this.tenantList.length >= res.TotalSize) {
          this.finished = true;
        }
      });
    },

    onCellClick (id, name) {
      this.currentTenantID = id;
      this.$emit('close');
      this.$emit('cell-click', id, name);
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
      color: $font-color-secondary;

      &__active {
        color: $color-primary;
      }
    }

    .van-icon {
      font-size: $font-size-regular;
      position: relative;
      top: -2px;
    }
  }

  .popup-title {
    font-size: $font-size-regular;
    padding: 15px auto 0;
    border-bottom: 1px solid $border-color;
  }
</style>
