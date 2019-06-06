<template>
  <ych-page>
    <div :class="$style['group']" :style="{borderBottom: '1px solid #ebebeb',}">
      <div :class="$style['header']">
        <div :class="$style['info']">
          <div :class="$style['title']">品牌Logo</div>
        </div>

        <ych-uploader
          :after-read="onRead"
          :max-size="204800000"
          @oversize="overSizeHandler"
          :class="$style['uploader']"
          :disabled="!isMain">
          <img :src="imgSrc" :class="$style['uploader-image']"  v-if="iconIsShow"/>
          <van-icon name="yuntaixinlingshoulogo" :class="$style['uploader-placeholder']" v-else />
        </ych-uploader>
      </div>
    </div>

    <div :class="$style['group']">
      <div :class="$style['tile']" @click="changeName('name')">
        <div :class="$style['tile-name']">品牌名称</div>
        <div :class="$style['tile-value']">{{ tenantFormData.UserName ? tenantFormData.UserName : '请填写品牌名称' }}</div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>

      <div :class="$style['tile']" @click="changeName('coin')">
        <div :class="$style['tile-name']">游戏币名称</div>
        <div :class="$style['tile-value']">{{ coinName ? coinName : '请填写游戏币名称' }}</div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>

       <div :class="$style['tile']" @click="goToInfoPage" :style="{margin: '10px 0'}">
        <div :class="$style['tile-name']">认证资料</div>
        <div :class="$style['tile-value']">
          <span :class="$style['tile-tip-text']">{{ statusText }}</span>
        </div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>
    </div>

    <div :class="$style['group']">
      <div :class="$style['tile']" @click="goToMiniProPage">
        <div :class="$style['tile-name']">绑定小程序</div>
        <div :class="$style['tile-value']">
          {{ miniProName || '未绑定' }}
        </div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>

       <div :class="$style['tile']" @click="goToPhoneBind" v-if="isMain">
        <div :class="$style['tile-name']">获取手机号</div>
        <div :class="$style['tile-value']">
          {{ phoneBind ? '开' : '关' }}
        </div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>

      <div :class="$style['tile']" @click="goToMiniProSetting" v-if="miniProName">
        <div :class="$style['tile-name']">小程序风格设置</div>
        <div :class="$style['tile-value']">
        </div>
        <div :class="$style['tile-icon']">
          <van-icon name="xiangyou" />
        </div>
      </div>
    </div>

    <!-- <div :class="[$style['group'], $style['disabled']]">
      <div :class="[$style['tile'], $style['disabled']]">
        <div :class="$style['tile-name']">主体账号</div>
        <div :class="$style['tile-value']">{{ phone }}</div>
      </div>

       <div :class="[$style['tile'], $style['disabled']]">
        <div :class="$style['tile-name']">账号ID</div>
        <div :class="$style['tile-value']">{{ id }}</div>
      </div>
    </div> -->

    <van-dialog
      v-model="showEditor"
      title="品牌名称更改"
      show-cancel-button
      :class="$style['editor']"
      :before-close="beforeClose">
      <div :class="$style['editor-input']">
        <input
          v-model="cacheUserName"
          placeholder="请输入品牌名称"/>
      </div>
    </van-dialog>

    <van-dialog
      v-model="showEditorCoinName"
      title="游戏币名称更改"
      show-cancel-button
      :class="$style['editor']"
      :before-close="beforeConfirm">
      <div :class="$style['editor-input']">
        <input
          v-model="cacheCoinName"
          placeholder="请输入游戏币名称"/>
      </div>
    </van-dialog>

    <van-button type="primary" :class="$style['change-button']" @click="$router.push('/change-tenant')">
      切换主体 / 退出登录
    </van-button>
  </ych-page>
</template>

<script>
import PersonApi from '@/api/Person';
import { Toast } from 'vant';

export default {
  data: () => ({
    stopSubmit: true,
    tenantFormData: {
      UserName: '',
      Key: '',
    },
    cacheUserName: '',
    cacheCoinName: '',
    coinName: '',
    statusText: '',
    id: '',
    phone: '',
    writeStatus: '',
    imgSrc: '',
    checkMoney: false,
    checkMoneyIsEdit: '',
    showEditor: false,
    isMain: false,
    showEditorCoinName: false,
    miniProName: '',
    miniProImg: '',
    phoneBind: true,
  }),

  computed: {
    iconIsShow () {
      return !!this.imgSrc;
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin;
    },
  },

  watch: {
    showEditor (val) {
      if (!val) return;
      this.cacheUserName = this.tenantFormData.UserName;
    },
    showEditorCoinName (val) {
      if (!val) return;
      this.cacheCoinName = this.coinName;
    },
  },

  created () {
    this.fillBackData();
  },

  mounted () {
    this.isMain = sessionStorage.getItem('isMain') === 'true' || this.isAdmin;
  },

  methods: {
    changeName (type) {
      if (type === 'name') {
        if (this.isMain) this.showEditor = true;
      } else if (type === 'coin') {
        if (this.isMain) this.showEditorCoinName = true;
      }
    },
    goToPhoneBind () {
      this.$router.push({
        path: '/weapp-phone-bind',
        query: {
          isBind: this.phoneBind,
        },
      });
    },
    overSizeHandler () {
      Toast('图片大小超过限制');
    },

    onRead (file, key) {
      // this.imgSrc = res.Url;file
      this.imgSrc = file.content;
      this.tenantFormData.Key = key;

      // 替换头像立即保存
      this.postPersonInfo();
    },

    goToMiniProPage () {
      this.$router.push({
        path: '/mini-pro-info',
        query: {
          name: this.miniProName,
          qr: this.miniProImg,
        },
      });
    },

    goToMiniProSetting () {
      if (!this.isMain) return;
      if (!this.miniProName) {
        Toast('商户未绑定小程序');
        return;
      }

      this.$router.push({
        path: '/mini-pro-setting',
      });
    },

    goToInfoPage () {
      if (!this.isMain) return;
      if (this.statusText === '验证审核金额中') return;

      if (this.checkMoney) {
        this.$router.push({
          path: '/validate-money',
          query: {
            isEdit: this.checkMoneyIsEdit,
          },
        });
      } else {
        this.$router.push({
          path: '/identity',
          query: {isFillBack: this.writeStatus},
        });
      }
    },

    checkDataStatus (type) {
      switch (type) {
      case 'Pass':
        this.statusText = '资料审核已通过';
        this.checkMoney = true;
        this.checkMoneyIsEdit = 'false';
        break;
      case 'ValidateMoney':
        this.statusText = '验证审核金额中';
        this.checkMoney = true;
        this.checkMoneyIsEdit = 'true';
        break;
      case 'Complete':
        this.statusText = '验证审核已通过';
        this.writeStatus = 'true';
        break;
      case 'Submit':
        this.statusText = '资料正在审核中';
        this.writeStatus = 'true';
        break;
      case 'WaitAudit':
        this.statusText = '资料正在审核中';
        this.writeStatus = 'true';
        break;
      case 'ManagerNone':
        this.statusText = '未提交审核';
        this.writeStatus = 'true';
        break;
      case 'NotPass':
        this.statusText = '审核不通过';
        this.writeStatus = 'true';
        break;
      case 'ValidateMoneyNotPass':
        this.statusText = '验证审核金不通过';
        this.checkMoney = true;
        this.checkMoneyIsEdit = 'true';
        break;
      case 'None':
        this.statusText = '未提交审核';
        this.writeStatus = 'false';
        break;
      }
    },

    fillBackData () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      PersonApi.getMainUserInfo().then((res) => {
        this.tenantFormData.UserName = res.userName;
        this.imgSrc = res.imgSrc;
        this.id = res.Number;
        this.phone = res.phoneNum;
        this.coinName = res.coinName;
        this.miniProName = res.MiniProName;
        this.miniProImg = res.MiniProQrImg;
        this.phoneBind = res.PhoneBind;
        this.checkDataStatus(res.AuditStatus);
        Toast.clear();
      });
    },

    checkValue () {
      if (this.tenantFormData.UserName === '') {
        Toast('主体名称不能为空');
        return false;
      }
      return true;
    },

    postPersonInfo (done) {
      if (this.stopSubmit && this.checkValue()) {
        this.stopSubmit = false;
        PersonApi.editPersonInfo({
          Key: this.tenantFormData.Key,
          UserName: this.cacheUserName,
        }).then((res) => {
          Toast.success('保存成功');
          if (this.cacheUserName) {
            this.tenantFormData.UserName = this.cacheUserName;
          }
          this.stopSubmit = true;
          done && done();
        }, () => {
          this.stopSubmit = true;
          done && done(false);
        });
      }
    },

    beforeConfirm (action, done) {
      if (action === 'confirm') {
        if (!this.cacheCoinName) {
          Toast('游戏币名称不能为空');
          done(false);
        } else if (this.cacheCoinName.length > 3) {
          Toast('游戏币名称不能超过三个字符');
          done(false);
        } else {
          PersonApi.editGameCoinName({
            GameCoinName: this.cacheCoinName,
          }).then(() => {
            this.coinName = this.cacheCoinName;
            done();
          }, () => {
            done(false);
          });
        }
      } else {
        done();
      }
    },

    beforeClose (action, done) {
      if (action === 'confirm') {
        if (!this.cacheUserName) {
          Toast('主体名称不能为空');
          done(false);
        } else {
          this.postPersonInfo(done);
        }
      } else {
        done();
      }
    },
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.change-button {
  margin-left: 5%;
  width: 90%;
  position: absolute;
  bottom: 16px;
}

.editor {
  &-input {
    height: 40px;
    width: 100%;
    border: 1px solid $color-primary;
    margin: 25px 0;
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

.van-dialog {
  .van-dialog__header {
    color: $font-color-primary !important;
  }

  .van-dialog__content {
    padding: 0 32px;
    border-bottom: 1px solid #F5F5F5; // stylelint-disable
  }
}

.group {
  width: 100%;
  box-sizing: border-box;

  &:nth-child(1) {
    padding: 0 16px;
    background-color: $color-white;
  }

  &.disabled {
    background-color: #ebebeb;
  }

  .header {
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .uploader {
      &-image {
        width: 55px;
        height: 55px;
      }

      &-placeholder {
        font-size: 30px;
        color: $color-primary;
      }
    }

    .info {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        color: $font-color-primary;
        font-size: 16px;
      }

      .subtitle {
        color: $font-color-secondary;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }

  .tile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 45px;
    padding: 0 16px;
    background-color: $color-white;
    border-bottom: 1px solid $border-color;

    &-value {
      flex: 1;
      text-align: right;
      color: $font-color-secondary;
    }

    &-icon {
      color: $font-color-secondary;
      margin-left: 5px;
    }

    &-tip-text {
      color: #ed4041;
    }
  }
}
</style>
