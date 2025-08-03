<template>
	<el-form ref="basicInfoRef" :model="user" :rules="rules" label-width="80px">
		<el-form-item label="用户昵称" prop="nickname">
			<el-input v-model="user.nickname" />
		</el-form-item>
		<el-form-item label="手机号码" prop="phoneNo">
			<el-input v-model="user.phoneNo" maxlength="11" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="user.email" maxlength="50" />
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="user.sex">
				<el-radio value="0">男</el-radio>
				<el-radio value="1">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item>
			<!-- prettier-ignore -->
			<el-button type="default" size="small" @click="reset()">重置</el-button>
			<!-- prettier-ignore -->
			<el-button type="danger" size="small" @click="close()">关闭</el-button>
			<!-- prettier-ignore -->
			<el-button type="primary" size="small" @click="submit()">保存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" name="UserInfo" setup>
import { updateUserProfile } from "@/api/system/user";
import { ElForm, FormInstance, FormRules } from "element-plus";
import { ref } from "vue";
import useTagsViewStore from "@/store/modules/tagsView";

// interface RuleItem {
// 	/**
// 	 * 是否必须验证
// 	 */
// 	required?: boolean;
// 	/**
// 	 * 验证失败信息
// 	 */
// 	message?: string;
// 	/**
// 	 * 触发条件
// 	 */
// 	trigger: string | string[];
// 	/**
// 	 * 类型
// 	 */
// 	type?: string;
// 	/**
// 	 * 正则表达式
// 	 */
//     pattern?: RegExp;
// }

// type FormRules = Record<string, RuleItem[]>;

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
});

const proxy = useSafeInstance();
const basicInfoRef = ref<FormInstance | null>();
const rules = ref<FormRules>({
	nickName: [
		{
			required: true,
			message: "用户昵称不能为空",
			trigger: "blur",
		},
	],
	email: [
		{
			required: true,
			message: "邮箱地址不能为空",
			trigger: "blur",
		},
		{
			type: "email",
			message: "'请输入正确的邮箱地址",
			trigger: ["blur", "change"],
		},
	],
	phoneNo: [
		{
			required: true,
			message: "手机号码不能为空",
			trigger: "blur",
		},
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
});

const submit = () => {
	basicInfoRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			try {
				const response: any = await updateUserProfile(props.user)
				if (response.code === 200) {
					proxy.$modal.msgSuccess("修改成功");
				} else {
					proxy.$modal.msgSuccess("修改失败");
				}
			} catch (error) {
				console.error("个人信息修改错误", error);
				proxy.$modal.msgError("修改错误，请稍后重试");
			}
		}
	});
};
const close = () => {
	useTagsViewStore().delView(proxy.$route);
	proxy.$router.push({ path: "/index" });
};
const reset = () => {
	basicInfoRef.value?.resetFields();
}

// 暴露给父组件
defineExpose({
	basicInfoRef
});

</script>
