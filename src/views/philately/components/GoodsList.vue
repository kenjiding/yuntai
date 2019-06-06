<template>
  <van-popup
    :value="goodsListShow"
    :class="$style.goodsListPopip"
    position="right">
    <page-header
      title="商品列表"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
    />

    <searchItem
      @search="searchHandle"
      @input="inputChange"
      font-color="#999999"
      placeholder="可搜索商品名称/商品编码"/>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList">

        <div
          v-for="item in fliterGoodsList"
          :key="item.goodsId"
          :class="$style['item']"
          @click="selectGoods(item)">
          <div>
            <img
              v-if="item.ImgKey"
              :src="item.ImgKey"
              :class="$style.avator">
            <img
              v-else
              src="../../../assets/img/level-default.png"
              :class="$style.avator">
            <div :class="$style.info">
              <p>商品名称：{{ item.goodsName }}</p>
              <p>成本： {{ item.Cost }}元</p>
            </div>
          </div>
          <div>
            <van-icon name="arrow" />
          </div>
        </div>

      </van-list>

      <van-button
        size="large"
        type="primary"
        :class="$style.button"
        @click="addGoods">添加商品</van-button>
  </van-popup>
</template>

<script>
import { List, Popup } from 'vant';
import searchItem from '@/views/member/components/SearchItem.vue';
import PageHeader from '@/components/PageHeader';
import Goods from '@/api/GoodsList';

export default {
  name: '',

  components: {
    [List.name]: List,
    [Popup.name]: Popup,
    searchItem,
    PageHeader,
  },

  props: {
    goodsListShow: {
      type: Boolean,
      default: false,
    },
    goodsFilterId: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      loading: false,
      finished: false,
      goodsList: [],
      pageIndex: 0,
      searchKey: '',
    };
  },

  computed: {
    fliterGoodsList () {
      return this.goodsList.filter((item) => {
        return !this.goodsFilterId.includes(item.goodsId);
      });
    },
  },

  watch: {
    goodsListShow (val) {
      if (!val) return;
      this.pageIndex = 0;
      this.finished = false;
      this.loading = false;
      this.goodsList = [];
      this.getList();
    },
  },

  methods: {
    selectGoods (data) {
      this.$emit('close', Object.assign(data), {
        needCacheData: false,
      });
    },
    addGoods () {
      this.$emit('close', {
        needCacheData: true,
      });

      this.$router.push('/goods-add');
    },
    getList () {
      this.loading = true;
      this.pageIndex++;
      Goods.goodsInfoListForAtlas({
        PageIndex: this.pageIndex,
        PageSize: 10,
        SearchKey: this.searchKey,
        AtlasID: this.$route.query.ID,
      }).then((res) => {
        this.loading = false;

        this.goodsList = this.goodsList.concat(res.goodsList);

        if (this.goodsList.length >= res.TotalSize) {
          this.finished = true;
        }
      }, () => {
        this.loading = false;
      });
    },
    searchHandle (val) {
      this.goodsList = [];
      this.pageIndex = 0;
      this.finished = false;
      this.searchKey = val;
      this.getList();
    },
    inputChange () {},
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.goodsListPopip {
  width: 100%;
  height: 100%;
  background-color: $color-bg-primary;

  .van-list {
    width: 100%;
    position: absolute;
    top: 94px;
    bottom: 50px;
    overflow: auto;
  }
}

.button {
  position: absolute;
  bottom: 0;
}

.avator {
  width: 50px;
  height: 50px;
  float: left;
  border-radius: $border-radius-small;
}

.info {
  float: left;
  width: 60% !important;
}

.item {
  overflow: hidden;
  margin: 0 10px 10px;
  background-color: $color-white;
  padding: 10px;

  p {
    padding: 5px 10px;
    color: $font-color-secondary;
    font-size: $font-size-special;
    text-align: left;
  }

  div {
    float: left;

    &:nth-child(1) {
      width: 90%;
    }

    &:nth-child(2) {
      width: 10%;
      text-align: right;

      .van-icon-arrow {
        color: $font-color-secondary;
        margin-top: 17px;
        font-weight: 600;
      }
    }
  }
}
</style>
