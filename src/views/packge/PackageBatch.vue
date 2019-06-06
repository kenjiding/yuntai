<template>
  <ych-page>
    <van-cell title="第一步：选择套餐" :class="$style.titleCell">
      <template slot="right-icon">
        <span
          :class="{
            [$style.allSelect]: true,
            [$style.allSelectActive]: goodsSelected.length === goodsDataList.length}"
          @click="allSelectMethods">
          全选({{goodsSelected.length}})
        </span>
      </template>
    </van-cell>
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :class="$style.list"
      @load="getGoodsInfoData()"
      :offset="200">

      <PakageInfoItem
        v-for="item in goodsDataList"
        :key="item.id"
        :class="{[$style.item]: true,[$style.active]: goodsSelected.includes(item.id)}"
        :goods-info="item"
        @click.native="selectItem(item.id)"/>
    </van-list>

    <van-popup
      v-model="storeSelectShow"
      position="right"
      :overlay="false"
      :style="{width: '100%'}">
      <GoodsStoreSelect
        type="batch"
        @changePopupShow="storeSelectShow = false"
        @addPageHandler="batchAddGoods"></GoodsStoreSelect>
    </van-popup>

    <bottomButton
      text="选择门店"
      @confirm="selectStore" />
  </ych-page>
</template>

<script>
import {List, Popup, Toast} from 'vant';
import PakageInfoItem from './components/PackageInfoItem';
import Goods from '@/api/GoodsList';
import PackgeApi from '@/api/Packge';

import bottomButton from '@/components/BottomButton';
import GoodsStoreSelect from '../goods/GoodsStoreSelect';

export default {
  name: '',

  components: {
    PakageInfoItem,
    GoodsStoreSelect,
    bottomButton,
    [List.name]: List,
    [Popup.name]: Popup,
  },

  data () {
    return {
      pageIndex: 1,
      listLoading: false,
      listFinished: false,
      goodsDataList: [],
      goodsSelected: [],
      storeSelectShow: false,
      isAllSelectMark: false,
      total: 0,
    };
  },
  created () {},

  methods: {
    batchAddGoods (tenantIDList) {
      Toast.loading({
        mask: true,
        message: '上架中...',
        duration: 0,
      });
      Goods.batchAddGoods({
        TenantIDList: tenantIDList,
        GoodsIDList: this.goodsSelected,
        GoodsType: 'Coin',
      }).then(() => {
        Toast.clear();
        this.$router.back();
      });
    },
    handleAllSelect () {
      if (this.isAllSelectMark) {
        this.goodsDataList.forEach((item) => {
          this.goodsSelected.push(item.id);
        });
      }
    },
    allSelectMethods () {
      //isAllSelectMark是标记用户是否点击了全选按钮，true为全选，false为取消全选
      this.isAllSelectMark = !this.isAllSelectMark;

      if (!this.isAllSelectMark) {
        //当isAllSelectMark为false，即取消全选时，先要判断选中的游戏币套餐个数和全部游戏币套餐个数是否相等，
        //如果相等，则证明用户要取消全选。相反继续全选所有游戏币套餐
        if (this.goodsSelected.length !== this.goodsDataList.length) {
          this.goodsSelected = [];

          this.goodsDataList.forEach((item) => {
            this.goodsSelected.push(item.id);
          });
          //全选完所有游戏币套餐的时候，需要将isAllSelectMark标记为true

          this.isAllSelectMark = true;
          return;
        } else {
          this.goodsSelected = [];
          return;
        }
      };

      if (this.goodsDataList.length >= this.total) {
        this.goodsSelected = [];

        this.handleAllSelect();
        return;
      }

      this.goodsSelected = [];
      this.goodsDataList = [];
      this.getGoodsInfoData({
        pageIndex: 1,
        pageSize: this.total,
      });
      // let alreadySelect = this.goodsSelected.length;
      // this.goodsSelected = [];
      // if (alreadySelect !== this.goodsDataList.length) {
      //   this.goodsDataList.forEach((item) => {
      //     this.goodsSelected.push(item.id);
      //   });
      // }
    },
    selectStore () {
      if (this.goodsSelected.length <= 0) {
        Toast('请选择游戏币套餐');
        return;
      }
      this.storeSelectShow = true;
    },
    selectItem (id) {
      if (this.goodsSelected.includes(id)) {
        this.goodsSelected.splice(this.goodsSelected.findIndex((item, index) => {
          return item === id;
        }), 1);
      } else {
        this.goodsSelected.push(id);
      }

      //全选所有游戏币套餐的时候，需要将isAllSelectMark标记为true
      if (this.goodsSelected.length === this.goodsDataList.length) {
        this.isAllSelectMark = true;
      }
    },
    getGoodsInfoData (formData) {
      this.listLoading = true;

      let goodsFormData = Object.assign({},
        {
          pageIndex: this.pageIndex++,
          pageSize: 50,
        },
        {TenantID: ''},
        {SearchKey: ''},
        formData);

      PackgeApi.packgeInfo(goodsFormData).then((res) => {
        this.listLoading = false;
        this.goodsDataList = this.goodsDataList.concat(res.Data);
        this.total = res.TotalSize;
        this.handleAllSelect();

        if (this.goodsDataList.length >= res.TotalSize) {
          this.listFinished = true;
        }
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.active {
  /* stylelint-disable-next-line */
  background-color: #8eb4e2;

  p {
    color: $color-white !important;
  }

  span {
    color: $color-white !important;
  }
}

.item {
  margin-bottom: 10px;
  border-radius: $border-radius;
}

.allSelectActive {
  background-color: $color-primary !important;
  color: $color-white;
}

.allSelect {
  width: 70px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  /* stylelint-disable-next-line */
  background-color: #e3e0e0;
  border-radius: $border-radius-small;
  font-size: $font-size-mini;
}

.titleCell {
  line-height: 30px;
}

.list {
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px 70px;
  position: absolute;
  top: 55px;
  bottom: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

</style>
