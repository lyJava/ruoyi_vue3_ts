export interface IMenu {
	children: [];
	component: string;
	createBy: string;
	createTime: string;
	icon: string | "system";
	isCache: string;
	isFrame: string;
	menuId: 1;
	menuName: string;
	menuType: string | "M";
	orderNum: number | 1;
	params: any;
	parentId: number | 0;
	parentName: string;
	path: string | "system";
	perms: string | "";
	query: string | "";
	remark: string;
	searchValue: string;
	status: string | "0";
	updateBy: string;
	updateTime: string;
	visible: string | "0";
}
