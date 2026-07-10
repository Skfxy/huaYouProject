// 话游 - 路由配置

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        title: "话游 - 主菜单",
      },
    },
    {
      path: "/game",
      name: "game",
      component: () => import("@/views/GameView.vue"),
      meta: {
        title: "话游 - 游戏中",
      },
    },
    {
      path: "/save",
      name: "save",
      component: () => import("@/views/SaveView.vue"),
      meta: {
        title: "话游 - 存档管理",
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
      meta: {
        title: "话游 - 设置",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || "话游 - 交互式叙事人生模拟";
  next();
});

export default router;
