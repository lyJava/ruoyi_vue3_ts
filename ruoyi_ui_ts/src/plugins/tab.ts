import useTagsViewStore from "@/store/modules/tagsView";
import router from "@/router";

export default {
	// 刷新当前tab页签
	async refreshPage(obj: any) {
		const { path, matched }: any = router.currentRoute;
		if (obj === undefined) {
			matched.forEach(
				(m: { components: { default: { name: string } } }) => {
					// prettier-ignore
					if (m.components && m.components.default && m.components.default.name) {
					if (!["Layout", "ParentView"].includes(m.components.default.name)) {
						obj = { name: m.components.default.name, path: path };
					}
				}
				}
			);
		}
		await useTagsViewStore().delCachedView(obj);
		const { path: path_1 } = obj;
		router.replace({
			path: "/redirect" + path_1,
		});
	},
	// 关闭当前tab页签，打开新页签
	closeOpenPage(obj: any) {
        const viewStore = useTagsViewStore();
		viewStore.delView(router.currentRoute.value);
		if (obj !== undefined) {
			return router.push(obj);
		}
	},
	// 关闭指定tab页签
	async closePage(obj: any) {
		if (obj === undefined) {
			// prettier-ignore
			const lastPath = await useTagsViewStore().delView(router.currentRoute as any) as any;
            return await router.push(lastPath || "/");
		}
		return useTagsViewStore().delView(obj);
	},
	// 关闭所有tab页签
	closeAllPage() {
		return useTagsViewStore().delAllViews();
	},
	// 关闭左侧tab页签
	closeLeftPage(obj: any) {
		// prettier-ignore
		return useTagsViewStore().delLeftTags(obj || router.currentRoute);
	},
	// 关闭右侧tab页签
	closeRightPage(obj: any) {
		// prettier-ignore
		return useTagsViewStore().delRightTags( obj || router.currentRoute);
	},
	// 关闭其他tab页签
	closeOtherPage(obj: any) {
		// prettier-ignore
		return useTagsViewStore().delOthersViews(obj || router.currentRoute);
	},
	// 添加tab页签
	openPage(title: any, url: any) {
		var obj: any = { path: url, meta: { title: title } };
		useTagsViewStore().addView(obj);
		return router.push(url);
	},
	// 修改tab页签
	updatePage(obj: any) {
		return useTagsViewStore().updateVisitedView(obj);
	},
};
