import request from "@/utils/request";

/**
 * 查询生成表数据
 *
 * @param {object} query
 * @returns
 */
export const listTable = async (query: any) => {
	return await request({
		url: "/tool/gen/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询db数据库列表
 * @param {object} query
 * @returns
 */
export const listDbTable = async (query: any) => {
	return await request({
		url: "/tool/gen/db/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询表详细信息
 *
 * @param {string} tableId 表ID
 * @returns
 */
export const getGenTable = async (tableId: string) => {
	return await request({
		url: `/tool/gen/${tableId}`,
		method: "get",
	});
};

/**
 * 修改代码生成信息
 *
 * @param {object} data
 * @returns
 */
export const updateGenTable = async (data: any) => {
	return await request({
		url: "/tool/gen/edit",
		method: "put",
		data: data,
	});
};

/**
 * 导入表
 *
 * @param {object} data
 * @returns
 */
export const importTable = (data: any) => {
	return request({
		url: "/tool/gen/importTable",
		method: "post",
		params: data,
	});
};

/**
 * 生成代码预览
 *
 * @param {string} tableId
 * @returns
 */
export const previewTable = (tableId: string) => {
	return request({
		url: `/tool/gen/preview/${tableId}`,
		method: "get",
	});
};

/**
 * 删除表数据
 *
 * @param {string} tableId
 * @returns
 */
export const delTable = (tableId: string) => {
	return request({
		url: `/tool/gen/${tableId}`,
		method: "delete",
	});
};

/**
 * 生成代码（自定义路径）
 *
 * @param {string} tableName
 * @returns
 */
export const genCode = (tableName: string) => {
	return request({
		url: `/tool/gen/genCode/${tableName}`,
		method: "get",
	});
};

/**
 * 同步数据库
 *
 * @param {string} tableName
 * @returns
 */
export const synchDb = (tableName: string) => {
	return request({
		url: `/tool/gen/synchDb/${tableName}`,
		method: "get",
	});
};

/**
 * 修改注释状态或版本
 * 
 * @param type 注释或者版本
 * @param id   主键ID
 * @param val  状态/版本值
 * @returns
 */
export const updateStatusOrVersion = async (type: string, id: string, val: string) => {
	return await request({
		url: `/tool/gen/change/${type}/${id}/${val}`,
		method: "get",
	});
};
