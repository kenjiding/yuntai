<template>
  <van-popup
    v-model="addPrizeShow"
    :class="$style.goodsListPopip"
    position="right">
    <page-header
      title="添加奖品"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
    />
    <div>
      <van-field
        v-model="name"
        required
        input-align="right"
        label="活动名称"
        placeholder="请输入"
      />
      <cell
        title="上传奖品图片"
        cell-type="uploader"
        v-model="imgKey"/>
    </div>

    <van-button
      size="large"
      type="primary"
      :class="$style.button"
      @click="save">确认</van-button>
  </van-popup>
</template>

<script>
import { Toast, Popup } from 'vant';
import PageHeader from '@/components/PageHeader';
import Cell from '@/components/Cell';

export default {
  name: '',

  components: {
    [Popup.name]: Popup,
    PageHeader,
    Cell,
  },

  props: {
    addPrizeShow: {
      type: Boolean,
      default: false,
    },
    fillBackData: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      imgKey: '',
      name: '',
    };
  },

  watch: {
    addPrizeShow (val) {
      console.log(val, this.fillBackData, '456');
      //当奖品是通过手动添加的时候，回填奖品图片和信息
      if (val && !this.fillBackData.GoodsID) {
        this.imgKey = this.fillBackData.Pic || '';
        this.name = this.fillBackData.GoodsName || '';
      } else {
        this.name = '';
        this.imgKey = '';
      }
    },
  },

  methods: {
    save () {
      if (this.name) {
        this.$emit('close', {
          goodsId: '',
          name: this.name,
          key: this.imgKey,
        });
      } else {
        Toast('请填写奖品名称');
      }
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.goodsListPopip {
  width: 100%;
  height: 100%;

  input {
    text-align: right;
  }
}

.button {
  position: fixed;
  bottom: 0;
}
</style>
