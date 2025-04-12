import { defineStore } from "pinia";
import { Router, RouteRecordRaw, useRouter } from "vue-router";

const useTagsViewStore = defineStore("tags-view", {
	state: () => ({
		//visitedViews: [] as Array<IVistView>,
		visitedViews: [] as any[],
		cachedViews: [] as any[],
	}),
	actions: {
		addView(view: any) {
			this.addVisitedView(view);
			this.addCachedView(view);
		},
		// prettier-ignore
		addVisitedView(view: { path: string; meta: { title: string; }; }) {
                if (this.visitedViews.some((v: { path: string; }) => v.path === view.path)) return
                this.visitedViews.push(
                    Object.assign({}, view, {
                        title: view.meta.title || 'no-name'
                    })
                )
            },
		addCachedView(view: any) {
			if (this.cachedViews.includes(view.name)) return;
			if (!view.meta.noCache) {
				this.cachedViews.push(view.name);
			}
		},
		delView(view: any) {
			return new Promise((resolve) => {
				this.delVisitedView(view);
				this.delCachedView(view);
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews],
				});
			});
		},
		delVisitedView(view: { path: string }) {
			return new Promise((resolve) => {
				for (const [i, v] of this.visitedViews.entries()) {
					if (v.path === view.path) {
						this.visitedViews.splice(i, 1);
						break;
					}
				}
				resolve([...this.visitedViews]);
			});
		},
		delCachedView(view: any) {
			return new Promise((resolve) => {
				const index = this.cachedViews.indexOf(view.name);
				index > -1 && this.cachedViews.splice(index, 1);
				resolve([...this.cachedViews]);
			});
		},
		delOthersViews(view: any) {
			return new Promise((resolve) => {
				this.delOthersVisitedViews(view);
				this.delOthersCachedViews(view);
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews],
				});
			});
		},
		delOthersVisitedViews(view: { path: string }) {
			return new Promise((resolve) => {
				this.visitedViews = this.visitedViews.filter((v) => {
					return v.meta.affix || v.path === view.path;
				});
				resolve([...this.visitedViews]);
			});
		},
		delOthersCachedViews(view: { name: string }) {
			return new Promise((resolve) => {
				const index = this.cachedViews.indexOf(view.name);
				if (index > -1) {
					this.cachedViews = this.cachedViews.slice(index, index + 1);
				} else {
					this.cachedViews = [];
				}
				resolve([...this.cachedViews]);
			});
		},
		delAllViews(view?: any) {
			return new Promise((resolve) => {
				this.delAllVisitedViews(view);
				this.delAllCachedViews(view);
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews],
				});
			});
		},
		delAllVisitedViews(view: any) {
			return new Promise((resolve) => {
				// prettier-ignore
				const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
				this.visitedViews = affixTags;
				resolve([...this.visitedViews]);
			});
		},
		delAllCachedViews(view: any) {
			return new Promise((resolve) => {
				this.cachedViews = [];
				resolve([...this.cachedViews]);
			});
		},
		updateVisitedView(view: { path: string }) {
			for (let v of this.visitedViews) {
				if (v.path === view.path) {
					v = Object.assign(v, view);
					break;
				}
			}
		},
		delRightTags(view: { path: string }) {
			return new Promise((resolve) => {
				// prettier-ignore
				const index = this.visitedViews.findIndex((v: { path: string }) => v.path === view.path);
				if (index === -1) {
					return;
				}
				this.visitedViews = this.visitedViews.filter((item, idx) => {
					if (idx <= index || (item.meta && item.meta.affix)) {
						return true;
					}
					const i = this.cachedViews.indexOf(item.name);
					if (i > -1) {
						this.cachedViews.splice(i, 1);
					}
					return false;
				});
				resolve([...this.visitedViews]);
			});
		},
		delLeftTags(view: { path: string }) {
			return new Promise((resolve) => {
				// prettier-ignore
				const index = this.visitedViews.findIndex((v: { path: string }) => v.path === view.path);
				if (index === -1) {
					return;
				}
				this.visitedViews = this.visitedViews.filter((item, idx) => {
					if (idx >= index || (item.meta && item.meta.affix)) {
						return true;
					}
					const i = this.cachedViews.indexOf(item.name);
					if (i > -1) {
						this.cachedViews.splice(i, 1);
					}
					return false;
				});
				resolve([...this.visitedViews]);
			});
		},
		/**
		 * 切换到指定标签页
		 * 
		 * @param pathOrName 当前路由path
		 * @param r 路由
		 */
		switchToTab(pathOrName: string, r: Router) {
			const routes = r.getRoutes();
			// 在已访问视图中查找匹配项
			const targetView = this.visitedViews.find(
				(view) => view.path === pathOrName || view.name === pathOrName
			);

			if (targetView) {
				// 如果标签已存在，直接跳转
				r.push(targetView.fullPath).catch(() => {});
				// 如果需要强制刷新页面可以加上：
				// proxy.$tab.refreshPage(targetView)
			} else {
				// 如果标签不存在，查找路由配置
				const targetRoute = findRouteByPathOrName(routes, pathOrName);

				if (targetRoute) {
					// 添加新标签并跳转
					useTagsViewStore().addView(targetRoute);
					r.push(targetRoute.path).catch(() => {});
				} else {
					console.warn(`未找到路径或名称为 ${pathOrName} 的路由`);
					// 可以添加默认跳转逻辑
					// router.push('/404')
				}
			}
		},
	},
});

/**
 * 递归查找路由
 * 
 * @param routes 路由数组
 * @param key 路由键
 * @returns 
 */
function findRouteByPathOrName(
	routes: RouteRecordRaw[],
	key: string
): RouteRecordRaw | undefined {
	for (const route of routes) {
		if (route.path === key || route.name === key) return route;
		if (route.children) {
			const found = findRouteByPathOrName(route.children, key);
			if (found) return found;
		}
	}
	return undefined;
};

export default useTagsViewStore;
