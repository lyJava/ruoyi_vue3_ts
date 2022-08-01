import DictOptions from "./DictOptions";
import DictData from "./DictData";

export default function(dict: any, dictMeta: any) {
	const label = determineDictField(
		dict,
		dictMeta.labelField,
		...DictOptions.DEFAULT_LABEL_FIELDS
	)  as any;
	const value = determineDictField(
		dict,
		dictMeta.valueField,
		...DictOptions.DEFAULT_VALUE_FIELDS
	) as any;
	return new DictData(dict[label], dict[value], dict);
}

/**
 * 确定字典字段
 * @param {DictData} dict
 * @param  {...String} fields
 */
function determineDictField(dict: any, ...fields: string[]) {
	// prettier-ignore
	return fields.find(f => Object.prototype.hasOwnProperty.call(dict, f));
}
