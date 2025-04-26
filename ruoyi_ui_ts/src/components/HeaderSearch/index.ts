import Fuse from "fuse.js";
import { getNormalPath } from "@/utils/ruoyi";
import { isHttp } from "@/utils/validate";
import usePermissionStore from "@/store/modules/permission";
import { ElSelect } from "element-plus";

export default () => {
	const search = ref<string>();
	const options = ref<any>();
	const searchPool = ref<any>();
	const show = ref<boolean>(false);
	const fuse = ref<any>({});
	const headerSearchSelectRef = useComponentRef(ElSelect);
	const router = useRouter();
	const routes = computed(() => usePermissionStore().routes);

	const click = () => {
		show.value = !show.value;
		if (show.value) {
			headerSearchSelectRef.value && headerSearchSelectRef.value.focus();
		}
	};

	const close = () => {
		headerSearchSelectRef.value && headerSearchSelectRef.value.blur();
		options.value = [];
		show.value = false;
	};

	const change = (val: any) => {
		const path = val.path;
		if (isHttp(path)) {
			// http(s):// 路径新窗口打开
			const pIndex = path.indexOf("http");
			window.open(path.substr(pIndex, path.length), "_blank");
		} else {
			router.push(path);
		}
		search.value = "";
		options.value = [];
		nextTick(() => {
			show.value = false;
		});
	};

	const initFuse = (list: any) => {
		fuse.value = new Fuse(list, {
			shouldSort: true,
			threshold: 0.4,
			location: 0,
			distance: 100,
			// maxPatternLength: 32,
			minMatchCharLength: 1,
			keys: [
				{
					name: "title",
					weight: 0.7,
				},
				{
					name: "path",
					weight: 0.3,
				},
			],
		});
	};
	// Filter out the routes that can be displayed in the sidebar
	// And generate the internationalized title
	const generateRoutes = (routes: any, basePath = "", prefixTitle = []) => {
		let res = [] as any;
		for (const r of routes) {
			// skip hidden router
			if (r.hidden) {
				continue;
			}
			const p =
				r.path.length > 0 && r.path[0] === "/" ? r.path : "/" + r.path;
			const data = {
				path: !isHttp(r.path) ? getNormalPath(basePath + p) : r.path,
				title: [...prefixTitle],
			} as any;
			if (r.meta && r.meta.title) {
				data.title = [...data.title, r.meta.title];
				if (r.redirect !== "noRedirect") {
					// only push the routes with title
					// special case: need to exclude parent router without redirect
					res.push(data);
				}
			}
			// recursive child routes
			if (r.children) {
				const tempRoutes = generateRoutes(
					r.children,
					data.path,
					data.title
				);
				if (tempRoutes.length >= 1) {
					res = [...res, ...tempRoutes];
				}
			}
		}
		return res;
	};

	const querySearch = (query: any) => {
		if (query !== "") {
			options.value = fuse.value.search(query);
		} else {
			options.value = [];
		}
	};

	onMounted(() => {
		searchPool.value = generateRoutes(routes.value);
	});

	watchEffect(() => {
		searchPool.value = generateRoutes(routes.value);
	});

	watch(show, (value) => {
		if (value) {
			document.body.addEventListener("click", close);
		} else {
			document.body.removeEventListener("click", close);
		}
	});

	watch(
		searchPool,
		(list) => {
			initFuse(list);
		},
		{ immediate: true }
	);

    // prettier-ignore
    return { show, search, options, click, change, querySearch, }
};
