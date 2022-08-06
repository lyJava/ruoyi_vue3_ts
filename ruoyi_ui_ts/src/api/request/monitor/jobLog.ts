import request from "@/utils/request";

/**
 * 查询调度日志列表
 * 
 * @param {object} param 参数Obj
 * @returns 
 */
export const listJobLog = async (param: any) => {
    return await request({
        url: "/monitor/jobLog/list",
        method: "get",
        params: param
    });
};

/**
 * 删除调度日志
 * 
 * @param {string} jobLogId 日志ID
 * @returns 
 */
export const delJobLog = async (jobLogId: string) => {
    return await request({
        url: "/monitor/jobLog/" + jobLogId,
        method: "delete"
    });
};

/**
 * 清空调度日志
 * 
 * @returns 
 */
export const cleanJobLog = async () => {
    return await request({
        url: "/monitor/jobLog/clean",
        method: "delete"
    });
};

/**
 * 导出调度日志
 * 
 * @param {object} query 参数Obj
 * @returns 
 */
export const exportJobLog = async (query: any) => {
    return await request({
        url: "/monitor/jobLog/export",
        method: "get",
        params: query
    });
};
