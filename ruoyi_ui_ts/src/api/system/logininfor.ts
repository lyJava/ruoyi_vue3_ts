import request from "@/utils/request";

/**
 * 查询登录日志列表
 * 
 * @param {object} query 
 * @returns 
 */
export const getlist = async (query: any) => {
     return await request({
        url: "/monitor/logininfor/list",
        method: "get",
        params: query
    });
};

/**
 * 删除登录日志
 * 
 * @param {string} infoId 
 * @returns 
 */
export const delLoginInfo = async (infoId: string | string[]) => {
    return await request({
        url: `/monitor/logininfor/${infoId}`,
        method: "delete"
    });
};

/**
 * 清空登录日志
 * 
 * @returns 
 */
export const cleanLogininfor = () => {
    return request({
        url: `/monitor/logininfor/clean`,
        method: "delete"
    });
};

/**
 * 导出登录日志
 * @param {object} query 
 * @returns 
 */
export const exportLogininfor = (query: any) => {
    return request({
        url: `/monitor/logininfor/export`,
        method: "get",
        params: query
    });
};

/**
 * 解除用户锁定
 * 
 * @param {object} query 
 * @returns 
 */
 export const unlockUser = (query: any) => {
    return request({
        url: `/monitor/logininfor/unlock?userName=${query}`,
        method: "get",
    });
};
