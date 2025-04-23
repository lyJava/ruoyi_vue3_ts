<template>
	<el-form size="default">
		<el-form-item>
			<el-radio v-model="radioValue" :label="1">
				日，允许的通配符[, - * ? / L W]
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="2"> 不指定 </el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="3">
				周期从
				<el-input-number v-model="cycle01" :min="1" :max="30" /> -
				<el-input-number
					v-model="cycle02"
					:min="cycle01 ? cycle01 + 1 : 2"
					:max="31"
				/>
				日
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="4">
				从
				<el-input-number v-model="average01" :min="1" :max="30" />
				号开始，每
				<el-input-number
					v-model="average02"
					:min="1"
					:max="31 - average01 || 1"
				/>
				日执行一次
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="5">
				每月
				<el-input-number v-model="workday" :min="1" :max="31" />
				号最近的那个工作日
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="6"> 本月最后一天 </el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="7">
				指定
				<num-select
					v-model="checkboxList"
					:multiple="true"
					:start="1"
					:end="31"
					placeholder="可多选"
					label-format="minutes"
				></num-select>
			</el-radio>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import numSelect from "@/components/CronExpress/MultipleSelect/numSelect.vue";

interface Props {
	check: (value: number, min: number, max: number) => number;
	cron?: Record<string, unknown>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "update", field: "day" | "week", value: string, type: string): void;
}>();

const radioValue = ref(1);
const workday = ref(1);
const cycle01 = ref(1);
const cycle02 = ref(2);
const average01 = ref(1);
const average02 = ref(1);
const checkboxList = ref<number[]>([]);

// 计算属性
const cycleTotal = computed(() => {
	const c1 = props.check(cycle01.value, 1, 30);
	const c2 = props.check(cycle02.value, c1 ? c1 + 1 : 2, 31);
	return `${c1}-${c2}`;
});

const averageTotal = computed(() => {
	const a1 = props.check(average01.value, 1, 30);
	const a2 = props.check(average02.value, 1, 31 - a1 || 0);
	return `${a1}/${a2}`;
});

const workdayCheck = computed(() => {
	return props.check(workday.value, 1, 31);
});

const checkboxString = computed(() => {
	return checkboxList.value.length > 0 ? checkboxList.value.join(",") : "*";
});

// 主要变更处理
const handleRadioChange = (newValue: number) => {
	if (newValue !== 2 && props.cron?.week !== "?") {
		emit("update", "week", "?", "day");
	}

	switch (newValue) {
		case 1:
			emit("update", "day", "*", "day");
			break;
		case 2:
			emit("update", "day", "?", "day");
			break;
		case 3:
			emit("update", "day", cycleTotal.value, "day");
			break;
		case 4:
			emit("update", "day", averageTotal.value, "day");
			break;
		case 5:
			emit("update", "day", `${workdayCheck.value}W`, "day");
			break;
		case 6:
			emit("update", "day", "L", "day");
			break;
		case 7:
			emit("update", "day", checkboxString.value, "day");
			break;
	}
};

// Watch 监听
watch(radioValue, (newVal, oldVal) => {
	if (newVal !== oldVal) {
		handleRadioChange(newVal);
	}
});

watch(cycleTotal, (newVal) => {
	if (radioValue.value === 3) {
		emit("update", "day", newVal, "day");
	}
});

watch(averageTotal, (newVal) => {
	if (radioValue.value === 4) {
		emit("update", "day", newVal, "day");
	}
});

watch(workdayCheck, (newVal) => {
	if (radioValue.value === 5) {
		emit("update", "day", `${newVal}W`, "day");
	}
});

watch(checkboxString, (newVal) => {
	if (radioValue.value === 7) {
		emit("update", "day", newVal, "day");
	}
});
</script>
