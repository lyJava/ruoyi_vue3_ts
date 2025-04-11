<template>
	<div class="upload-demo">
		<el-upload
			ref="uploadRef"
			:action="uploadUrl"
			list-type="picture-card"
			:headers="headers"
			:auto-upload="false"
			:file-list="fileList"
			:on-change="handleChange"
			:on-remove="handleRemove"
			:on-success="handleSuccess"
		>
			<el-icon><Plus /></el-icon>

			<template #file="{ file }">
				<div class="custom-upload-file">
					<img
						class="el-upload-list__item-thumbnail"
						:src="file.url"
						:alt="file.name"
					/>
					<span class="el-upload-list__item-actions">
						<el-tooltip content="预览">
							<span @click.stop="handlePreview(file)">
								<el-icon><ZoomIn /></el-icon>
							</span>
						</el-tooltip>

						<el-tooltip content="下载" v-if="!disabled">
							<span @click.stop="handleDownload(file)">
								<el-icon><Download /></el-icon>
							</span>
						</el-tooltip>

						<el-tooltip content="删除" v-if="!disabled">
							<span @click.stop="handleRemove(file)">
								<el-icon><Delete /></el-icon>
							</span>
						</el-tooltip>
					</span>
				</div>
			</template>
		</el-upload>

		<!-- 添加手动上传按钮 -->
		<el-button
			type="primary"
			@click="submitUpload"
			style="margin-top: 20px"
		>
			开始上传
		</el-button>

		<el-dialog v-model="dialogVisible" title="图片预览" append-to-body>
			<img w-full :src="dialogImageUrl" class="preview-image" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { ElUpload, UploadFile, UploadFiles } from "element-plus";
import { ElMessage} from "element-plus";
import { getToken } from "@/utils/auth";

// 上传配置
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload");
const headers = computed(() => ({
	Authorization: `Bearer ${getToken()}`,
	"X-Requested-With": "XMLHttpRequest",
}));

const uploadRef = ref<InstanceType<typeof ElUpload>>();

// 添加手动上传方法
const submitUpload = () => {
	uploadRef.value!.submit(); // 手动触发上传
};
// 响应式数据
const fileList = ref<UploadFile[]>([]);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const disabled = ref(false);

// 处理文件变化
const handleChange = (file: UploadFile, files: UploadFiles) => {
	fileList.value = files;
};

// 处理文件删除
const handleRemove = (file: UploadFile) => {
	const index = fileList.value.indexOf(file);
	if (index !== -1) {
		fileList.value.splice(index, 1);
	}
};

// 处理图片预览
const handlePreview = (file: UploadFile) => {
	if (!file.url && !file.raw) return;
	dialogImageUrl.value = file.url || URL.createObjectURL(file.raw!);
	dialogVisible.value = true;
};

const handleSuccess = (
	response: any,
	uploadFile: UploadFile,
	uploadFiles: UploadFiles
) => {
	console.log("返回===", response);

	// 这里需要根据你的接口返回结构处理
	if (response.code === 200) {
		ElMessage.success("文件上传成功");
		// 更新文件列表
		fileList.value = uploadFiles;
	}
};

// 处理文件下载
const handleDownload = (file: UploadFile) => {
	if (!file.url) return;

	const link = document.createElement("a");
	link.href = file.url;
	link.download = file.name || "download";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
</script>

<style scoped>
.upload-demo {
	padding: 20px;
}

.custom-upload-file {
	position: relative;
	width: 100%;
	height: 100%;
}

.preview-image {
	display: block;
	max-width: 100%;
	margin: 0 auto;
	border-radius: 4px;
}

.el-upload-list__item-actions {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
}

.el-upload-list__item-actions span {
	cursor: pointer;
	transition: color 0.3s;
}

.el-upload-list__item-actions span:hover {
	color: var(--el-color-primary);
}

.el-upload--picture-card {
	--el-upload-picture-card-size: 120px;
}
</style>
