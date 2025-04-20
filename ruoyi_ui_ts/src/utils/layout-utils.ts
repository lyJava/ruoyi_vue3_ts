/**
 * 解决某些模块同时使用了静态引入与动态引入，造成打包无法使用独立chunk问题
 */
export const LAYOUT_CONFIG = {
	requiresAuth: true,
	comment: () => import("@/layout/index.vue"),
}
