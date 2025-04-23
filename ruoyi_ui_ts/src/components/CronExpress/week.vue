<template>
	<el-form size="default">
		<el-form-item>
			<el-radio v-model="radioValue" :label="1">
				周，允许的通配符[, - * ? / L #]
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="2"> 不指定 </el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="3">
				周期从星期
				<el-select clearable v-model="cycle01">
					<el-option
						v-for="(item, index) in weekList"
						:key="index"
						:label="item.value"
						:value="item.key"
						:disabled="item.key === 1"
					/>
				</el-select>
				-
				<el-select clearable v-model="cycle02">
					<el-option
						v-for="(item, index) in weekList"
						:key="index"
						:label="item.value"
						:value="item.key"
						:disabled="item.key < cycle01 && item.key !== 1"
					/>
				</el-select>
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="4">
				第
				<el-input-number v-model="average01" :min="1" :max="4" />
				周的星期
				<el-select clearable v-model="average02">
					<el-option
						v-for="(item, index) in weekList"
						:key="index"
						:label="item.value"
						:value="item.key"
					/>
				</el-select>
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="5">
				本月最后一个星期
				<el-select clearable v-model="weekday">
					<el-option
						v-for="(item, index) in weekList"
						:key="index"
						:label="item.value"
						:value="item.key"
					/>
				</el-select>
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="6">
				指定
				<str-select
					v-model="checkboxList"
					:options="weekList"
					:multiple="true"
					placeholder="可多选"
				></str-select>
			</el-radio>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import strSelect from "@/components/CronExpress/MultipleSelect/strSelect.vue";

interface WeekItem {
	key: number;
	value: string;
}

interface Props {
	check: (value: number, min: number, max: number) => number;
	cron?: Record<string, any>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "update", field: "day" | "week", value: string, type?: string): void;
}>();

// 响应式状态
const radioValue = ref(2);
const weekday = ref(2);
const cycle01 = ref(2);
const cycle02 = ref(3);
const average01 = ref(1);
const average02 = ref(2);
const checkboxList = ref<number[]>([]);

// 周列表数据
const weekList = ref<WeekItem[]>([
	{ key: 2, value: "星期一" },
	{ key: 3, value: "星期二" },
	{ key: 4, value: "星期三" },
	{ key: 5, value: "星期四" },
	{ key: 6, value: "星期五" },
	{ key: 7, value: "星期六" },
	{ key: 1, value: "星期日" },
]);

// 计算属性
const cycleTotal = computed(() => {
	const c1 = props.check(cycle01.value, 1, 7);
	const c2 = props.check(cycle02.value, 1, 7);
	return `${c1}-${c2}`;
});

const averageTotal = computed(() => {
	const a1 = props.check(average01.value, 1, 4);
	const a2 = props.check(average02.value, 1, 7);
	return `${a2}#${a1}`;
});

const weekdayCheck = computed(() => props.check(weekday.value, 1, 7));

const checkboxString = computed(() =>
	checkboxList.value.length > 0 ? checkboxList.value.join(",") : "*"
);

// 核心监听逻辑
watch(radioValue, (newVal) => {
	if (newVal !== 2 && props.cron?.day !== "?") {
		emit("update", "day", "?", "week");
	}

	switch (newVal) {
		case 1:
			emit("update", "week", "*");
			break;
		case 2:
			emit("update", "week", "?");
			break;
		case 3:
			emit("update", "week", cycleTotal.value);
			break;
		case 4:
			emit("update", "week", averageTotal.value);
			break;
		case 5:
			emit("update", "week", `${weekdayCheck.value}L`);
			break;
		case 6:
			emit("update", "week", checkboxString.value);
			break;
	}
});

// 辅助监听
watch(cycleTotal, (newVal) => {
	if (radioValue.value === 3) {
		emit("update", "week", newVal);
	}
});

watch(averageTotal, (newVal) => {
	if (radioValue.value === 4) {
		emit("update", "week", newVal);
	}
});

watch(weekdayCheck, (newVal) => {
	if (radioValue.value === 5) {
		emit("update", "week", `${newVal}L`);
	}
});

watch(checkboxString, (newVal) => {
	if (radioValue.value === 6) {
		emit("update", "week", newVal);
	}
});

// 初始化处理
if (props.cron?.week) {
	// 这里可以添加cron表达式解析逻辑
}
</script>
