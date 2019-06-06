<template>
  <ych-page>
    <page-header
      slot="header"
      title="意见反馈"
      left-arrow
      @click-left="$router.go(-1)">
    </page-header>
    <div :class="$style['person-info-wrap']">
      <p :class="$style.iconText">
        <van-icon name="fankui" />
        <span>请输入您遇到的问题</span>
      </p>
      <van-cell-group>
        <van-field
          v-model="text"
          type="textarea"
          placeholder="请输入留言"
          maxlength="800"
          @input="checkMessage"
        />
      </van-cell-group>
      <van-button
        :class="{[$style['login-button']]: true ,[$style['button-text']]: colorText }"
        size="large"
        :disabled="buttonStatus"
        @click="postText">提交</van-button>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import PersonApi from '@/api/Person';
import { Toast } from 'vant';

export default {
  name: '',
  data () {
    return {
      text: '',
      buttonStatus: true,
      colorText: false,
      stopSubmit: true,
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    checkMessage () {
      let checkTarget = this.text;
      checkTarget = checkTarget.trim();
      if (checkTarget.length > 0) {
        this.buttonStatus = false;
        this.colorText = true;
      } else {
        this.buttonStatus = true;
        this.colorText = false;
      }
    },
    returnPersonCenter () {
      Toast.clear();
      Toast.success('提交成功');
      setTimeout(() => {
        this.$router.go(-1);
      }, 1000);
    },
    postText () {
      if (this.text) {
        Toast.loading({
          mask: true,
          message: '加载中...',
          duration: 0,
        });
        PersonApi.postFeedBack({text: this.text}).then((res) => {
          this.returnPersonCenter();
        });
      }
    },
  },

  mounted: function () {},

  computed: {},
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.button-text {
  color: $color-primary;
}

.login-button {
  position: fixed;
  left: 0;
  bottom: 0;
}

.person-info-wrap {
  height: 90%;
  padding: 20px;
  background-color: $color-bg-secondary;

  .van-field {
    textarea {
      height: 250px !important;
    }
  }
}

.iconText {
  position: relative;
  padding: 0 12px 20px;
  font-size: $font-size-primary;
  color: $font-color-placeholder;

  span {
    margin-left: 10px;
  }

  .van-icon-edit {
    color: $font-color-placeholder;
  }
}
</style>
