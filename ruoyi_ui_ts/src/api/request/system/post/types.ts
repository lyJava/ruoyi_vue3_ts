export interface QueryParam {
	pageNum?: number;
	pageSize?: number;
	postCode?: string;
	postName?: string;
	postStatus?: string;
}

export interface FormParam extends QueryParam {
	id?: string;
	postSort?: number;
	remarks?: string;
}
