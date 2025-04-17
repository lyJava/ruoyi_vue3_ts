<template>
	<div class="quill-container">
		<QuillEditor
            style="min-height: 300px"
			ref="quillEditorRef"
			:options="options"
			v-model:content="content"
			contentType="html"
			@textChange="textChange"
		/>
		<!-- 使用input 标签劫持原本视频上传事件，实现视频上传 -->
		<input
			type="file"
			accept="video/*"
			name="file"
			ref="uploadFileVideo"
			id="uploadFileVideo"
			@change="handleVideoUpload"
			style="opacity: 0; width: 0; height: 0; cursor: pointer"
		/>
		<!--使用input 标签劫持原本图片上传事件，实现图片上传-->
		<input
			type="file"
			name="file"
			id="uploadFileImg"
			ref="uploadFileImg"
			@change="handleImgUpload"
			style="opacity: 0; width: 0; height: 0; cursor: pointer"
		/>
	</div>
</template>
<script lang="ts" setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { toRaw, ref, watch, nextTick, onMounted } from "vue";
import { useComponentRef } from "@/utils/ruoyi";
//quill-image-resize-module插件的安装和使用和vue2中的差不多，大家可以去翻我之前写的文章

//自定义字体大小
let fontSizeStyle = Quill.import("attributors/style/size") as any;
fontSizeStyle.whitelist = ["12px", "14px", "16px", "20px", "24px", false];
Quill.register(fontSizeStyle, true);
//自定义quill编辑器的字体
var fonts = [
	"Microsoft-YaHei",
	"YouYuan",
	"SimSun",
	"SimHei",
	"KaiTi",
	"FangSong",
	"Arial",
	"Times-New-Roman",
	"sans-serif",
];
var Font = Quill.import("formats/font") as any;
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);

const quillEditorRef = useComponentRef(QuillEditor);
const uploadFileImg = ref();
const uploadFileVideo = ref();
const content = ref<string>(""); //富文本绑定的值
const options = ref({
	theme: "snow",
	bounds: window.document.body,
	debug: "warn",
	modules: {
		// 工具栏配置
		toolbar: {
			container: [
				[
					{
						font: fonts,
					},
				], // 字体种类
				[
					{
						size: ["12px", "14px", "16px", "20px", "24px", false],
					},
				], // 字体大小
				["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
				["blockquote", "code-block"], // 引用  代码块
				[{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
				[{ indent: "-1" }, { indent: "+1" }], // 缩进
				[{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
				[{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
				[{ align: [] }], // 对齐方式
				["clean"], // 清除文本格式
				["link", "image", "video"], // 链接、图片、视频
			],
			handlers: {
				video: function (val: any) {
					// 劫持原来的视频点击按钮事件
					const eleVideo = document.querySelector(
						"#uploadFileVideo"
					) as HTMLInputElement;
					eleVideo?.click();
				},
				image: function () {
					// 劫持原来的图片点击按钮事件
					const eleImg = document.querySelector(
						"#uploadFileImg"
					) as HTMLInputElement;
					eleImg?.click();
				},
			},
		},
		// imageResize: {
		// 	//添加
		// 	displayStyles: {
		// 		//添加
		// 		backgroundColor: "black",
		// 		border: "none",
		// 		color: "white",
		// 	},
		// 	modules: ["Resize", "DisplaySize"], //添加
		// },
	},

	placeholder: "请输入......",
});

interface EditorProps {
	modelValue: string;
	minHeight?: string | number;
}

const props = withDefaults(defineProps<EditorProps>(), {
	modelValue: "",
	minHeight: "400px",
});

//图片上传
const handleImgUpload = async (evt: any) => {
	if (evt.target.files.length === 0) {
		return;
	}
	const formData = new FormData();
	formData.append("file", evt.target.files[0]);
	try {
		const res: any = ""; //图片上传的接口
		let quill = toRaw(quillEditorRef.value!).getQuill();
		// 获取光标位置
		let length = quill.selection.savedRange.index;
		quill.insertEmbed(length, "image", res.data.url);
		// 调整光标到最后
		quill.setSelection(length + 1);
	} catch (error) {
		console.log(error);
	}
	uploadFileImg.value.value = "";
};

//视频上传
const handleVideoUpload = async (evt: any) => {
	if (evt.target.files.length === 0) {
		return;
	}
	const formData = new FormData();
	formData.append("file", evt.target.files[0]);
	try {
		const res: any = ""; //图片上传接口
		let quill = toRaw(quillEditorRef.value!).getQuill();
		// 获取光标位置
		let length = quill.selection.savedRange.index;
		quill.insertEmbed(length, "video", res.data.url);
		// 调整光标到最后
		quill.setSelection(length + 1);
	} catch (error) {
		console.log(error);
	}
	uploadFileVideo.value.value = "";
};

// 增强类型定义
const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

// 优化后的内容同步
watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal !== content.value) {
			nextTick(() => {
				content.value = newVal || "";
				quillEditorRef.value?.setHTML(content.value);
			});
		}
	},
	{ immediate: true }
);

// 安全的编辑器初始化
onMounted(() => {
	nextTick(() => {
		try {
			const quill = quillEditorRef.value?.getQuill();
			if (!quill) throw new Error("Quill实例未创建");

			// 验证关键模块
			["toolbar"].forEach((module) => {
				if (!quill.getModule(module)) {
					console.warn(`模块 ${module} 未正确加载`);
				}
			});
		} catch (error) {
			console.error("编辑器初始化失败:", error);
		}
	});
});

const textChange = () => {
	emit("update:modelValue", content.value);
};
// https://juejin.cn/post/7259624494959394875
</script>
<style scoped>
.quill-container {
	:deep(.ql-container) {
		min-height: v-bind("props.minHeight");
		border-radius: 0 0 8px 8px;
		font-family: inherit;
	}

	:deep(.ql-toolbar) {
		border-radius: 8px 8px 0 0;
		background-color: #f8f9fa;
	}

	:deep(.ql-editor) {
		min-height: v-bind("props.minHeight");
		line-height: 1.6;
		font-size: 16px;

		img {
			max-width: 100%;
			height: auto;
			vertical-align: middle;
		}
	}
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
	content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
	border-right: 0px;
	content: "保存";
	padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
	content: "请输入视频地址:";
}
/* 自定义font-size */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
	content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
	content: "10px";
	font-size: 10px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
	content: "12px";
	font-size: 12px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
	content: "14px";
	font-size: 14px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
	content: "16px";
	font-size: 16px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
	content: "18px";
	font-size: 18px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
	content: "20px";
	font-size: 20px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
	content: "24px";
	font-size: 24px;
}
/* 自定义标题 */
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
	content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	content: "标题6";
}
/* 自定义字体 */
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
	content: "微软雅黑";
}
/* .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
 content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
 content: "等宽字体";
} */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
	content: "宋体";
	font-family: "SimSun";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
	content: "黑体";
	font-family: "SimHei";
}
.ql-snow
	.ql-picker.ql-font
	.ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow
	.ql-picker.ql-font
	.ql-picker-item[data-value="Microsoft-YaHei"]::before {
	content: "微软雅黑";
	font-family: "Microsoft YaHei";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="YouYuan"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="YouYuan"]::before {
	content: "幼圆";
	font-family: "YouYuan";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
	content: "楷体";
	font-family: "KaiTi";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
	content: "仿宋";
	font-family: "FangSong";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
	content: "Arial";
	font-family: "Arial";
}
.ql-snow
	.ql-picker.ql-font
	.ql-picker-label[data-value="Times-New-Roman"]::before,
.ql-snow
	.ql-picker.ql-font
	.ql-picker-item[data-value="Times-New-Roman"]::before {
	content: "Times New Roman";
	font-family: "Times New Roman";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
	content: "sans-serif";
	font-family: "sans-serif";
}

.ql-font-SimSun {
	font-family: "SimSun";
}
.ql-font-SimHei {
	font-family: "SimHei";
}
.ql-font-YouYuan {
	font-family: "YouYuan";
}
.ql-font-Microsoft-YaHei {
	font-family: "Microsoft YaHei";
}
.ql-font-KaiTi {
	font-family: "KaiTi";
}
.ql-font-FangSong {
	font-family: "FangSong";
}
.ql-font-Arial {
	font-family: "Arial";
}
.ql-font-Times-New-Roman {
	font-family: "Times New Roman";
}
.ql-font-sans-serif {
	font-family: "sans-serif";
}
</style>
