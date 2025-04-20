import { createWebHistory, createRouter } from "vue-router";

/* Layout */
//export const Layout = () => import("@/layout/index.vue");
import { LAYOUT_CONFIG } from "@/utils/layout-utils";
/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
	{
		path: "/:pathMatch(.*)*", // 解决路由爆[Vue Router warn]: No match found for location with path
		hidden: true,
		// redirect: '/403', // 错误方式，刷新立马会导致进入守卫的页面
		component: () => import("@/views/error/404.vue"), // 切记不要使用 redirect: '/403',
	},
	{
		path: "/redirect",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		children: [
			{
				path: "/redirect/:path(.*)",
				component: () => import("@/views/redirect/index.vue"),
			},
		],
	},
	{
		path: "/login",
		component: () => import("@/views/login.vue"),
		hidden: true,
	},
	{
		path: "/register",
		component: () => import("@/views/register.vue"),
		hidden: true,
	},
	{
		path: "/404",
		component: () => import("@/views/error/404.vue"),
		hidden: true,
	},
	{
		path: "/401",
		component: () => import("@/views/error/401.vue"),
		hidden: true,
	},
	{
		path: "",
		component: LAYOUT_CONFIG.comment,
		redirect: "/index",
		children: [
			{
				path: "/index",
				component: () => import("@/views/index.vue"),
				name: "Index",
				meta: { title: "首页", icon: "dashboard", affix: true },
			},
		],
	},
	{
		path: "/user",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		redirect: "noredirect",
		children: [
			{
				path: "profile",
				component: () =>
					import("@/views/system/user/profile/index.vue"),
				name: "Profile",
				meta: { title: "个人中心", icon: "user" },
			},
		],
	},
];
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
	{
		path: "/system/user-auth",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		permissions: ["system:user:edit"],
		children: [
			{
				path: "role/:userId(\\d+)",
				component: () => import("@/views/system/user/authRole.vue"),
				name: "AuthRole",
				meta: { title: "分配角色", activeMenu: "/system/user" },
			},
		],
	},
	{
		path: "/system/role-auth",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		permissions: ["system:role:edit"],
		children: [
			{
				path: "user/:roleId(\\d+)",
				component: () => import("@/views/system/role/authUser.vue"),
				name: "AuthUser",
				meta: { title: "分配用户", activeMenu: "/system/role" },
			},
		],
	},
	{
		path: "/system/dict-data",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		permissions: ["system:dict:list"],
		children: [
			{
				path: "index/:dictId(\\d+)",
				component: () => import("@/views/system/dict/data.vue"),
				name: "Data",
				meta: { title: "字典数据", activeMenu: "/system/dict" },
			},
		],
	},
	{
		path: "/monitor/job-log",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		permissions: ["monitor:job:list"],
		children: [
			{
				path: "index",
				component: () => import("@/views/monitor/job/log.vue"),
				name: "JobLog",
				meta: { title: "调度日志", activeMenu: "/monitor/job" },
			},
		],
	},
	{
		path: "/tool/gen-edit",
		component: LAYOUT_CONFIG.comment,
		hidden: true,
		permissions: ["tool:gen:edit"],
		children: [
			{
				path: "index/:tableId(\\d+)",
				component: () => import("@/views/tool/gen/editTable.vue"),
				name: "GenEdit",
				meta: { title: "修改生成配置", activeMenu: "/tool/gen" },
			},
		],
	},
];

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
/* const originalPush = createRouter.prototype.push;
createRouter.prototype.push = function push(
	location: any,
	onResolve: any,
	onReject: any
) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch((err: any) => {
		console.log("路由异常", err);
	});
}; */

const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes,
	// 刷新时，滚动条位置还原
	//scrollBehavior: () => ({ left: 0, top: 0 }),
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0 };
		}
	},
});

export default router;
