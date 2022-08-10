import { parseTime } from "./ruoyi";

/**
 * 表格时间格式化
 */
export const formatDate = (cellValue: string | number | Date) => {
	if (!cellValue) {
		return "";
	}
	var date = new Date(cellValue);
	var year = date.getFullYear();
	// prettier-ignore
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	// prettier-ignore
	var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	// prettier-ignore
	var minutes =  date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	// prettier-ignore
	var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	// prettier-ignore
	return (
        year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    );
};

/**
 * 返回几天前，刚刚等时间
 *
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export const formatTime = (time: any, option: any): string | null => {
	if (("" + time).length === 10) {
		time = parseInt(time) * 1000;
	} else {
		time = +time;
	}
	const d: any = new Date(time);
	const now = Date.now();

	const diff = (now - d) / 1000;

	if (diff < 30) {
		return "刚刚";
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + "分钟前";
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + "小时前";
	} else if (diff < 3600 * 24 * 2) {
		return "1天前";
	}
	if (option) {
		return parseTime(time, option);
	} else {
		// prettier-ignore
		return (d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分" );
	}
};

/**
 * 将Obj里的字段拼接
 * 
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url: string | null): object {
	url = url == null ? window.location.href : url;
	const search = url.substring(url.lastIndexOf("?") + 1);
	const obj = {};
	const reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, (rs: any, $1: string, $2: string) => {
		const name = decodeURIComponent($1);
		let val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
}

/**
 * 字符串的utf-8
 *
 * @param {string} input value
 * @returns {number} output value
 */
export const byteLength = (str: string): number => {
	// returns the byte length of an utf8 string
	let s = str.length;
	for (var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i);
		if (code > 0x7f && code <= 0x7ff) s++;
		else if (code > 0x7ff && code <= 0xffff) s += 2;
		if (code >= 0xdc00 && code <= 0xdfff) i--;
	}
	return s;
};

/**
 * 清空数组
 *
 * @param {Array} actual
 * @returns {Array}
 */
export const cleanArray = (actual: string | any[]): Array<any> => {
	const newArray = [];
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
};

/**
 * 参数编码
 *
 * @param {Object} json
 * @returns {Array}
 */
export const param = (json: { [x: string]: string | number | boolean; }): any => {
	if (!json) return "";
	return cleanArray(
		Object.keys(json).map((key) => {
			if (json[key] === undefined) return "";
			return (
				encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
			);
		})
	).join("&");
};

/**
 * URL编码
 *
 * @param {string} url
 * @returns {Object}
 */
export const param2Obj = (url: string): object => {
	const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
	if (!search) {
		return {};
	}
	const obj = {};
	const searchArr = search.split("&");
	searchArr.forEach((v) => {
		const index = v.indexOf("=");
		if (index !== -1) {
			const name = v.substring(0, index);
			const val = v.substring(index + 1, v.length);
			obj[name] = val;
		}
	});
	return obj;
};

/**
 * 创建div并且赋值
 *
 * @param {string} val
 * @returns {string}
 */
export const html2Text = (val: string): string => {
	const div = document.createElement("div");
	div.innerHTML = val;
	return div.textContent || div.innerText;
};

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export const objectMerge = (target: { [x: string]: any; }, source: string | any[]): object => {
	if (typeof target !== "object") {
		target = {};
	}
	if (Array.isArray(source)) {
		return source.slice();
	}
	Object.keys(source).forEach((property) => {
		const sourceProperty = source[property];
		if (typeof sourceProperty === "object") {
			target[property] = objectMerge(target[property], sourceProperty);
		} else {
			target[property] = sourceProperty;
		}
	});
	return target;
};

/**
 * 元素class切换
 * 
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleClass = (element: { className: any; }, className: string | any[]) => {
	if (!element || !className) {
		return;
	}
	let classString = element.className;
	const nameIndex = classString.indexOf(className);
	if (nameIndex === -1) {
		classString += "" + className;
	} else {
		classString =
			classString.substr(0, nameIndex) +
			classString.substr(nameIndex + className.length);
	}
	element.className = classString;
};

/**
 * @param {string} type
 * @returns {Date}
 */
export const getTime = (type: string): any => {
	if (type === "start") {
		return new Date().getTime() - 3600 * 1000 * 24 * 90;
	} else {
		return new Date(new Date().toDateString());
	}
};

/**
 * 防抖函数
 * 
 * @param {Function} func     函数
 * @param {number} wait       毫秒数
 * @param {boolean} immediate 到达边界不调用 
 * @return {*}
 */
export const debounce = (func: any, wait: number, immediate: boolean): any => {
	let timeout: NodeJS.Timeout | null, args: null, context: null | undefined, timestamp: number, result: any;

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp;

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return (...args: any) => {
		context = this;
		timestamp = +new Date();
		const callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
};

/**
 * 深克隆
 * 
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {any} source
 * @returns {Object}
 */
export const deepClone = (source: any): object => {
	if (!source && typeof source !== "object") {
		throw new Error("error arguments");
	}
	const targetObj = source.constructor === Array ? [] : {};
	Object.keys(source).forEach((keys) => {
		if (source[keys] && typeof source[keys] === "object") {
			targetObj[keys] = deepClone(source[keys]);
		} else {
			targetObj[keys] = source[keys];
		}
	});
	return targetObj;
};

/**
 * 数组去重
 * 
 * @param {Array} arr
 * @returns {Array}
 */
export const uniqueArr = (arr: Iterable<unknown> | null | undefined): Array<any> => {
	return Array.from(new Set(arr));
};

/**
 * @returns {string}
 */
// export const createUniqueString = () => {
// 	const timestamp = +new Date() + "";
// 	const randomNum = parseInt((1 + Math.random() + 0) * 65536);
// 	return (+(randomNum + timestamp)).toString(32);
// };

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (ele: { className: string; }, cls: string): boolean => {
	return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};

/**
 * 元素添加指定class
 * 
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export const addClass = (ele: { className: string; }, cls: string) => {
	if (!hasClass(ele, cls)) ele.className += " " + cls;
};

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export const removeClass = (ele: { className: string; }, cls: string) => {
	if (hasClass(ele, cls)) {
		const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		ele.className = ele.className.replace(reg, " ");
	}
};

export const makeMap = (str: string, expectsLowerCase: any) => {
	const map = Object.create(null);
	const list = str.split(",");
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return expectsLowerCase
		? (val: string) => map[val.toLowerCase()]
		: (val: string | number) => map[val];
};

export const exportDefault = "export default ";

export const beautifierConf = {
	html: {
		indent_size: "2",
		indent_char: " ",
		max_preserve_newlines: "-1",
		preserve_newlines: false,
		keep_array_indentation: false,
		break_chained_methods: false,
		indent_scripts: "separate",
		brace_style: "end-expand",
		space_before_conditional: true,
		unescape_strings: false,
		jslint_happy: false,
		end_with_newline: true,
		wrap_line_length: "110",
		indent_inner_html: true,
		comma_first: false,
		e4x: true,
		indent_empty_lines: true,
	},
	js: {
		indent_size: "2",
		indent_char: " ",
		max_preserve_newlines: "-1",
		preserve_newlines: false,
		keep_array_indentation: false,
		break_chained_methods: false,
		indent_scripts: "normal",
		brace_style: "end-expand",
		space_before_conditional: true,
		unescape_strings: false,
		jslint_happy: true,
		end_with_newline: true,
		wrap_line_length: "110",
		indent_inner_html: true,
		comma_first: false,
		e4x: true,
		indent_empty_lines: true,
	},
};

// 首字母大小
export const titleCase = (str: string) => {
	return str.replace(/( |^)[a-z]/g, (L: string) => L.toUpperCase());
};

// 下划转驼峰
export const camelCase = (str: string) => {
	return str.replace(/-[a-z]/g, (str1: string) => str1.substr(-1).toUpperCase());
};

export const isNumberStr = (str: string) => {
	return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
};
