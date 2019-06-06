<template>
  <ych-page>
    <div :class="$style.tenant" ref="tenant-name">
      <van-icon
        name="mendian"
        slot="icon"
        :class="$style['cell-icon']"/>
      <span :class="$style['tenant-name']">{{$route.query.tenantName}}</span>
    </div>

    <van-collapse
      v-model="activeName"
      accordion
      :class="$style.wrap">
      <van-collapse-item title="已上架的套餐" name="1" :value="onlineTotal + '个'" ref="collapse-item">
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          @load="getInfoData(true)"
          :offset="200"
          :style="{maxHeight: this.screenHeight + 'px'}">
          <PackageInfoItem
            v-for="item in onlinePackgeList"
            :key="item.id"
            :goods-info="item"
            @click.native="goToEditPage(item.id)">
          </PackageInfoItem>
        </van-list>
      </van-collapse-item>

      <van-collapse-item title="未上架的套餐" name="2" :value="offlineTotal+'个'">
        <van-list
          v-model="offlineListLoading"
          :finished="offlineListFinished"
          @load="getInfoData(false)"
          :offset="200"
          :style="{maxHeight: this.screenHeight + 'px'}">
          <PackageInfoItem
            v-for="item in offlinePackgeList"
            :key="item.id"
            :goods-info="item"
            @click.native="goToEditPage(item.id)">
          </PackageInfoItem>
        </van-list>
      </van-collapse-item>
    </van-collapse>

    <!-- <div :class="$style.playWrap">
      <div :class="$style.playContent">

        <van-list
          v-model="listLoading"
          :finished="listFinished"
          :offset="500"
          @load="getInfoData"
        >
        <van-cell-group
          v-for="item in packgeList"
          :key="item.id"
          @click.native="goToEditPage(item.id)">
          <div :class="$style.topTitleStyle">{{item.currency + '游戏币'}}</div>
          <van-cell
            :title="`售价: ￥${item.price}`"
            :value="'兑换价格(积分): ' + item.points"
            :class="$style.topValueStyle" />
        </van-cell-group>
        </van-list>
      </div>
    </div> -->

  </ych-page>
</template>

<script>
import { Toast, List, Search, Collapse, CollapseItem } from 'vant';
import PackageInfoItem from './components/PackageInfoItem';
import PackgeApi from '@/api/Packge';

export default {
  name: 'packgePlayPage',
  data () {
    return {
      activeName: '1',

      onlinePackgeList: [],
      listLoading: false,
      listFinished: false,
      onlineTotal: 0,

      offlinePackgeList: [],
      offlineListLoading: false,
      offlineListFinished: false,
      offlineTotal: 0,
      onlinePageIndex: 1,
      offlinePageIndex: 1,

      screenHeight: 0,
    };
  },
  computed: {
    isMain () {
      return this.$store.state.userInfo.IsMain;
    },
    userPremissions () {
      return this.$store.getters.getPremissions;
    },
    hasPremission () {
      return this.userPremissions.findIndex(name => name === 'package-edit') > -1;
    },
  },

  components: {
    [Search.name]: Search,
    [List.name]: List,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    PackageInfoItem,
  },

  created () {
    this.createGetPackageList();
  },

  mounted () {
    this.computedDOMSize();
  },

  methods: {
    computedDOMSize () {
      let tenantHeight = this.$refs['tenant-name'].offsetHeight;
      let marginBottom = getComputedStyle(this.$refs['tenant-name'], null)['marginBottom'].split('.')[0];
      let collapseHeight = this.$refs['collapse-item'].$el.childNodes[0].offsetHeight;
      this.screenHeight = document.body.clientHeight - tenantHeight - collapseHeight * 2 - Number(marginBottom);
    },
    goToEditPage (id) {
      this.$router.push({
        path: '/package-edit',
        query: { Id: id },
      });
    },
    goToAddPage () {
      this.$router.push({
        path: '/package-add',
        query: {tenantID: this.$route.query.tenantId},
      });
    },
    getInfoData (isOnline) {
      let pageIndex;
      if (isOnline) {
        this.listLoading = true;
        pageIndex = this.onlinePageIndex++;
      } else {
        this.offlineListLoading = true;
        pageIndex = this.offlinePageIndex++;
      }

      let formData = Object.assign({},
        {
          PageIndex: pageIndex,
          PageSize: 20,
          IsOnline: isOnline,
        },
        {TenantID: this.$route.query.tenantId || null},
      );

      PackgeApi.packgeInfo(formData).then(res => {
        Toast.clear();
        if (isOnline) {
          //只对第一页的数据做判断，当不存在上架的套餐时，默认打开未上架的套餐
          if (pageIndex === 1) {
            this.activeName = res.TotalSize > 0 ? '1' : '2';
          }
          this.listLoading = false;
          this.onlineTotal = res.TotalSize;
          this.onlinePackgeList = this.onlinePackgeList.concat(res.Data);

          if (this.onlinePackgeList.length >= res.TotalSize) {
            this.listFinished = true;
          }
        } else {
          this.offlineListLoading = false;
          this.offlineTotal = res.TotalSize;
          this.offlinePackgeList = this.offlinePackgeList.concat(res.Data);

          if (this.offlinePackgeList.length >= res.TotalSize) {
            this.offlineListFinished = true;
          }
        }
      });
    },
    createGetPackageList () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });

      this.getInfoData(false);
    },
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.wrap {
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .van-collapse-item__content {
    padding: 0;
  }

  .van-list {
    min-height: 1px;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
}

.tenant {
  padding: 10px;
  margin-bottom: 10px;
  background-color: $color-white;
  border-radius: $border-radius-small;

  &-name {
    font-size: $font-size-special;
    position: relative;
    top: -2px;
  }
}

.cell-icon {
  font-size: $font-size-secondary;
  color: $color-primary;
  margin-right: 8px;
  display: inline-block;
  height: 20px;
}

</style>
