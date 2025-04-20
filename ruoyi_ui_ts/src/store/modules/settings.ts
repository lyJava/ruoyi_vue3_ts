import defaultSettings, { SettingsState } from "@/settings";
import useDynamicTitle from "@/utils/useDynamicTitle";

import { defineStore } from "pinia";

// prettier-ignore
const { sideTheme, theme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings;
// prettier-ignore
const storageSetting = JSON.parse(localStorage.getItem('layout-setting') || '{}') as Partial<SettingsState>;

const useSettingsStore = defineStore("settings", {
	state: (): SettingsState => ({
		title: "",
		theme: storageSetting.theme ?? theme,
		// prettier-ignore
		sideTheme: storageSetting.sideTheme ?? sideTheme,
		showSettings: storageSetting.showSettings?? showSettings,
		// prettier-ignore
		topNav: storageSetting.topNav ?? topNav,
		tagsView: storageSetting.tagsView ?? tagsView,
		fixedHeader: storageSetting.fixedHeader ?? fixedHeader,
		sidebarLogo: storageSetting.sidebarLogo ?? sidebarLogo,
		dynamicTitle: storageSetting.dynamicTitle ?? dynamicTitle,
		errorLog: storageSetting.errorLog, // 可选属性无需 ?? 默认值
	}),
	actions: {
		// 修改布局设置
		changeSetting<K extends keyof SettingsState>(data: { key: K; value: SettingsState[K] }) {
			const { key, value } = data;
			if (Object.prototype.hasOwnProperty.call(this, key)) {
				// 使用类型断言确保类型安全
				(this[key] as SettingsState[K]) = value;
			}
		},
		// 设置网页标题
		setTitle(title: string) {
			this.title = title;
			useDynamicTitle();
		},
	},
});

export default useSettingsStore;
