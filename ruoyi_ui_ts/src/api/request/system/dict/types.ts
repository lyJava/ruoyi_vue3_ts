export interface TypeQueryParam {
	pageNum?: number;
	pageSize?: number;
	dictName?: string;
	dictType?: string;
	status?: string;
}

export interface TypeFormParam extends TypeQueryParam {
	dictId?: string;
	remark?: string;
}

export interface DataQueryParam {
	pageNum?: number;
	pageSize?: number;
	dictLabel?: string;
	dictType?: string;
	dictStatus?: string;
}

export interface DataFormParam extends DataQueryParam {
	id?: string;
	dictValue?: string;
	dictSort?: number;
	remarks?: string;
}
