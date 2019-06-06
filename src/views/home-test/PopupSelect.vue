<template>
  <div
    :class="$style['popup-wrap']">
  <van-popup
    v-model="popupStatus"
    position="bottom"
    :close-on-click-overlay="false"
    @click-overlay="$emit('update:popupStatus', false)">
    <van-cell
      :title="titleText"
      :class="$style.popupTitleStyle">
      <van-icon
        slot="right-icon"
        name="close"
        @click="$emit('update:popupStatus', false)" />
    </van-cell>
    <inlineLoading
      v-show="isLoading"
      type="spinner"
      size="50px">
    </inlineLoading>

    <div :class="$style.popupContentStyle">
      <van-cell
        icon="mendian"
        :style="{color: '#077AFF'}"
        :title="`全部门店(${merchantsList.length}家)`"
        @click="toggle(null,{id: null,})"
      >
      </van-cell>
      <van-cell
        v-for="(item,index) in merchantsList"
        icon="mendian"
        :class="{[$style.popupCellItem]: true, [$style.cellBorderActive] : (isActive == index)}"
        :title="item.Name"
        :key="item.id"
        @click="toggle(index,item)"
        >
      </van-cell>
    </div>
  </van-popup>
  </div>
</template>

<script>
import {
  Popup,
} from 'vant';
import inlineLoading from '@/views/goods/components/InlineLoading';

export default {
  name: '',
  data () {
    return {
      isActive: null,
    };
  },
  props: {
    popupStatus: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    merchantsList: {
      type: Array,
    },
    titleText: {
      type: String,
      default: '门店选择',
    },
  },

  components: {
    inlineLoading,
    [Popup.name]: Popup,
  },

  methods: {
    toggle (index, val) {
      this.$emit('update:popupStatus', false);
      this.isActive = index;
      this.$emit('selectItem', val);
    },
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.popup-wrap {
  .van-popup {
    height: 40%;
    z-index: 5000;

    .popupContentStyle {
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      height: 100%;

      .van-icon-mendian {
        font-size: 18px;
      }

      .popupCellItem {
        color: $font-color-placeholder;
        font-size: $font-size-primary;

        &:last-of-type {
          margin-bottom: 60px;
        }
      }

      .cellBorderActive {
        color: $color-primary;
      }
    }

    .popupTitleStyle {
      padding-top: 15px;
      padding-bottom: 10px;

      .van-cell__title {
        font-size: $font-size-primary;
        font-weight: 900;
      }

      .van-icon-close {
        font-size: $font-size-secondary;
        color: $font-color-placeholder;
      }
    }
  }
}
</style>
