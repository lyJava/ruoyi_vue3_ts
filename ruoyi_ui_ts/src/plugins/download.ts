import axios from "axios";
import { ElMessage } from "element-plus";
import { FileSaverOptions, saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { blobValidate } from "@/utils/ruoyi";

const baseURL = import.meta.env.VITE_APP_BASE_API;

export default {
	name(name: string, isDelete = true) {
		// prettier-ignore
		var url = `${baseURL}/common/download?fileName=${encodeURI(name)} + "&delete=${isDelete}`;
		axios({
			method: "get",
			url: url,
			responseType: "blob",
			headers: { Authorization: "Bearer " + getToken() }
		}).then(async res => {
			const isLogin = await blobValidate(res.data);
			if (isLogin) {
				const blob = new Blob([res.data]);
				this.saveAs(blob, decodeURI(res.headers["download-filename"]), null);
			} else {
				this.printErrMsg(res.data);
			}
		});
	},
	resource(resource: string) {
		// prettier-ignore
		var url = `${baseURL}/common/download/resource?resource=${encodeURI(resource)}`;
		axios({
			method: "get",
			url: url,
			responseType: "blob",
			headers: { Authorization: "Bearer " + getToken() }
		}).then(async res => {
			const isLogin = await blobValidate(res.data);
			if (isLogin) {
				const blob = new Blob([res.data]);
				this.saveAs(blob, decodeURI(res.headers["download-filename"]), null);
			} else {
				this.printErrMsg(res.data);
			}
		});
	},
	zip(url: string, name: any) {
		axios({
			method: "get",
			url: `${baseURL}${url}`,
			responseType: "blob",
			headers: { Authorization: "Bearer " + getToken() }
		}).then(async res => {
			const isLogin = await blobValidate(res.data);
			if (isLogin) {
				const blob = new Blob([res.data], { type: "application/zip" });
				this.saveAs(blob, name, null);
			} else {
				this.printErrMsg(res.data);
			}
		});
	},
	saveAs(text: string | Blob, name: string | undefined, opts?: any) {
		saveAs(text, name, opts);
	},
	async printErrMsg(data: { text: () => any; }) {
		const resText = await data.text();
		const rspObj = JSON.parse(resText);
		// prettier-ignore
		const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
		ElMessage.error(errMsg);
	}
};
