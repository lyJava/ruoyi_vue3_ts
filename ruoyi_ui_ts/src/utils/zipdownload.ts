import axios from "axios";
import { getToken } from "@/utils/auth";

const mimeMap = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip: "application/zip"
};


const baseUrl = import.meta.env.VITE_APP_BASE_API;
/**
 * 下载zip文件
 * 
 * @param {string} str 
 */
export const downLoadZip = (str: string) => {
    const url = baseUrl + str;
    axios({
        method: "get",
        url: url,
        responseType: "blob",
        headers: { Authorization: "Bearer " + getToken() }
    }).then(respose => {
        resolveBlob(respose, mimeMap.zip);
    });
}
/**
 * 解析blob响应内容并下载
 * 
 * @param {*} response blob响应内容
 * @param {String} mimeType MIME类型
 */
export const resolveBlob = (response: any, mimeType: string) => {
    const aLink = document.createElement("a");
    const blob = new Blob([response.data], { type: mimeType });
    // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    const patten = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
    const contentDisposition = decodeURI(response.headers["content-disposition"]);
    const result = patten.exec(contentDisposition) as any;
    let fileName = result[1];
    fileName = fileName.replace(/\"/g, "");
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute("download", fileName); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
}
