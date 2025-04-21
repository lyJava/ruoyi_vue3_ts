/**
 * 判断url是否是http或https
 *
 * @param {string} url
 * @returns {Boolean}
 */
export function isHttp(url: string | string[]): boolean {
	return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
}

/**
 * 验证是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string): boolean => {
	return /^(https?:|mailto:|tel:)/.test(path);
};


const DEFAULT_EXTERNAL_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

/**
 *  验证是否是外部链接 - 支持动态协议配置的版本
 * @param path 
 * @param protocols 
 * @returns 
 */
export const isExternalDynamic = (
	path: string,
	protocols: string[] = DEFAULT_EXTERNAL_PROTOCOLS
): boolean => {
	try {
		const url = new URL(path);
		return protocols.includes(url.protocol.toLowerCase());
	} catch {
		return false; // 非标准 URL 格式视为内部路径
	}
};

/**
 * 默认验证通过的用户名
 */
const DEFAULT_VALID_USERNAMES = ["admin", "editor"];
const VALID_SET = new Set(
	DEFAULT_VALID_USERNAMES.map((name) => name.toLowerCase())
);

/**
 * 验证用户名是否在预设用户名中
 *
 * @param {string} input 用户名
 * @returns {Boolean}
 */
export const validUsername = (
	input: string,
	customValidSet?: Set<string>
): boolean => {
	const normalized = input.trim().toLowerCase();
	return (customValidSet || VALID_SET).has(normalized);
};

/**
 * 验证是否是合法的URL地址
 *
 * @param {string} url
 * @returns {Boolean}
 */
export const validURL = (url: string): boolean => {
	const reg =
		/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return reg.test(url);
};

/**
 * 是否全部是小写字母
 *
 * @param {string} str
 * @returns {Boolean}
 */
export const validLowerCase = (str: string): boolean => {
	const reg = /^[a-z]+$/;
	return reg.test(str);
};

/**
 * 是否全部是大写字母
 *
 * @param {string} str
 * @returns {Boolean}
 */
export const validUpperCase = (str: string): boolean => {
	const reg = /^[A-Z]+$/;
	return reg.test(str);
};

/**
 * 验证是否是字母
 *
 * @param {string} str
 * @returns {Boolean}
 */
export const validAlphabets = (str: string): boolean => {
	const reg = /^[A-Za-z]+$/;
	return reg.test(str);
};

/**
 * 验证是否是邮箱
 *
 * @param {string} email
 * @returns {Boolean}
 */
export const validEmail = (email: string): boolean => {
	const reg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return reg.test(email);
};

/**
 * 验证输入的值是否是字符串
 *
 * @param {string} value 输入的值
 * @returns {Boolean}
 */
export const isString = (value: unknown): boolean => {
	return typeof value === "string" || value instanceof String;
};

/**
 * 验证是否是数组(排除了类数组对象)
 *
 * @param {Array} arg 值
 * @returns {Boolean} 是否是数组
 */
export const isArray = (arg: unknown): boolean => {
	return (
		Array.isArray(arg) ||
		(typeof arg === "object" &&
			arg !== null &&
			Object.prototype.toString.call(arg) === "[object Array]")
	);
};
