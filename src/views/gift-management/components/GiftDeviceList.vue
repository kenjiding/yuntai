<template>
  <div>
    <!-- <van-pull-refresh
    v-model="loading"
    @refresh="onRefresh"
    :class="$style.main"> -->
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="300"
        @load="onLoad(false)">
          <div :class="$style['template-content']">
            <template v-for="item in giftDeviceList">
              <van-cell
                is-link
                :key="item.DeviceID"
                :class="$style['template-cell']"
                @click="handleGiftClicked(item.DeviceID)">
                  <div slot="title" :class="$style.title">
                    <img
                      v-if="item.DeviceState == 'Online'"
                      src="../../../assets/img/machine.png"
                      :class="$style.icon"/>
                    <img
                      v-if="item.DeviceState == 'Offline'"
                      src="../../../assets/img/machine-disabled.png"
                      :class="$style.icon"/>
                    <p>
                      <span :class="$style['title-name']">{{item.DeviceName}}</span><br>
                      <span :class="$style['title-number']">{{item.DeviceNumber}}</span>
                    </p>
                  </div>
                  <p>
                    <span>{{item.GiftName}}</span><br>
                    库存{{item.Stock}}
                  </p>
                  <van-icon
                    slot="right-icon"
                    name="xiangyou"/>
                </van-cell>
            </template>
          </div>
      </van-list>
    <!-- </van-pull-refresh> -->
  </div>
</template>
<script>
import GiftManagementApi from '@/api/GiftManagement';
import {List, PullRefresh} from 'vant';
import refreshEvent from '@/events/order-list-refresh';

export default {
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },

  props: {
    id: {
      type: String,
      default: '',
    },
    searchKey: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    loading: false,
    finished: false,
    giftDeviceList: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  }),

  created () {
    //this.onLoad(false);
    refreshEvent.on(() => {
      this.onRefresh(true);
    });
  },

  methods: {
    onLoad: function (refresh) {
      this.pageIndex++;
      GiftManagementApi.getGiftDeviceList({
        TenantID: this.id,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        SearchKey: this.searchKey,
      }).then(res => {
        this.$emit('device-acount', res.Total);

        res.Data.forEach(item => {
          this.giftDeviceList.push({
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
    onRefresh () {
      this.pageIndex = 0;
      this.totalCount = 0;
      this.giftDeviceList = [];
      this.loading = true;
      this.onLoad(true);
    },

    handleGiftClicked (currentId) {
      this.$router.push({
        path: '/gift-setting',
        query: {
          DeviceId: currentId,
        },
      });
    },
  },

  beforeDestroy () {
    refreshEvent.off();
  },

};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";
  @import "@/styles/mixins.scss";

  .template-content {
    width: 100%;
    overflow: scroll;
  }

  .template-cell {
    height: 80px;
    background-color: $color-white;
    padding: 20px 5px 20px 15px;

    .title {
      display: flex;
      justify-content: flex-start;
      line-height: 21px;

      &-name {
        margin-left: 10px;
        color: $color-primary;
        font-size: $font-size-secondary;
      }

      &-number {
        margin-left: 10px;
        color: $font-color-placeholder;
        font-size: $font-size-special;
      }
    }

    .van-icon-xiangyou {
      line-height: 40px;
      color: $color-info;
      font-size: $font-size-secondary;
    }

    .van-cell__value {
      line-height: 20px;
      color: $font-color-secondary;
      font-size: $font-size-special;
      padding-right: 10px;

      span:first-child {
        color: $font-color-regular;
      }
    }

    .icon {
      height: 40px;
    }
  }
</style>
