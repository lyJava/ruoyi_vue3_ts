import request from "@/utils/request";

/**
 * 单个删除
 * 
 * @param fileName 文件名
 * @returns 
 */
export const deleteFile = async (fileName: string) => {
	return await request({
		url: `/common/delete?name=${fileName}`,
		method: "get",
	});
};

/**
 * 批量删除
 * 
 * @param list 文件名称数组
 * @returns 
 */
export const batchDelete = async (list: string[]) => {
	return await request({
		url: `/common/batchDelete`,
		method: "post",
        data: list
	});
};