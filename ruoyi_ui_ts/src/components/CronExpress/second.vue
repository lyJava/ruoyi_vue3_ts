<template>
	<el-form size="default">
		<el-form-item>
			<el-radio v-model="radioValue" :label="1">
				秒，允许的通配符[, - * /]
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="2">
				周期从
				<el-input-number v-model="cycle01" :min="0" :max="58" /> ~
				<el-input-number
					v-model="cycle02"
					:min="cycle01 ? cycle01 + 1 : 1"
					:max="59"
				/>
				秒
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="3">
				从
				<el-input-number v-model="average01" :min="0" :max="58" />
				秒开始，每
				<el-input-number
					v-model="average02"
					:min="1"
					:max="59 - average01 || 0"
				/>
				秒执行一次
			</el-radio>
		</el-form-item>

		<el-form-item>
			<el-radio v-model="radioValue" :label="4">
				指定
				<num-select
					v-model="checkboxList"
					:multiple="true"
					:start="0"
					:end="59"
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
	radioParent?: number;
}

interface Emits {
	(e: "update", field: "second", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式状态
const radioValue = ref(props.radioParent || 1);
const cycle01 = ref(1);
const cycle02 = ref(2);
const average01 = ref(0);
const average02 = ref(1);
const checkboxList = ref<number[]>([]);

// 计算属性
const cycleTotal = computed(() => {
	const c1 = props.check(cycle01.value, 0, 58);
	const c2 = props.check(cycle02.value, c1 ? c1 + 1 : 1, 59);
	return `${c1}-${c2}`;
});

const averageTotal = computed(() => {
	const a1 = props.check(average01.value, 0, 58);
	const a2 = props.check(average02.value, 1, 59 - a1 || 0);
	return `${a1}/${a2}`;
});

const checkboxString = computed(() =>
	checkboxList.value.length > 0 ? checkboxList.value.join(",") : "*"
);

// 监听变化
watch(radioValue, (newVal) => {
	switch (newVal) {
		case 1:
			emit("update", "second", "*");
			break;
		case 2:
			emit("update", "second", cycleTotal.value);
			break;
		case 3:
			emit("update", "second", averageTotal.value);
			break;
		case 4:
			emit("update", "second", checkboxString.value);
			break;
	}
});

watch(cycleTotal, (newVal) => {
	if (radioValue.value === 2) {
		emit("update", "second", newVal);
	}
});

watch(averageTotal, (newVal) => {
	if (radioValue.value === 3) {
		emit("update", "second", newVal);
	}
});

watch(checkboxString, (newVal) => {
	if (radioValue.value === 4) {
		emit("update", "second", newVal);
	}
});

watch(
	() => props.radioParent,
	(newVal) => {
		if (newVal !== undefined) {
			radioValue.value = newVal;
		}
	}
);
</script>
