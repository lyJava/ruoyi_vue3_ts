import defaultSettings from "@/settings";
import useDynamicTitle from "@/utils/useDynamicTitle";

import { defineStore } from "pinia";

// prettier-ignore
const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings
// prettier-ignore
const storageSetting = JSON.parse(localStorage.getItem('layout-setting') as any) || ''

const useSettingsStore = defineStore("settings", {
	state: () => ({
		title: "",
		theme: "#409EFF",
		// prettier-ignore
		sideTheme: storageSetting.sideTheme || sideTheme,
		showSettings: showSettings,
		// prettier-ignore
		topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
		// prettier-ignore
		tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
		// prettier-ignore
		fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
		// prettier-ignore
		sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
		// prettier-ignore
		dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
	}),
	actions: {
		// 修改布局设置
		changeSetting(data: { key: any; value: any }) {
			const { key, value } = data;
			if (this.hasOwnProperty(key)) {
				this[key] = value;
			}
		},
		// 设置网页标题
		setTitle(title: any) {
			this.title = title;
			useDynamicTitle();
		},
	},
});

export default useSettingsStore;
