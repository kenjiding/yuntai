export default [
  {
    path: '/member',
    name: 'member',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/Index'),
    meta: {
      title: '会员管理',
      openJsSdk: true,
    },
  }, {
    path: '/member-info',
    name: 'member-info',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/MemberInfo'),
    meta: {
      title: '会员管理',
    },
  }, {
    path: '/level-manager',
    name: 'level-manager',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/LevelManager'),
    meta: {
      title: '会员管理',
    },
  }, {
    path: '/level-setting',
    name: 'level-setting',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/LevelSetting'),
    meta: {
      title: '会员管理',
    },
  }, {
    path: '/member-acount',
    name: 'member-acount',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/MemberAcount'),
    meta: {
      title: '会员管理',
      openJsSdk: true,
    },
  },
  {
    path: '/member-probability',
    name: 'member-probability',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/MemberProbability'),
  },
  {
    path: '/member-probability-list',
    name: 'member-probability-list',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/MemberProbabilityList'),
  },

  {
    path: '/member-currenceLog',
    name: 'member-currenceLog',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/CurrenceLog'),
  },
  {
    path: '/member-integralLog',
    name: 'member-integralLog',
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/IntegralLog'),
  },
];
