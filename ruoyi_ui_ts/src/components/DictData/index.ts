import App from './App.vue'
import { createApp } from "vue";
import DataDict from "@/utils/dict";
import { getDicts } from "@/api/system/dict/data";

function install() {
	createApp(App).use(DataDict, {
		metas: {
			"*": {
				labelField: "dictLabel",
				valueField: "dictValue",
				async request(dictMeta: { type: string; }) {
					const res = await getDicts(dictMeta.type);
                    return res.data;
				}
			}
		}
	});
}
export default {
	install
};
