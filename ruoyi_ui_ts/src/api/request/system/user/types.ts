export interface UserBase {
	/**
	 * 用户名
	 */
	username?: string;
	/**
	 * 部门ID
	 */
	deptId?: number;
	/**
	 * 昵称
	 */
	nickname?: string;
	/**
	 * 手机号
	 */
	phoneNo?: string;
	/**
	 * 用户状态
	 */
	userStatus?: string;
	/**
	 * 性别
	 */
	sex?: string;
}

export interface QueryParam extends UserBase {
	/**
	 * 当前页码
	 */
	pageNum: number;
	/**
	 * 每页条数
	 */
	pageSize: number;
}

export interface FormParam extends UserBase {
	/**
	 * 用户ID
	 */
	id?: string;
	/**
	 * 密码
	 */
	password?: string;
	/**
	 * 邮箱
	 */
	email?: string;
	/**
	 * 备注
	 */
	remarks?: string;
	/**
	 * 岗位ID数组
	 */
	postIds?: string[];
	/**
	 * 角色ID数组
	 */
	roleIds?: string[];
	/**
	 * 角色名称数组
	 */
	roleNameArray?: string[];
	/**
	 * 岗位名称数组
	 */
	postNameArray?: string[];
	/**
	 * 角色
	 */
	roles?: any[];
	/**
	 * 岗位
	 */
	posts?: any[];
	/**
	 * 部门名称
	 */
	deptName?: string;
	/**
	 * 更新时间
	 */
	updateTime?: string;
	/**
	 * 创建人
	 */
	createBy?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 是否删除
	 */
	delFlag?: string;
}

// 增加type方式写法
/*
type UserBase = {
	username?: string;
	deptId?: number;
	nickname?: string;
	phoneNo?: string;
	userStatus?: string;
	sex?: string;
};

type QueryParam = UserBase & {
	pageNum: number;
	pageSize: number;
};

type FormParam = UserBase & {
	id?: string;
	password?: string;
	email?: string;
	remarks?: string;
	postIds?: string[];
	roleIds?: string[];
	roleNameArray?: string[];
	postNameArray?: string[];
	roles?: any[];
	posts?: any[];
	deptName?: string;
	updateTime?: string;
	createBy?: string;
	createTime?: string;
	delFlag?: string;
};
*/