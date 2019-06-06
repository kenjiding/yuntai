<template>
  <ych-page>
    <div :class="$style.wrap">
      <item
        v-for="item in list"
        :key="item.Phone"
        :info="(item.IsInterim ? '卡号：' : '手机号：') +  item.Phone"
        :title="item.IsInterim ? '会员卡' : item.NickName"
        :level-icon="item.Level"
        :icon-color="sexName(item.Sex).name === 'xingbienanxianxing' ? 'blue' : 'red'"
        :middle-icon="sexName(item.Sex).name"
        :left-img="item.Pic"
        right-text-color="#077AFF"
        :right-text="`第${item.Num}名`"
        >
      </item>
    </div>
  </ych-page>
</template>

<script>
import {Toast} from 'vant';
import item from './components/Item';
import ActivityRanking from '@/api/ActivityRanking';

export default {
  name: '',

  components: {
    item,
  },

  data () {
    return {
      list: [],
    };
  },
  created () {
    this.getData();
  },

  methods: {
    sexName (val) {
      let className = {
        Man: {name: 'xingbienanxianxing', bgcolor: '#077AFF'},
        Woman: {name: 'xingbienvxianxing', bgcolor: 'red'},
        Unknown: {name: '', bgcolor: ''},
      };
      return className[val];
    },
    getData () {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载...',
        mask: true,
      });
      ActivityRanking.getRankingSort({
        ID: this.$route.query.ID,
      }).then((res) => {
        this.list = res.Data;
        Toast.clear();
        if (this.list.length <= 0) {
          Toast('没有数据');
        }
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.wrap {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

</style>
