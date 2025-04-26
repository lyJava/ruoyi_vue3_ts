import { getToken } from "@/utils/auth";
import { useSafeInstance } from "@/utils/ruoyi";
import { UploadFile, UploadRawFile } from "element-plus";

export default (props: any) => {
	const proxy = useSafeInstance();
	const number = ref<number>(0);
	const uploadList = ref<UploadFile[]>([]);
	const baseUrl = import.meta.env.VITE_APP_BASE_API;
	const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + "/common/upload";
	const headers = { Authorization: "Bearer " + getToken() };
	const fileList = ref<UploadFile[] | undefined>([]);


    const showTip = computed(
        () => props.isShowTip && (props.fileType || props.fileSize)
    );

	// 上传前校检格式和大小
	const handleBeforeUpload = (file: UploadRawFile) => {
		// 校检文件类型
		if (props.fileType.length) {
			let fileExtension = "";
			if (file.name.lastIndexOf(".") > -1) {
				fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
			}
			const isTypeOk = props.fileType.some((type: any) => {
				if (file.type.indexOf(type) > -1) return true;
				if (fileExtension && fileExtension.indexOf(type) > -1)
					return true;
				return false;
			});
			if (!isTypeOk) {
				proxy.$modal.msgError(
					`文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`
				);
				return false;
			}
		}
		// 校检文件大小
		if (props.fileSize) {
			const isLt = file.size / 1024 / 1024 < props.fileSize;
			if (!isLt) {
				proxy.$modal.msgError(
					`上传文件大小不能超过 ${props.fileSize} MB!`
				);
				return false;
			}
		}
		proxy.$modal.loading("正在上传文件，请稍候...");
		number.value++;
		return true;
	};

	// 文件个数超出
	const handleExceed = () => {
		proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
	};

	// 上传失败
	const handleUploadError = (err: Error) => {
		console.log("上传文件失败", err);
		proxy.$modal.msgError("上传文件失败");
	};

	const emit = defineEmits(["update:modelValue"]);

	// 上传成功回调
	const handleUploadSuccess = (uploadFile: UploadFile) => {
		uploadList.value.push(uploadFile);
		if (uploadList.value.length === number.value) {
			fileList.value = fileList
				.value!.filter((f) => f.url !== undefined)
				.concat(uploadList.value);
			uploadList.value = [];
			number.value = 0;
			emit("update:modelValue", listToString(fileList.value));
			proxy.$modal.closeLoading();
		}
	};

	// 删除文件
	const handleDelete = (index: number) => {
		fileList.value?.splice(index, 1);
		emit("update:modelValue", listToString(fileList.value!));
	};

	// 获取文件名称
	const getFileName = (name: string) => {
		if (name.lastIndexOf("/") > -1) {
			return name.slice(name.lastIndexOf("/") + 1);
		} else {
			return "";
		}
	};

	// 对象转成指定字符串分隔
	const listToString = (list: any[], separator?: string) => {
		let str = "";
		separator = separator || ",";
		for (let i in list) {
			if (undefined !== list[i].url) {
				str += list[i].url + separator;
			}
		}
		return str !== "" ? str.substring(0, str.length - 1) : "";
	};

    return {
        number,
        uploadList,
        baseUrl,
        uploadFileUrl,
        headers,
        fileList,
        showTip,
        getFileName,
        handleBeforeUpload,
        handleUploadError,
        handleExceed,
        handleUploadSuccess,
        handleDelete
    }
};
