<template>
	<el-color-picker
		v-model="theme"
		:predefine="predefineColors"
		class="theme-picker"
		popper-class="theme-picker-dropdown"
	/>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { ElMessage, type ColorPickerProps } from "element-plus";
import useStore from "@/store";

const ORIGINAL_THEME = "#409EFF"; // 默认主题色
const predefineColors: ColorPickerProps["predefine"] = [
	"#409EFF",
	"#1890ff",
	"#304156",
	"#212121",
	"#11a983",
	"#13c2c2",
	"#6959CD",
	"#f5222d",
];

// 组合式 API 变量
const store = useStore(); // 如果使用 Pinia：const settingsStore = useSettingsStore()
const chalk = ref<string>("");
const theme = ref<string>("");

// 计算属性
const defaultTheme = computed(() => store.setting.theme);

// 监听默认主题变化
watch(
	defaultTheme,
	(val) => {
		theme.value = val;
	},
	{ immediate: true }
);

// 主题颜色变化监听
watch(theme, async (newVal, oldVal) => {
	if (typeof newVal !== "string") return;
	const oldColor = chalk.value ? oldVal : ORIGINAL_THEME;
	const themeCluster = getThemeCluster(newVal.replace("#", ""));
	const originalCluster = getThemeCluster(oldColor.replace("#", ""));

	const messageInstance = ElMessage({
		message: "Compiling the theme",
		customClass: "theme-message",
		type: "success",
		duration: 0,
		icon: "loading",
	});

	if (!chalk.value) {
		const version = (await import("element-plus/package.json")).version;
        console.log("当前element-plus的版本", version);
		const url = `https://unpkg.com/element-plus@${version}/dist/index.css`;
		await getCSSString(url, "chalk");
		const processedStyle = updateStyle(
			chalk.value,
			originalCluster,
			themeCluster
		);
		updateStyleTag("chalk-style", processedStyle);
	}

	updateExistingStyles(originalCluster, themeCluster);

	store.setting.changeSetting({
		key: "theme",
		value: newVal,
	});

	messageInstance?.close();
});

// 生命周期
onBeforeUnmount(() => {
	const styleTag = document.getElementById("chalk-style");
	styleTag?.parentNode?.removeChild(styleTag);
});

// 方法实现
const updateStyle = (
	styleContent: string,
	oldCluster: string[],
	newCluster: string[]
): string => {
	let newStyle = styleContent;
	oldCluster.forEach((color, index) => {
		newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
	});

	return newStyle;
};

// 新增样式标签更新函数
const updateStyleTag = (id: string, content: string) => {
	let styleTag = document.getElementById(id);
	if (!styleTag) {
		styleTag = document.createElement("style");
		styleTag.id = id;
		document.head.appendChild(styleTag);
	}
	styleTag.textContent = content;
};

const getCSSString = (url: string, variable: "chalk"): Promise<void> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				chalk.value = xhr.responseText.replace(/@font-face{[^}]+}/, "");
				resolve();
            } else {
                console.log(new Error(`Failed to load CSS from ${url}`));
                reject(new Error(`Failed to load CSS from ${url}`))
            }
		};
		xhr.open("GET", url);
		xhr.send();
	});
};

const getThemeCluster = (themeColor: string): string[] => {
    // 新增格式校验
    if (!/^[0-9a-fA-F]{6}$/.test(themeColor)) {
        throw new Error('Invalid theme color format');
    }
	const tint = (color: string, tintVal: number): string => {
		const red = parseInt(color.slice(0, 2), 16);
		const green = parseInt(color.slice(2, 4), 16);
		const blue = parseInt(color.slice(4, 6), 16);

		if (tintVal === 0) {
			return `${red},${green},${blue}`;
		}

		const newRed = Math.round(red + (255 - red) * tintVal)
			.toString(16)
			.padStart(2, "0");
		const newGreen = Math.round(green + (255 - green) * tintVal)
			.toString(16)
			.padStart(2, "0");
		const newBlue = Math.round(blue + (255 - blue) * tintVal)
			.toString(16)
			.padStart(2, "0");
		return `#${newRed}${newGreen}${newBlue}`;
	};

	const shade = (color: string, shadeVal: number): string => {
		const red = parseInt(color.slice(0, 2), 16);
		const green = parseInt(color.slice(2, 4), 16);
		const blue = parseInt(color.slice(4, 6), 16);

		const newRed = Math.round(red * (1 - shadeVal))
			.toString(16)
			.padStart(2, "0");
		const newGreen = Math.round(green * (1 - shadeVal))
			.toString(16)
			.padStart(2, "0");
		const newBlue = Math.round(blue * (1 - shadeVal))
			.toString(16)
			.padStart(2, "0");
		return `#${newRed}${newGreen}${newBlue}`;
	};

	const clusters = [themeColor];
	for (let i = 0; i <= 9; i++) {
		clusters.push(tint(themeColor, Number((i / 10).toFixed(2))));
	}
	clusters.push(shade(themeColor, 0.1));
	return clusters;
};

const updateExistingStyles = (oldCluster: string[], newCluster: string[]) => {
    console.log("外部的样式表===", oldCluster, newCluster);
	const styles = Array.from(document.querySelectorAll("style")).filter(
		(style) => {
			const text = style.textContent || "";
			return (
                // 添加白名单，只处理 element-plus 相关样式
                text.includes('element-plus') && 
				new RegExp(oldCluster[0], "i").test(text) &&
				!/Chalk Variables/.test(text)
			);
		}
	);

	styles.forEach((style) => {
		requestAnimationFrame(() => {
			const content = style.textContent || "";
			style.textContent = updateStyle(content, oldCluster, newCluster);
		});
	});
};
</script>

<style>
.theme-message,
.theme-picker-dropdown {
	z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
	height: 26px !important;
	width: 26px !important;
	padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
	display: none;
}
</style>
