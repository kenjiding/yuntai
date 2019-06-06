const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function buildIconExample () {
  const iconPath = path.join(__dirname, '../src/styles/font/demo_fontclass.html');
  const iconOutputPath = path.join(__dirname, '../src/components/IconExample.vue');
  let fileContent = `<!--
  此示例代码文件为自动生成 ===> build-files/build-icon-example
  请执行 yarn build:icon 生成此文件
-->
<template>
  <ych-page>
    <ul class="icon_lists">
      <li
        v-for="item in icon"
        :key="item.className">
        <van-icon :name="item.className"/>
        <div class="name">{{ item.name }}</div>
        <div class="fontclass">{{ item.className }}</div>
      </li>
    </ul>
  </ych-page>
</template>

<script type="text/javascript">
export default {
  name: 'Icon',
  data () {
    return {
      {replacedContent}
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/them.scss';

.icon_lists {
  width: 100% !important;
}

.icon_lists li {
  float: left;
  width: 33vw;
  height: 180px;
  text-align: center;
  list-style: none !important;
}

.icon_lists .van-icon {
  font-size: 42px;
  line-height: 100px;
  margin: 10px 0;
  color: $color-black;
}

</style>
`;

  fs.readFile(iconPath, (err, data) => {
    if (err) {
      throw err;
    }

    const $ = cheerio.load(data.toString(), {decodeEntities: false});
    let iconData = `icon: [`;
    $('ul').first().find('li').each((index, dom) => {
      let className = $(dom).find('.fontclass').html().trim();
      iconData += `
        {
          name: '${$(dom).find('.name').first().html()}',
          className: '${className.substring(10)}',
        },`;
    });
    iconData += '\n      ],';

    fileContent = fileContent.replace('{replacedContent}', iconData);

    fs.writeFileSync(iconOutputPath, fileContent);
  });
}

buildIconExample();
