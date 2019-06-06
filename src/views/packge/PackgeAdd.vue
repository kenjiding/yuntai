<template>
  <ych-page>
    <div :class="$style.addplayWrap">
      <div :class="$style.addplayContent"
          v-for="(item, index) in allGroup"
          :key="index">
        <van-cell-group>
          <van-field
            v-model="item.currency"
            :class="$style.currencyStyle"
            :disabled="!isMain"
            type="number"
            required
            :max="100000"
            :precision="0"
            label="游戏币"
            placeholder="请输入游戏币数量"
          />
          <van-field
            v-model="item.price"
            :disabled="!isMain"
            label="售价"
            :max="100000"
            type="number"
            placeholder="请输入游戏币售价"
            required
          />
        </van-cell-group>
        <van-panel>
          <van-row slot="header">
            <van-col :span="12"><span>兑换价格(积分)</span></van-col>
            <van-col :span="12">
              <van-switch
                v-model="item.IsPoint"
                size="26px"
                :disabled="!isMain" />
            </van-col>
          </van-row>
          <van-field
            v-model="item.points"
            v-show="item.IsPoint"
            type="number"
            :precision="0"
            placeholder="请输入兑换积分"
            :disabled="!isMain" />
        </van-panel>
      </div>

      <van-cell
        title="上架门店"
        :value="allGroup[0].store.length + '家'"
        is-link
        clickable
        :style="{marginTop: '10px'}"
        @click="popupShow = true">
      </van-cell>
      <!--
        <div
          :class="$style['add-icon-style']"
          @click="addItemHandler"
          v-show="addIconShow">
          <van-icon name="tianjia" />
        </div>
      -->
      <!--
        <div
          :class="$style['package-delect-button']"
          @click="deleteItem"
          v-show="delectButtom">
          <van-button>删除</van-button>
        </div>
      -->
    </div>
    <!-- <van-button
      size="large"
      :class="$style['store-button-style']"
      v-show="selectBottomShow"
      @click="popupShow = true">设置上架门店</van-button> -->
    <van-popup
      v-model="popupShow"
      position="right"
      :overlay="false"
      :style="{width: '100%'}">
      <GoodsStoreSelect
        @changePopupShow="popupShow = false"
        @addPageHandler="addSelect"
        :defaultSelect.sync="allGroup[0].store"></GoodsStoreSelect>
    </van-popup>

    <bottomButton
      :leftText="buttonText"
      :rightText="isEdit ? '保存' : '确定'"
      @leftClick="deleteItem"
      @rightClick="saveHandle" />
  </ych-page>
</template>

<script>
import {
  Field,
  Panel,
  Switch,
  Popup,
  List,
  Loading,
  Toast,
} from 'vant';
import PackgeApi from '@/api/Packge';
import bottomButton from '@/components/BottomButton';
import inlineLoading from './components/InlineLoading';
import GoodsStoreSelect from '@/views/goods/GoodsStoreSelect';
import checkData from './tool/checkFormData';

export default {
  name: 'addPlayPage',
  data () {
    return {
      names: '',
      navBarTitle: '新增游乐套餐',
      delectButtom: false,
      allGroup: [{
        currency: '',
        price: '',
        points: '',
        IsPoint: false,
        store: [],
      }],
      addIconShow: true,
      saveIconShow: true,
      popupShow: false,
      selectBottomShow: true,
      //禁止重复连续提交
      stopSubmit: true,
    };
  },
  props: {
    // vue-router配置的props参数
    isEdit: {
      type: Boolean,
    },
  },
  components: {
    Field,
    [Popup.name]: Popup,
    [Panel.name]: Panel,
    [Switch.name]: Switch,
    [List.name]: List,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    inlineLoading,
    GoodsStoreSelect,
    bottomButton,
  },
  computed: {
    buttonText () {
      if (this.isEdit && this.isMain) {
        return '删除';
      } else {
        return null;
      }
    },
    storeChange () {
      return this.allGroup.length;
    },
    isMain () {
      return this.$store.state.userInfo.IsMain || this.$store.getters.getIsAdmin;
    },
  },
  watch: {
    storeChange (newval, oldval) {
      //检测批量添加套餐的时候，当选择完门店后再次企图增加套餐时，新增的套餐没有选择到门店的问题
      if (newval !== oldval) {
        let a = this.allGroup.find((item) => {
          return item.store.length > 0;
        });
        if (a) {
          this.allGroup.forEach((value) => {
            value.store = a.store;
          });
        }
      }
    },
  },
  methods: {
    addSelect (val) {
      this.allGroup.forEach((item) => {
        item.store = val;
      });
    },
    deleteItem (val) {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此套餐？',
        theme: 'danger',
      }).then(() => {
        PackgeApi.deletePackageItem({ID: this.$route.query.Id}).then((res) => {
          this.$router.go(-1);
        });
      }).catch(() => {});
    },
    addItemHandler () {
      let value = {
        currency: '',
        price: '',
        points: '',
        IsPoint: false,
        store: [],
      };
      this.allGroup.push(value);
    },
    checkPlice () {
      for (let i = 0; i < this.allGroup.length; i++) {
        if (!/^\+?[1-9][0-9]*$/.test(this.allGroup[i].currency)) {
          Toast('游戏币数应为大于零的整数');
          return false;
        }
        if (!/^\d+\.?\d{0,2}$/.test(this.allGroup[i].price)) {
          Toast('售卖价格不能小于分');
          return false;
        }
        if (this.allGroup[i].IsPoint) {
          if (!/^\+?[1-9][0-9]*$/.test(this.allGroup[i].points)) {
            Toast('兑换积分数应为大于零的整数');
            return false;
          }
        } else {
          this.allGroup[i].points = 0;
          // if (this.allGroup[i].points !== '') {
          //   if (!/^\+?[0-9][0-9]*$/.test(this.allGroup[i].points)) {
          //     Toast('兑换积分数应为整数');
          //     return false;
          //   }
          // } else {
          //   //points字段，后台接收是该参数不能为''空值，而且必须为number类型。所以当points为空的时候，默认补零
          //   this.allGroup[i].points = 0;
          // }
        }
      }
      this.stopSubmit && this.whichStep();
    },
    saveHandle () {
      // 检查表单数据
      let dataPass = checkData({
        data: this.allGroup,
        ignore: ['points', 'store'],
        message: {
          currency: '请填写游戏币',
          price: '请填写售卖价格',
        },
      });

      //编辑套餐，当用户是主体的时候，它没有去选择门店页面修改了上架门店就直接按保存退出，就需要以下处理
      if (typeof this.allGroup[0].store[0] === 'object') {
        this.allGroup[0].store = this.allGroup[0].store.map((item) => {
          return item.id;
        });
      }

      dataPass && this.checkPlice();
    },
    whichStep () {
      this.stopSubmit = false;
      //this.isEdit是路由配置的props参数
      if (this.isEdit) {
        this.allGroup[0].ID = this.$route.query.Id;
        this.postEdit();
      } else {
        this.postAdd();
      }
    },
    postAdd () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PackgeApi.addNewPackge({PackageList: this.allGroup}).then(res => {
        Toast.success('添加成功');
        setTimeout(() => {
          this.$router.back();
        }, 1000);
        this.stopSubmit = true;
        Toast.clear();
      }, () => { this.stopSubmit = true; });
    },
    postEdit () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PackgeApi.editPackge({PackageList: this.allGroup}).then(res => {
        Toast.clear();
        this.stopSubmit = true;
        Toast.success('编辑成功');
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      }, () => { this.stopSubmit = true; });
    },
    BackfillData () {
      Toast.loading({
        duration: 0,
        message: '加载中...',
        mask: true,
      });
      PackgeApi.getPackgeInfoById({ id: this.$route.query.Id }).then(res => {
        this.allGroup[0].currency = res.currency;
        this.allGroup[0].price = res.price;
        this.allGroup[0].points = res.points ? res.points : '';
        this.allGroup[0].IsPoint = res.Ispoints;
        this.allGroup[0].store = res.storeList;
        Toast.clear();
      });
    },
    thisTenantAdd () {
      //当选择完门店进入套餐列表时，按添加套餐操作，这是不能选择上架其他门店，默认在该门店上架
      if (this.$route.query.tenantID) {
        this.allGroup[0].store.push(this.$route.query.tenantID);
        this.selectBottomShow = false;
      }
    },
  },
  created: function () {
    if (this.isEdit) {
      // 判断用户是否为主体
      if (this.isMain) {
        this.delectButtom = true;
        this.saveIconShow = true;
      } else {
        this.saveIconShow = false;
      }
      this.addIconShow = false;
      this.navBarTitle = '编辑游戏币套餐';
      this.BackfillData();
    } else {
      this.thisTenantAdd();
    }
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.store-button-style {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  color: $color-primary;
}

.add-icon-style {
  width: 90%;
  height: 40px;
  background: $color-white;
  margin: 20px auto 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .van-icon-tianjia {
    font-size: $font-size-secondary;
    color: $color-primary;
  }
}

.package-delect-button {
  width: 100%;
  position: relative;
  top: 20px;
  margin-bottom: 40px;

  .van-button {
    border-radius: $border-radius;
    border: 1px solid $font-color-special;
    width: 90%;
    color: $font-color-special;
    margin: 0 auto;
    display: block;
  }
}

.addplayWrap {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .addplayContent {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    box-sizing: border-box;
    position: relative;
    top: 0;
    overflow: hidden;
    background-color: $color-bg-secondary;

    .van-icon-dizhi {
      line-height: 19px;
      color: $font-color-placeholder;
      font-size: $font-size-primary;
    }

    .currencyStyle {
      &:first-of-type {
        border-bottom: 1px solid $border-color;
      }
    }

    .van-panel {
      padding: 7px 15px;

      .van-panel__content {
        .van-field {
          padding: 0;
          margin-top: 10px;

          input {
            background-color: $color-bg-regular;
            padding: 10px;
            margin-bottom: 10px;
          }
        }
      }

      .van-row {
        .van-col--12 {
          font-size: $font-size-special;

          &:first-of-type {
            height: 33px;
            line-height: 33px;
          }

          &:last-of-type {
            text-align: right;
            margin-top: 5px;
          }

          .van-switch--on {
            background-color: $color-primary;
          }
        }
      }
    }

    .van-cell-group {
      border-bottom: 1px solid $border-color;

      .van-cell:not(:last-child)::after {
        content: none;
      }

      .van-cell {
        .van-cell__value {
          input {
            text-align: right;
          }
        }
      }
    }

    [class*="van-hairline"]::after {
      content: none;
    }
  }
}

.addplayWrapNavBar {
  background-color: $color-primary;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2000 !important;

  .van-icon {
    color: $color-white;
    font-size: $font-size-regular;
  }

  .van-icon-save {
    color: $color-white;
    font-size: 28px;
    line-height: 50px;
  }

  .van-nav-bar__title {
    color: $color-white;
  }

  .van-nav-bar__text {
    color: $color-white;
  }
}
</style>
