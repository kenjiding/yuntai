<template>
  <ych-page>
    <searchItem
      placeholder="可搜索商品名称/商品编码"
      history-name="goodsSearchHistory"
      backGround="#077AFF"
      @search="searchHandle"
      ref="search-item"/>

    <div :class="$style.tenant" ref="tenant-name">
      <van-icon
        name="mendian"
        slot="icon"
        :class="$style['cell-icon']"/>
      <span :class="$style['tenant-name']">{{$route.query.tenantName}}</span>
    </div>

    <!-- 搜索后的商品列表 -->
    <van-list
      v-model="listLoading"
      v-show="searchValue"
      :finished="listFinished"
      :class="$style['search-list']"
      @load="getSearchData()"
      :offset="200">
      <GoodsInfoItem
        v-for="item in searchDataList"
        :key="item.goodsId"
        :goods-info="item"
        @click.native="goToEditPage(item.goodsId)">
      </GoodsInfoItem>
    </van-list>
    <!-- 搜索后的商品列表 -->

      <!-- <p :class="$style.sort">
        <span>已上架的商品</span>
        <span>2个</span>
      </p> -->

    <van-collapse
      v-model="activeName"
      accordion
      v-show="!searchValue"
      :class="$style.goodsWrap">
      <van-collapse-item title="已上架的商品" name="1" :value="onlineTotal + '个'" ref="collapse-item">
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          @load="getGoodsInfoData(true)"
          :offset="200"
          :style="{maxHeight: this.screenHeight + 'px'}">
          <GoodsInfoItem
            v-for="item in onlineGoodsDataList"
            :key="item.goodsId"
            :goods-info="item"
            @click.native="goToEditPage(item.goodsId)">
          </GoodsInfoItem>
        </van-list>
      </van-collapse-item>

      <van-collapse-item title="未上架的商品" name="2" :value="offlineTotal+'个'">
        <van-list
          v-model="offlineListLoading"
          :finished="offlineListFinished"
          @load="getGoodsInfoData(false)"
          :offset="200"
          :style="{maxHeight: this.screenHeight + 'px'}">
          <GoodsInfoItem
            v-for="item in offlineGoodsDataList"
            :key="item.goodsId"
            :goods-info="item"
            @click.native="goToEditPage(item.goodsId)">
          </GoodsInfoItem>
        </van-list>
      </van-collapse-item>
    </van-collapse>

    <!-- <div
      v-if="isMain"
      :class="$style['add-device-btn']" @click="goToAddPage">
      <van-icon name="tianjia"/>
    </div> -->
  </ych-page>
</template>

<script>
import { Dialog, Icon, Toast, List, Search, Collapse, CollapseItem } from 'vant';
import searchItem from '@/components/SearchItem';
import Scroll from '@/components/Scroll';

import Goods from '@/api/GoodsList';
import GoodsInfoItem from './components/GoodsInfoItem';

export default {
  name: 'goodsInfoPage',
  data () {
    return {
      activeName: '1',

      onlineGoodsDataList: [],
      listLoading: false,
      listFinished: false,
      onlineTotal: 0,

      offlineGoodsDataList: [],
      offlineListLoading: false,
      offlineListFinished: false,
      offlineTotal: 0,

      searchDataList: [],
      searchListLoading: false,
      searchListFinished: false,
      searchPageIndex: 1,

      showVisible: false,
      searchValue: '',
      onlinePageIndex: 1,
      offlinePageIndex: 1,
      scrollOpt: {
        scrollbar: true,
        startY: 0,
      },

      screenHeight: 0,
    };
  },

  computed: {
    isMain () {
      return this.$store.state.userInfo.IsMain;
    },
  },

  components: {
    searchItem,
    Scroll,
    Dialog,
    GoodsInfoItem,
    [Icon.name]: Icon,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,

    [List.name]: List,
    [Search.name]: Search,
  },

  mounted () {
    this.computedDOMSize();
    this.getGoodsInfoData(false);
  },

  methods: {
    computedDOMSize () {
      let searchHeight = this.$refs['search-item'].$el.offsetHeight;
      let tenantHeight = this.$refs['tenant-name'].offsetHeight;
      let marginBottom = getComputedStyle(this.$refs['tenant-name'], null)['marginBottom'].split('.')[0];
      let collapseHeight = this.$refs['collapse-item'].$el.childNodes[0].offsetHeight;
      this.screenHeight = document.body.clientHeight - searchHeight - tenantHeight - collapseHeight * 2 - Number(marginBottom);
    },
    goToAddPage () {
      this.$router.push({
        path: '/goods-add',
        query: { isEdit: 'false', tenantID: this.$route.query.tenantId },
      });
    },
    goToEditPage (id) {
      // this.$router.push({
      //   path: '/goods-store-list',
      //   query: { isEdit: 'true', goodsId: id },
      // });
      this.$router.push({
        path: '/goods-edit',
        query: { isEdit: 'true', goodsId: id },
      });
    },
    searchHandle (value) {
      this.searchValue = value;
      //启用搜索功能时，要将页码置 1 ，并将列表数据清空
      this.searchDataList = [];
      this.searchPageIndex = 1;
      value && this.getSearchData();
    },

    getSearchData () {
      this.searchListLoading = true;

      let goodsFormData = Object.assign({},
        {
          pageIndex: this.searchPageIndex++,
          pageSize: 20,
        },
        {TenantID: this.$route.query.tenantId || null},
        {SearchKey: this.searchValue});

      Goods.goodsInfoList(goodsFormData).then((res) => {
        this.searchListLoading = false;
        this.searchDataList = this.searchDataList.concat(res.goodsList);

        if (this.searchDataList.length >= res.TotalSize) {
          this.searchListFinished = true;
        }
      });
    },

    getGoodsInfoData (isOnline) {
      let pageIndex;
      if (isOnline) {
        this.listLoading = true;
        pageIndex = this.onlinePageIndex++;
      } else {
        this.offlineListLoading = true;
        pageIndex = this.offlinePageIndex++;
      }

      let goodsFormData = Object.assign({},
        {
          pageIndex: pageIndex,
          pageSize: 20,
          IsOnline: isOnline,
        },
        {TenantID: this.$route.query.tenantId || null},
        {SearchKey: ''});

      Goods.goodsInfoList(goodsFormData).then((res) => {
        Toast.clear();
        if (isOnline) {
          //只对第一页的数据做判断，当不存在上架的商品时，默认打开未上架的商品
          if (pageIndex === 1) {
            this.activeName = res.TotalSize > 0 ? '1' : '2';
          }
          this.listLoading = false;
          this.onlineTotal = res.TotalSize;
          this.onlineGoodsDataList = this.onlineGoodsDataList.concat(res.goodsList);

          if (this.onlineGoodsDataList.length >= res.TotalSize) {
            this.listFinished = true;
          }
        } else {
          this.offlineListLoading = false;
          this.offlineTotal = res.TotalSize;
          this.offlineGoodsDataList = this.offlineGoodsDataList.concat(res.goodsList);

          if (this.offlineGoodsDataList.length >= res.TotalSize) {
            this.offlineListFinished = true;
          }
        }
      });
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.search-list {
  position: absolute;
  width: 100%;
  top: 110px;
  bottom: 0;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}

.cell-icon {
  font-size: $font-size-secondary;
  color: $color-primary;
  margin-right: 8px;
  display: inline-block;
  height: 20px;
}

.goodsWrap {
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

.sort {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-size: $font-size-special;
  color: $font-color-secondary;
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

.searchWrap {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  background-color: $color-bg-regular !important;
}

.search {
  padding: 14px 0 10px;
  background-color: $color-bg-regular !important;

  .van-field__icon {
    display: none;
  }

  .van-field {
    height: 36px;
    border-radius: $border-radius;
    background-color: $color-info;
  }

  input {
    background-color: $color-info;
    padding-top: 4px;
  }
}

.add-device-btn {
  width: 50px;
  height: 50px;
  background-color: $color-primary;
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: $font-size-secondary;
  color: $color-white;
  border-radius: $border-radius-circle;
  display: flex;
  align-items: center;
  justify-content: center;

  .van-icon-tianjia {
    margin-bottom: 5px;
  }
}

</style>
