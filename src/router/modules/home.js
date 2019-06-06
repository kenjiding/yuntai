export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home-test/HomeTabs'),
    meta: {
      needKeepAlive: true,
    },
  },
  {
    path: '/home',
    name: 'home2',
    component: () => import('@/views/home-test/Index'),
  },
  {
    path: '/write-info',
    name: 'write-info',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home-test/WriteInfo'),
  },
];
