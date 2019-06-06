<template>
  <ych-page :class="$style.wrap">
    <van-field
      v-model="formData.Name"
      input-align="right"
      label="图鉴名称"
      placeholder="请输入"
      required/>

      <cell
        cell-type="uploader"
        large-size
        cellContainerPadding="15px 16px 0 8px"
        :value="formData.PicData"
        @input="value => formData.Pic = value"
        :onUploaded="onUploaded"
        required>
        <div slot="title">
          <p>图鉴背景</p>
          <p :class="$style.label">尺寸:670*310</p>
        </div>
      </cell>
      <div :class="$style.list">
        <div
          v-for="(item, index) in formData.GiftList"
          :key="item.GoodsID"
          :class="$style['list-item']">
          <div>
            <img :src="item.GoodsPic" :class="$style['list-img']"/>
            <p :class="$style.pText">{{item.GoodsName}}</p>
          </div>
          <van-icon
            name="close"
            :class="$style['list-item-delect']"
            @click="deleteItme(index)" />
        </div>

        <div
          :class="$style['list-item']"
          @click="addItme">
          <div>
            <van-icon
              name="add-o"
              :class="$style['list-item-add']" />
            <p :class="$style.addText">添加礼品</p>
          </div>
        </div>
      </div>

    <GoodsList
      :goods-list-show="goodsListShow"
      :goods-filter-id="filterID"
      @close="goodsSelectAfter"/>

    <bottomButton
      :left-text="isEdit ? '删除' : ''"
      :right-text="isEdit ? '保存' : ''"
      :text="isEdit ? '' : '保存'"
      @delete="deleteItem"
      @confirm="beforeSave"
      @save="beforeSave"/>
  </ych-page>
</template>

<script>
import { Toast } from 'vant';
import Cell from '@/components/Cell';
import Atlas from '@/api/Atlas';
import bottomButton from './components/BottomButton';
import GoodsList from './components/GoodsList';

export default {
  name: '',

  components: {
    Cell,
    bottomButton,
    GoodsList,
  },

  props: {
    // vue-router配置的props参数
    isEdit: {
      type: Boolean,
    },
  },

  data () {
    return {
      formData: {
        Name: '',
        Pic: '',
        PicData: '',
        GiftList: [],
      },
      goodsListShow: false,
      filterID: [],
    };
  },

  created () {
    if (this.isEdit) {
      this.getData();
    }
  },

  beforeRouteEnter (to, from, next) {
    //当从添加商品页面返回的时候，回填活动信息
    if (from.fullPath === '/goods-add') {
      next((vm) => {
        let cacheData = vm.$store.state.philately.philatelyData;
        vm.formData = cacheData;
      });
    } else {
      next();
    }
  },

  methods: {
    onUploaded (file, key) {
      this.formData.PicData = file.content;
    },

    confirm () {
      Atlas.createAtlas(this.formData).then(() => {
        Toast.clear();
        this.$router.back();
      });
    },

    beforeSave () {
      if (!this.formData.Name) {
        Toast('请填写图鉴名称');
        return;
      } else if (!this.formData.Pic) {
        Toast('请选择图鉴背景');
        return;
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });

      this.isEdit ? this.edit() : this.confirm();
    },

    edit () {
      if (this.formData.Pic.indexOf('http') > -1) {
        this.formData.Pic = '';
      }
      this.formData.ID = this.$route.query.ID;

      Atlas.editAtlas(this.formData).then(() => {
        Toast.clear();
        this.$router.back();
      });
    },
    deleteItem () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此图鉴？',
        theme: 'danger',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            Atlas.deleteAtlas({ID: this.$route.query.ID}).then((res) => {
              done();
              this.$router.back();
            }, () => {
              done(false);
            });
          } else {
            done();
          }
        },
      }).catch(() => {});
    },
    goodsSelectAfter (data) {
      this.goodsListShow = false;
      if (data && !data.needCacheData) {
        this.formData.GiftList.push({
          GoodsID: data.goodsId,
          GoodsName: data.goodsName,
          GoodsPic: data.ImgKey,
        });
      } else {
        //跳转到添加商品页面的时候，缓存活动数据
        this.$store.commit('philately/savePhilatelyData', this.formData);
      }
    },
    addItme () {
      this.filterID = this.formData.GiftList.map((item) => {
        return item.GoodsID;
      });

      this.goodsListShow = true;
    },
    deleteItme (index) {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此图鉴商品？',
        theme: 'danger',
      }).then(() => {
        this.formData.GiftList.splice(index, 1);
      }).catch(() => {});
    },
    getData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      Atlas.atlasDetail({ID: this.$route.query.ID}).then((res) => {
        this.formData.Name = res.Name;
        this.formData.Pic = res.Pic;
        this.formData.PicData = res.Pic;

        this.formData.GiftList = res.GiftList;
        Toast.clear();
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.label {
  margin-top: 10px;
  font-size: $font-size-special;
  color: $font-color-placeholder;
}

.addText {
  font-size: $font-size-special;
  margin-top: 10px;
  color: $color-primary;
}

.wrap {
  .van-field {
    input {
      text-align: right;
    }
  }
}

.list {
  width: 100%;
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;
  margin-bottom: 50px;

  &-item {
    width: 105px;
    height: 160px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-white;
    margin: 0 10px 20px;
    border-radius: $border-radius;
    position: relative;

    &-delect {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      color: $color-danger;
      font-size: $font-size-primary;
    }

    &-add {
      display: block;
      margin-left: 15px;
      font-size: 25px; // stylelint-disable
      color: $color-primary;
    }

    .van-icon-close::before {
      content: "\F015" !important;
    }

    .pText {
      margin: 5px 5px 0;
      font-size: $font-size-special;
      line-height: 18px;
      width: 80px;
      height: 35px;
      text-align: center;

      @include ellipsis(2);
    }
  }

  &-img {
    width: 80px;
    height: 80px;
    display: block;
    margin: 10px auto 0;
    border-radius: $border-radius-small;
  }
}

</style>
