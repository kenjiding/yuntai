<template>
  <ych-page>
    <page-header
      slot="header"
      title="门店权限"
      left-arrow
      right-text="确认"
      @click-left="returnBack"
      @click-right="saveSelectData">
    </page-header>
    <div
      :class="$style['store-group']">

      <form action="/" :class="$style.itemWrap">
        <van-search
          placeholder="请输入门店名称"
          v-model="searchValue"
          @search="searchListByName"
          @clear="searchListByName"
          :class="$style.search"
          :show-action="false"/>
      </form>

        <!-- <van-row>
          <van-col>
            <van-icon name="receive-gift" />
          </van-col>
          <van-col>将游戏币套餐同步到门店，将替换原有套餐</van-col>
        </van-row> -->
        <div :class="$style['box-wrap']">
          <van-radio-group
            v-model="radio"
            :class="$style['all-check-box']"
            v-show="allCheckBoxShow" >
            <van-cell title="选择全部" @click="selectAllBox">
              <van-radio :name="true" />
            </van-cell>
          </van-radio-group>

          <van-checkbox-group
            v-model="result"
            @change="change">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in storeListData"
                :title="item.Name"
                :key="index">
                <van-checkbox :name="item.id"/>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
    </div>

  </ych-page>
</template>

<script>
import { Search, RadioGroup, Radio, Toast, Checkbox, CheckboxGroup, Icon, Switch } from 'vant';
import PageHeader from '@/components/PageHeader';
import PackgeApi from '@/api/Packge';

export default {
  name: '',
  data () {
    return {
      storeListData: [],
      searchValue: null,
      result: [],
      radio: false,
      allCheckBoxShow: true,
    };
  },
  props: {
    defaultSelect: {
      type: Array,
    },
    selectShow: Boolean,
  },

  components: {
    [Switch.name]: Switch,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon,
    [CheckboxGroup.name]: CheckboxGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Search.name]: Search,
    PageHeader,
  },

  watch: {
    selectShow (val, oldVal) {
      if (val) {
        this.getStoreData();
        console.log(this.defaultSelect, '进来watch');
      };
    },
  },
  methods: {
    returnBack () {
      this.$emit('changePopupShow');
      this.searchValue = '';
      this.allCheckBoxShow = true;
    },
    saveSelectData () {
      this.allCheckBoxShow = true;
      this.searchValue = '';
      this.$emit('changePopupShow');
      this.$emit('update:defaultSelect', this.result);
    },
    selectAllBox () {
      this.radio = !this.radio;
      if (this.radio) {
        this.storeListData.forEach((item) => {
          this.result.push(item.id);
        });
        //对选择结果去重
        this.result = Array.from(new Set(this.result));
      } else {
        this.result = [];
      }
    },
    change () {
      if (this.result.length < this.storeListData.length) {
        this.radio = false;
      } else {
        this.radio = true;
      }
    },
    searchListByName (value) {
      this.allCheckBoxShow = !value;
      this.searchValue = value;
      this.getStoreData();
    },
    getStoreData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      PackgeApi.getStoreList({name: this.searchValue}).then((res) => {
        this.storeListData = res.data;
        this.result = this.defaultSelect;
        this.change();
        Toast.clear();
      });
    },
  },
  created: function () {
    this.getStoreData();
    console.log(this.defaultSelect, '进来');
  },

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.itemWrap {
  width: 100%;
  height: 64px;
  padding: 0 13px;
  box-sizing: border-box;
  background-color: $color-white !important;
}

.search {
  height: 100%;
  width: 100%;
  padding: 0;
  background-color: $color-white !important;

  .van-field {
    padding: 6px 8px;
    background-color: $border-color;
    border-radius: $border-radius;
  }
}

.box-wrap {
  width: 100%;
  position: absolute;
  top: 110px;
  bottom: 0;
  left: 0;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}

.all-check-box {
  border-top: 1px solid $border-color;
  background-color: $color-bg-secondary;

  .van-cell__title {
    span {
      color: $font-color-placeholder;
    }
  }

  .van-icon-checked {
    color: $color-primary;
  }
}

.store-group {
  .van-row {
    background: rgb(242, 242, 242);
    padding: 5px 35px 0;

    .van-col {
      font-size: $font-size-mini;
      color: $font-color-placeholder;

      &:first-of-type {
        margin-right: 5px;
        color: $color-warning;
      }
    }
  }

  .van-checkbox-group {
    width: 100%;
    background-color: $color-bg-secondary;
    box-sizing: border-box;
    padding: 10px 0 0;

    .van-cell {
      color: $font-color-placeholder;

      .van-cell__title {
        @include ellipsis(1);

        width: 250px;
      }

      .van-cell__value {
        width: 20%;

        .van-checkbox--checked {
          background-color: $color-primary;
          border-color: $color-primary;
        }
      }

      &:last-of-type {
        margin-bottom: 50px;
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

</style>
