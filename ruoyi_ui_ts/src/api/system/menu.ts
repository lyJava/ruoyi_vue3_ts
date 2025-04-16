import request from "@/utils/request";

/**
 * 查询菜单列表
 *
 * @param {any} query 参数
 * @returns
 */
export const listMenu = async (query?: any) => {
	return await request({
		url: "/system/menu/list",
		method: "get",
		params: query,
	});
};

/**
 * 查询菜单分页列表
 *
 * @param {any} query 参数
 * @returns
 */
 export const pageList = async (query?: any) => {
	return await request({
		url: "/system/menu/page",
		method: "get",
		params: query,
	});
};

/**
 * 查询菜单详细
 *
 * @param {string} menuId 菜单ID
 * @returns
 */
export const getMenu = async (menuId: string) => {
	return await request({
		url: `/system/menu/${menuId}`,
		method: "get",
	});
};

/**
 * 查询菜单下拉树结构
 *
 * @returns
 */
export const treeSelect = async () => {
	return await request({
		url: "/system/menu/treeSelect",
		method: "get",
	});
};

/**
 * 根据角色ID查询菜单下拉树结构
 *
 * @param {string} roleId 角色ID
 * @returns
 */
export const roleMenuTreeSelect = async (roleId: string) => {
	return await request({
		url: `/system/menu/roleMenuTreeSelect/${roleId}`,
		method: "get",
	});
};

/**
 * 新增菜单
 *
 * @param {object} param 菜单Obj
 * @returns
 */
export const addMenu = async (param: any) => {
	return await request({
		url: "/system/menu",
		method: "post",
		data: param,
	});
};

/**
 * 修改菜单
 *
 * @param {object} param 菜单Obj
 * @returns
 */
export const updateMenu = async (param: any) => {
	return await request({
		url: "/system/menu",
		method: "put",
		data: param,
	});
};


/**
 * 批量删除
 *
 * @param {string} ids 菜单ID数组
 * @returns
 */
 export const batchDelMenu = async (ids: string | string[]) => {
	return await request({
		url: `/system/menu/${ids}`,
		method: "delete",
	});
};

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
