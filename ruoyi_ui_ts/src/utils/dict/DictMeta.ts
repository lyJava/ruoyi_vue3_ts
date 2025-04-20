import { mergeRecursive } from "@/utils/ruoyi";
import DictOptions from "./DictOptions";


// 定义 MetaConfig 接口
  
/**
 * @classdesc 字典元数据
 * @property {String} type 类型
 * @property {Function} request 请求
 * @property {String} label 标签字段
 * @property {String} value 值字段
 */
export default class DictMeta {
    type: any;
    request: any;
    responseConverter: any;
    labelField: any;
    valueField: any;
    lazy: boolean;
    static parse: (options: any) => DictMeta;
	// prettier-ignore
	constructor(options: { [x: string]: any; type?: any; request?: any; responseConverter?: any; labelField?: any; valueField?: any; lazy?: any; }) {
        this.type = options.type
        this.request = options.request
        this.responseConverter = options.responseConverter
        this.labelField = options.labelField
        this.valueField = options.valueField
        this.lazy = options.lazy === true
    }
}

/**
 * 解析字典元数据
 * @param {Object} options
 * @returns {DictMeta}
 */
DictMeta.parse = function(options: any): DictMeta {
	let opts = null;
	if (typeof options === "string") {
		opts = DictOptions.metas[options] || {};
		opts.type = options;
	} else if (typeof options === "object") {
		opts = options;
	}
	opts = mergeRecursive(DictOptions.metas["*"], opts);
	return new DictMeta(opts);
};
