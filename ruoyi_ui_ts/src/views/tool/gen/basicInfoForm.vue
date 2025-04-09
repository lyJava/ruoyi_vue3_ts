<template>
	<el-form
		ref="basicInfoForm"
		:model="info"
		:rules="rules"
		label-width="150px"
	>
		<el-row>
			<el-col :span="12">
				<el-form-item label="表名称" prop="tableName">
					<el-input
						placeholder="请输入仓库名称"
						v-model="info.tableName"
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="表描述" prop="tableComment">
					<el-input
						placeholder="请输入"
						v-model="info.tableComment"
					/>
				</el-form-item>
			</el-col>

			<el-col :span="12">
				<el-form-item label="实体类名称" prop="className">
					<el-input placeholder="请输入" v-model="info.className" />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="作者" prop="functionAuthor">
					<el-input
						placeholder="请输入"
						v-model="info.functionAuthor"
					/>
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item label="swagger注释" prop="swagger">
					<!-- <el-select
						v-model="info.swagger"
						clearable
						@change="selectChange"
						style="width: 100%"
					>
						<el-option
							v-for="(item, index) in options1"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</el-select> -->
					<!-- prettier-ignore -->
					<el-switch
                        v-model="info.swagger"
                        class="mb-2"
                        :active-value="1"
                        :inactive-value="0"
                        style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                    />
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item label="excel注释" prop="excelExport">
					<!-- <el-select
						v-model="info.excelExport"
						clearable
						@change="selectChange"
						style="width: 100%"
					>
						<el-option
							v-for="(item, index) in options2"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</el-select> -->
					<!-- prettier-ignore -->
					<el-switch
                        v-model="info.excelExport"
                        class="mb-2"
                        :active-value="1"
                        :inactive-value="0"
                        style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                    />
				</el-form-item>
			</el-col>
            <el-col :span="4">
				<el-form-item label="vue版本" prop="swagger">
					<!-- <el-switch
                        v-model="info.vueVersion"
                        inline-prompt
                        active-value="是"
                        inactive-value="否"
                        style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                    /> -->
                    <el-select
						v-model="info.vueVersion"
						clearable
						@change="selectChange"
						style="width: 100%"
					>
						<el-option
							v-for="(item, index) in vueOptions3"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="备注" prop="remark">
					<el-input
						type="textarea"
						:rows="3"
						v-model="info.remark"
					></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>
<script name="GenBasicInfo" setup>
import { ref } from "vue";
defineProps({
	info: {
		type: Object,
		default: null,
	},
});

const rules = ref({
	tableName: [
		{
			required: true,
			message: "请输入表名称",
			trigger: "blur",
		},
	],
	tableComment: [
		{
			required: true,
			message: "请输入表描述",
			trigger: "blur",
		},
	],
	className: [
		{
			required: true,
			message: "请输入实体类名称",
			trigger: "blur",
		},
	],
	functionAuthor: [
		{
			required: true,
			message: "请输入作者",
			trigger: "blur",
		},
	],
});
const options1 = [
	{
		value: 0,
		label: "否",
	},
	{
		value: 1,
		label: "是",
	},
];
const options2 = [
	{
		value: 0,
		label: "否",
	},
	{
		value: 1,
		label: "是",
	},
];

const vueOptions3 = [
	{
		value: 2,
		label: "Vue2",
	},
	{
		value: 3,
		label: "Vue3",
	},
];

const selectChange = (data) => {
	console.log("当前选择的值", data);
};
</script>
