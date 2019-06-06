<template>
  <popup
    v-model="localVisible"
    position="right"
    :class="$style.container">
    <div :class="$style.container">
      <form action="/">
        <search
          ref="searchBar"
          show-action
          v-model.trim="value"
          :placeholder="searchPlaceholder"
          @cancel="onCancel"
          @search="onSearch"
          @clear="$emit('clearSearch', value)"/>
      </form>
      <p :class="$style.history">
        <span>历史搜索</span>
        <van-icon
          name="close"
          @click="deleteHistory" />
      </p>
      <div :class="$style['history-value']">
        <span
          v-for="item in historyStrArr"
          :key="item"
          @click="clickHistoryItem(item)">{{ item }}</span>
      </div>
    </div>
  </popup>
</template>

<script>
import {
  Popup,
  Search,
} from 'vant';

export default {
  components: {
    Popup,
    Search,
  },

  props: {
    historyName: String,
    visible: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: '请输入搜索内容',
    },
  },

  data: () => ({
    value: '',
    historyStrArr: [],
  }),

  computed: {
    localVisible: {
      get () {
        return this.visible;
      },
      set (value) {
        this.$emit('update:visible', value);
      },
    },
  },

  watch: {
    localVisible (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(_ => {
          this.$refs.searchBar.$el.getElementsByClassName('van-field__control')[0].focus();
        });
        this.historyStrArr = JSON.parse(localStorage.getItem(this.historyName));
      } else {
        this.value = '';
      }
    },
  },

  methods: {
    onCancel () {
      this.localVisible = false;
      this.$emit('search', this.value);
    },
    deleteHistory () {
      localStorage.removeItem(this.historyName);
      this.historyStrArr = [];
    },
    clickHistoryItem (value) {
      this.$emit('historyValue', value);
    },
    onSearch () {
      this.$emit('search', this.value);
      this.localVisible = false;
      this.saveSearchKeyToLocalStorage();
    },

    saveSearchKeyToLocalStorage () {
      let historyArr = JSON.parse(localStorage.getItem(this.historyName)) || [];

      (!historyArr.includes(this.value) && this.value) && historyArr.push(this.value);

      localStorage.setItem(this.historyName, JSON.stringify(historyArr));
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .history-value {
    width: 100%;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;

    span {
      display: inline-block;
      padding: 8px 15px;
      margin: 0  0 10px 10px;
      background-color: $border-color-secondary;
      font-size: $font-size-special;
      color: $font-color-regular;
    }
  }

  .history {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    color: $font-color-regular;
  }

  .container {
    width: 100%;
    height: 100%;
    background-color: $border-color;
  }
</style>
