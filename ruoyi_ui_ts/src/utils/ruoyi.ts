import lodash from "lodash";
// prettier-ignore
import { ComponentPublicInstance, isRef, ref, Ref, } from "vue";
import { getToken } from "./auth";
import { ElMessage } from "element-plus";
/**
 * 通用ts方法封装处理
 * Copyright (c) 2019 ruoyi
 */
const baseURL = import.meta.env.VITE_APP_BASE_API;

/**
 * 日期格式化
 *
 * @param {string} time 日期
 * @param {string} pattern 格式化类型
 * @returns
 */
export const parseTime = (time: string | number | Date, pattern: string = "{y}-{m}-{d} {h}:{i}:{s}") => {
	if (!time) {
		return null;
	}
	const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
	let date;
	if (typeof time === "object") {
		date = time;
	} else {
		if (typeof time === "string" && /^[0-9]+$/.test(time)) {
			time = parseInt(time);
		} else if (typeof time === "string") {
			time = time.replace(new RegExp(/-/gm), "/");
		}
		// prettier-ignore
		if (typeof time === "number" && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj: {
		[key in "y" | "m" | "d" | "h" | "i" | "s" | "a" | "ms" | "q" | "ap"]: number | string;
	} = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
		ms: date.getMilliseconds(),
		q: Math.floor((date.getMonth() + 3) / 3),
		ap: date.getHours() < 12 ? "AM" : "PM",
	};
	// prettier-ignore
	const time_str = format.replace(/{(y|m|d|h|i|s|a|ms)+}/g, (match: string, key: string) => {
		// 类型断言 key 为合法键
		const validKey = key as keyof typeof formatObj;
		// 类型保护
		if (!(validKey in formatObj)) {
			return match; // 返回原始匹配值
		}
		let value = formatObj[validKey];
		// Note: getDay() returns 0 on Sunday
		if (key === "a") {
			return ["日", "一", "二", "三", "四", "五", "六"][validKey as unknown as number];
		}
		if (key === "ms") {
			return String(value).padStart(3, "0");
		}
		// 统一返回字符串类型
		return typeof value === "number" && value < 10 && validKey !== 'y' && validKey !== "q" ? `0${value}` : `${value}`// 年份不需要补零 
			? `0${value}`
			: value.toString();
	});
	return time_str;
};

/**
 * 时间格式化(moment格式)
 * 
 * @param time 日期时间
 * @param format 格式化字符串，比如YYYY-MM-DD HH:mm:ss
 * @returns 
 */
export const parseTimeMoment = (time: string | number | Date, format: string = "YYYY-MM-DD HH:mm:ss") => {
	if (!time) {
		return null;
	}
	let date;
	if (typeof time === "object") {
		date = time;
	} else {
		if (typeof time === "string" && /^[0-9]+$/.test(time)) {
			time = parseInt(time);
		} else if (typeof time === "string") {
			time = time.replace(new RegExp(/-/gm), "/");
		}
		// prettier-ignore
		if (typeof time === "number" && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}

	const pad = (num: number, length: number = 2) => num.toString().padStart(length, "0");

	const formatObj: Record<string, string> = {
		YYYY: date.getFullYear().toString(),
		YY: date.getFullYear().toString().slice(2),
		MM: pad(date.getMonth() + 1),
		M: (date.getMonth() + 1).toString(),
		DD: pad(date.getDate()),
		D: date.getDate().toString(),
		HH: pad(date.getHours()),
		H: date.getHours().toString(),
		hh: pad(date.getHours() % 12 === 0 ? 12 : date.getHours() % 12),
		mm: pad(date.getMinutes()),
		m: date.getMinutes().toString(),
		ss: pad(date.getSeconds()),
		s: date.getSeconds().toString(),
		SSS: pad(date.getMilliseconds(), 3),
		A: date.getHours() < 12 ? "AM" : "PM",
		a: date.getHours() < 12 ? "am" : "pm",
		Q: Math.floor((date.getMonth() + 3) / 3).toString(),
		dddd: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()],
	};

	// 将 moment 风格格式替换为实际值
	const result = format.replace(
		/(YYYY|YY|MM|M|DD|D|HH|H|hh|mm|m|ss|s|SSS|A|a|Q|dddd)/g,
		(match) => formatObj[match] ?? match
	);
	return result;
};

/**
 * 日期时间截取
 *
 * @param dateTime 日期时间
 * @returns
 */
export const dateTimeSub = (dateTime: unknown): string => {
	if (!dateTime) return "";

	let str: string;

	if (typeof dateTime === "string") {
		str = dateTime.trim();
	} else if (dateTime instanceof Date) {
		str = dateTime.toISOString();
	} else {
		str = String(dateTime).trim();
	}

	// 处理 ISO 格式（优先级最高）
	const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})T/);
	if (isoMatch) return isoMatch[1];

	// 处理紧凑格式 YYYYDDMM（新增逻辑）
	const compactMatch = str.match(/^(\d{4})(\d{2})(\d{2})$/);
	if (compactMatch) {
		const [, yyyy, dd, mm] = compactMatch; // 分解为年-日-月
		return `${yyyy}-${mm}-${dd}`;
	}

	// 处理斜杠格式 DD/MM/YYYY
	const slashMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
	if (slashMatch) {
		const [, dd, mm, yyyy] = slashMatch;
		return `${yyyy}-${mm}-${dd}`;
	}

	// 默认截取前10字符
	return str.slice(0, 10);
};

/**
 * 表单重置
 *
 * @param {string} formRef
 */
export const resetForm = (
	formRef:
		| Ref<{ resetFields?: () => void }>
		| { resetFields?: () => void }
		| null
		| undefined
): void => {
	// 参数空值校验
	if (formRef === null || formRef === undefined) {
		console.error(`resetForm方法参数验证失败，收到类型：${typeof formRef}`);
		throw new Error(`参数不能为：${typeof formRef}`);
	}
	const actualInstance = isRef(formRef) ? formRef.value : formRef;
	// 实例及调用方法有效性校验
	if (actualInstance && typeof actualInstance.resetFields == "function") {
		actualInstance.resetFields();
	}
};

/**
 * 清除表格选中
 *
 * @param tableRef 表格ref
 */
export const cleanTableSelection = (
	tableRef:
		| Ref<{ clearSelection?: () => void }>
		| { clearSelection?: () => void }
		| null
		| undefined
): void => {
	// 参数空值校验
	if (tableRef === null || tableRef === undefined) {
		console.error(
			`cleanTableSelection方法参数验证失败，收到类型：${typeof tableRef}`
		);
		throw new Error(`参数不能为：${typeof tableRef}`);
	}

	const actualInstance = isRef(tableRef) ? tableRef.value : tableRef;
	// 实例及调用方法有效性校验
	if (actualInstance && typeof actualInstance.clearSelection == "function") {
		actualInstance.clearSelection();
	}
};

type TableInstance = {
	toggleRowSelection: <T>(row: T, selected: boolean) => void;
};

/**
 * 设置表格行是否为选中状态
 *
 * @param tableRef  表格ref
 * @param row       表格行
 * @param selected  是否选中
 */
// prettier-ignore
export const setTableRowSelected = <T extends Object>(tableRef: Ref<TableInstance | null> | TableInstance | null | undefined, row: T, selected: boolean): void => {
	// 参数空值校验
	if (tableRef === null || tableRef === undefined) {
		console.error(
			`setTableRowSelected方法参数验证失败 收到类型：${typeof tableRef}`
		);
		throw new Error(`参数不能为：${typeof tableRef}`);
	}
	// 设置当前行被选中
	const actualInstance = isRef(tableRef) ? tableRef.value : tableRef;
	// 实例及调用方法有效性校验
	if (actualInstance && typeof actualInstance.toggleRowSelection == "function") {
		actualInstance.toggleRowSelection(row, selected);
	}
};

/**
 * 添加日期范围
 *
 * @param params
 * @param dateRange
 * @param propName
 * @returns
 */
// prettier-ignore
export const addDateRange = (params: any, dateRange: any[], propName: string) => {
	let search = params;
	search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
	dateRange = Array.isArray(dateRange) ? dateRange : [];
	if (dateRange) {
		if (typeof propName !== "undefined") {
			const firstCode = propName.substring(0, 1);
			if (!isUpCase(firstCode)) {
				propName = firstCode.toUpperCase() + propName.substring(1);
			} else {
				propName = firstCode + propName.substring(1);
			}
			search.params["begin" + propName] = dateRange[0];
			search.params["end" + propName] = dateRange[1];
		} else {
			search.params["beginTime"] = dateRange[0];
			search.params["endTime"] = dateRange[1];
		}
	}
	return search;
};

/**
 * 回显数据字典
 *
 * @param datas
 * @param value
 * @param separator
 * @returns
 */
export const selectDictLabel = (
	datas: any,
	value: string | undefined,
	separator: undefined
) => {
	if (!value || !datas) {
		return "";
	}
	let actions: any = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == "" + value) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	});
	if (actions.length === 0) {
		actions.push(value);
	}
	return actions.join("");
};

interface DictItem {
	dictValue: string | number;
	dictLabel: string;
}

type DictDataSource = DictItem[] | Record<string, DictItem>;

/**
 * 回显数据字典（字符串数组）
 *
 * @param datas
 * @param value
 * @param separator
 * @returns
 */
export const selectDictLabels = (
	datas: DictDataSource | null | undefined,
	value?: string | number | null | undefined, // 改为可选参数，符合实际使用场景
	separator = "," // 默认参数简化
): string => {
	// 防御性检查
	if (!value || !datas) return String(value ?? "");

	// 统一数据结构转换（添加类型断言）
	const items = Array.isArray(datas)
		? datas
		: Object.values(datas).filter(isDictItem);

	// 类型守卫函数
	function isDictItem(item: any): item is DictItem {
		return item && typeof item === "object" && "dictValue" in item;
	}

	// 查找所有匹配项（支持多值匹配）
	const matchedLabels = items
		.filter((item) => String(item.dictValue) === String(value))
		.map((item) => item.dictLabel);

	// 返回结果处理
	return matchedLabels.length > 0
		? matchedLabels.join(separator)
		: String(value);
};

/**
 *  通用下载方法
 *
 * @param fileName 文件名称
 */
export const download = (fileName: string) => {
	// prettier-ignore
	console.log("通用下载方法，文件名", fileName);
	// prettier-ignore
	window.location.href = `${baseURL}/common/download?fileName=${encodeURI(fileName)}&delete=true`;
};

/**
 * 通过URL下载
 *
 * @param url 请求URL
 * @param fileName 文件名(可选，若不指定将使用浏览器默认下载行为)
 */
export const downloadWithURL = async (url: string, fileName?: string): Promise<void> => {
	try {

		/* if (!fileName) {
			window.location.href = url.startsWith("http") || url.startsWith("https") ? url : `${baseURL}/${url}`;
			return;
		} */

		let finalFileName = fileName;

		const { data, headers } = await useCusFetch(url, { method: "GET" }, "blob");

		debugger
		const contentDisposition = headers.get("Content-Disposition");
		console.log("返回内容响应===", contentDisposition);

		if (!finalFileName && contentDisposition) {
			const extractedName = extractFilename(contentDisposition);
			if (extractedName) {
				try {
					// 尝试解码 URL 编码的文件名
					finalFileName = decodeURIComponent(extractedName);
				} catch (e) {
					// 如果解码失败，使用原始值
					console.warn("文件名解码失败，使用原始值:", extractedName);
					finalFileName = extractedName;
				}
			}
		}

		const a = document.createElement("a");
		a.style.display = "none";
		// 强制下载,确保最终有文件名
		a.download = finalFileName || "download";

		document.body.appendChild(a);
		const blobUrl = window.URL.createObjectURL(data);
		a.href = blobUrl;
		a.click();

		document.body.removeChild(a);
		window.URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("下载失败:", error);
		ElMessage.error("下载失败");
	}
};

/**
 * 从 Content-Disposition 提取文件名
 * @param contentDisposition 
 * @returns 
 */
const extractFilename = (contentDisposition: string | null): string | null => {
	if (!contentDisposition) return null;

	// 1. 尝试匹配带引号的文件名（支持 URL 编码）
	const quotedMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-8'')?([^"';]+)["']?/i);
	if (quotedMatch && quotedMatch[1]) {
		return quotedMatch[1].replace(/['"]/g, '');
	}

	// 2. 尝试匹配不带引号的普通文件名
	const unquotedMatch = contentDisposition.match(/filename\*?=([^;]+)/i);
	if (unquotedMatch && unquotedMatch[1]) {
		return unquotedMatch[1].trim();
	}

	return null;
};

/**
 * 字符串格式化(%s )
 *
 * @param str 字符串
 * @returns
 */
export const sprintf = (format: string, ...args: any[]): string => {
	let currentIndex = 0;
	let isValid = true;

	const result = format.replace(/%s/g, (match) => {
		if (currentIndex >= args.length) {
			isValid = false;
			return ""; // 参数不足时返回空字符串
		}
		return String(args[currentIndex++]); // 类型安全转换
	});

	// 同时检查参数是否用完
	return isValid && currentIndex === args.length ? result : "";
};

/**
 * 转换字符串，undefined,null等转化为""
 *
 * @param str 字符串
 * @returns
 */
export const praseStrEmpty = (str: string): string => {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

// 数据合并
// prettier-ignore
export const mergeRecursive = (source: { [x: string]: any; }, target: { [x: string]: any; }) => {
	for (var p in target) {
		try {
			if (target[p].constructor == Object) {
				source[p] = mergeRecursive(source[p], target[p]);
			} else {
				source[p] = target[p];
			}
		} catch (e) {
			source[p] = target[p];
		}
	}
	return source;
};

interface TreeNode {
	[key: string]: any;
	children?: TreeNode[];
}

/**
 * 构造树型结构数据
 *
 * @param {*} data 数据源
 * @param {*} idKey id字段 默认 'id'
 * @param {*} parentIdKey 父节点字段 默认 'parentId'
 * @param {*} childrenKey 孩子节点字段 默认 'children'
 */
// prettier-ignore
export const handleTree = <T extends TreeNode>(
	data: T[],
	idKey: string = 'id',
	parentIdKey: string = 'parentId',
	childrenKey: string = 'children'
): T[] => {
	const config = {
		id: idKey,
		parentId: parentIdKey,
		children: childrenKey
	}

	// 没有数据直接返回
	if (!data) {
		return [];
	}

	// 使用 Map 替代对象提高类型安全性
	const childrenMap = new Map<string | number, T[]>()
	const nodeMap = new Map<string | number, T>()
	const tree: T[] = []

	// 第一阶段：构建映射关系
	data.forEach(node => {
		const parentId = node[config.parentId]

		// 初始化子节点容器
		if (!childrenMap.has(parentId)) {
			childrenMap.set(parentId, [])
		}
		childrenMap.get(parentId)?.push(node)

		nodeMap.set(node[config.id], node)
	})

	// 第二阶段：识别根节点
	data.forEach(node => {
		const parentId = node[config.parentId]
		if (!nodeMap.has(parentId)) {
			tree.push(node)
		}
	})

	// 第三阶段：递归构建树形结构
	const buildTree = (currentNode: T) => {
		const currentChildren = childrenMap.get(currentNode[config.id]) || []

		// 类型安全赋值方案
		if (currentChildren.length > 0) {
			// 方案1：使用类型断言（推荐）
			; (currentNode as any)[config.children] = currentChildren

			// 方案2：通过泛型扩展（需修改接口）
			// (currentNode as T & { [key: string]: any })[config.children] = currentChildren

			currentChildren.forEach(child => buildTree(child))
		}
	}

	tree.forEach(root => buildTree(root))
	return tree
}

interface TreeNode2 {
	id: string | number;
	parentId?: string | number | null;
	children?: TreeNode[];
	[key: string]: any; // 允许动态属性
}

export const handleTree2 = <T extends TreeNode2>(
	data: T[],
	config: {
		idKey?: string;
		parentIdKey?: string;
		childrenKey?: string;
	} = {}
): T[] => {
	const {
		idKey = "id",
		parentIdKey = "parentId",
		childrenKey = "children",
	} = config;

	// 3. 类型安全赋值策略
	const setChildren = (node: T, children: T[]) => {
		// 方法1：类型断言（推荐）
		(node as any)[childrenKey] = children;

		// 方法2：使用类型扩展
		// ;(node as T & { [key: string]: any })[childrenKey] = children
	};

	// 4. 其他逻辑保持不变...
	const childrenMap = new Map<string | number | null, T[]>();
	const nodeMap = new Map<string | number, T>();
	const tree: T[] = [];

	data.forEach((node) => {
		const parentId = node[parentIdKey] ?? null;
		if (!childrenMap.has(parentId)) {
			childrenMap.set(parentId, []);
		}
		childrenMap.get(parentId)!.push(node);
		nodeMap.set(node[idKey], node);
	});

	data.forEach((node) => {
		const parentId = node[parentIdKey];
		if (!nodeMap.has(parentId) && parentId !== 0) {
			tree.push(node);
		}
	});

	const buildTree = (currentNode: T) => {
		const currentChildren = childrenMap.get(currentNode[idKey]) || [];
		if (currentChildren.length > 0) {
			setChildren(currentNode, currentChildren); // 使用安全赋值方法
			currentChildren.forEach((child) => buildTree(child));
		}
	};

	tree.forEach((root) => buildTree(root));
	return tree;
};

/**
 * 参数处理
 *
 * @param {*} params  参数
 */
export const tansParams = (params: { [x: string]: any }) => {
	let result = "";
	if (!params) {
		return "";
	}

	// 判断是否是响应式对象
	if (isReactive(params) || isRef(params)) {
		params = toRaw(params);
	}

	for (const propName of Object.keys(params)) {
		const value = params[propName];
		var part = encodeURIComponent(propName) + "=";
		if (value !== null && value !== "" && typeof value !== "undefined") {
			if (typeof value === "object") {
				for (const key of Object.keys(value)) {
					// 也防止 value[key] 是 ref/reactive
					// prettier-ignore
					const val = isReactive(value[key]) || isRef(value[key]) ? toRaw(value[key]) : value[key];
					// prettier-ignore
					if (val !== null && val !== "" && typeof val !== "undefined") {
						let params = propName + "[" + key + "]";
						var subPart = encodeURIComponent(params) + "=";
						result += subPart + encodeURIComponent(value[key]) + "&";
					}
				}
			} else {
				result += part + encodeURIComponent(value) + "&";
			}
		}
	}
	return result;
}

// 验证是否为blob格式
export const blobValidate = async (data: any) => {
	let b = false;
	try {
		const text = await data.text();
		JSON.parse(text);
		b = false;
	} catch (error) {
		b = true;
	}
	return b;
};

/**
 * 判断字母是否是大写
 *
 * @param {string} str
 * @returns
 */
export const isUpCase = (str: any) => {
	if (!str) {
		return false;
	}
	let bool = false;
	const strCode = str.charCodeAt();
	// 大写
	if (strCode >= 65 && strCode <= 90) {
		bool = false;
	} else if (strCode >= 97 && strCode <= 122) {
		// 小写
		bool = true;
	} else {
		console.error(`不是字母`);
		throw new Error(`不是字母`);
	}
	return bool;
};

// 返回项目路径
export const getNormalPath = (p: string) => {
	if (p.length === 0 || !p || p == "undefined") {
		return p;
	}
	let res = p.replace("//", "/");
	if (res[res.length - 1] === "/") {
		return res.slice(0, res.length - 1);
	}
	return res;
};

/**
 * 通用防抖
 *
 * @param callback 回调函数
 * @param wait     等待毫秒数
 * @param type     回调函数额外参数
 * @param options  防抖额外参数
 * @returns
 */
// prettier-ignore
export const lodashFunc = (callback: Function, wait: number, type?: any, options?: any) => {
	return lodash.debounce(function () {
		type ? callback(type) : callback();
	}, wait, options);
};

/**
 * 随机返回数组中的某个元素
 *
 * @param arr 数组
 * @returns
 */
export const getRadomForArr = <T>(arr: Array<T>) => {
	return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 返回主键数组分隔,过滤undefined
 *
 * @param ids id数组或者字符串
 * @returns
 */
export const displayIdArr = (ids: string | string[]): string => {
	/*const newIds:string[] = []
	if (Array.isArray(ids)) {
		ids.forEach((item) => {
			if(item) {
				newIds.push(item)
			}
		});
	} 
	return Array.isArray(newIds) ? newIds.join(", ") : ids;
	*/
	const processedIds = Array.isArray(ids) ? ids : [ids];
	const validIds = processedIds.filter(Boolean);
	return validIds.join(", ");
};

/**
 * 安全获取vue组件实例类型
 *
 * @param _component 组件类型名称
 * @returns 组件类型
 */
// prettier-ignore
export const useComponentRef = <T extends abstract new (...args: never[]) => any>(_component: T) => {
	return ref<InstanceType<T>>();
};

/**
 * 安全获取proxy
 *
 * @returns 全局proxy
 */
// prettier-ignore
export const useSafeInstance = <T extends ComponentPublicInstance = ComponentPublicInstance | any>() => {
	const instance = getCurrentInstance();
	if (!instance) throw new Error('必须在 setup() 中使用');
	return instance.proxy as T;
};
