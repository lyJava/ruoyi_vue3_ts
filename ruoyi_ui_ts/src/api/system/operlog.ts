import request from "@/utils/request";

/**
 * 查询操作日志列表
 *
 * @param {*} query 查询参数
 * @returns
 */
export const getPageList = async (query: any) => {
	return await request({
		url: "/monitor/operlog/list",
		method: "get",
		params: query,
	});
};

/**
 * 删除操作日志
 *
 * @param {*} operId 操作日志ID
 * @returns
 */
export const delOperlog = async (operId: string | string[]) => {
	return await request({
		url: `/monitor/operlog/${operId}`,
		method: "delete",
	});
};

/**
 * 清空操作日志
 *
 * @returns
 */
export const cleanOperlog = async () => {
	return await request({
		url: "/monitor/operlog/clean",
		method: "delete",
	});
};

/**
 * 导出操作日志
 *
 * @param {*} query 导出参数
 * @returns
 */
export const exportOperlog = async (query: any) => {
	return await request({
		url: "/monitor/operlog/export",
		method: "get",
		params: query,
	});
};
