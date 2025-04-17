import request from "@/utils/request";

/**
 * 查询参数列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listConfig = async (query: any) => {
	return await request({
		url: "/system/config/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询参数详细
 *
 * @param {string} configId 参数ID
 * @returns
 */
export const getConfig = async (configId: string | string[]) => {
	return await request({
		url: `/system/config/${configId}`,
		method: "get",
	});
};

/**
 * 根据参数键名查询参数值
 *
 * @param {string} configKey 参数键名
 * @returns
 */
export const getConfigKey = async (configKey: string) => {
	return await request({
		url: `/system/config/configKey/${configKey}`,
		method: "get",
	});
};

/**
 * 新增参数配置
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addConfig = async (param: any) => {
	return await request({
		url: "/system/config",
		method: "post",
		data: param,
	});
};

/**
 * 修改参数配置
 *
 * @param {object} data 参数Obj
 * @returns
 */
export const updateConfig = async (param: any) => {
	return await request({
		url: "/system/config",
		method: "put",
		data: param,
	});
};

/**
 * 删除参数配置
 *
 * @param {string} configId 参数ID
 * @returns
 */
export const delConfig = async (configId: string | string[]) => {
	return await request({
		url: `/system/config/${configId}`,
		method: "delete",
	});
};

/**
 * 清理参数缓存
 *
 * @returns
 */
export const clearCache = async () => {
	return await request({
		url: "/system/config/clearCache",
		method: "delete",
	});
};

/**
 * 导出参数
 *
 * @param {object} query 查询Obj
 * @returns
 */
export const exportConfig = async (query: any) => {
	return await request({
		url: "/system/config/export",
		method: "get",
		params: query,
	});
};
