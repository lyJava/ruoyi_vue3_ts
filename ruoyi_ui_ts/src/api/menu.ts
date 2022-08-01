import request from "@/utils/request";

/**
 * 获取路由
 *
 * @returns
 */
export const getRouters = async () => {
	return await request({
		url: "/getRouters",
		method: "get",
	});
};
