import request from "@/utils/request";

// 查询字典数据列表
export const listData = async (query: any) => {
	return await request({
		url: "/system/dict/data/list",
		method: "get",
		params: query,
	});
};

// 查询字典数据详细
export const getData = async (dictCode: string) => {
	return await request({
		url: "/system/dict/data/" + dictCode,
		method: "get",
	});
};

// 根据字典类型查询字典数据信息
export const getDicts = async (dictType: string) => {
	return await request({
		url: "/system/dict/data/type/" + dictType,
		method: "get",
	});
};

// 新增字典数据
export const addData = async (data: any) => {
	return await request({
		url: "/system/dict/data",
		method: "post",
		data: data,
	});
};

// 修改字典数据
export const updateData = async (data: any) => {
	return await request({
		url: "/system/dict/data",
		method: "put",
		data: data,
	});
};

// 删除字典数据
export const delData = async (dictCode: string) => {
	return await request({
		url: "/system/dict/data/" + dictCode,
		method: "delete",
	});
};

// 导出字典数据
export const exportData = async (query: any) => {
	return await request({
		url: "/system/dict/data/export",
		method: "get",
		params: query,
	});
};
