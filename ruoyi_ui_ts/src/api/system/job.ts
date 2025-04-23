import request from "@/utils/request";

/**
 * 查询定时任务调度列表
 *
 * @param {object} param
 * @returns
 */
export const listJob = async (param: any) => {
    return await request({
        url: "/monitor/job/list",
        method: "get",
        params: param
    });
};

/**
 * 查询定时任务调度详细
 *
 * @param {string} jobId
 * @returns
 */
export const getJob = async (jobId: string) => {
    return await request({
        url: `/monitor/job/${jobId}`,
        method: "get"
    });
};

// 新增定时任务调度
export const addJob = async (param: any) => {
    return await request({
        url: "/monitor/job",
        method: "post",
        data: param
    });
};

// 修改定时任务调度
export const updateJob = async (param: any) => {
    return await request({
        url: "/monitor/job",
        method: "put",
        data: param
    });
};

// 删除定时任务调度
export const delJob = async (jobId: string) => {
    return await request({
        url: `/monitor/job/${jobId}`,
        method: "delete"
    });
};

// 导出定时任务调度
export const exportJob = async (param: any) => {
    return await request({
        url: "/monitor/job/export",
        method: "get",
        params: param
    });
};

// 任务状态修改
export const changeJobStatus = async (jobId: string, status: string) => {
    return await request({
        url: "/monitor/job/changeStatus",
        method: "put",
        data: {
            jobId,
            status
        }
    });
};

/**
 * 批量修改任务状态
 * 
 * @param data 任务数组
 * @returns 
 */
export const batchChangeJobStatus = async (data : {jobId: string, status: string}[]) => {
    return await request({
        url: "/monitor/job/changeStatus/batch",
        method: "put",
        data
    });
};

// 定时任务立即执行一次
export const runJob = async (jobId: string, jobGroup: any) => {
    return await request({
        url: "/monitor/job/run",
        method: "put",
        data: {
            jobId,
            jobGroup
        }
    });
};
