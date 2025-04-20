<template>
	<div>
		<el-upload
			action="/dev-api/common/upload"
			name="file"
			:show-file-list="false"
			style="display: none"
			ref="upload"
			>
    	</el-upload>
	
	<div class="quill-container">
		<QuillEditor
			ref="quillRef"
			theme="snow"
			v-model:content="content"
			:options="editorOptions"
			contentType="html"
			style="min-height: 300px"
		/>
		<input
			type="file"
			hidden
			accept=".jpg,.png"
			ref="fileInput"
			@change="handleUpload"
		/>
	</div>
	</div>
</template>

<script lang="ts" setup>
// "quill": "^2.0.3",无法上传图片
import { QuillEditor } from "@vueup/vue-quill";
import { computed, ref, toRaw } from "vue";
import type { Delta, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

interface EditorEmits {
	(e: "update:content", value: string): void;
}

interface EditorProps {
	content?: string;
	type?: string;
	minHeight?: string | number;
}

const props = withDefaults(defineProps<EditorProps>(), {
	content: "",
	type: "base64",
	minHeight: "400px",
});

const emit = defineEmits<EditorEmits>();

// Refs
const quillRef = ref<InstanceType<typeof QuillEditor> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Editor Options
const editorOptions = ref<any>({
	modules: {
		toolbar: {
			container: [
				["bold", "italic", "underline", "strike"],
				[{ size: ["small", false, "large", "huge", "big"] }],
				[{ font: [] }],
				[{ align: [] }],
				[{ list: "ordered" }, { list: "bullet" }],
				[{ indent: "-1" }, { indent: "+1" }],
				[{ header: [1, 2, 3, 4, 5, 6, 7, false] }],
				["image"],
				[{ direction: "rtl" }],
				[{ color: [] }, { background: [] }],
			],
			handlers: {
				image: () => {
					handleImageClick();
				},
			},
		},
	},
	placeholder: "请输入内容...",
	// 禁用弃用功能
	suppressDOMNodeInserted: true,
});

// 添加图片点击处理函数
const handleImageClick = () => {
	console.log("点击图片按钮，触发文件选择");
	fileInput.value?.click();
};

// Content binding
const content = computed({
	get: () => props.content,
	set: (value: string | Delta) => {
		if (typeof value === "string") {
			emit("update:content", value);
		}
	},
});

//@ready="initEditor"
const initEditor = () => {
	const quill = toRaw(quillRef.value?.getQuill()) as Quill;
	if (!quill) {
		console.error("Quill实例未找到");
		return;
	}

	const toolbar = quill.getModule("toolbar") as any; // 类型断言
	if (!toolbar) {
		console.error("工具栏模块未加载");
		return;
	}

	return
	/* console.log("绑定图片处理器...")
	if (typeof toolbar.addHandler === "function") {
		toolbar.addHandler("image", () => {
			console.log("点击图片按钮，触发文件选择");
			console.log("fileBtn DOM元素:", fileInput.value);
			fileInput.value?.click();

			// 备选方案：直接创建临时input
			if (!fileInput.value) {
				console.warn("检测到fileBtn未绑定，使用临时方案");
				const tempInput = document.createElement("input");
				tempInput.type = "file";
				tempInput.accept = ".jpg,.png";
				tempInput.onchange = handleUpload;
				tempInput.click();
			}
		});
	} else {
		console.error("工具栏缺少addHandler，当前工具栏:", toolbar);
	} */
};

// Image upload handler
const handleUpload = async (e: Event) => {
	console.log("11111"); // 这里会触发
	const target = e.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	// 显示加载指示
	const quill = toRaw(quillRef.value?.getQuill());
	const position = quill?.getSelection()?.index || 0;

	try {
		// 插入临时占位图
		quill?.insertEmbed(position, "image", "/loading.gif");
		// 等待上传
		const imageUrl = await uploadImage(file);
		insertImageToEditor(imageUrl);
	} catch (error) {
		console.error("图片上传失败:", error);
	} finally {
		target.value = "";
	}
};

// Upload image to server
const uploadImage = async (file: File): Promise<string> => {
	console.log("33333"); // 这里不触发
	const formData = new FormData();
	formData.append("file", file);

	// 替换为实际的上传接口
	const response = await fetch("/dev-api/system/file/upload", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) throw new Error("上传失败");
	const data = await response.json();
	return data.url;
};


const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`文件大小不能超过 5 MB`)
    }

    let imageUrl: string
    if (props.type === 'base64') {
      imageUrl = await readFileAsBase64(file)
    } else {
      imageUrl = await uploadImage(file)
    }

    insertImageToEditor(imageUrl)
  } catch (error) {
    console.error('上传失败:', error)
  } finally {
    input.value = ''
  }
}

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Insert image to editor
const insertImageToEditor = (url: string) => {
	const quill = toRaw(quillRef.value?.getQuill()) as Quill | null;
	if (!quill) return;

	const selection = quill.getSelection();
	const position = selection?.index || 0;

	quill.insertEmbed(position, "image", url);
	quill.setSelection(position + 1);
};
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
</style>
