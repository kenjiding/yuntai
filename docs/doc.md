-  技术栈
    - Vue全家桶(Vue、Vuex、VueRouter)
    - 脚手架：vue-cli 3.0
    - UI： Vant(按需引入)
    - ES6语法（API看情况再定）
    - 样式预处理：SCSS 
    - 代码约束： ESLint (standard)
    - Ajax库： axios
    - mock： NEI
    - 包管理器： Yarn(推荐) / NPM 
    - 其它： JSX
    
- vant组件按需引入
    > 在项目较小的情况下，大部分组件不会用到，并且vant业务组件较多，如果全部引入会导致打包后的依赖包过大

    
```
<template>
  <address-list
    v-model="chosenAddressId"
    :list="list"
    @add="onAdd"
    @edit="onEdit"
  />
</template>

<script>
import { AddressList } from 'vant';

export default {
  components: {
    AddressList
  },
  
  ...
}
```

    

- CSS Module
    > 为了避免SPA的样式冲突问题


```
<template>
    ...
    <div :class="$style.test">
      For guide and recipes on how to configure / customize this project,check out thesdfasdfsdfvue-cli documentation.
    </div>
    ...
</template>

....

<style lang="scss" module>
.test {
  line-height: 1.2;
}
</style>

```

- 移动适配方案 — vw
    > 不用`flexible.js(rem)`的原因，flexibles是模拟vw的适配方案，并且存在较多问题，它的诞生与存在也是因为vw的兼容问题。

    在实际业务开发上，我们会根据UI设计稿(375px / 750px)进行样式布局，使用单位px,

    - 相关文章：
        - [使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)
        - [分享手淘过年项目中采用到的前端技术](https://www.w3cplus.com/css/taobao-2018-year.html)
        - [再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)
        - [如何在Vue项目中使用vw实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)
        
- 项目已有SCSS Mixins
    - one-px-border —— 1像素边框
    - ellipsis —— 单行或多行文本省略

- 开发注意点
    - 复杂组件/页 的拆分
    - UI上的临界点处理
    - 对代码要有追求，不要写面条式代码