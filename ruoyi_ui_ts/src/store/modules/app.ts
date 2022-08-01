import Cookies from "js-cookie";
import { defineStore } from "pinia";

const useAppStore = defineStore("app", {
	state: () => ({
		sidebar: {
			opened: Cookies.get("sidebarStatus") ? Cookies.get("sidebarStatus") : true,
			withoutAnimation: false,
			hide: false,
		},
		device: "desktop",
		size: Cookies.get("size") || "default",
	}),
	actions: {
		toggleSideBar(withoutAnimation: any) {
			if (this.sidebar.hide) {
				return false;
			}
			this.sidebar.opened = !this.sidebar.opened;
			this.sidebar.withoutAnimation = withoutAnimation;
			if (this.sidebar.opened) {
				Cookies.set("sidebarStatus", "1");
			} else {
				Cookies.set("sidebarStatus", "0");
			}
		},
		closeSideBar(withoutAnimation: any) {
			Cookies.set("sidebarStatus", "0");
			this.sidebar.opened = false;
			this.sidebar.withoutAnimation = withoutAnimation;
		},
		toggleDevice(device: string) {
			this.device = device;
		},
		setSize(size: any) {
			this.size = size;
			Cookies.set("size", size);
		},
		toggleSideBarHide(status: any) {
			this.sidebar.hide = status;
		},
	},
});

export default useAppStore;
