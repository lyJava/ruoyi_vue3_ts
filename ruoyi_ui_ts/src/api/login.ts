import request from "@/utils/request";

/**
 * 登录方法
 *
 * @param {object} loginParam 登录参数
 * @returns
 */
export const login = async (loginParam: any) => {
	return await request({
		url: "/login",
		method: "post",
		data: loginParam,
	});
};

/**
 * 获取用户(角色与权限)详细信息
 *
 * @returns
 */
export const getInfo = async () => {
	return await request({
		url: "/getInfo",
		method: "get",
	});
};

/**
 * 退出
 *
 * @returns
 */
export const logout = async () => {
	return await request({
		url: "/logout",
		method: "post",
	});
};

/**
 * 获取验证码
 *
 * @returns
 */
export const getCodeImg = async () => {
	return await request({
		url: "/captchaImage",
		method: "get",
	});
};

// 注册方法
export const register = async (data: any) => {
	return await request({
		url: "/register",
		headers: {
			isToken: false,
		},
		method: "post",
		data: data,
	});
};
