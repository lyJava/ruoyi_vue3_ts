import request from "@/utils/request";

/**
 * 查询角色列表
 *
 * @param {object} query
 * @returns
 */
export const listRole = (query: any) => {
	return request({
		url: "/system/role/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询角色详细
 *
 * @param {string} roleId 角色ID
 * @returns
 */
export const getRole = (roleId: string) => {
	return request({
		url: `/system/role/${roleId}`,
		method: "get",
	});
};

/**
 * 新增角色
 *
 * @param {object} data
 * @returns
 */
export const addRole = (data: any) => {
	return request({
		url: "/system/role",
		method: "post",
		data: data,
	});
};

/**
 * 修改角色
 *
 * @param {object} data
 * @returns
 */
export const updateRole = (data: any) => {
	return request({
		url: "/system/role",
		method: "put",
		data: data,
	});
};

/**
 * 角色数据权限
 *
 * @param {object} data
 * @returns
 */
export const dataScope = (data: any) => {
	return request({
		url: "/system/role/dataScope",
		method: "put",
		data: data,
	});
};

/**
 * 角色状态修改
 *
 * @param {string} roleId 角色ID
 * @param {string} status 状态值
 * @returns
 */
export const changeRoleStatus = async (roleId: any, status: any) => {
	return await request({
		url: "/system/role/changeStatus",
		method: "put",
		data: {
			roleId,
			status,
		},
	});
};

/**
 * 删除角色
 *
 * @param {string} roleId
 * @returns
 */
export const delRole = async (roleId: string | string[])  => {
	return await request({
		url: `/system/role/${roleId}`,
		method: "delete",
	});
};

/**
 * 导出角色
 *
 * @param {object} query
 * @returns
 */
export const exportRole = async (query: any) => {
	return await request({
		url: "/system/role/export",
		method: "post",
		data: {
			query,
		},
	});
};

/**
 * 导出角色
 *
 * @param {object} query
 * @returns
 */
export const exportRoleStream = async (query: any) => {
	return await request({
		url: "/system/role/exportByStream",
		method: "post",
		data: {
			query,
		},
	});
};

// 查询角色已授权用户列表
export async function allocatedUserList(query: any) {
	return await request({
		url: "/system/role/authUser/allocatedList",
		method: "get",
		params: query,
	});
}

// 查询角色未授权用户列表
export async function unallocatedUserList(query: any) {
	return await request({
		url: "/system/role/authUser/unallocatedList",
		method: "get",
		params: query,
	});
}

// 取消用户授权角色
export async function authUserCancel(data: any) {
	return await request({
		url: "/system/role/authUser/cancel",
		method: "put",
		data: data,
	});
}

// 批量取消用户授权角色
export async function authUserCancelAll(data: any) {
	return await request({
		url: "/system/role/authUser/cancelAll",
		method: "put",
		params: data,
	});
}

// 授权用户选择
export async function authUserSelectAll(data: any) {
	return await request({
		url: "/system/role/authUser/selectAll",
		method: "put",
		params: data,
	});
}
