import { mergeRecursive } from "@/utils/ruoyi";
import dictConverter from "./DictConverter";

interface MetaConfig {
	request: (dictMeta: { type: any }) => Promise<any[]>;
	responseConverter: (response: any, dictMeta: any) => any;
	labelField: string;
	valueField: string;
	type?: any;
}

export const options = {
	metas: {
		"*": {
			/**
			 * 字典请求，方法签名为function(dictMeta: DictMeta): Promise
			 */
			request: (dictMeta: { type: any; }) => {
				console.log(`load dict ${dictMeta.type}`);
				return Promise.resolve([]);
			},
			/**
			 * 字典响应数据转换器，方法签名为function(response: Object, dictMeta: DictMeta): DictData
			 */
			responseConverter,
			labelField: "label",
			valueField: "value"
		}
	} as Record<string, MetaConfig>, // 允许字符串索引,
	/**
	 * 默认标签字段
	 */
	DEFAULT_LABEL_FIELDS: ["label", "name", "title"],
	/**
	 * 默认值字段
	 */
	DEFAULT_VALUE_FIELDS: ["value", "id", "uid", "key"]
};

/**
 * 映射字典
 * @param {Object} response 字典数据
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {DictData}
 */
function responseConverter(response: any, dictMeta: any) {
	// prettier-ignore
	const dicts = response.content instanceof Array ? response.content : response;
	if (dicts === undefined) {
		// prettier-ignore
		console.warn(`no dict data of "${dictMeta.type}" found in the response`);
		return [];
	}
	return dicts.map((d: any) => dictConverter(d, dictMeta));
}

export function mergeOptions(src: { [x: string]: any; }) {
	mergeRecursive(options, src);
}

export default options;
