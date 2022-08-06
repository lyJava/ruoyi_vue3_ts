<template>
	<el-form ref="formRef" :model="user" :rules="rules" label-width="80px">
		<el-form-item label="用户昵称" prop="nickName">
			<el-input v-model="user.nickName" />
		</el-form-item>
		<el-form-item label="手机号码" prop="phonenumber">
			<el-input v-model="user.phonenumber" maxlength="11" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="user.email" maxlength="50" />
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="user.sex">
				<el-radio label="0">男</el-radio>
				<el-radio label="1">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item>
			<!-- prettier-ignore -->
			<el-button type="primary" size="small" @click="submit()">保存</el-button>
			<!-- prettier-ignore -->
			<el-button type="danger" size="small" @click="close()">关闭</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" name="UserInfo">
import { updateUserProfile } from "@/api/system/user";
import { ElForm } from "element-plus";
import { ref, getCurrentInstance } from "vue";
import useTagsViewStore from "@/store/modules/tagsView";
export default {
	props: {
		user: {
			type: Object,
		},
	},
	setup(props: any) {
		const { proxy } = getCurrentInstance() as any;
		const formRef = ref<InstanceType<typeof ElForm>>();
		const rules = ref<any>({
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
			phonenumber: [
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
			formRef.value?.validate((valid: boolean) => {
				if (valid) {
					updateUserProfile(props.user).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
						}
					});
				}
			});
		};
		const close = () => {
			useTagsViewStore().delView(proxy.$route);
			proxy.$router.push({ path: "/index" });
		};

		// prettier-ignore
		return {
			rules, formRef, submit, close,
        };
	},
};
</script>
