import request from "@/utils/request";

/**
 * 查询服务器器详细
 *
 * @returns
 */
export const getServer = async () => {
	return await request({
		url: "/monitor/server",
		method: "get",
	});
};
