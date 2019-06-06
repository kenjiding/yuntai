import Vue from 'vue';
import Router from 'vue-router';
import modulesRoutes from './modules';

import routerGuards from './router-guards';

Vue.use(Router);

let routes = [
  ...modulesRoutes,
  {
    path: '*', //其他页面，强制跳转到登录页面
    redirect: '/',
  },
];

// 生产环境下不添加Icon页
if (process.env.NODE_ENV !== 'production') {
  routes.push({
    path: '/icon',
    name: 'icon',
    component: () => import('@/components/IconExample'),
    meta: { requiresAuth: false },
  });
}

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes,
});

routerGuards(router);

export default router;
