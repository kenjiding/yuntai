<template>
  <ych-page>
    <div :class="$style['container']">
      <div :class="$style['page-wrap']" v-if="currentActive === 0">
        <div :class="$style['preview-page-container']" :style="{ backgroundColor: themeData.themeColor }" >
          <img src="@/assets/img/mini_pro_nav_dark.png" :class="$style['page-nav']" v-if="customMiniProPreviewThemeData.textColor === '黑色'">
          <img src="@/assets/img/mini_pro_nav_light.png" :class="$style['page-nav']" v-else>

          <div :class="$style['page-bg-wrap']" :style="{ backgroundImage: `url('${themeData.mainImg}')`, backgroundSize: 'cover', backgroundPosition: 'top' }">
            <div :class="$style['page-content']">
              <div :class="$style['info-wrap']" :style="{ color: themeData.textColor }">
                <img src="@/assets/img/mini_pro_head.png" :class="$style['head']"/>
                <div :class="$style['info']">
                  <div :class="$style['title']">芸苔测试账号</div>
                  <img src="@/assets/img/V2.png" :class="$style['level']"/>
                </div>
                <div :class="$style['store-wrap']">
                  <img :src="themeData.rechargeImg" :class="$style['recharge-button']" v-if="themeData.rechargeImg"/>
                  <img src="@/assets/img/recharge_button_bg.png" :class="$style['recharge-button']" v-else/>
                  <div :class="$style['store']">
                    <div :class="$style['value']">888</div>
                    <img :src="themeData.balanceImg" :class="$style['recharge-balance']" v-if="themeData.balanceImg"/>
                    <img src="@/assets/img/recharge_balance.png" :class="$style['recharge-balance']" v-else/>
                  </div>
                </div>
              </div>

              <div :class="$style['qr-wrap']">
                <img src="https://user-gold-cdn.xitu.io/2019/3/19/16994f4670a15c69?w=165&h=165&f=png&s=1801" :class="$style['qr']"/>
              </div>
            </div>

            <div :class="$style['page-bottom-nav']">
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 0">
                <img :src="themeData.indexIcon" :class="$style['icon']" v-if="themeData.indexIcon"/>
                <img src="@/assets/img/home_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']" :style="{ color: themeData.themeColor }">{{themeData.indexIconName}}</div>
              </div>
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 2">
                <img :src="themeData.picIcon" :class="$style['icon']" v-if="themeData.picIcon"/>
                <img src="@/assets/img/atlas_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']">{{themeData.picIconName}}</div>
              </div>
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 1">
                <img :src="themeData.personIcon" :class="$style['icon']" v-if="themeData.personIcon"/>
                <img src="@/assets/img/person_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']">{{themeData.personIconName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="$style['page-wrap']" v-if="currentActive === 2">
        <div :class="$style['preview-page-container']">
          <img src="@/assets/img/mini_pro_nav_dark.png" :class="$style['page-nav']" v-if="customMiniProPreviewThemeData.textColor === '黑色'"  :style="{ backgroundColor: themeData.themeColor }">
          <img src="@/assets/img/mini_pro_nav_light.png" :class="$style['page-nav']" v-else  :style="{ backgroundColor: themeData.themeColor }">

          <div :class="$style['page-bg-wrap']" :style="{ backgroundColor: '#ffffff' }" >
            <div :class="$style['page-content']" >
              <div :class="$style['atlas-wrap']">
                <img src="@/assets/img/atlas_black.png" :class="$style['img']"/>
              </div>
            </div>

            <div :class="$style['page-bottom-nav']">
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 0">
                <img :src="themeData.indexIcon" :class="$style['icon']" v-if="themeData.indexIcon"/>
                <img src="@/assets/img/home_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']">{{themeData.indexIconName}}</div>
              </div>
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 2">
                <img :src="themeData.picIcon" :class="$style['icon']" v-if="themeData.picIcon"/>
                <img src="@/assets/img/atlas_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']" :style="{ color: themeData.themeColor }">{{themeData.picIconName}}</div>
              </div>
              <div :class="$style['page-bottom-nav-item']" @click="currentActive = 1">
                <img :src="themeData.personIcon" :class="$style['icon']" v-if="themeData.personIcon"/>
                <img src="@/assets/img/person_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']">{{themeData.personIconName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="$style['page-wrap']" v-if="currentActive === 1">
        <div :class="$style['preview-page-container']" :style="{ backgroundColor: '#ffffff' }">
          <img src="@/assets/img/mini_pro_nav_dark.png" :class="$style['page-nav']" v-if="customMiniProPreviewThemeData.textColor === '黑色'" :style="{ backgroundColor: themeData.themeColor }">
          <img src="@/assets/img/mini_pro_nav_light.png" :class="$style['page-nav']" v-else :style="{ backgroundColor: themeData.themeColor }">

          <div :class="$style['page-content']" :style="{ color: themeData.textColor, backgroundImage: `url('${themeData.cardImg}')`, backgroundSize: 'cover', backgroundPosition: 'top', backgroundColor: themeData.themeColor }">
            <div :class="$style['person-wrap']">
              <img src="@/assets/img/mini_pro_head.png" :class="$style['head']"/>
              <div :class="$style['info']">
                <div :class="$style['title']">芸苔测试账号</div>
                <div :class="$style['subtitle']">13163635656</div>
              </div>
              <div :class="[$style['person-center'], themeData.textColor === '#ffffff' ? $style['light'] : $style['dark']]" :style="{ color: themeData.themeColor }">
                会员<br>中心
              </div>
            </div>

            <div :class="$style['person-store-wrap']">
              <div :class="$style['store-item']">
                <div :class="$style['value']">88</div>
                <div :class="$style['title']">积分</div>
              </div>

              <div :class="$style['store-item']">
                <div :class="$style['value']">88</div>
                <div :class="$style['title']">余币</div>
              </div>

              <div :class="$style['store-item']">
                <div :class="$style['value']">88</div>
                <div :class="$style['title']">礼品</div>
              </div>

              <div :class="$style['store-item']">
                <div :class="$style['value']">88</div>
                <div :class="$style['title']">会员卡</div>
              </div>

              <div :class="$style['store-item']">
                <div :class="$style['value']">88</div>
                <div :class="$style['title']">券</div>
              </div>
            </div>

            <div :style="{ height: '60px' }"></div>
            <div :class="$style['activity-wrap']"></div>
          </div>

          <div :class="$style['page-bottom-nav']">
            <div :class="$style['page-bottom-nav-item']" @click="currentActive = 0">
              <img :src="themeData.indexIcon" :class="$style['icon']" v-if="themeData.indexIcon"/>
              <img src="@/assets/img/home_icon.png" :class="$style['icon']" v-else/>
              <div :class="$style['text']">{{themeData.indexIconName}}</div>
            </div>
            <div :class="$style['page-bottom-nav-item']" @click="currentActive = 2">
                <img :src="themeData.picIcon" :class="$style['icon']" v-if="themeData.picIcon"/>
                <img src="@/assets/img/atlas_icon.png" :class="$style['icon']" v-else/>
                <div :class="$style['text']">{{themeData.picIconName}}</div>
              </div>
            <div :class="$style['page-bottom-nav-item']" @click="currentActive = 1">
              <img :src="themeData.personIcon" :class="$style['icon']" v-if="themeData.personIcon"/>
              <img src="@/assets/img/person_icon.png" :class="$style['icon']" v-else/>
              <div :class="$style['text']" :style="{ color: themeData.themeColor }">{{themeData.personIconName}}</div>
            </div>
          </div>
        </div>
      </div>

      <div :class="$style['button-wrap']">
        <van-button type="primary" :class="$style['confirm-button']" @click="$router.back()" :style="{ marginRight: '10px' }">
          返回修改
        </van-button>

        <van-button type="primary" :class="$style['confirm-button']" @click="saveStyle">
          保存
        </van-button>
      </div>
    </div>
  </ych-page>
</template>

<script>
// 750 * 1334
import { Toast } from 'vant';
import Tenant from '@/api/Tenant';

export default {
  data: () => ({
    currentActive: 0,
    themeData: {
      indexIconName: '',
      picIconName: '',
      personIconName: '',
      rechargeImg: null,
      balanceImg: null,
      indexIcon: null,
      picIcon: null,
      personIcon: null,
      mainImg: 'http://updater.rapa.vip/mobile_index/miniyunyou_cdc.png?',
      cardImg: null,
      textColor: '#ffffff',
      themeColor: '#ee3131',
    },
    customMiniProPreviewThemeData: {},
  }),

  created () {
    let customMiniProPreviewThemeData = this.$store.state.customMiniProPreviewThemeData;

    for (let key in this.themeData) {
      if (customMiniProPreviewThemeData[key]) {
        if (key === 'textColor') {
          this.themeData[key] = customMiniProPreviewThemeData[key] === '黑色' ? '#000000' : '#ffffff';
        } else {
          this.themeData[key] = customMiniProPreviewThemeData[key];
        }
      }
    }
    this.customMiniProPreviewThemeData = customMiniProPreviewThemeData;
  },

  methods: {
    saveStyle () {
      let params = JSON.parse(this.customMiniProPreviewThemeData.saveParams);
      if (!params) {
        Toast('数据已经丢失，请返回重新尝试预览保存');
        return;
      }

      //处理提交的表单数据
      params.IndexIconName = this.customMiniProPreviewThemeData.indexIconName;
      params.PicIconName = this.customMiniProPreviewThemeData.picIconName;
      params.PersonIconName = this.customMiniProPreviewThemeData.personIconName;
      delete params.AtlasText;
      delete params.IndexText;
      delete params.MyText;

      Toast.loading({
        message: '保存中...',
        duration: 0,
        mask: true,
      });

      Tenant.saveStyle(params).then(res => {
        Toast.success('保存成功');
        this.$router.go(-2);
        setTimeout(() => {
          Toast.success('保存成功');
        });
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
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

.page-wrap {
  flex: 1;
}

.preview-page-container {
  width: 300px;
  height: 533.6px;
  background-color: $color-danger;
  margin: 0 auto;
  margin-top: 15px;
  display: flex;
  flex-direction: column;

  .page-nav {
    width: 100%;
    height: auto;
  }

  .page-bg-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    flex: 1;

    .atlas-wrap {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;

      .img {
        width: 100%;
      }
    }

    .info-wrap {
      display: flex;
      flex-direction: row;
      font-size: 12.8px;
      padding: 0 20px;
      padding-top: 14px;

      .head {
        width: 44px;
        height: 44px;
      }

      .info {
        flex: 1;
        height: 44px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;

        .level {
          width: 35.2px;
          height: 12.8px;
          margin-top: 4px;
        }
      }

      .store-wrap {
        .recharge-button {
          width: 80px;
          height: 26.4px;
        }

        .store {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          margin-top: 4px;

          .value {
            margin-right: 4px;
            font-size: 16px;
          }
        }

        .recharge-balance {
          width: 20px;
          height: 20px;
        }
      }
    }

    .qr-wrap {
      position: relative;
      width: 300px;
      height: 335px;
      display: flex;
      justify-content: center;
      padding-top: 95px;
      box-sizing: border-box;

      .default-bg {
        width: 300px;
        height: 300px;
        position: absolute;
        top: 0;
      }

      .qr {
        position: relative;
        z-index: 5;
        width: 120px;
        height: 120px;
        border-radius: 4px; // stylelint-disable
      }

      .qr-tip {
        position: absolute;
        bottom: 8px;
        font-size: 11.2px;
      }
    }

    .person-wrap {
      display: flex;
      flex-direction: row;
      font-size: 12.8px;
      padding: 0 20px;
      padding-top: 14px;

      .head {
        width: 44px;
        height: 44px;
      }

      .info {
        flex: 1;
        height: 44px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        font-size: 12.8px;

        .subtitle {
          margin-top: 4px;
          font-size: 11.2px;
        }
      }

      .person-center {
        width: 45.6px;
        height: 35.4px;
        font-size: 8px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 6px;
        box-sizing: border-box;
        position: relative;
        margin-top: 10px;

        &.dark {
          background: url('@/assets/img/person_center_bg_grey.png') no-repeat;
          background-size: 100% 100%;
        }

        &.light {
          background: url('@/assets/img/person_center_bg.png') no-repeat;
          background-size: 100% 100%;
        }

        &.dark::after {
          color: transparent;
          overflow: hidden;
          position: absolute;
          width: 1px;
          height: 25px;
          top: -25px;
          background-color: #b2b2b2;
        }

        &.light::after {
          color: transparent;
          overflow: hidden;
          position: absolute;
          width: 1px;
          height: 25px;
          top: -25px;
          background-color: #ffffff;
        }
      }
    }

    .person-store-wrap {
      background: url('@/assets/img/user_store_bg.png') no-repeat;
      background-size: 90% 100%;
      background-position: center;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 20px 12px;

      .store-item {
        height: 56px;
        width: 92px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
          font-size: 9.6px;
        }

        .value {
          font-size: 14.4px;
          margin-bottom: 4px;
        }
      }
    }

    .activity-wrap {
      background-color: #fff;
      height: 192px;
      margin-top: -40px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
  }

  .page-bottom-nav {
    width: 100%;
    height: 58.4px;
    background-color: $color-white;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    box-shadow: 0px -1px 1px 0px #ebebeb;

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon {
        width: 20px;
        height: 20px;
        margin-bottom: 4px;
      }

      .text {
        font-size: 10px;
        color: #666;
      }
    }
  }
}
</style>
