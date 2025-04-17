import request from "@/utils/request";

/**
 * 查询公告列表
 *
 * @param {any} query 参数Obj
 * @returns
 */
export const listNotice = async (query: any) => {
	return await request({
		url: "/system/notice/list",
		method: "get",
		params: query,
	});
};

/**
 * 通过公告ID查询公告
 *
 * @param {string} noticeId 公告ID
 * @returns
 */
export const getNotice = async (noticeId: string) => {
	return await request({
		url: `/system/notice/${noticeId}`,
		method: "get",
	});
};

/**
 * 新增公告
 *
 * @param {object} data 公告Obj
 * @returns
 */
export const addNotice = async (data: any) => {
	return await request({
		url: "/system/notice",
		method: "post",
		data: data,
	});
};

/**
 * 修改公告
 *
 * @param {object} data 公告Obj
 * @returns
 */
export const updateNotice = async (data: any) => {
	return await request({
		url: "/system/notice",
		method: "put",
		data: data,
	});
};

/**
 * 通过ID删除公告
 *
 * @param {string} noticeId 公告ID
 * @returns
 */
export const delNotice = async (noticeId: string | string[]) => {
	return await request({
		url: `/system/notice/${noticeId}`,
		method: "delete",
	});
};
