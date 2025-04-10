<template>
	<el-form ref="pwdFormRef" :model="user" :rules="rules" label-width="80px">
		<el-form-item label="旧密码" prop="oldPassword">
			<el-input
				v-model="user.oldPassword"
				placeholder="请输入旧密码"
				type="password"
                show-password
			/>
		</el-form-item>
		<el-form-item label="新密码" prop="newPassword">
			<el-input
				v-model="user.newPassword"
				placeholder="请输入新密码"
				type="password"
                show-password
			/>
		</el-form-item>
		<el-form-item label="确认密码" prop="confirmPassword">
			<el-input
				v-model="user.confirmPassword"
				placeholder="请确认密码"
				type="password"
                show-password
			/>
		</el-form-item>
		<el-form-item>
			<!-- prettier-ignore -->
			<el-button type="default" size="small" @click="formReset">重置</el-button>
			<!-- prettier-ignore -->
			<el-button type="danger" size="small" @click="close">关闭</el-button>
			<!-- prettier-ignore -->
			<el-button type="primary" size="small" @click="submit">保存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" name="RestPwd" setup>
import { ref, getCurrentInstance } from "vue";
import { updateUserPwd } from "@/api/system/user";
import { ElForm } from "element-plus";
import useTagsViewStore from "@/store/modules/tagsView";

const { proxy } = getCurrentInstance() as any;
const pwdFormRef = ref<InstanceType<typeof ElForm>>();
const equalToPassword = (rule: any, value: any, callback: any) => {
	if (proxy.user.newPassword !== value) {
		callback(new Error("两次输入的密码不一致"));
	} else {
		callback();
	}
};
const user = ref({
	oldPassword: undefined,
	newPassword: undefined,
	confirmPassword: undefined,
});
// 表单校验
const rules = ref({
	oldPassword: [
		{
			required: true,
			message: "旧密码不能为空",
			trigger: "blur",
		},
	],
	newPassword: [
		{
			required: true,
			message: "新密码不能为空",
			trigger: "blur",
		},
		{
			min: 6,
			max: 20,
			message: "长度在 6 到 20 个字符",
			trigger: "blur",
		},
	],
	confirmPassword: [
		{
			required: true,
			message: "确认密码不能为空",
			trigger: "blur",
		},
		{
			required: true,
			validator: equalToPassword,
			trigger: "blur",
		},
	],
});

const submit = () => {
	pwdFormRef.value?.validate((valid: boolean) => {
		if (valid) {
			// prettier-ignore
			updateUserPwd(user.value.oldPassword, user.value.newPassword).then((response: any) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess("修改成功");
                    proxy.resetForm(pwdFormRef);
                }
            });
		}
	});
};
const close = () => {
	useTagsViewStore().delView(proxy.$route);
	proxy.$router.push({ path: "/index" });
};

const formReset = () => {
	pwdFormRef.value?.resetFields();
};

// 暴露方法
defineExpose({
	pwdFormRef,
	formReset,
});
</script>
