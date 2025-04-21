// prettier-ignore
import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from "@/api/system/cache";

export default () => {
	const proxy = useSafeInstance();
	const cacheNames = ref<any>([]);
	const cacheKeys = ref<any>([]);
	const cacheForm = ref<any>({});
	const loading = ref<boolean>(true);
	const subLoading = ref<boolean>(false);
	const nowCacheName = ref<string>("");
	const tableHeight = ref<number>(window.innerHeight - 200);

	/** 查询缓存名称列表 */
	const getCacheNames = async () => {
		loading.value = true;
		await listCacheName().then((response: any) => {
			if (response.code === 200) {
				cacheNames.value = response.data;
				loading.value = false;
			}
		});
	};

	/** 刷新缓存名称列表 */
	const refreshCacheNames = () => {
		getCacheNames();
		proxy.$modal.msgSuccess("刷新缓存列表成功");
	};

	/** 清理指定名称缓存 */
	const handleClearCacheName = (row: any) => {
		clearCacheName(row.cacheName).then((response: any) => {
			if (response.code === 200) {
				// prettier-ignore
				proxy.$modal.msgSuccess(`清理缓存名称["${nowCacheName.value}]成功`);
				getCacheKeys();
			}
		});
	};

	/** 查询缓存键名列表 */
	const getCacheKeys = (row?: any) => {
		const cacheName = row ? row.cacheName : nowCacheName.value;
		if (cacheName === "") {
			return;
		}
		subLoading.value = true;
		listCacheKey(cacheName).then((response: any) => {
			if (response.code === 200) {
				cacheKeys.value = response.data;
				subLoading.value = false;
				nowCacheName.value = cacheName;
			}
		});
	};

	/** 刷新缓存键名列表 */
	const refreshCacheKeys = () => {
		getCacheKeys();
		proxy.$modal.msgSuccess("刷新键名列表成功");
	};

	/** 清理指定键名缓存 */
	const handleClearCacheKey = (cacheKey: any) => {
		clearCacheKey(cacheKey).then((response: any) => {
			if (response.code === 200) {
				proxy.$modal.msgSuccess(`清理缓存键名[${cacheKey}]成功`);
				getCacheKeys();
			}
		});
	};

	/** 列表前缀去除 */
	const nameFormatter = (row: any) => {
		return row.cacheName.replace(":", "");
	};

	/** 键名前缀去除 */
	const keyFormatter = (cacheKey: any) => {
		return cacheKey.replace(nowCacheName.value, "");
	};

	/** 查询缓存内容详细 */
	const handleCacheValue = (cacheKey: any) => {
		getCacheValue(nowCacheName.value, cacheKey).then((response: any) => {
			if (response.code === 200) {
				cacheForm.value = response.data;
			}
		});
	};

	/** 清理全部缓存 */
	const handleClearCacheAll = () => {
		clearCacheAll().then((response: any) => {
			if (response.code === 200) {
				proxy.$modal.msgSuccess("清理全部缓存成功");
			}
		});
	};

	onMounted(() => {
		getCacheNames();
	});

    // prettier-ignore
    return {
        cacheNames, cacheKeys, cacheForm, loading, subLoading, tableHeight, refreshCacheNames, handleClearCacheName, getCacheKeys, refreshCacheKeys, 
        handleClearCacheKey, nameFormatter, keyFormatter, handleCacheValue, handleClearCacheAll, 
    };

};
