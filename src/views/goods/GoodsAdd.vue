<template>
  <ych-page>
    <div :class="$style['goods-add-cart']">
      <div
        :class="$style['content-wrap']">

        <van-cell
          title="商品类型"
          is-link
          :value="goodsTypeSelectItem.title"
          v-if="$route.query.isEdit === 'false'"
          @click="goodsTypeSelectShow = !goodsTypeSelectShow"
          :class="$style['goods-type-cell']" />

        <van-field
          :class="$style['first-van-field']"
          v-model="goodsAddFormData.name"
          :label="currentGoodsShow ? '商品名称' : '门票名称'"
          placeholder="请输入商品名称"
          required
          :disabled="!isMain"
        />
        <!-- 子账号编辑回填的节点 -->
        <div v-show="!isManagerShow">
          <van-field
            :class="$style['first-van-field']"
            v-model="goodsAddFormData.scanCode"
            label="商品条码"
            placeholder="请输入商品名称"
            :disabled="!isMain"
            v-show="currentGoodsShow"
          />
          <van-field
            :class="$style['first-van-field']"
            v-model="groupInfo.Name"
            label="商品分组"
            placeholder="请输入商品名称"
            required
            :disabled="!isMain"
          />
        </div>
        <!-- 子账号编辑商品回填的节点 -->

        <!-- 主账号新增、编辑商品的节点 -->
        <div v-show="isManagerShow">
          <van-cell
            title="商品条码"
            :class="$style.qrcode"
            v-show="currentGoodsShow">
            <div slot="right-icon" :class="$style['qrcode-right']">
              <van-field
                v-model="goodsAddFormData.scanCode"
                placeholder="请输入商品条形码"
              />
              <van-icon name="qr" @click.native="scanQrCode"/>
            </div>
          </van-cell>

          <van-cell
            :title="currentGoodsShow ? '商品分组' : '门票分组'"
            :value="groupInfo.Name"
            :class="$style['first-van-field']"
            is-link
            required
            @click.native="selectGroup"/>
        </div>

        <GameTicket
          v-show="!currentGoodsShow"
          @addItem="addGameTicketItem"
          :game-goods-detail="goodsAddFormData.GoodsDetail"
          :disabled="!isMain"/>

        <!-- 主账号新增、编辑商品的节点 -->
        <van-cell-group
          :class="$style['form-group-style']"
          v-if="currentGoodsShow">
          <cell
            title="商品图片"
            cell-type="uploader"
            v-model="goodsAddFormData.Key"
            :disabled="!isMain"/>

          <van-field
            v-model="goodsAddFormData.GoodsCost"
            label="商品成本"
            placeholder="请填写商品成本"
            type="number"
            required
            :max="100000"
            :disabled="!isMain"
            :class="$style['cell-margin']"
          />
        </van-cell-group>

        <van-field
          v-model="goodsAddFormData.price"
          :label="currentGoodsShow ? '商品售价' : '门票价格'"
          placeholder="请填写商品售价"
          type="number"
          required
          :max="100000"
          :disabled="!isMain"
          :class="$style['goods-type-cell']"
        />

        <van-panel>
          <van-row slot="header" :class="$style['close-button']">
            <van-col :span="12" :class="$style['close-button-item']"><span>兑换价格</span></van-col>
            <van-col :span="12" :class="$style['close-button-item']">
              <van-switch
                v-model="goodsAddFormData.Ispoints"
                size="26px"
                :disabled="!isMain"
                 />
            </van-col>
          </van-row>
          <van-field
            :class="$style.showInput"
            v-model="goodsAddFormData.points"
            v-show="goodsAddFormData.Ispoints"
            type="number"
            :precision="0"
            :disabled="!isMain"
            placeholder="请输入积分兑换价格"
            label="积分兑换" />

          <van-field
            :class="$style.showInput"
            v-model="goodsAddFormData.currency"
            v-show="goodsAddFormData.Ispoints"
            type="number"
            :precision="0"
            :disabled="!isMain"
            placeholder="请输入游戏币兑换价格"
            label="游戏币兑换" />
        </van-panel>

        <van-panel v-show="currentGoodsShow">
          <van-row slot="header" :class="$style['close-button']">
            <van-col :span="12" :class="$style['close-button-item']"><span>回收价值(积分)</span></van-col>
            <van-col :span="12" :class="$style['close-button-item']">
              <van-switch
                size="26px"
                v-model="goodsAddFormData.IsRetrievePoints"
                :disabled="!isMain"
                 />
            </van-col>
          </van-row>
          <van-field
            :class="$style.showInput"
            v-model="goodsAddFormData.retrievePoints"
            v-show="goodsAddFormData.IsRetrievePoints"
            type="number"
            :precision="0"
            :disabled="!isMain"
            placeholder="请输入回收积分" />
        </van-panel>

        <van-cell
          title="上架门店"
          :value="goodsAddFormData.storeGroup.length + '家'"
          is-link
          clickable
          :style="{marginTop: '10px'}"
          @click="popupShow = true">
        </van-cell>

      </div>
    </div>

    <!-- <van-button
      size="large"
      :class="$style['store-button-style']"
      v-show="buttonShow"
      @click.native="popupShow = true">设置上架门店</van-button> -->

    <van-popup
      v-model="popupShow"
      position="right"
      :overlay="false"
      :style="{width: '100%'}">
      <GoodsStoreSelect
        @changePopupShow="popupShow = false"
        @addPageHandler="addSelect"
        type="add"
        :popup-show="popupShow"
        :defaultSelect.sync="goodsAddFormData.storeGroup"></GoodsStoreSelect>
    </van-popup>

    <popup-select
      :popup-status="popupStatus"
      :popupHeight="40"
      :default-group="goodsAddFormData.groupID"
      @afterSelect="afterSelecItem"
      @popupStatusHandle="popupStatus = false"
      @deleteGroup="refleshData"
      titleText="请选择分组">
    </popup-select>

    <ych-dialog
      :value="dialogValue"
      @cancel=" dialogValue =false"
      :before-close="dialogConfirm"
      :title="dialogTitle">
      <div :class="$style['dialog-content']">
        <p>{{valueText}}</p>
        <van-field
          v-model="inputGoodsGroupName"
          :type="inputType"
          :error-message="errorMessage"/>
      </div>
    </ych-dialog>

    <van-popup v-model="goodsTypeSelectShow" position="top">
       <p
          v-for="li in typeOptions"
          :key="li.title"
          :class="{[$style['goods-type-active']]: goodsTypeActiveIndex === li.val,[$style['goods-type-item']]: true}"
          @click.stop="selectItemHandle(li)">{{li.title}}</p>
    </van-popup>

    <bottomButton
      :leftText="buttonText"
      rightText="保存"
      @leftClick="deleteItem"
      @rightClick="beforeSaveGoods" />
  </ych-page>
</template>

<script>
import { Popup, Panel, List, Toast } from 'vant';
import inlineLoading from './components/InlineLoading';
import popupSelect from './components/PopupSelect';
import GameTicket from './components/GameTicket';

import goodsListApi from '@/api/GoodsList';
import GoodsStoreSelect from '@/views/goods/GoodsStoreSelect';
import checkData from '@/views/packge/tool/checkFormData';
import wx from 'weixin-js-sdk';
import Cell from '@/components/Cell';
import bottomButton from '@/components/BottomButton';

export default {
  name: 'GoodsAddPage',

  data () {
    return {
      goodsAddFormData: {
        name: '',
        retrievePoints: '',
        points: '',
        currency: undefined,
        price: '',
        scanCode: '',
        storeGroup: [],
        groupID: '',
        GoodsCost: '',
        Ispoints: false,
        IsRetrievePoints: false,
        isBindGift: false,
        Key: '',
        GoodType: 'Goods',
        GoodsDetail: [{Detail: ''}],
      },
      typeOptions: [
        {
          title: '通用商品',
          val: 'Goods',
        },
        {
          title: '游乐门票',
          val: 'TicketGoods',
        },
      ],
      goodsTypeSelectItem: {
        title: '通用商品',
        val: 'Goods',
      },
      goodsTypeSelectShow: false,
      goodsTypeActiveIndex: 'Goods',
      groupInfo: {},
      inputGoodsGroupName: '',
      isActive: null,
      buttonStatus: false,
      dialogValue: false,
      popupStatus: false,
      popupShow: false,
      isManagerShow: true,
      buttonShow: true,
      dialogTitle: '',
      valueText: '',
      inputType: null,
      errorMessage: '',
      isBindDevice: '',
    };
  },
  components: {
    [Popup.name]: Popup,
    [Panel.name]: Panel,
    [List.name]: List,
    inlineLoading,
    popupSelect,
    GoodsStoreSelect,
    Cell,
    bottomButton,
    GameTicket,
  },

  computed: {
    currentGoodsShow () {
      return this.goodsAddFormData.GoodType === 'Goods';
    },
    isMain () {
      return this.$store.state.userInfo.IsMain || this.$store.getters.getIsAdmin;
    },
    buttonText () {
      if (this.$route.query.isEdit === 'true' && this.isMain) {
        return '删除';
      } else {
        return null;
      }
    },
  },

  methods: {
    refleshData () {
      if (this.$route.query.isEdit === 'true') {
      // 判断用户是否为主体
        if (this.isMain) {
          this.buttonStatus = true;
        } else {
          this.isManagerShow = false;
        }
        this.getGoodsById();
      } else {
        this.thisTenantAdd();
      }
    },
    selectItemHandle (data) {
      this.goodsTypeActiveIndex = data.val;
      this.goodsTypeSelectItem = data;
      this.goodsTypeSelectShow = false;
      this.changeGoodsType(data.val);
    },
    addGameTicketItem () {
      let gameList = this.goodsAddFormData.GoodsDetail;
      gameList.length < 20 && this.goodsAddFormData.GoodsDetail.push({Detail: ''});
    },
    changeGoodsType (val) {
      //重置表单数据
      this.goodsAddFormData = {
        name: '',
        retrievePoints: '',
        points: '',
        currency: undefined,
        price: '',
        scanCode: '',
        storeGroup: [],
        groupID: '',
        GoodsCost: '',
        Ispoints: false,
        IsRetrievePoints: false,
        isBindGift: false,
        Key: '',
        GoodType: 'CurrentGoods',
        GoodsDetail: [{Detail: ''}],
      };
      this.groupInfo = {};
      this.goodsAddFormData.GoodType = val;
    },
    scanQrCode () {
      let _this = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            //当扫描结果的字符串不全是数字组成的话。用逗号截取该结果，并且取后面的值。目的：为了避免出现以下形式的扫描结果：
            //CODE_128,1435636
            let result = res.resultStr.indexOf(',') > -1 ? res.resultStr.split(',')[1] : res.resultStr;
            _this.goodsAddFormData.scanCode = result;
          },
          fail: function (res) {
            //当扫描条形码出现错误后，弹出对话框手动输入条形码
            _this.dialogValue = true;
            _this.dialogTitle = '输入条形码';
            _this.valueText = '请输入条形码';
            _this.inputType = 'number';
          },
        });
      });
    },
    addSelect (val) {
      this.goodsAddFormData.storeGroup = val;
    },
    afterSelecItem (val) {
      this.goodsAddFormData.groupID = val.ID;
      this.groupInfo.Name = val.Name;
      this.groupInfo.ID = val.ID;
    },
    selectGroup () {
      this.popupStatus = true;
    },
    dialogConfirm (action, done) {
      if (action === 'cancel') {
        this.errorMessage = '';
        this.inputGoodsGroupName = '';
        return done();
      };

      if (this.inputGoodsGroupName === '') {
        this.errorMessage = '不能为空';
        return done(false);
      }

      if (this.dialogTitle === '添加分组') {
        goodsListApi.addGoodsGroup({groupName: this.inputGoodsGroupName}).then((res) => {
          this.dialogValue = false;
          this.inputGoodsGroupName = '';
          Toast('分组添加成功');
          done();
        }, _ => done());
      } else {
        //当扫描条形码出现错误后，弹出对话框手动输入条形码
        this.goodsAddFormData.scanCode = this.inputGoodsGroupName;
        this.dialogValue = false;
        this.inputGoodsGroupName = '';
        done();
      }
      this.errorMessage = '';
    },
    deleteTips () {
      this.$dialog.confirm({
        title: '提醒',
        showCancelButton: false,
        message: `该商品是设备《${this.isBindDevice}》的礼品，如需删除，请将商品从设备礼品中删除`,
        beforeClose: (action, done) => {
          done();
        },
      });
    },
    deleteItem () {
      this.$dialog.confirm({
        title: '提醒',
        message: '确定要删除此商品？',
        theme: 'danger',
      }).then(() => {
        if (this.goodsAddFormData.isBindGift) {
          this.deleteTips();
        } else {
          goodsListApi.deleteGoodsItem({ID: this.$route.query.goodsId}).then((res) => {
            this.$router.go(-1);
          });
        }
      }).catch(() => {});
    },
    checkDecimal (val) {
      return /^\d+\.?\d{0,2}$/.test(val);
    },
    checkValue () {
      if (!this.checkDecimal(this.goodsAddFormData.price)) {
        Toast('售卖价格最多只允许两位小数');
        return false;
      }

      if (this.goodsAddFormData.Ispoints) {
        if (!this.goodsAddFormData.points && !this.goodsAddFormData.currency) {
          Toast('积分价格与游戏币价格至少存在一个');
          return false;
        } else {
          if (this.goodsAddFormData.points && !/^\+?[1-9][0-9]*$/.test(this.goodsAddFormData.points)) {
            Toast('积分价格应为大于零的整数');
            return false;
          } else if (this.goodsAddFormData.currency && !/^\+?[1-9][0-9]*$/.test(this.goodsAddFormData.currency)) {
            Toast('游戏币价格应为大于零的整数');
            return false;
          }
        }
      } else {
        this.goodsAddFormData.points = '';
        this.goodsAddFormData.currency = 0;
        // if (this.goodsAddFormData.points !== '') {
        //   if (!/^\+?[1-9][0-9]*$/.test(this.goodsAddFormData.points)) {
        //     Toast('兑换积分应为大于零的整数');
        //     return false;
        //   }
        // }
      }

      if (this.goodsAddFormData.IsRetrievePoints) {
        if (this.goodsAddFormData.retrievePoints === '') {
          Toast('回收积分不能为空');
          return false;
        } else {
          if (!/^\+?[1-9][0-9]*$/.test(this.goodsAddFormData.retrievePoints)) {
            Toast('回收积分应为大于零的整数');
            return false;
          }
        }
      } else {
        this.goodsAddFormData.retrievePoints = '';
        // if (this.goodsAddFormData.retrievePoints !== '') {
        //   if (!/^\+?[1-9][0-9]*$/.test(this.goodsAddFormData.retrievePoints)) {
        //     Toast('回收积分应为大于零的整数');
        //     return false;
        //   }
        // }
      }

      return true;
    },
    beforeSaveGoods () {
      this.currentGoodsShow ? this.saveAddGoods() : this.saveGameTicket();
    },
    saveGameTicket () {
      let dataPass = checkData({
        data: this.goodsAddFormData,
        ignore: ['points', 'retrievePoints', 'storeGroup', 'currency', 'Key', 'scanCode', 'GoodsCost', 'GoodsDetail'],
        message: {
          name: '请填写商品名称',
          groupID: '请选择商品分组',
          price: '请填写商品价格',
        },
      });

      //判断游玩门票项目是否有不填写的情况
      let isEmpty = this.goodsAddFormData.GoodsDetail.findIndex(item => !item.Detail);
      if (isEmpty !== -1) {
        return Toast(`请填写项目${isEmpty + 1}名称`);
      }

      //编辑套餐，当用户是主体的时候，它没有去选择门店页面修改上架门店就直接按保存退出，就需要以下处理
      if (typeof this.goodsAddFormData.storeGroup[0] === 'object') {
        this.goodsAddFormData.storeGroup = this.goodsAddFormData.storeGroup.map((item) => {
          return item.id;
        });
      }

      //当表单检查为true 并且 禁止多次提交为true的时候。才可以完成提交操作
      if (dataPass) {
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        });

        if (this.$route.query.goodsId) {
          this.edit();
        } else {
          this.add();
        }
      }
    },

    saveAddGoods () {
      let dataPass = checkData({
        data: this.goodsAddFormData,
        ignore: ['points', 'retrievePoints', 'storeGroup', 'currency', 'Key', 'GoodsDetail', 'scanCode'],
        message: {
          name: '请填写商品名称',
          price: '请填写商品价格',
          groupID: '请选择商品分组',
        },
      });

      //编辑套餐，当用户是主体的时候，它没有去选择门店页面修改上架门店就直接按保存退出，就需要以下处理
      if (typeof this.goodsAddFormData.storeGroup[0] === 'object') {
        this.goodsAddFormData.storeGroup = this.goodsAddFormData.storeGroup.map((item) => {
          return item.id;
        });
      }

      //当回填商品信息时，如果此时Key为http资源地址，则证明商品图片没有被修改，
      //提交数据的时候应将Key变为空，避免后台错误的覆盖
      let imgKey = this.goodsAddFormData.Key;
      this.goodsAddFormData.Key = imgKey.includes('http') ? '' : imgKey;

      //当表单检查为true 并且 禁止多次提交为true的时候。才可以完成提交操作
      if (dataPass && this.checkValue()) {
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        });

        if (this.$route.query.goodsId) {
          this.edit();
        } else {
          this.add();
        }
      }
    },
    edit () {
      this.goodsAddFormData.goodsID = this.$route.query.goodsId;
      goodsListApi.editGoods(this.goodsAddFormData).then(res => {
        Toast.clear();
        Toast.success('编辑商品成功');
        setTimeout(() => {
          this.$router.back();
        });
      }, res => {
        Toast.clear();
      });
    },
    add () {
      goodsListApi.addGoods(this.goodsAddFormData).then(res => {
        Toast.clear();
        Toast.success('新增商品成功');

        // 判断是否期望返回创建的商品
        if (this.$route.query.needLinkBack) {
          this.$store.commit('setLinkBackData', {
            ID: res.ID,
            Name: this.goodsAddFormData.name,
          });
        }

        setTimeout(() => {
          this.$router.back();
        });
      }, res => {
        Toast.clear();
      });
    },
    getGoodsById () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载...',
        mask: true,
      });
      goodsListApi.getGoodsInfoById({ID: this.$route.query.goodsId}).then((res) => {
        this.goodsAddFormData.name = res.goodsName;
        this.goodsAddFormData.GoodsCost = res.GoodsCost;
        this.goodsAddFormData.price = res.price;
        this.goodsAddFormData.scanCode = res.scanCode;
        this.goodsAddFormData.Ispoints = res.Ispoints;
        this.goodsAddFormData.IsRetrievePoints = res.IsRetrievePoints;
        this.goodsAddFormData.storeGroup = res.storeGroup;
        this.goodsAddFormData.isBindGift = res.IsBindGift;

        this.goodsAddFormData.GoodType = res.GoodType;
        this.goodsAddFormData.GoodsDetail = res.GoodsDetail;

        this.goodsAddFormData.Key = res.ImgSrc;
        this.groupInfo = res.group;
        this.goodsAddFormData.groupID = res.group.ID;
        this.goodsAddFormData.retrievePoints = res.retrievePoints ? res.retrievePoints : '';
        this.goodsAddFormData.points = res.points ? res.points : '';
        this.goodsAddFormData.currency = res.currency ? res.currency : undefined;
        this.isBindDevice = res.BindDeviceNumberList[0];
        Toast.clear();
      });
    },
    thisTenantAdd () {
      //当选择完门店进入商品列表时，按添加商品操作，这时不能选择上架其他门店，默认在该门店上架
      if (this.$route.query.tenantID) {
        this.goodsAddFormData.storeGroup.push(this.$route.query.tenantID);
        this.buttonShow = false;
      }
    },
  },
  created: function () {
    this.refleshData();
  //   if (this.$route.query.isEdit === 'true') {
  //     // 判断用户是否为主体
  //     if (this.isMain) {
  //       this.buttonStatus = true;
  //     } else {
  //       this.isManagerShow = false;
  //     }
  //     this.getGoodsById();
  //   } else {
  //     this.thisTenantAdd();
  //   }
  },
};
</script>
<style lang='scss' module>
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.cell-margin {
  margin-top: 10px;
}

.goods-type-item {
  padding: 20px;
  text-align: center;
  font-size: $font-size-special;
  border-bottom: 1px solid $border-color;
}

.goods-type-cell {
  border-bottom: 1px solid $border-color;
}

.goods-type-active {
  color: $color-primary;
}

.qrcode {
  border-bottom: 1px solid $border-color;

  .van-cell__title {
    flex: 2;
  }

  &-right {
    flex: 6;
  }

  .van-field {
    width: 90%;
    float: left;
    padding: 0;
  }

  .van-icon-qr {
    color: $font-color-secondary;
    float: right;
    width: 25px;
    height: 25px;
    text-align: right;
    line-height: 20px;
    font-size: $font-size-secondary;
  }
}

.dialog-content {
  width: 75%;
  margin: 0 auto 30px;

  p {
    padding: 20px 0 15px;
    color: $font-color-regular;
  }

  .van-cell {
    border-radius: $border-radius-small;
    padding: 0;

    input {
      background-color: $color-bg-regular;
      height: 50px;
    }
  }
}

.goods-add-cart {
  background-color: $color-bg-regular;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;

  .content-wrap {
    width: 100%;
    padding: 0 0 100px;
    overflow: hidden;

    .first-van-field {
      border-bottom: 1px solid $border-color;
    }

    .van-cell:not(:last-child)::after {
      content: none;
    }

    .van-cell {
      .van-cell__value {
        input {
          color: $font-color-regular;
          text-align: right;
        }
      }
    }

    .van-panel {
      padding: 7px 15px;
      border-bottom: 1px solid $border-color;

      .van-panel__content {
        .showInput {
          padding: 0;
          margin-top: 10px;

          .van-cell__title {
            line-height: 40px;
            min-width: 50px !important;
            width: 50px;
          }

          input {
            background-color: $color-bg-regular;
            padding: 10px;
          }
        }
      }

      .close-button {
        .van-switch--on {
          background-color: $color-primary;
        }

        .close-button-item {
          font-size: $font-size-special;

          &:first-of-type {
            height: 33px;
            line-height: 33px;
          }

          &:last-of-type {
            text-align: right;
            margin-top: 5px;
          }
        }
      }
    }

    .form-group-style {
      background-color: $color-bg-regular;

      .van-field {
        border-bottom: 1px solid $border-color;
      }
    }

    .van-row {
      .van-col--12 {
        font-size: $font-size-special;
      }
    }

    [class*="van-hairline"]::after {
      content: none;
    }
  }

  .cash-wrap-navbar {
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
}
</style>
