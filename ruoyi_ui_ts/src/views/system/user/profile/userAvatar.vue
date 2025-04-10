<template>
	<div>
		<div class="user-info-head" @click="editCropper()">
			<img
				v-bind:src="options.img"
				title="点击上传头像"
				class="img-circle img-lg"
			/>
		</div>
		<el-dialog
			title="头像改动"
			v-model="open"
			width="40%"
			style="margin-top: 16vh !important"
			append-to-body
			destroy-on-close
		>
			<el-row>
				<el-col :xs="24" :md="12" style="height: 360px">
					<div v-if="visible" style="margin-left: 2%">
						<cropper
							style="height: 360px"
							ref="cropperRef"
							:src="options.img"
							:stencil-props="{
								aspectRatio: 1,
								handlers: {},
								movable: true,
								resizable: true,
							}"
							:auto-zoom="true"
							:background="false"
							@change="handleChange"
						/>
					</div>
				</el-col>
				<el-col :xs="24" :md="12" style="height: 360px">
					<div class="avatar-upload-preview">
						<!-- prettier-ignore -->
						<img :src="options.previews.url" width="200" height="200" :style="previewStyle" class="preview-image"/>
					</div>
				</el-col>
			</el-row>
			<br />
			<el-row>
				<el-col :lg="2" :md="2">
					<el-upload
						action="#"
						:http-request="requestUpload"
						:show-file-list="false"
						:before-upload="beforeUpload"
					>
						<el-button size="small">
							选择
							<i class="upload -right"></i>
						</el-button>
					</el-upload>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="plus"
						size="small"
						@click="changeScale(1)"
						title="放大"
					/>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="minus"
						size="small"
						@click="changeScale(-1)"
						title="缩小"
					></el-button>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="refresh-left"
						size="small"
						@click="rotateLeft()"
						title="左旋"
					/>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="refresh-right"
						size="small"
						@click="rotateRight()"
						title="右旋"
					/>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button size="small" @click="restImg">还原</el-button>
				</el-col>
				<el-col :lg="{ span: 5, offset: 6 }" :md="2">
					<!-- prettier-ignore -->
					<el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>
<script lang="ts" name="UserAvatar" setup>
import useUserStore from "@/store/modules/user";
import { uploadAvatar } from "@/api/system/user";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import {
	ref,
	getCurrentInstance,
	reactive,
	watch,
	nextTick,
	computed,
} from "vue";

const baseURL = import.meta.env.VITE_APP_BASE_API;

const cropperRef = ref();

// 初始缩放比例
const scale = ref<number>(1);
const previewStyle = computed(() => ({
	transform: `scale(${scale.value})`,
	transformOrigin: "center center", // 确保从中心缩放
}));

const { proxy } = getCurrentInstance() as any;
// 是否显示弹出层
const open = ref<boolean>(false);
// 是否显示cropper
const visible = ref<boolean>(false);
// 弹出层标题
const options = reactive<any>({
	img: useUserStore().avatar, //裁剪图片的地址
	autoCrop: true, // 是否默认生成截图框
	autoCropWidth: 300, // 默认生成截图框宽度
	autoCropHeight: 300, // 默认生成截图框高度
	fixedBox: true, // 固定截图框大小 不允许改变
	previews: {
		url: useUserStore().avatar,
	},
});

watch(visible, (newVal) => {
	if (newVal) {
		nextTick(() => {
			console.log("cropper 实例:", cropperRef.value?.$attrs);
		});
	}
});

// 编辑头像
const editCropper = () => {
	open.value = true;
	nextTick(() => {
		visible.value = true;
	});
	options.img = useUserStore().avatar;
};

// 监听弹窗关闭重置头像
watch(() => open.value, (newVal) => {
	if (!newVal) {
		options.img = useUserStore().avatar;
	}
});

// 覆盖默认的上传行为
const requestUpload: any = () => {};

// 向左旋转
const rotateLeft = () => {
	cropperRef.value?.rotate(-90);
};

// 向右旋转
const rotateRight = () => {
	cropperRef.value?.rotate(90);
};

// 图片放大或者缩小
const changeScale = (direction: number) => {
	// 每次缩放步长
	const step = 0.15;
	const newScale = direction > 0 ? scale.value + step : scale.value - step;
	scale.value = Math.min(3.5, Math.max(1, newScale));

	// 调用 cropper 的实际缩放（保持原有功能）
	const zoomFactor = direction > 0 ? 1.1 : 0.9;
	cropperRef.value?.zoom(zoomFactor);
};

// 图片还原
const restImg = () => {
	if (cropperRef.value) {
		scale.value = 1; // 重置为原始比例
		//cropperRef.value.rotate(0);
		//cropperRef.value.zoom(1);
		cropperRef.value.reset();
	}
};
// 上传预处理
const beforeUpload = (file: any) => {
	if (file.type.indexOf("image/") == -1) {
		// prettier-ignore
		proxy.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
	} else {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			options.img = reader.result;
		};
	}
};
// 上传图片
const uploadImg = () => {
	const { canvas } = cropperRef.value?.getResult() || {};
	if (canvas) {
		canvas.toBlob(async (data: Blob) => {
			let formData = new FormData();
			formData.append("avatarfile", data);
			await uploadAvatar(formData).then((response: any) => {
				if (response.code === 200) {
					open.value = false;
					const newAvatar = baseURL + response.data;
					useUserStore().avatar = newAvatar;
					proxy.$modal.msgSuccess("修改成功");
					visible.value = false;
				}
			});
		});
	}
};
// 实时预览
const handleChange = ({ canvas }: { canvas: HTMLCanvasElement }) => {
	if (canvas) {
		//options.previews.url = canvas.toDataURL();
		//options.previews.img = canvas.toDataURL();
		const scaleFactor = 2;
		const highResCanvas = document.createElement("canvas");
		highResCanvas.width = canvas.width * scaleFactor;
		highResCanvas.height = canvas.height * scaleFactor;

		const ctx = highResCanvas.getContext("2d");
		if (ctx) {
			ctx.scale(scaleFactor, scaleFactor);
			ctx.drawImage(canvas, 0, 0);
			ctx.imageSmoothingQuality = "high"; // 画布抗锯齿
		}

		options.previews.url = highResCanvas.toDataURL("image/jpeg", 1.0);
	}
};
</script>
<style scoped lang="scss">
.preview-image {
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.84); /* 平滑曲线 */
	max-width: 100%;
	max-height: 100%;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: crisp-edges;
}
.user-info-head {
	position: relative;
	display: inline-block;
	height: 120px;
}

.user-info-head:hover:after {
	content: "+";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	color: #eee;
	background: rgba(0, 0, 0, 0.5);
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	cursor: pointer;
	line-height: 110px;
	border-radius: 50%;
}
</style>
