export interface IDept {
	ancestors?: string;
	children?: [];
	createBy?: string;
	createTime?: string;
	delFlag?: string;
	deptId?: string;
	deptName: string;
	email?: string;
	leader?: string;
	orderNum?: string;
}
export interface IUser {
    userId: string;
	userName: string;
	createTime: string;
	phonenumber: string;
	admin?: boolean;
	avatar?: string;
	createBy?: string;
	delFlag?: string;
	dept: IDept;
	deptId?: string;
	email: string;
	loginDate?: string;
	loginIp?: string;
	nickName: string;
	postIds?: string;
	postNameArray?: string;
	remark?: string;
	roleIds?: undefined;
	roleNameArray?: undefined;
	roles?: [];
	salt?: undefined;
	searchValue?: undefined;
	sex?: string;
	status?: string;
	updateBy?: undefined;
	updateTime?: undefined;
	deptName?: string
}
