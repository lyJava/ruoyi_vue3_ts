export interface QueryParam {
	pageNum?: number;
	pageSize?: number;
	configName?: string;
	configKey?: string;
	configType?: string;
}

export interface FormParam extends QueryParam {
	id?: string;
	configValue?: string;
	remark?: string;
}
