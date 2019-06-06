<template>
  <ych-page>
    <div
      :class="$style['store-group']">
        <SearchItem
          placeholder="可搜索门店名称"
          backGround="#077AFF"
          @search="searchHandle"
          v-if="whitchPageComeIn"/>
        <van-cell-group :style="{top: whitchPageComeIn ? null : 0}">
          <!-- <van-cell
            :title="allGoodsName"
            :value="whitchPageComeIn ? AllGoodsNum : AllPackageNum"
            icon="shangpin"
            :class="$style['group-first-cell']"
            @click="goToGoodsPage"
            is-link/> -->
          <van-cell
            v-for="(item,index) in storeListData"
            :key="item.id"
            :value="whitchPageComeIn ? item.GoodsNum : item.PackageNum + '个'"
            :class="{[$style['store-list-style']]: isActive === index}"
            :style="{color: '#333333'}"
            @click="toggle(index,item)"
            is-link>
            <van-icon
              name="mendian"
              slot="icon"
              :class="$style['cell-icon']"/>
            <template slot="title">
              <!-- <img src="../../assets/img/tenant.png" :class="$style['store-list_img']"/> -->
              <span :style="{ verticalAlign: 'initial',}">{{item.Name}}</span>
            </template>
          </van-cell>
        </van-cell-group>
    </div>
    <!-- <div
      v-if="isMain"
      :class="$style['add-device-btn']"
      @click="buttonClick">
      <van-icon name="tianjia"/>
    </div> -->

    <bottomButton
      v-if="isMain"
      leftText="批量上下架"
      :rightText="whitchPageComeIn ? '新增商品' : '新增套餐'"
      @leftClick="batchGoods"
      @rightClick="addGoods" />
  </ych-page>
</template>

<script>
import { Cell, CellGroup, Toast } from 'vant';
import bottomButton from '@/components/BottomButton';
import SearchItem from '@/views/member/components/SearchItem';
import PackgeApi from '@/api/Packge';

export default {
  name: 'GoodsStore',
  data () {
    return {
      isActive: null,
      storeListData: [],
      pathName: '/',
      buttonText: '',
      allGoodsName: '',
      AllGoodsNum: '',
      AllPackageNum: '',
      searchKey: '',
    };
  },

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    bottomButton,
    SearchItem,
  },

  computed: {
    isMain () {
      return this.$store.state.userInfo.IsMain || this.$store.getters.getIsAdmin;
    },
    whitchPageComeIn () {
      return this.$route.fullPath.indexOf('goods') > -1;
    },
  },
  methods: {
    searchHandle (val) {
      this.searchKey = val;
      this.storeListData = [];

      this.getStoreData();
    },
    batchGoods () {
      let pathName = this.whitchPageComeIn ? '/goods-batch' : '/package-batch';
      this.$router.push(pathName);
    },
    addGoods () {
      let pathName = this.whitchPageComeIn ? '/goods-add' : '/package-add';
      this.$router.push({
        path: pathName,
        query: { isEdit: 'false' },
      });
    },
    toggle (index, val) {
      this.isActive = index;
      this.goToGoodsPage(val);
    },
    goToGoodsPage (val) {
      this.pathName = this.whitchPageComeIn ? '/goods' : '/package';
      this.$router.push({
        path: this.pathName,
        query: {
          tenantId: val ? val.id : '',
          tenantName: val.Name,
        },
      });
    },
    getStoreData () {
      Toast.loading({
        duration: 0,
        message: '加载中...',
        mask: true,
      });
      PackgeApi.getStoreList({
        name: this.searchKey,
      }).then((res) => {
        this.storeListData = res.data;
        this.AllGoodsNum = res.AllGoodsNum;
        this.AllPackageNum = res.AllPackageNum;
        Toast.clear();
      }, () => Toast.clear());
    },
  },
  created: function () {
    if (this.whitchPageComeIn) {
      this.buttonText = '新增商品(同步到多家门店)';
      this.allGoodsName = '全部商品';
    } else {
      this.buttonText = '新增套餐(同步到多家门店)';
      this.allGoodsName = '全部套餐';
    }
    this.getStoreData();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.cell-icon {
  font-size: $font-size-secondary;
  color: $color-primary;
  margin-right: 8px;
  display: inline-block;
  height: 20px;
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

.group-first-cell {
  padding-bottom: 7px !important;
  margin-bottom: 10px;

  .van-cell__title {
    line-height: 30px;
  }
}

.store-group {
  .van-cell-group {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    width: 100%;
    background: $color-bg-primary;
    position: absolute;
    top: 55px;
    bottom: 0;

    .van-cell {
      color: $font-color-placeholder;
      padding: 10px 15px;

      &:last-of-type {
        margin-bottom: 70px;
      }
    }

    .van-search {
      padding: 10px 0 !important;
    }
  }
}

.store-list-style {
  color: $color-primary !important;
}

.store-list_img {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  margin-right: 5px;
}

</style>
