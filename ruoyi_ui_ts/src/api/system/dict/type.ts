import request from "@/utils/request";

// 查询字典类型列表
export const listType = async (query?: any) => {
	return await request({
		url: "/system/dict/type/list",
		method: "get",
		params: query,
	});
};

// 查询字典类型详细
export const getDataType = async (dictId: string) => {
	return await request({
		url: `/system/dict/type/${dictId}`,
		method: "get",
	});
};

// 新增字典类型
export const addType = async (data: any) => {
	return await request({
		url: "/system/dict/type",
		method: "post",
		data: data,
	});
};

// 修改字典类型
export const updateType = async (data: any) => {
	return await request({
		url: "/system/dict/type",
		method: "put",
		data: data,
	});
};

// 删除字典类型
export const delType = async (dictId: string | string[]) => {
	return await request({
		url: `/system/dict/type/${dictId}`,
		method: "delete",
	});
};

// 清理参数缓存
export const clearCache = async () => {
	return await request({
		url: "/system/dict/type/clearCache",
		method: "delete",
	});
};

export const refreshCache = async () => {
	return await request({
		url: "/system/dict/type/refreshCache",
		method: "get",
	});
};

// 导出字典类型
export const exportType = async (query: any) => {
	return await request({
		url: "/system/dict/type/export",
		method: "get",
		params: query,
	});
};

// 获取字典选择框列表
export const optionSelect = async () => {
	return await request({
		url: "/system/dict/type/optionSelect",
		method: "get",
	});
};

/**
 * 修改状态
 * 
 * @param dictId 
 * @param status 
 * @returns 
 */
export const updateDictTypeStatus = async (dictId: string, status: string) => {    
    return await request({
		url: `/system/dict/type/status/${dictId}/${status}`,
		method: "get",
	});
};
