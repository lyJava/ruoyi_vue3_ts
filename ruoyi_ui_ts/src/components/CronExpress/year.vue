<template>
	<el-form size="default">
		<el-form-item>
			<el-radio :label="1" v-model="radioValue">
				不填，允许的通配符[, - * /]
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio :label="2" v-model="radioValue"> 每年 </el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio :label="3" v-model="radioValue">
				周期从
				<el-input-number
					v-model="cycle01"
					:min="fullYear"
					:max="2098"
				/>
				-
				<el-input-number
					v-model="cycle02"
					:min="cycle01 ? cycle01 + 1 : fullYear + 1"
					:max="2099"
				/>
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio :label="4" v-model="radioValue">
				从
				<el-input-number
					v-model="average01"
					:min="fullYear"
					:max="2098"
				/>
				年开始，每
				<el-input-number
					v-model="average02"
					:min="1"
					:max="2099 - average01 || fullYear"
				/>
				年执行一次
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio :label="5" v-model="radioValue">
				指定
				<num-select
					v-model="checkboxList"
					:multiple="true"
					:start="fullYear"
					:end="(fullYear-1+9)"
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
	month?: number;
	cron?: Record<string, any>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "update", field: "year", value: string): void;
}>();

// 响应式状态
const fullYear = ref(0);
const radioValue = ref(1);
const cycle01 = ref(0);
const cycle02 = ref(0);
const average01 = ref(0);
const average02 = ref(1);
const checkboxList = ref<number[]>([]);

const yearOptionList =ref<number[]>([]);

for (let i = 0; i< 9; i++) {
	yearOptionList.value.push(i+fullYear.value);
}

// 计算属性
const cycleTotal = computed(() => {
	const c1 = props.check(cycle01.value, fullYear.value, 2098);
	const c2 = props.check(
		cycle02.value,
		c1 ? c1 + 1 : fullYear.value + 1,
		2099
	);
	return `${c1}-${c2}`;
});

const averageTotal = computed(() => {
	const a1 = props.check(average01.value, fullYear.value, 2098);
	const a2 = props.check(average02.value, 1, 2099 - a1 || fullYear.value);
	return `${a1}/${a2}`;
});

const checkboxString = computed(() => checkboxList.value.join(","));

// 生命周期钩子
onMounted(() => {
	const currentYear = new Date().getFullYear();
	fullYear.value = currentYear;
	cycle01.value = currentYear;
	average01.value = currentYear;
});

// 监听器
watch(radioValue, (newVal) => {
	switch (newVal) {
		case 1:
			emit("update", "year", "");
			break;
		case 2:
			emit("update", "year", "*");
			break;
		case 3:
			emit("update", "year", cycleTotal.value);
			break;
		case 4:
			emit("update", "year", averageTotal.value);
			break;
		case 5:
			emit("update", "year", checkboxString.value);
			break;
	}
});

watch(cycleTotal, (newVal) => {
	if (radioValue.value === 3) {
		emit("update", "year", newVal);
	}
});

watch(averageTotal, (newVal) => {
	if (radioValue.value === 4) {
		emit("update", "year", newVal);
	}
});

watch(checkboxString, (newVal) => {
	if (radioValue.value === 5) {
		emit("update", "year", newVal);
	}
});
</script>
