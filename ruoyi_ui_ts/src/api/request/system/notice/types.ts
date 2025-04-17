export interface QueryParam {
	pageNum?: number;
	pageSize?: number;
	noticeTitle?: string;
	createBy?: string;
	noticeType?: string;
    noticeStatus?:string;
}

export interface FormParam extends QueryParam {
    id?:string;
	noticeContent?: string;
}