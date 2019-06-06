<template>
  <van-popup v-model="popupShow" position="bottom" @click-overlay="$emit('close')">
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
  </van-popup>
</template>
<script>
import GiftManagementApi from '@/api/GiftManagement';
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
    tenantList: [
      {
        Name: '全部门店',
        ID: '00000000-0000-0000-0000-000000000000',
      },
    ],
    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
    currentTenantID: '00000000-0000-0000-0000-000000000000',
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
  created () {
    this.onLoad();
  },
  methods: {
    onLoad: function () {
      this.pageIndex++;
      GiftManagementApi.getTenantList({
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
        this.refTenantAmount = res.Total;
        this.$emit('refTenantAmount', res.Total);
        if (this.totalCount >= res.Total) {
          this.finished = true;
        }
      });
    },

    onCellClick (id, name) {
      this.currentTenantID = id;
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
    //margin-top: 5px;
    font-size: $font-size-regular;
    height: 56px;
    padding-top: 15px;
    padding-right: auto;
    padding-left: auto;
  }
</style>
