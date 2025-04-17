import request from "@/utils/request";

/**
 * 查询在线用户列表
 *
 * @param {object} query 查询参数
 * @returns
 */
export const list = async (query: any) => {
	return await request({
		url: "/monitor/online/list",
		method: "get",
		params: query,
	});
};

/**
 * 用户强退
 *
 * @param {string} tokenId 凭证ID
 * @returns
 */
export const forceLogout = async (tokenId: string) => {
	return await request({
		url: `/monitor/online/${tokenId}`,
		method: "delete",
	});
};
