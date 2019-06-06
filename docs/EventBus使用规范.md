# Event Bus 使用方式 与 规范

Event Bus不再会注册全局属性，为了避免使用不规范，导致各种问题。若要使用，需要遵循以下步骤 与 规范：

- event命名
  > 为了避免事件命名冲突问题，要先在`/src/events/constants/events-name.js`下定义事件名称常量（全部大写，以下划线分割）

      // 商品详情刷新
      export const GOODS_DETAIL_REFRESH = 'GOODS_DETAIL_REFRESH';


- 新建事件JS文件

  在`/src/events/`目录下新建，命名规范`以模块名开头，全部小写，用中划线分割`

      import initEvent from './event-base';
      import { GOODS_DETAIL_REFRESH } from './constants/events-name';

      export default initEvent(GOODS_DETAIL_REFRESH);

- 使用方式
  > 注意：在组件使用Event Bus 监听时，组件销毁（beforeDestroy）前必须取消事件监听

      import refreshEvent from '@/events/goods-detail-refresh';

      export default {
        created () {
          // 监听事件
          refreshEvent.on((arg1, arg2) => {
            console.log(arg1, arg2);
          });
        },

        beforeDestroy () {
          // 取消事件监听
          refreshEvent.off();
        },

        methods: {
          open () {
            // 事件分发
            refreshEvent.emit('参数1', '参数2');
          }
        }
      }
