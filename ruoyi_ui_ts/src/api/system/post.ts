import request from "@/utils/request";

/**
 * 查询岗位列表
 *
 * @param {object} query 查询参数Obj
 * @returns
 */
export const listPost = async (query: any) => {
	return await request({
		url: "/system/post/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询岗位详细
 *
 * @param {string} postId 岗位ID
 * @returns
 */
export const getPost = async (postId: string) => {
	return await request({
		url: `/system/post/${postId}`,	
		method: "get",
	});
};

/**
 * 新增岗位
 *
 * @param {object} data 岗位Obj
 * @returns
 */
export const addPost = async (data: any) => {
	return await request({
		url: "/system/post",
		method: "post",
		data: data,
	});
};

/**
 * 修改岗位
 *
 * @param {object} data 岗位Obj
 * @returns
 */
export const updatePost = async (data: any) => {
	return await request({
		url: "/system/post",
		method: "put",
		data: data,
	});
};

/**
 * 删除岗位
 *
 * @param {string} postId 岗位ID
 * @returns
 */
export const delPost = async (postId: string | string[]) => {
	return await request({
		url: `/system/post/${postId}`,
		method: "delete",
	});
};

/**
 * 导出岗位
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const exportPost = async (query: any) => {
	return await request({
		url: "/system/post/export",
		method: "get",
		params: query,
	});
};
