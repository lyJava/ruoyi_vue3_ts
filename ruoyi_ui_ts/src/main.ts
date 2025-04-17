import { createApp, Directive } from "vue";
import App from "./App.vue";

const app = createApp(App);

import router from "@/router";
import { createPinia } from "pinia";
import Cookies from "js-cookie";

import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";

// TODO 这里引入hljs与注册语言是为了防止打包后缺失样式(放开javascript的注释)，开发环境不需要
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('sql', sql);

// highlight在线预览 https://highlightjs.org/static/demo/
// 样式合集 https://unpkg.com/browse/@highlightjs/cdn-assets@11.4.0/styles/
// highlight 的样式，依赖包，组件
// 原文链接：https://blog.csdn.net/qitest/article/details/121495369

import "highlight.js/styles/vs2015.css";


// element-plus
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import locale from "element-plus/es/locale/lang/zh-cn";
// element-plus icons
//import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 去掉避免vue-cropper拖动出现Unable to preventDefault inside passive event listener invocation
//import "default-passive-events";

//全局css
import "@/assets/styles/index.scss";

//注册 自定义指令
import * as directive from "@/directive";

import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import plugins from "./plugins";
import { download } from "@/utils/request";

// 自定义svg图标组件
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon/index.vue";
// element-plus图标
import elementIcons from "@/components/SvgIcon/svgicon";

import "./permission"; // permission control

import useDict from "@/utils/dict";
// prettier-ignore
import { parseTime, dateTimeSub, resetForm, cleanTableSelection, setTableRowSelected, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";

// 分页组件
import Pagination from "@/components/Pagination/index.vue";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar/index.vue";
// 富文本组件
import Editor from "@/components/Editor/vue2/index.vue";
import RichEditor from "@/components/Editor/vue3/index.vue";
// 文件上传组件
import FileUpload from "@/components/FileUpload/index.vue";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload/index.vue";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview/index.vue";
// 字典标签组件
import DictTag from "@/components/DictTag/index.vue";
// 数据标签组件
import DataTag from "@/components/DataTag/index.vue";
// 数据标签组件(单个)
import DataSingleTag from "@/components/DataSingleTag/index.vue";
// 状态开关组件
import StatusSwitch from "@/components/StatusSwitch/index.vue";
// 表单搜索重置组件
import FormSearch from "@/components/FormSearch/index.vue";
/**
 * 图标连接组件
 */
import ExternalLinkIcon from "@/components/RuoYi/ExternalLinkIcon/index.vue";

import QuillEditor from "@/components/QuillEditor/index.vue";

// Vue-Cropper
//import VueCropper from "vue-cropper";
//import  VueCropper from 'vue-cropper'
//import 'vue-cropper/dist/index.css' 
// TODO 对vue进行类型补充说明，不然在vue页面使用的时候会报错
declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		getDicts: Function;
		getConfigKey: Function;
		download: Function;
		parseTime: Function;
        dateTimeSub: Function;
		resetForm: Function;
        cleanTableSelection: Function;
        setTableRowSelected: Function;
		handleTree: Function;
		addDateRange: Function;
		selectDictLabel: Function;
		selectDictLabels: Function;
	}
}

import { copyText } from "@/directive/copyText";

// 注册复制文本指令
app.directive("copyText", copyText);

// 批量注册自定义指令
Object.keys(directive).forEach((key) => {
	app.directive(key, (directive as { [key: string]: Directive })[key]);
});
// 注册element-plus icon图标组件,已经注册，不需要再次注册
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
// 	app.component(key, component);
// }

// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.getDicts = getDicts;
app.config.globalProperties.getConfigKey = getConfigKey;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.dateTimeSub = dateTimeSub;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.cleanTableSelection = cleanTableSelection;
app.config.globalProperties.setTableRowSelected = setTableRowSelected;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;

// 全局组件挂载
app.component("Pagination", Pagination);
app.component("RightToolbar", RightToolbar);
app.component("Editor", Editor);
app.component("FileUpload", FileUpload);
app.component("image-upload", ImageUpload);
app.component("ImagePreview", ImagePreview);
app.component("DictTag", DictTag);
app.component("DataTag", DataTag);
app.component("DataSingleTag", DataSingleTag);
app.component("StatusSwitch", StatusSwitch);
app.component("FormSearch", FormSearch);
app.component("svg-icon", SvgIcon);
app.component("external-link-icon", ExternalLinkIcon);
app.component("RichEditor", RichEditor);
app.component("QuillEditor", QuillEditor);

// 类型断言解决 size 的类型问题
const size = (Cookies.get('size') || 'default') as 'large' | 'default' | 'small'

// 使用element-plus，设置默认语言及全局size
app.use(ElementPlus, {
	locale: locale,
	// 支持 large、default、small
	size: size,
});

// 注册pinia，router等
app.use(createPinia());
app.use(router);
app.use(plugins);
app.use(elementIcons);
app.use(hljsVuePlugin);


app.mount("#app");
