import { useCusFetch } from "@/utils/fetch";
import request from "@/utils/request";
import { praseStrEmpty } from "@/utils/ruoyi";
import { Ref } from "vue";

/**
 * 查询用户列表
 *
 * @param {any} query
 * @returns 用户列表
 */
export const listUser = async (query: any) => {
	return await request({
		url: "/system/user/list",
		method: "get",
		params: query,
	});
};

/**
 * 通过用户ID查询用户详细
 *
 * @param {string} userId 用户ID
 * @returns 用户信息
 */
export const getUser = async (userId?: string) => {
	return await request({
		url: `/system/user/${praseStrEmpty(userId!)}`,
		method: "get",
	});
};

/**
 * 新增用户
 *
 * @param {any} data
 * @returns
 */
export const addUser = async (data: any) => {
	return await request({
		url: "/system/user",
		method: "post",
		data: data,
	});
};

/**
 * 修改用户
 *
 * @param {any} data
 * @returns
 */
export const updateUser = async (data: any) => {
	return await request({
		url: "/system/user",
		method: "put",
		data: data,
	});
};

/**
 * 删除用户
 *
 * @param {string} userId 用户ID
 * @returns
 */
export const delUser = async (userId: string | string[]) => {
	return await request({
		url: `/system/user/${userId}`,
		method: "delete",
	});
};

/**
 * 导出用户
 *
 * @param {object} query
 * @returns
 */
export const exportUser = async (query: any) => {
	return await request({
		url: "/system/user/export",
		method: "get",
		params: query,
	});
};

/**
 * 用户密码重置
 *
 * @param {string} userId   用户ID
 * @param {string} password 密码
 * @returns
 */
export const resetUserPwd = async (userId: string, password: string) => {
	return await request({
		url: "/system/user/resetPwd",
		method: "put",
		data: {
			userId,
			password,
		},
	});
};

/**
 * 用户状态修改
 *
 * @param {string} userId 用户ID
 * @param {string} status 用户状态
 * @returns
 */
export const changeUserStatus = async (userId: string, status: string) => {
	return await request({
		url: "/system/user/changeStatus",
		method: "put",
		data: {
			userId,
			status,
		},
	});
};

/**
 * 查询用户个人信息
 *
 * @returns
 */
export const getUserProfile = async () => {
	return await request({
		url: "/system/user/profile",
		method: "get",
	});
};

/**
 * 修改用户个人信息
 *
 * @param {object} data
 * @returns
 */
export const updateUserProfile = async (data: any) => {
	return await request({
		url: "/system/user/profile",
		method: "put",
		data: data,
	});
};

/**
 * 用户密码重置
 *
 * @param {string} oldPassword 旧密码
 * @param {string} newPassword 新密码
 * @returns
 */
export const updateUserPwd = async (oldPassword: any, newPassword: any) => {
	return await request({
		url: "/system/user/profile/updatePwd",
		method: "put",
		params: {
			oldPassword,
			newPassword,
		},
	});
};

/**
 * 用户头像上传
 *
 * @param {Object} data
 * @returns
 */
export const uploadAvatar = async (data: any) => {
	return await request({
		url: "/system/user/profile/avatar",
		method: "post",
		data: data,
	});
};

/**
 * 下载用户导入模板
 *
 * @returns
 */
export const importTemplate = async () => {
	return await request({
		url: "/system/user/importTemplate",
		method: "get",
	});
};

// 查询授权角色
export const getAuthRole = async (userId: any) => {
	return await request({
		url: `/system/user/authRole/${userId}`,
		method: "get",
	});
};

// 保存授权角色
export const updateAuthRole = async (data: any) => {
	return await request({
		url: "/system/user/authRole",
		method: "put",
		params: data,
	});
};

export const getAllRole = async (): Promise<any> => {
	return await request({
		url: "/system/role/selectAll",
		method: "get",
	});
};

export const getAllPost = async (): Promise<any> => {
	return await request({
		url: "/system/post/selectAll",
		method: "get",
	});
};

export const getAllRoleFetch = async (): Promise<any> => {
	return await useCusFetch("/system/role/selectAll", {
		method: "get",
	});
};

export const getAllPostFetch = async (): Promise<any> => {
	return await useCusFetch("/system/post/selectAll", {
		method: "get",
	});
};

/**
 * 获取所有角色与岗位信息
 * 
 * @param roleRef 角色ref
 * @param postRef 岗位ref
 */
export const getAllPostAndRole = (roleRef: Ref, postRef: Ref) => {
	Promise.all([getAllRoleFetch(), getAllPostFetch()]).then(([roleResp, postResp]) => {
		if (roleResp.data.code === 200) {
			roleRef.value = roleResp.data.data;
		}
		if (postResp.data.code === 200) {
			postRef.value = postResp.data.data;
		}
	}).catch(error => {
		console.error("请求失败:", error);
	});
};