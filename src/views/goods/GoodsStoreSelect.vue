<template>
  <ych-page>
    <div
      :class="$style['store-group']">
        <!-- <van-row>
          <van-col>
            <van-icon name="receive-gift" />
          </van-col>
          <van-col>将游戏币套餐同步到门店，将替换原有套餐</van-col>
        </van-row> -->
        <van-radio-group
          v-model="radio"
          :class="$style['all-check-box']"
          v-if="type === 'add'">
          <van-cell title="选择全部" @click="selectAllBox">
            <van-radio
              :name="true"
              :class="$style['all-check-box-radio']" />
          </van-cell>
        </van-radio-group>

        <van-cell
          title="第二步：选择上架门店"
          :class="$style.titleCell"
          v-else>
          <template slot="right-icon">
            <span
              :class="{
                [$style.allSelect]: true,
                [$style.allSelectActive]: result.length === hasPermissionStoreList.length}"
              @click="allSelectMethods">
              全选({{result.length}})
            </span>
          </template>
        </van-cell>

        <p :class="$style.warming" v-if="type !== 'add'">注：商品不会上架到未选择的门店</p>

        <van-checkbox-group
          v-model="result"
          @change="checkBoxChange">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in hasPermissionStoreList"
              :title="item.Name"
              :key="item.id"
              clickable
              icon="dizhi"
              @click="toggle(index)">
              <van-checkbox :name="item.id" ref="checkboxes"/>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>

        <p :class="$style.text" v-if="noPermissionStoreList.length > 0">以下门店没有操作权限</p>

        <van-checkbox-group
          v-model="noPermissionResult">
          <van-cell-group>
            <van-cell
              v-for="item in noPermissionStoreList"
              :title="item.Name"
              :key="item.id"
              icon="dizhi">
              <van-checkbox disabled :name="item.id" :class="$style.disabled"/>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>

        <p :class="$style.empty"></p>
    </div>

    <bottomButton
      leftText="返回"
      rightText="确认"
      @leftClick="$emit('changePopupShow')"
      @rightClick="saveSelectData" />
  </ych-page>
</template>

<script>
import { RadioGroup, Radio, Toast, Checkbox, CheckboxGroup, Icon, Switch } from 'vant';
import bottomButton from '@/components/BottomButton';
import PackgeApi from '@/api/Packge';

export default {
  name: 'GoodsStore',
  data () {
    return {
      isActive: null,
      pathName: '/',
      result: [],
      noPermissionResult: [],
      radio: false,
      hasPermissionStoreList: [],
      noPermissionStoreList: [],
    };
  },
  props: {
    defaultSelect: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: 'add',
    },
    popupShow: Boolean,
  },
  watch: {
    popupShow: {
      handler () {
        document.body.scrollTop = document.body.scrollHeight;
      },
      immediate: true,
    },
  },
  components: {
    [Switch.name]: Switch,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon,
    [CheckboxGroup.name]: CheckboxGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    bottomButton,
  },

  methods: {
    allSelectMethods () {
      let alreadySelect = this.result.length;
      this.result = [];
      console.log(alreadySelect, 'alreadySelect');
      if (alreadySelect !== this.hasPermissionStoreList.length) {
        this.hasPermissionStoreList.forEach((item) => {
          this.result.push(item.id);
        });
      }
    },
    selectAllBox () {
      this.radio = !this.radio;
      if (this.radio) {
        this.hasPermissionStoreList.forEach((item) => {
          this.result.push(item.id);
        });
        this.result = Array.from(new Set(this.result));
      } else {
        this.result = [];
      }
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    saveSelectData () {
      this.$emit('update:defaultSelect', this.result.concat(this.noPermissionResult));
      this.$emit('changePopupShow');
      this.$emit('addPageHandler', this.result.concat(this.noPermissionResult));
    },
    checkBoxChange () {
      this.radio = !(this.result.length < this.hasPermissionStoreList.length);
    },
    fillBackSelect () {
      let allBindTenant = this.defaultSelect.map((item) => {
        return item.id;
      });

      this.hasPermissionStoreList.forEach((item) => {
        allBindTenant.includes(item.id) && this.result.push(item.id);
      });

      this.noPermissionStoreList.forEach((item) => {
        allBindTenant.includes(item.id) && this.noPermissionResult.push(item.id);
      });
    },
    getStoreData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中...',
        mask: true,
      });
      PackgeApi.getStoreList().then((res) => {
        //筛选有权限的门店列表
        this.hasPermissionStoreList = res.data || [];
        this.noPermissionStoreList = res.AuthPermissions || [];
        //编辑页面过来的时候，回填默认选择
        this.fillBackSelect();
        Toast.clear();
      });
    },
  },
  created: function () {
    this.getStoreData();
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.warming {
  font-size: $font-size-special;
  color: $font-color-placeholder;
  text-align: left;
  padding: 0 0 10px 15px;
}

.empty {
  width: 100%;
  height: 50px;
}

.text {
  padding: 15px 20px 15px 17px;
  color: $font-color-secondary;
  font-size: $font-size-special;
}

.all-check-box-radio {
  color: $color-primary;

  .van-icon-checked {
    color: $color-primary !important;
  }
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
  margin-bottom: 15px;
}

.all-check-box {
  padding: 0 0 10px;
  background: rgb(242, 242, 242);
}

.store-group {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 50px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .van-checkbox-group {
    .all-check-box {
      padding: 20px 25px;
    }

    .van-cell {
      color: $font-color-placeholder;
      border-bottom: 1px solid $border-color;

      .van-cell__title {
        @include ellipsis(1);

        width: 250px;
      }

      .van-cell__value {
        width: 20%;

        .van-checkbox--checked {
          border-color: $color-primary;
          background-color: $color-primary;
        }
      }
    }
  }
}

.store-list-style {
  color: $color-primary !important;
}

</style>
