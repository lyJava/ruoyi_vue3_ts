import request from "@/utils/request";

/**
 * 查询部门列表
 * 
 * @param {object} query 查询参数Obj
 * @returns
 */
export const listDept = async (query?: any) => {
	return await request({
		url: "/system/dept/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询部门分页列表
 * 
 * @param {object} query 查询参数Obj
 * @returns
 */
 export const page = async (query?: any) => {
	return await request({
		url: "/system/dept/page",
		method: "get",
		params: query,
	});
};

/**
 * 查询部门列表（排除节点
 * 
 * @param {string} deptId 部门ID
 * @returns
 */
export const listDeptExcludeChild = async (deptId: string) => {
	return await request({
		url: `/system/dept/list/exclude/${deptId}`,
		method: "get",
	});
};

/**
 * 查询部门详细
 * 
 * @param {string} deptId 部门ID
 * @returns
 */
export const getDept = async (deptId: string) => {
	return await request({
		url: `/system/dept/${deptId}`,
		method: "get",
	});
};

/**
 * 查询部门下拉树结构
 *
 * @returns
 */
export const deptTreeSelect = async () => {
	return await request({
		url: "/system/dept/treeSelect",
		method: "get",
	});
};

/**
 * 根据角色ID查询部门树结构
 *
 * @param {string} roleId 角色ID
 * @returns
 */
export const roleDeptTreeSelect = async (roleId: string) => {
	return await request({
		url: `/system/dept/roleDeptTreeSelect/${roleId}`,
		method: "get",
	});
};

/**
 * 新增部门
 *
 * @param {object} param 部门Obj
 * @returns
 */
export const addDept = async (param: any) => {
	return await request({
		url: "/system/dept",
		method: "post",
		data: param,
	});
};

/**
 * 修改部门
 *
 * @param {object} data 部门Obj
 * @returns
 */
export const updateDept = async (data: any) => {
	return await request({
		url: "/system/dept",
		method: "put",
		data: data,
	});
};

/**
 * 删除
 *
 * @param {string} deptId 部门Id
 * @returns
 */
export const delDept = async (deptId: string) => {
	return await request({
		url: `/system/dept/${deptId}`,
		method: "delete",
	});
};



/**
 * 批量删除
 *
 * @param {string} ids 部门Id数组
 * @returns
 */
 export const batchDelDept = async (ids: string[]) => {
	return await request({
		url: `/system/dept/${ids}`,
		method: "delete",
	});
};
