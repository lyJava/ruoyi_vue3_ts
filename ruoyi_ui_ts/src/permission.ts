import router from "./router";
import { ElMessage } from "element-plus";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, removeToken } from "@/utils/auth";
import { isHttp } from "@/utils/validate";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect", "/bind", "/register"];

router.beforeEach((to: any, from, next) => {
	NProgress.start();
	if (getToken()) {
		to.meta.title && useSettingsStore().setTitle(to.meta.title);
		if (to.path === "/login") {
			NProgress.done();
			next({ path: "/" });
		} else {
			if (useUserStore().roles.length === 0) {
				// 判断当前用户是否已拉取完user_info信息
				// prettier-ignore
				useUserStore().getInfo().then((resp: any) => {
                        // prettier-ignore
						 usePermissionStore().generateRoutes().then((accessRoutes: any) => {
							// roles权限生成可访问的路由表
                            accessRoutes.forEach((route: any) => {
                                if (!isHttp(route.path)) {
                                     // 动态添加可访问路由表
                                    router.addRoute(route);
                                }
                            });
                             // hack方法 确保addRoutes已完成
							next({ ...to, replace: true });
						});
					})
					.catch(err => {
						 /* useUserStore().logOut().then(() => {
							NProgress.done();
							ElMessage.error(err);
							next({ path: "/login" });
						}); */
						removeToken();
					});
			} else {
				next();
			}
		}
	} else {
		// 没有token
		if (whiteList.indexOf(to.path) !== -1) {
			// 在免登录白名单，直接进入
			next();
		} else {
			NProgress.done();
			next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
		}
	}
});

router.afterEach(() => {
	NProgress.done();
});
