import request from "@/utils/request";

// 查询缓存详细
export const getCache = () => {
	return request({
		url: "/monitor/cache",
		method: "get",
	});
};

// 查询缓存名称列表
export const listCacheName = () => {
	return request({
		url: "/monitor/cache/getNames",
		method: "get",
	});
};

// 查询缓存键名列表
export const listCacheKey = (cacheName: string) => {
	return request({
		url: "/monitor/cache/getKeys/" + cacheName,
		method: "get",
	});
};

// 查询缓存内容
export const getCacheValue = (cacheName: string, cacheKey: string) => {
	return request({
		url: "/monitor/cache/getValue/" + cacheName + "/" + cacheKey,
		method: "get",
	});
};

// 清理指定名称缓存
export const clearCacheName = (cacheName: string) => {
	return request({
		url: "/monitor/cache/clearCacheName/" + cacheName,
		method: "delete",
	});
};

// 清理指定键名缓存
export const clearCacheKey = (cacheKey: string) => {
	return request({
		url: "/monitor/cache/clearCacheKey/" + cacheKey,
		method: "delete",
	});
};

// 清理全部缓存
export const clearCacheAll = () => {
	return request({
		url: "/monitor/cache/clearCacheAll",
		method: "delete",
	});
};
