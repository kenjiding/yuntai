<template>
  <ych-page>
    <div :class="$style['content']">
      <cell-group no-padding :class="$style['cell-group']">
        <cell
          title="主题色"
          cell-type="input"
          placeholder="6位十六进制RGB色值，包含#号"
          v-model="miniProStyle.ThemeColor" />

        <cell
          ref="textColorActionSheet"
          title="文本色"
          cell-type="select"
          :actions="getActions()"
          :value="miniProStyle.TextColor"/>

        <cell
          title="主界面背景图"
          subtitle="建议大小：750*1334px"
          cell-type="uploader"
          :can-remove="true"
          :on-uploaded="onMainImgUploaded"
          v-model="miniProStyle.MainBg"/>

        <cell
          title="我的界面背景图"
          subtitle="建议大小：750*590px"
          cell-type="uploader"
          :can-remove="true"
          :on-uploaded="onCardImgUploaded"
          v-model="miniProStyle.CardBg"/>

        <div :class="$style['cell-item-custom']">
          <div :class="$style['title-wrap']">
            <div :class="$style['title']">充值区图标</div>
            <div :class="$style['subtitle']">建议大小: 200*70px / 50*50px</div>
          </div>
          <div :class="$style['uploader-container']">
            <div :class="[$style['uploader-item'], $style['recharge-item']]">
              <div :class="$style['updater-close']" v-if="rechargeImg" @click="() => removeUploadedImg('rechargeImg')">
                &times;
              </div>
              <ych-uploader
                :after-read="(file, key) => uploadSuccess(file, key, 'rechargeImg')"
                :max-size="204800000"
                :class="$style['uploader-wrap']"
                uploadType="public">
                <img :src="rechargeImg" v-if="rechargeImg" :class="$style['uploader-image']"/>
                <div v-else :class="$style['uploader-placeholder']">
                  <van-icon name='tianjia' size="18px" color="#E0E0E0" />
                </div>
              </ych-uploader>
              <div :class="$style['uploader-title']">充值按钮</div>
            </div>

            <div :class="[$style['uploader-item'], $style['balance-item']]">
              <div :class="$style['updater-close']" v-if="balanceImg" @click="() => removeUploadedImg('balanceImg')">
                &times;
              </div>
              <ych-uploader
                :after-read="(file, key) => uploadSuccess(file, key, 'balanceImg')"
                :max-size="204800000"
                :class="$style['uploader-wrap']"
                uploadType="public">
                <img :src="balanceImg" v-if="balanceImg" :class="$style['uploader-image']"/>
                <div v-else :class="$style['uploader-placeholder']">
                  <van-icon name='tianjia' size="18px" color="#E0E0E0" />
                </div>
              </ych-uploader>
              <div :class="$style['uploader-title']">余额图标</div>
            </div>
          </div>
        </div>

        <div :class="$style['cell-item-custom']">
          <div :class="$style['title-wrap']">
            <div :class="$style['title']">菜单栏图标</div>
            <div :class="$style['subtitle']">建议大小: 60*60px</div>
          </div>
          <div :class="$style['uploader-container']">
            <div :class="[$style['uploader-item'], $style['balance-item']]">
              <div :class="$style['updater-close']" v-if="indexIcon" @click="() => removeUploadedImg('indexIcon')">
                &times;
              </div>
              <ych-uploader
                :after-read="(file, key) => uploadSuccess(file, key, 'indexIcon')"
                :max-size="204800000"
                :class="$style['uploader-wrap']"
                uploadType="public">
                <img :src="indexIcon" v-if="indexIcon" :class="$style['uploader-image']"/>
                <div v-else :class="$style['uploader-placeholder']">
                  <van-icon name='tianjia' size="18px" color="#E0E0E0" />
                </div>
              </ych-uploader>
              <div
                @click="changTabName('indexIcon')"
                :class="[$style['uploader-title'],$style['uploader-title_tab']]">{{indexIconName}}</div>
            </div>

            <div :class="[$style['uploader-item'], $style['balance-item']]">
              <div :class="$style['updater-close']" v-if="picIcon" @click="() => removeUploadedImg('picIcon')">
                &times;
              </div>
              <ych-uploader
                :after-read="(file, key) => uploadSuccess(file, key, 'picIcon')"
                :max-size="204800000"
                :class="$style['uploader-wrap']"
                uploadType="public">
                <img :src="picIcon" v-if="picIcon" :class="$style['uploader-image']"/>
                <div v-else :class="$style['uploader-placeholder']">
                  <van-icon name='tianjia' size="18px" color="#E0E0E0" />
                </div>
              </ych-uploader>
              <div
                @click="changTabName('picIcon')"
                :class="[$style['uploader-title'],$style['uploader-title_tab']]">{{picIconName}}</div>
            </div>

            <div :class="[$style['uploader-item'], $style['balance-item']]">
              <div :class="$style['updater-close']" v-if="personIcon" @click="() => removeUploadedImg('personIcon')">
                &times;
              </div>
              <ych-uploader
                :after-read="(file, key) => uploadSuccess(file, key, 'personIcon')"
                :max-size="204800000"
                :class="$style['uploader-wrap']"
                uploadType="public">
                <img :src="personIcon" v-if="personIcon" :class="$style['uploader-image']"/>
                <div v-else :class="$style['uploader-placeholder']">
                  <van-icon name='tianjia' size="18px" color="#E0E0E0" />
                </div>
              </ych-uploader>
              <div
                @click="changTabName('personIcon')"
                :class="[$style['uploader-title'],$style['uploader-title_tab']]">{{personIconName}}</div>
            </div>
          </div>
        </div>
      </cell-group>

      <div :class="$style['button-wrap']">
        <van-button type="primary" :class="$style['confirm-button']" @click="preview" :style="{ marginRight: '10px' }">
          预览
        </van-button>

        <van-button type="primary" :class="$style['confirm-button']" @click="saveStyle">
          保存
        </van-button>
      </div>
    </div>

    <van-dialog
      v-model="showDialog"
      :title="dialogInfo.text"
      show-cancel-button
      :class="$style['editor']"
      :before-close="beforeConfirm">
      <div :class="$style['editor-input']">
        <input
          v-model="cacheName"
          @blur="clickScrollHandler"
          :placeholder="`请输入${dialogInfo.text}名称`"/>
      </div>
    </van-dialog>
  </ych-page>
</template>

<script>
import { Toast } from 'vant';
import CellGroup from '@/components/CellGroup';
import Cell from '@/components/Cell';
import Tenant from '@/api/Tenant';

export default {
  components: {
    CellGroup,
    Cell,
  },

  data: () => ({
    rechargeImg: '', // 充值按钮图标
    balanceImg: '', // 余额图标
    indexIcon: '', // 首页图标
    indexIconName: '首页',
    picIcon: '', // 图鉴图标
    picIconName: '图鉴', // 图鉴名称
    personIcon: '', // 我的图标
    personIconName: '我的', // 我的名称
    mainImg: '',
    cardImg: '',
    miniProStyle: {
      MainBg: '',
      CardBg: '',
      TextColor: '',
      ThemeColor: '',
    },
    showDialog: false,
    dialogInfo: {
      type: '',
      text: '',
    },
    cacheName: '',
  }),

  beforeRouteEnter (to, from, next) {
    if (from.name === 'person-info' || from.name === null) {
      to.meta.refreshData = true;
    } else {
      to.meta.refreshData = false;
    }

    next();
  },

  activated () {
    if (this.$route.meta.refreshData) {
      this.getMiniProStyle();
    }
  },

  watch: {
    showDialog (val) {
      if (val) return;
      document.getElementsByClassName('van-modal')[0].removeEventListener('touchstart', this.clickScrollHandler);
    },
  },

  methods: {
    clickScrollHandler () {
      document.body.scrollTop = document.body.scrollHeight;
    },
    changTabName (type) {
      this.cacheName = '';
      let nameObj = {
        indexIcon: this.indexIconName,
        picIcon: this.picIconName,
        personIcon: this.personIconName,
      };
      this.showDialog = true;
      this.dialogInfo = {
        type: type,
        text: nameObj[type],
      };
      document.getElementsByClassName('van-modal')[0].addEventListener('touchstart', this.clickScrollHandler);
    },
    beforeConfirm (action, done) {
      if (action === 'confirm') {
        if (!this.cacheName) {
          Toast(`${this.dialogInfo.text}名称不能为空`);
          done(false);
        } else if (!/^[\u4e00-\u9fa5]+$/gi.test(this.cacheName)) {
          Toast(`${this.dialogInfo.text}名称只能为汉字`);
          done(false);
        } else if (this.cacheName.length > 3) {
          Toast(`${this.dialogInfo.text}名称不能多于3个字符`);
          done(false);
        } else {
          this[this.dialogInfo.type + 'Name'] = this.cacheName;
          done();
        }
      } else {
        done();
      }
    },
    preview () {
      if (this.miniProStyle.ThemeColor) {
        let reg = /^#[0-9A-Fa-f]{6}$/;
        if (!reg.test(this.miniProStyle.ThemeColor)) {
          Toast('请输入正确的主体色值');
          return;
        }
      }

      let params = JSON.parse(JSON.stringify(this.miniProStyle));
      for (let key in params) {
        if (params[key] && params[key].startsWith('http')) {
          params[key] = params[key].substring(params[key].lastIndexOf('/') + 1);
        }
      }

      if (params.TextColor) {
        if (params.TextColor === '白色') {
          params.TextColor = '#ffffff';
        } else {
          params.TextColor = '#000000';
        }
      }

      this.$store.commit('changeCustomMiniProPreviewThemeData', {
        rechargeImg: this.rechargeImg,
        balanceImg: this.balanceImg,
        indexIcon: this.indexIcon,
        picIcon: this.picIcon,
        personIcon: this.personIcon,
        mainImg: this.mainImg,
        cardImg: this.cardImg,
        textColor: this.miniProStyle.TextColor,
        themeColor: this.miniProStyle.ThemeColor,
        saveParams: JSON.stringify(params),

        indexIconName: this.indexIconName,
        picIconName: this.picIconName,
        personIconName: this.personIconName,
      });

      this.$router.push({
        path: '/mini-pro-preview',
      });
    },

    saveStyle () {
      if (this.miniProStyle.ThemeColor) {
        let reg = /^#[0-9A-Fa-f]{6}$/;
        if (!reg.test(this.miniProStyle.ThemeColor)) {
          Toast('请输入正确的主体色值');
        }
      }

      Toast.loading({
        message: '保存中...',
        duration: 0,
        mask: true,
      });

      let params = JSON.parse(JSON.stringify(this.miniProStyle));
      for (let key in params) {
        if (params[key] && params[key].startsWith('http')) {
          params[key] = params[key].substring(params[key].lastIndexOf('/') + 1);
        }
      }

      if (params.TextColor) {
        if (params.TextColor === '白色') {
          params.TextColor = '#ffffff';
        } else {
          params.TextColor = '#000000';
        }
      }

      params.IndexIconName = this.indexIconName;
      params.PicIconName = this.picIconName;
      params.PersonIconName = this.personIconName;
      delete params.AtlasText;
      delete params.IndexText;
      delete params.MyText;

      console.log(params, 'params');

      Tenant.saveStyle(params).then(res => {
        Toast.success('保存成功');
        this.$router.back();
        setTimeout(() => {
          Toast.success('保存成功');
        });
      });
    },

    onMainImgUploaded (file) {
      this.mainImg = file.content;
    },

    onCardImgUploaded (file) {
      this.cardImg = file.content;
    },

    getMiniProStyle () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });

      Tenant.getStyle().then(res => {
        Toast.clear();
        this.miniProStyle = res;

        if (this.miniProStyle.TextColor) {
          if (this.miniProStyle.TextColor === '#ffffff') {
            this.miniProStyle.TextColor = '白色';
          } else {
            this.miniProStyle.TextColor = '黑色';
          }
        }

        let localFieldName = {
          'rechargeImg': 'RechargeBg',
          'balanceImg': 'BalanceBg',
          'indexIcon': 'IndexBg',
          'picIcon': 'AtlasBg',
          'personIcon': 'MyBg',
          'mainImg': 'MainBg',
          'cardImg': 'CardBg',
          'indexIconName': 'IndexText',
          'picIconName': 'AtlasText',
          'personIconName': 'MyText',
        };

        for (let localName in localFieldName) {
          this[localName] = res[localFieldName[localName]];
        }
      });
    },

    uploadSuccess (file, key, fieldName) {
      this[fieldName] = file.content;

      let realFieldName = {
        'rechargeImg': 'RechargeBg',
        'balanceImg': 'BalanceBg',
        'indexIcon': 'IndexBg',
        'picIcon': 'AtlasBg',
        'personIcon': 'MyBg',
      }[fieldName];

      this.miniProStyle[realFieldName] = key;
    },

    onTextColorChange (item) {
      this.$refs.textColorActionSheet.close();
      this.miniProStyle.TextColor = item.name;
    },

    getActions () {
      let _this = this;
      return [{
        name: '白色',
        subname: '#ffffff',
        callback: _this.onTextColorChange,
      }, {
        name: '黑色',
        subname: '#000000',
        callback: _this.onTextColorChange,
      }];
    },

    removeUploadedImg (fieldName) {
      let realFieldName = {
        'rechargeImg': 'RechargeBg',
        'balanceImg': 'BalanceBg',
        'indexIcon': 'IndexBg',
        'picIcon': 'AtlasBg',
        'personIcon': 'MyBg',
      }[fieldName];

      this.miniProStyle[realFieldName] = null;
      this[fieldName] = null;
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.editor {
  &-input {
    height: 40px;
    width: 80%;
    border: 1px solid $color-primary;
    margin: 25px auto;
    margin-bottom: 35px;
    border-radius: $border-radius-small;

    input {
      outline: none;
      border: none;
      border-radius: $border-radius-small;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 16px;
      font-size: 14px;
      text-align: center;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;

  .cell-group {
    flex: 1;
    overflow-y: auto;
  }
}

.button-wrap {
  width: 100%;
  display: flex;
  padding: 10px 16px;
  box-sizing: border-box;
}

.confirm-button {
  flex: 1;
}

.cell-item-custom {
  background-color: $color-white;
  padding: 16px;
  height: 95px;

  .title-wrap {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    .title {
      font-size: 14px;
      color: $font-color-primary;
    }

    .subtitle {
      font-size: 12px;
      color: $font-color-secondary;
      margin-left: 5px;
    }
  }

  .uploader-container {
    display: flex;
    margin-top: 10px;

    .uploader-item {
      text-align: center;
      margin-right: 30px;
      position: relative;
    }

    .uploader-wrap {
      width: 100%;
      height: 100%;
    }

    .uploader-image {
      height: 50px;
      border-radius: $border-radius-small;
      box-sizing: border-box;
    }

    .uploader-placeholder {
      width: 100%;
      height: 100%;
      border: 1px dashed #b3b3b3; // stylelint-disable
      border-radius: $border-radius-small;
      line-height: 50px;
      box-sizing: border-box;
      text-align: center;
    }

    .uploader-title {
      color: $font-color-secondary;
      margin-top: 8px;
      font-size: 12px;
    }

    .uploader-title_tab {
      background-color: $border-color;
      padding: 5px 0;
      border-radius: $border-radius-small;
    }

    .updater-close {
      position: absolute;
      z-index: 5;
      right: -5px;
      top: -5px;
      width: 15px;
      height: 15px;
      line-height: 15px;
      display: flex;
      justify-content: center;
      background-color: $color-danger;
      border-radius: $border-radius-circle;
      color: $color-white;
      font-size: 12px;
    }

    .balance-item {
      width: 50px;
      height: 50px;

      .uploader-image {
        width: 50px;
      }
    }

    .recharge-item {
      width: 100px;
      height: 50px;

      .uploader-image {
        width: 100px;
      }
    }
  }
}
</style>
