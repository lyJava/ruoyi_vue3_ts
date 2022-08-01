import Vue from "vue";
import { mergeRecursive } from "@/utils/ruoyi";
import DictMeta from "./DictMeta";
import DictData from "./DictData";


var VueApp: any = Vue;

const DEFAULT_DICT_OPTIONS = {
	types: []
};

/**
 * @classdesc 字典
 * 
 * @property {Object} label 标签对象，内部属性名为字典类型名称
 * @property {Object} dict 字段数组，内部属性名为字典类型名称
 * @property {Array.<DictMeta>} _dictMetas 字典元数据数组
 */
export default class Dict {
    owner: null;
    label: {};
    type: {};
    _dictMetas: any;
	constructor() {
		this.owner = null;
		this.label = {};
		this.type = {};
	}

	init(options: { [x: string]: any; types?: any[]; }) {
		if (options instanceof Array) {
			options = { types: options };
		}
		const opts = mergeRecursive(DEFAULT_DICT_OPTIONS, options);
		if (opts.types === undefined) {
			throw new Error("need dict types");
		}
		const ps: any[] = [];
		this._dictMetas = opts.types.map((t: any) => DictMeta.parse(t));
		this._dictMetas.forEach((dictMeta: { type: any; lazy: any; }) => {
			const type = dictMeta.type;
			VueApp.set(this.label, type, {});
			VueApp.set(this.type, type, []);
			if (dictMeta.lazy) {
				return;
			}
			ps.push(loadDict(this, dictMeta));
		});
		return Promise.all(ps);
	}

	/**
	 * 重新加载字典
	 * @param {String} type 字典类型
	 */
	reloadDict(type: any) {
		const dictMeta = this._dictMetas.find((e: { type: any; }) => e.type === type);
		if (dictMeta === undefined) {
			return Promise.reject(`the dict meta of ${type} was not found`);
		}
		return loadDict(this, dictMeta);
	}
}

/**
 * 加载字典
 * 
 * @param {Dict} dict 字典
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {Promise}
 */
export const loadDict = async (dict: any, dictMeta: { type: any; lazy?: any; request?: any; responseConverter?: any; }) => {
	 return await dictMeta.request(dictMeta).then((response: any) => {
		const type = dictMeta.type;
		let dicts = dictMeta.responseConverter(response, dictMeta);
		if (!(dicts instanceof Array)) {
			console.error(
				"the return of responseConverter must be Array.<DictData>"
			);
			dicts = [];
		} else if (
			dicts.filter(d => d instanceof DictData).length !== dicts.length
		) {
			console.error("the type of elements in dicts must be DictData");
			dicts = [];
		}
		dict.type[type].splice(0, Number.MAX_SAFE_INTEGER, ...dicts);
		dicts.forEach((d: { value: any; label: any; }) => {
			VueApp.set(dict.label[type], d.value, d.label);
		});
		return dicts;
	});
}
