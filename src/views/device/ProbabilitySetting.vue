<template>
  <ych-page>
     <page-header
      slot="header"
      left-arrow
      title="概率设置"
      @click-left="$router.go(-1)"
      @click-right="judgeProbabilityTempValue">
      <van-icon
        name="save"
        slot="right"/>
     </page-header>
      <div :class="$style.wrap">
        <p :class="$style.iconText">基础设置</p>
        <van-cell-group>
          <van-field
            v-model="formData.giftProbability"
            label="出礼品概率"
            type="number"
            precition="2"
            value-type="precentage"
          >
            <span slot="button">%</span>
          </van-field>

          <van-field
            v-model="formData.huxian"
            label="下弧线长度"
            placeholder="2"
          >
            <span slot="button">秒</span>
          </van-field>
          <van-field
            v-model="formData.gaodu"
            label="抓起高度"
            placeholder="随机"
          />
        </van-cell-group>
        <p :class="$style.iconText">抓力设置</p>
        <van-cell-group>
          <van-field
            v-model="formData.zhuali"
            label="抓取抓力"
            placeholder="36"
          >
            <span slot="button">v</span>
          </van-field>
          <van-field
            v-model="formData.daoding"
            label="到顶抓力"
            placeholder="24"
          >
            <span slot="button">v</span>
          </van-field>
          <van-field
            v-model="formData.yidong"
            label="移动抓力"
            placeholder="18"
          >
            <span slot="button">v</span>
          </van-field>
          <van-field
            v-model="formData.songda"
            label="送达抓力"
            placeholder="48"
          >
            <span slot="button">v</span>
          </van-field>
        </van-cell-group>
        <p :class="$style.iconText">电机移动速度设置</p>
        <van-cell-group>
          <van-field
            v-model="formData.qianhou"
            label="前后电机速度"
            placeholder="5"
          />
          <van-field
            v-model="formData.zuoyou"
            label="左右电机速度"
            placeholder="5"
          />
          <van-field
            v-model="formData.shangxia"
            label="上下电机速度"
            placeholder="5"
          />
        </van-cell-group>
      </div>
  </ych-page>
</template>

<script>
import { Toast } from 'vant';
import PageHeader from '@/components/PageHeader';
import Device from '@/api/Device';

export default {
  name: '',

  data () {
    return {
      formData: {
        giftProbability: null,
        huxian: '',
        gaodu: '',
        zhuali: '',
        daoding: '',
        yidong: '',
        songda: '',
        qianhou: '',
        zuoyou: '',
        shangxia: '',
      },
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0,
      });
      this.$store.commit('changeTest', this.formData);

      Device.setProbability({
        ID: this.$route.query.ID,
        Probability: this.formData.giftProbability,
      }).then(() => {
        this.$router.back();
        Toast.clear();
      });
    },
    judgeProbabilityTempValue () {
      if (this.formData.giftProbability !== '') {
        if (this.formData.giftProbability < 0 || this.formData.giftProbability > 1) {
          Toast('概率应为大于0 - 100之间');
          return;
        }
      }
      if (!this.formData.giftProbability) {
        Toast('概率不能为空，负数或者0');
        return;
      }

      this.save();
    },
  },
  created () {
    this.formData.giftProbability = this.$route.query.Probability;
    this.formData.huxian = this.$store.state.testData.huxian;
    this.formData.gaodu = this.$store.state.testData.gaodu;
    this.formData.zhuali = this.$store.state.testData.zhuali;
    this.formData.daoding = this.$store.state.testData.daoding;
    this.formData.yidong = this.$store.state.testData.yidong;
    this.formData.songda = this.$store.state.testData.songda;
    this.formData.qianhou = this.$store.state.testData.qianhou;
    this.formData.zuoyou = this.$store.state.testData.zuoyou;
    this.formData.shangxia = this.$store.state.testData.shangxia;
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 46px;
  bottom: 0;

  input {
    text-align: right;
    color: $font-color-secondary;
  }

  .van-field__button {
    padding-left: 3px;
    color: $font-color-secondary;
  }
}

.iconText {
  position: relative;
  padding: 10px 15px;
  font-size: $font-size-special;
  font-weight: 550;
  color: $font-color-placeholder;
}
</style>
