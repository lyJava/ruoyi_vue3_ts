<template>
	<div class="upload-file">
		<el-upload
			multiple
			:action="uploadFileUrl"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:limit="limit"
			:on-error="handleUploadError"
			:on-exceed="handleExceed"
			:on-success="handleUploadSuccess"
			:show-file-list="false"
			:headers="headers"
			class="upload-file-uploader"
			ref="upload"
		>
			<!-- 上传按钮 -->
			<el-button type="primary">选取文件</el-button>
		</el-upload>
		<!-- 上传提示 -->
		<div class="el-upload__tip" v-if="showTip">
			请上传
			<template v-if="fileSize">
				大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
			</template>
			<template v-if="fileType">
				格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
			</template>
			的文件
		</div>
		<!-- 文件列表 -->
		<transition-group
			class="upload-file-list el-upload-list el-upload-list--text"
			name="el-fade-in-linear"
			tag="ul"
		>
			<li
				:key="file.uid"
				class="el-upload-list__item ele-upload-list__item-content"
				v-for="(file, index) in fileList"
			>
				<el-link
					:href="`${baseUrl}${file.url}`"
					:underline="false"
					target="_blank"
				>
					<span class="document">
						{{ getFileName(file.name) }}
					</span>
				</el-link>
				<div class="ele-upload-list__item-content-action">
					<el-link
						:underline="false"
						@click="handleDelete(index)"
						type="danger"
						>删除</el-link
					>
				</div>
			</li>
		</transition-group>
	</div>
</template>

<script lang="ts" setup>
import useFileUpload from "./index";

const props = defineProps({
	modelValue: [String, Object, Array],
	limit: {
		type: Number,
		default: 5,
	},
	fileSize: {
		type: Number,
		default: 5,
	},
	fileType: {
		type: Array,
		default: ["doc", "xls", "ppt", "txt", "pdf"],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: true,
	},
});

const {
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
	handleDelete,
} = useFileUpload(props);

watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			let temp = 1;
			// 首先将值转为数组
			const list = Array.isArray(val)
				? val
				: props.modelValue?.toString().split(",");
			// 然后将数组转为对象数组
			fileList.value = list?.map((item) => {
				if (typeof item === "string") {
					item = { name: item, url: item };
				}
				item.uid = item.uid || new Date().getTime() + temp++;
				return item;
			});
		} else {
			fileList.value = [];
			return [];
		}
	},
	{ deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.upload-file-uploader {
	margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
	border: 1px solid #e4e7ed;
	line-height: 2;
	margin-bottom: 10px;
	position: relative;
}
.upload-file-list .ele-upload-list__item-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: inherit;
}
.ele-upload-list__item-content-action .el-link {
	margin-right: 10px;
}
</style>
