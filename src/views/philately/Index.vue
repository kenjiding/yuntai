<template>
  <ych-page>
    <cell
      title="礼品图鉴"
      cell-type="switch"
      v-model="expandValue"
      @change="switchChange"/>

    <van-list
      v-model="loading"
      v-show="expandValue"
      :class="$style.list"
      :finished="finished"
      finished-text="没有更多了"
      @load="getData">
      <div
        v-for="item in imgList"
        :key="item.ID"
        :class="$style.item"
        @click="intoItem(item.ID)">
        <img :src="item.Pic" />
        <p>{{item.Name}}</p>
        <p><img src="../../assets/img/count.png" :class="$style.icon" />{{item.GiftCount}}</p>
      </div>
    </van-list>
    <bottomButton
      v-show="expandValue"
      text="新增图鉴"
      @confirm="add"/>
  </ych-page>
</template>

<script>
import cell from '@/components/Cell';
import { List, Toast } from 'vant';
import Atlas from '@/api/Atlas';
import bottomButton from './components/BottomButton';

export default {
  name: '',

  components: {
    cell,
    bottomButton,
    [List.name]: List,
  },

  data () {
    return {
      expandValue: true,
      imgList: [],
      loading: false,
      finished: false,
      pageIndex: 0,
    };
  },

  created () {
    // this.getData();
  },

  methods: {
    switchChange (val) {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '加载中。。。',
        mask: true,
      });
      Atlas.updateFlag({Flag: val}).then(() => {
        this.expandValue = val;
        this.pageIndex = 0;
        this.finished = false;
        this.loading = false;
        this.imgList = [];
        this.getData();

        Toast.clear();
      }, () => {
        this.expandValue = !val;
      });
    },
    intoItem (id) {
      this.$router.push({
        path: '/edit-philately',
        query: {
          ID: id,
        },
      });
    },
    add () {
      this.$router.push({
        path: '/add-philately',
      });
    },
    getData () {
      this.pageIndex++;
      this.loading = true;
      Atlas.atlasList({
        PageIndex: this.pageIndex,
        PageSize: 10,
      }).then((res) => {
        this.imgList = this.imgList.concat(res.DataList);

        this.expandValue = res.IsOpen;
        this.loading = false;

        if (this.imgList.length >= res.Total) {
          this.finished = true;
        }
      }, () => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang='scss' module>
@import "@/styles/them.scss";

.icon {
  width: 17px !important;
  height: 17px !important;
  vertical-align: top;
  margin-right: 5px;
}

.list {
  position: absolute;
  top: 45px;
  bottom: 55px;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.item {
  margin: 10px auto;
  width: 90%;
  height: 155px;
  position: relative;
  color: $color-white;

  img {
    width: 100%;
    height: 100%;
    border-radius: $border-radius;
  }

  p {
    position: relative;
    bottom: 50px;
    left: 15px;
    font-size: $font-size-primary;
    margin-bottom: 5px;
  }
}

</style>
