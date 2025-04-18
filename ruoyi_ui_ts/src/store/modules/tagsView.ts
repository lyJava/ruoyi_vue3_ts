import { defineStore } from "pinia";
import {
	LocationQuery,
	RouteLocationNormalizedLoaded,
	RouteRecordName,
	RouteRecordRaw,
	useRouter,
} from "vue-router";

interface RouteMeta {
	title?: string;
	affix?: boolean;
	noCache?: boolean;
	[key: string]: unknown;
}

export interface VisitedView {
	path: string;
	name?: string | symbol;
	meta: RouteMeta;
	title?: string;
	fullPath?: string;
	query?: LocationQuery;
}

type RouteIdentifier = string | symbol;

const useTagsViewStore = defineStore("tags-view", {
	state: () => ({
		visitedViews: [] as VisitedView[],
		cachedViews: [] as string[],
	}),
	actions: {
		addView(view: RouteLocationNormalizedLoaded) {
			this.addVisitedView(view);
			this.addCachedView(view);
		},
		// prettier-ignore
		addVisitedView(view: RouteLocationNormalizedLoaded) {
			const exists = this.visitedViews.some(v => v.path === view.path);
			if (exists) {
				return;
			}
			const newView: VisitedView = {
				path: view.path,
				name: view.name as string,
				meta: { ...view.meta },
				title: view.meta.title?.toString() || 'no-name',
				fullPath: view.fullPath,
			};

			this.visitedViews.push(newView);
		},
		/**
		 * 添加缓存视图
		 *
		 * @param view 视图
		 * @returns
		 */
		addCachedView(view: RouteLocationNormalizedLoaded) {
			const name = getSafeRouteName(view.name);
			if (!name || this.cachedViews.includes(name)) return;
			if (!view.meta.noCache) {
				this.cachedViews.push(name);
			}
		},
		/**
		 * 删除视图
		 *
		 * @param view
		 * @returns
		 */
		async delView(view: VisitedView) {
			await this.delVisitedView(view);
			await this.delCachedView(view);
			return this.getCurrentViews();
		},
		/**
		 * 删除访问记录
		 *
		 * @param view
		 * @returns
		 */
		async delVisitedView(view: VisitedView) {
			this.visitedViews = this.visitedViews.filter(
				(v) => v.path !== view.path
			);
			return this.visitedViews;
		},
		async delCachedView(view: VisitedView) {
			const name = view.name?.toString();
			if (!name) return this.cachedViews;
			this.cachedViews = this.cachedViews.filter((n) => n !== name);
			return this.cachedViews;
		},
		async delOthersViews(view: VisitedView) {
			await this.delOthersVisitedViews(view);
			await this.delOthersCachedViews(view);
			return this.getCurrentViews();
		},
		async delOthersVisitedViews(view: { path: string }) {
			this.visitedViews = this.visitedViews.filter((v) => {
				return v.meta.affix || v.path === view.path;
			});
			return this.visitedViews;
		},
		async delOthersCachedViews(view: VisitedView) {
			const name = view.name?.toString();
			if (!name) return this.cachedViews;
			this.cachedViews = this.cachedViews.filter(
				(n) => n === name || this.getAffixCacheNames().includes(n)
			);
			return this.cachedViews;
		},
		async delAllViews() {
			await this.delAllVisitedViews();
			await this.delAllCachedViews();
			return this.getCurrentViews();
		},
		async delAllVisitedViews() {
			this.visitedViews = this.visitedViews.filter((v) => v.meta.affix);
			return this.visitedViews;
		},
		async delAllCachedViews() {
			this.cachedViews = this.getAffixCacheNames();
			return this.cachedViews;
		},
		updateVisitedView(view: RouteLocationNormalizedLoaded) {
			const index = this.visitedViews.findIndex(
				(v) => v.path === view.path
			);
			if (index === -1) return;

			// 显式处理 name 类型
			const name =
				typeof view.name === "symbol"
					? view.name
					: view.name?.toString();

			this.visitedViews[index] = {
				...this.visitedViews[index],
				...view,
				name: name || this.visitedViews[index].name,
				title:
					view.meta.title?.toString() ||
					this.visitedViews[index].title,
			};
		},
		async delRightTags(view: VisitedView) {
			const index = this.visitedViews.findIndex(
				(v) => v.path === view.path
			);
			if (index === -1) return;

			this.visitedViews = this.visitedViews.filter((item, idx) => {
				if (idx <= index || item.meta.affix) return true;
				this.removeCache(item);
				return false;
			});

			return this.visitedViews;
		},
		async delLeftTags(view: VisitedView) {
			// prettier-ignore
			const index = this.visitedViews.findIndex(v => v.path === view.path);
			if (index === -1) return;

			this.visitedViews = this.visitedViews.filter((item, idx) => {
				if (idx >= index || item.meta.affix) return true;
				this.removeCache(item);
				return false;
			});

			return this.visitedViews;
		},
		/**
		 * 切换到指定标签页
		 *
		 * @param pathOrName 当前路由path
		 * @param r 路由
		 */
		async switchToTab(pathOrName: RouteIdentifier) {
			const router = useRouter();

			// 分离路径和名称比较 支持 symbol 类型查询
			const targetView = this.visitedViews.find((v) => {
				const isPathMatch = v.path === pathOrName.toString();
				const isNameMatch = v.name === pathOrName;
				return isPathMatch || isNameMatch;
			});

			if (targetView) {
				await router.push(targetView.fullPath || targetView.path);
				return;
			}

			const targetRoute = findRouteByPathOrName(
				router.getRoutes(),
				pathOrName
			);
			if (targetRoute) {
				const resolvedRoute = router.resolve(targetRoute);
				this.addView(
					resolvedRoute as unknown as RouteLocationNormalizedLoaded
				);
				await router.push(resolvedRoute.fullPath);
			} else {
				console.warn(`Route not found: ${String(pathOrName)}`);
				await router.push("/404");
			}
		},
		getCurrentViews() {
			return {
				visitedViews: [...this.visitedViews],
				cachedViews: [...this.cachedViews],
			};
		},

		getAffixCacheNames() {
			return this.visitedViews
				.filter((v) => v.meta.affix && v.name)
				.map((v) => v.name as string);
		},
		removeCache(view: VisitedView) {
			const name = view.name?.toString();
			if (!name) return;
			const index = this.cachedViews.indexOf(name);
			if (index > -1) this.cachedViews.splice(index, 1);
		},
	},
});

// 在工具方法中添加处理
function getSafeRouteName(name: RouteRecordName): string | undefined {
	if (typeof name === "string") return name;
	if (typeof name === "symbol") return name.toString();
	return undefined;
}

/**
 * 递归查找路由
 *
 * @param routes 路由数组
 * @param key 路由键
 * @returns
 */
function findRouteByPathOrName(
	routes: RouteRecordRaw[],
	key: RouteIdentifier
): RouteRecordRaw | undefined {
	return (
		routes.find((route) => {
			// 显式类型分支处理
			if (typeof key === "symbol") {
				return route.name === key;
			}
			return route.path === key || route.name === key;
		}) || deepFindRoute(routes, key)
	);
}

function deepFindRoute(
	routes: RouteRecordRaw[],
	key: RouteIdentifier
): RouteRecordRaw | undefined {
	for (const route of routes) {
		if (route.children) {
			const found = deepFindRoute(route.children, key);
			if (found) return found;
		}
	}
}

export default useTagsViewStore;
