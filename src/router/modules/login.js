export default [
  {
    path: '/terms-service',
    name: 'terms-service',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/TermsService'),
  },
  {
    path: '/first-login',
    name: 'first-login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/FirstLogin'),
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/Index'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/Login'),
        meta: { requiresAuth: false },
      },
      {
        path: 'reset-pass-word',
        name: 'reset-pass-word',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/Reset'),
        meta: { requiresAuth: false },
      },
    ],
  },
];
