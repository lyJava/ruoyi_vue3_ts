import request from "@/utils/request";

// 查询缓存详细
export const getCache = async () => {
	return await request({
		url: "/monitor/cache",
		method: "get",
	});
};

// 查询缓存名称列表
export const listCacheName = async () => {
	return await request({
		url: "/monitor/cache/getNames",
		method: "get",
	});
};

// 查询缓存键名列表
export const listCacheKey = async (cacheName: string) => {
	return await request({
		url: `/monitor/cache/getKeys/${cacheName}`,
		method: "get",
	});
};

// 查询缓存内容
export const getCacheValue = async (cacheName: string, cacheKey: string) => {
	return await request({
		url: `/monitor/cache/getValue/${cacheName}/${cacheKey}`,
		method: "get",
	});
};

// 清理指定名称缓存
export const clearCacheName = async (cacheName: string) => {
	return await request({
		url: `/monitor/cache/clearCacheName/${cacheName}`,
		method: "delete",
	});
};

// 清理指定键名缓存
export const clearCacheKey = async (cacheKey: string) => {
	return await request({
		url: `/monitor/cache/clearCacheKey/${cacheKey}`,
		method: "delete",
	});
};

// 清理全部缓存
export const clearCacheAll = async () => {
	return await request({
		url: "/monitor/cache/clearCacheAll",
		method: "delete",
	});
};
