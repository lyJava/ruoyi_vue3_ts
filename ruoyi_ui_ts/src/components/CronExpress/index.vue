<template>
	<div>
		<el-tabs type="border-card">
			<el-tab-pane label="秒" v-if="shouldHide('second')">
				<CrontabSecond
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronsecond"
				/>
			</el-tab-pane>

			<el-tab-pane label="分钟" v-if="shouldHide('min')">
				<CrontabMinute
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronmin"
				/>
			</el-tab-pane>

			<el-tab-pane label="小时" v-if="shouldHide('hour')">
				<CrontabHour
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronhour"
				/>
			</el-tab-pane>

			<el-tab-pane label="日" v-if="shouldHide('day')">
				<CrontabDay
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronday"
				/>
			</el-tab-pane>

			<el-tab-pane label="月" v-if="shouldHide('month')">
				<CrontabMonth
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronmonth"
				/>
			</el-tab-pane>

			<el-tab-pane label="周" v-if="shouldHide('week')">
				<CrontabWeek
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronweek"
				/>
			</el-tab-pane>

			<el-tab-pane label="年" v-if="shouldHide('year')">
				<CrontabYear
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="crontabValueObj"
					ref="cronyear"
				/>
			</el-tab-pane>
		</el-tabs>

		<div class="popup-main">
			<div class="popup-result">
				<p class="title">时间表达式</p>
				<table>
					<thead>
						<tr>
							<th
								v-for="item of tabTitles"
								width="40"
								:key="item"
							>
								{{ item }}
							</th>
							<th>Cron 表达式</th>
						</tr>
					</thead>
					<tbody>
						<tr style="font-size: 16px;">
							<td>
								<span>{{ crontabValueObj.second }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.min }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.hour }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.day }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.month }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.week }}</span>
							</td>
							<td>
								<span>{{ crontabValueObj.year }}</span>
							</td>
							<td>
								<span>{{ crontabValueString }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CrontabResult :ex="crontabValueString"></CrontabResult>

			<div class="pop_btn">
				<el-button size="default" type="primary" @click="submitFill"
					>确定</el-button
				>
				<el-button size="default" type="warning" @click="clearCron"
					>重置</el-button
				>
				<el-button size="default" @click="hidePopup">取消</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	defineProps,
	defineEmits,
	reactive,
	ref,
	watch,
	onMounted,
	ComponentPublicInstance,
} from "vue";
import CrontabSecond from "./second.vue";
import CrontabMinute from "./minute.vue";
import CrontabHour from "./hour.vue";
import CrontabDay from "./day.vue";
import CrontabMonth from "./month.vue";
import CrontabWeek from "./week.vue";
import CrontabYear from "./year.vue";
import CrontabResult from "./result.vue";

interface CrontabValue {
	second: string;
	min: string;
	hour: string;
	day: string;
	month: string;
	week: string;
	year: string;
}

interface CrontabComponent {
	radioValue?: number;
	cycle01?: number;
	cycle02?: number;
	average01?: number;
	average02?: number;
	checkboxList?: string[];
	workday?: number;
	weekday?: number;
}

const props = defineProps({
	expression: {
		type: String,
		default: "",
	},
	hideComponent: {
		type: Array as () => string[],
		default: () => [],
	},
});

const emit = defineEmits(["hide", "fill"]);

const tabTitles = ["秒", "分钟", "小时", "日", "月", "周", "年"];
const crontabValueObj = reactive<CrontabValue>({
	second: "*",
	min: "*",
	hour: "*",
	day: "*",
	month: "*",
	week: "?",
	year: "",
});

// 子组件引用
const cronsecond = ref<ComponentPublicInstance & CrontabComponent>();
const cronmin = ref<ComponentPublicInstance & CrontabComponent>();
const cronhour = ref<ComponentPublicInstance & CrontabComponent>();
const cronday = ref<ComponentPublicInstance & CrontabComponent>();
const cronmonth = ref<ComponentPublicInstance & CrontabComponent>();
const cronweek = ref<ComponentPublicInstance & CrontabComponent>();
const cronyear = ref<ComponentPublicInstance & CrontabComponent>();

const shouldHide = (key: string) => {
	return !props.hideComponent.includes(key);
};

const resolveExp = () => {
	if (props.expression) {
		const arr = props.expression.split(" ");
		if (arr.length >= 6) {
			const obj: CrontabValue = {
				second: arr[0],
				min: arr[1],
				hour: arr[2],
				day: arr[3],
				month: arr[4],
				week: arr[5],
				year: arr[6] || "",
			};
			Object.assign(crontabValueObj, obj);
			for (const key in obj) {
				changeRadio(
					key as keyof CrontabValue,
					obj[key as keyof CrontabValue]
				);
			}
		}
	} else {
		clearCron();
	}
};

const updateCrontabValue = (
	name: keyof CrontabValue,
	value: string,
	from?: string
) => {
	crontabValueObj[name] = value;
	if (from && from !== name) {
		changeRadio(name, value);
	}
};
// 赋值到组件
const changeRadio = (name: keyof CrontabValue, value: string) => {
	const components: Record<string, typeof cronsecond> = {
		second: cronsecond,
		min: cronmin,
		hour: cronhour,
		day: cronday,
		month: cronmonth,
		week: cronweek,
		year: cronyear,
	};
    let insValue = 0; 

	const componentRef = components[name]?.value;
	if (!componentRef) return;

	if (["second", "min", "hour", "month"].includes(name)) {
		if (value === "*") {
			componentRef.radioValue = 1;
		} else if (value.includes("-")) {
			const [cycle01, cycle02] = value.split("-");
			componentRef.cycle01 = isNaN(Number(cycle01)) ? 0 : Number(cycle01);
			componentRef.cycle02 = Number(cycle02);
			componentRef.radioValue = 2;
		} else if (value.includes("/")) {
			const [average01, average02] = value.split("/");
			componentRef.average01 = isNaN(Number(average01))
				? 0
				: Number(average01);
			componentRef.average02 = Number(average02);
			componentRef.radioValue = 3;
		} else {
			componentRef.checkboxList = value.split(",");
			componentRef.radioValue = 4;
		}
	} else if (name == "day") {
		if (value === "*") {
			insValue = 1;
		} else if (value == "?") {
			insValue = 2;
		} else if (value.indexOf("-") > -1) {
			let indexArr = value.split("-") as any; 
			isNaN(indexArr[0])
				? (componentRef.cycle01 = 0)
				: (componentRef.cycle01 = indexArr[0]);
			componentRef.cycle02 = indexArr[1];
			insValue = 3;
		} else if (value.indexOf("/") > -1) {
			let indexArr = value.split("/") as any;
			isNaN(indexArr[0])
				? (componentRef.average01 = 0)
				: (componentRef.average01 = indexArr[0]);
			componentRef.average02 = indexArr[1];
			insValue = 4;
		} else if (value.indexOf("W") > -1) {
			let indexArr = value.split("W") as any;
			isNaN(indexArr[0])
				? (componentRef.workday = 0)
				: (componentRef.workday = indexArr[0]);
			insValue = 5;
		} else if (value === "L") {
			insValue = 6;
		} else {
			componentRef.checkboxList = value.split(",");
			insValue = 7;
		}
	} else if (name == "week") {
		if (value === "*") {
			insValue = 1;
		} else if (value == "?") {
			insValue = 2;
		} else if (value.indexOf("-") > -1) {
			let indexArr = value.split("-") as any;
			isNaN(indexArr[0])
				? (componentRef.cycle01 = 0)
				: (componentRef.cycle01 = indexArr[0]);
			componentRef.cycle02 = indexArr[1];
			insValue = 3;
		} else if (value.indexOf("#") > -1) {
			let indexArr = value.split("#") as any;
			isNaN(indexArr[0])
				? (componentRef.average01 = 1)
				: (componentRef.average01 = indexArr[0]);
			componentRef.average02 = indexArr[1];
			insValue = 4;
		} else if (value.indexOf("L") > -1) {
			let indexArr = value.split("L") as any;
			isNaN(indexArr[0])
				? (componentRef.weekday = 1)
				: (componentRef.weekday = indexArr[0]);
			insValue = 5;
		} else {
			componentRef.checkboxList = value.split(",");
			insValue = 7;
		}
	} else if (name == "year") {
		if (value == "") {
			insValue = 1;
		} else if (value == "*") {
			insValue = 2;
		} else if (value.indexOf("-") > -1) {
			insValue = 3;
		} else if (value.indexOf("/") > -1) {
			insValue = 4;
		} else {
			componentRef.checkboxList = value.split(",");
			insValue = 5;
		}
	}
	componentRef.radioValue = insValue;
};


const checkNumber = (value: number, minLimit: number, maxLimit: number) => {
	value = Math.floor(value);
	return Math.max(minLimit, Math.min(value, maxLimit));
};

const hidePopup = () => emit("hide");

const submitFill = () => {
	emit("fill", crontabValueString.value);
	hidePopup();
};

const clearCron = () => {
	Object.assign(crontabValueObj, {
		second: "*",
		min: "*",
		hour: "*",
		day: "*",
		month: "*",
		week: "?",
		year: "",
	});
	Object.keys(crontabValueObj).forEach((key) => {
		changeRadio(
			key as keyof CrontabValue,
			crontabValueObj[key as keyof CrontabValue]
		);
	});
};

const crontabValueString = computed(() => {
	const { second, min, hour, day, month, week, year } = crontabValueObj;
	return `${second} ${min} ${hour} ${day} ${month} ${week}${
		year ? " " + year : ""
	}`;
});

watch(() => props.expression, (newVal, oldVal) => {
  resolveExp()
}, { immediate: true })
onMounted(() => {
	resolveExp;
});
</script>
<style scoped>
.pop_btn {
	text-align: center;
	margin-top: 20px;
}
.popup-main {
	position: relative;
	margin: 10px auto;
	background: #fff;
	border-radius: 5px;
	font-size: 12px;
	overflow: hidden;
}
.popup-title {
	overflow: hidden;
	line-height: 34px;
	padding-top: 6px;
	background: #f2f2f2;
}
.popup-result {
	box-sizing: border-box;
	line-height: 24px;
	margin: 25px auto;
	padding: 15px 10px 10px;
	border: 1px solid #ccc;
	position: relative;
}
.popup-result .title {
	position: absolute;
	top: -28px;
	left: 50%;
	width: 140px;
	font-size: 14px;
	margin-left: -70px;
	text-align: center;
	line-height: 30px;
	background: #fff;
}
.popup-result table {
	text-align: center;
	width: 100%;
	margin: 0 auto;
}
.popup-result table span {
	display: block;
	width: 100%;
	font-family: arial;
	line-height: 30px;
	height: 30px;
	white-space: nowrap;
	overflow: hidden;
	border: 1px solid #e8e8e8;
}
.popup-result-scroll {
	font-size: 12px;
	line-height: 24px;
	height: 10em;
	overflow-y: auto;
}
</style>
