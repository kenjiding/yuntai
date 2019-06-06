<template>
  <van-cell value="商品类型" :class="$style.cell">
    <template slot="right-icon">
      <div :class="$style.select" @click="openSelect">
        <p>{{selectItem.title}}</p>
        <p><van-icon :name="selectShow ? 'arrow-up' : 'arrow-down'" size="1.5em"/></p>
        <ul :class="$style.item" v-show="selectShow">
          <li
            v-for="li in options"
            :key="li.title"
            :class="{[$style.active]: activeIndex === li.val}"
            @click.stop="selectItemHandle(li)">{{li.title}}</li>
        </ul>
      </div>

    </template>
  </van-cell>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      selectItem: {
        title: '通用商品',
        val: 'Goods',
      },
      selectShow: false,
      activeIndex: 'Goods',
      options: [
        {
          title: '通用商品',
          val: 'Goods',
        },
        {
          title: '游乐门票',
          val: 'TicketGoods',
        },
      ],
    };
  },
  created () {

  },

  methods: {
    openSelect () {
      this.selectShow = !this.selectShow;
    },
    selectItemHandle (data) {
      this.activeIndex = data.val;
      this.selectItem = data;
      this.selectShow = false;
      this.$emit('changeGoodsType', data.val);
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.active {
  color: $color-primary;
}

.cell {
  overflow: visible;
  border-bottom: 1px solid $border-color;
}

.item {
  position: absolute;
  width: 90px;
  top: 28px;
  z-index: 2000;
  background-color: $color-white;
  border: 1px solid $font-color-regular;
  border-top: none;
  border-radius: $border-radius-small;

  li {
    height: 30px;
    line-height: 32px;
    padding-left: 6px;
  }
}

.select {
  width: 90px;
  height: 27px;
  border: 1px solid $font-color-regular;
  border-radius: $border-radius-small;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    &:nth-child(1) {
      flex: 8;
      text-align: center;
    }

    &:nth-child(2) {
      flex: 2;
    }
  }
}
</style>
