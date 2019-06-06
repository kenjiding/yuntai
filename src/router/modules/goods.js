export default [
  {
    path: '/goods',
    name: 'goods',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Index'),
  },
  {
    path: '/goods-add',
    name: 'goods-add',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsAdd'),
    meta: { openJsSdk: true },
  },
  {
    path: '/goods-edit',
    name: 'goods-edit',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsAdd'),
    meta: { openJsSdk: true },
  },
  {
    path: '/goods-store-list',
    name: 'goods-store-list',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsStore'),
    alias: '/package-store-list',
  },
  {
    path: '/goods-store-select',
    name: 'goods-store-select',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsStoreSelect'),
  },
  {
    path: '/goods-batch',
    name: 'goods-batch',
    component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsBatch'),
  },
];
