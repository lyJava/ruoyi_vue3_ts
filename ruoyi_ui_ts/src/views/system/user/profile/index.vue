<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :span="6" :xs="24">
				<el-card class="box-card">
					<template #header>
						<div class="clearfix">
							<span>个人信息</span>
						</div>
					</template>

					<div>
						<div class="text-center">
							<userAvatar :user="user" />
						</div>
						<ul class="list-group list-group-striped">
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="user"
										style="margin-right: 5px"
									/>用户名称
								</span>
								<span class="pull-right">
									{{ user.userName }}
								</span>
							</li>
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="phone"
										style="margin-right: 5px"
									/>手机号码
								</span>
								<span class="pull-right">
									{{ user.phonenumber }}
								</span>
							</li>
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="email"
										style="margin-right: 5px"
									/>用户邮箱
								</span>
								<span class="pull-right">
									{{ user.email }}
								</span>
							</li>
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="tree"
										style="margin-right: 5px"
									/>所属部门
								</span>
								<span class="pull-right" v-if="user.dept">
									{{ user.dept.deptName }}
								</span>
							</li>
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="peoples"
										style="margin-right: 5px"
									/>岗位信息
								</span>
								<span class="pull-right">
									<el-tag
										style="margin: 3px"
										v-for="item in postGroup"
										>{{ item }}</el-tag
									>
								</span>
							</li>
							<li class="list-group-item">
								<span>
									<svg-icon
										icon-class="peoples"
										style="margin-right: 5px"
									/>所属角色
								</span>
								<span class="pull-right">
									<el-tag
										style="margin: 3px"
										v-for="item in roleGroup"
										>{{ item }}</el-tag
									>
								</span>
							</li>
							<li class="list-group-item">
								<span
									><svg-icon
										icon-class="date"
										style="margin-right: 5px"
									/>创建日期
								</span>
								<span class="pull-right">
									<span style="line-height: 22px">{{
										user.createTime
									}}</span>
								</span>
							</li>
						</ul>
					</div>
				</el-card>
			</el-col>
			<el-col :span="18" :xs="24">
				<el-card>
					<template #header>
						<div class="clearfix">
							<span>基本资料</span>
						</div>
					</template>

                    <!-- <el-tabs v-model="activeTab" @tab-change="tabChange"> -->
					<el-tabs v-model="activeTab" @tab-click="tabClick">
						<el-tab-pane label="基本资料" name="userInfo">
							<userInfo ref="userInfoRef" :user="user" />
						</el-tab-pane>
						<el-tab-pane label="修改密码" name="resetPwd">
							<resetPwd ref="pwdRef" :user="user" />
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" name="Profile" setup>
import { ref, onMounted } from "vue";
import userAvatar from "./userAvatar.vue";
import userInfo from "./userInfo.vue";
import resetPwd from "./resetPwd.vue";
import { getUserProfile } from "@/api/system/user";
import { IUser } from "@/api/request/module/profile";
import { TabPaneName } from "element-plus";

const pwdRef = ref<any>();
const userInfoRef = ref<InstanceType<typeof userInfo>>();
const activeTab = ref<string>("userInfo");
const user = ref<IUser>({
	userId: "",
	userName: "",
	avatar: "",
	createBy: "",
	createTime: "",
	dept: {
		deptName: "",
	},
	deptId: "",
	email: "",
	nickName: "",
	phonenumber: "",
	remark: "",
});

const roleGroup = ref<any>();
const postGroup = ref<any>();
const getUser = async () => {
	await getUserProfile().then((response: any) => {
		if (response.code === 200) {
			const data = response.data;
			user.value = data.data;
			roleGroup.value = data.roleGroup.split(",");
			postGroup.value = data.postGroup.split(",");
		}
	});
};

/**
 * tab点击调用
 * 
 * @param tab tab
 */
const tabClick = (tab: any) => {
	if ("resetPwd" === tab.paneName) {
		// proxy.$refs["pwdRef"].formRest();
		//pwdRef.value?.pwdFormRef?.resetFields();
		//pwdRef.value?.formReset();
		console.log("当前tab===", tab.paneName);
		
	}
	if ("userInfo" === tab.paneName) {
		//userInfoRef.value?.basicInfoRef?.resetFields();
		console.log("当前tab===", tab.paneName);
	}
};

/**
 * tab改变调用
 */
const tabChange = (tabName: TabPaneName) => {
	if ("resetPwd" === tabName) {
		// proxy.$refs["pwdRef"].formRest();
        // 使用vue3的方式
		pwdRef.value?.formReset();
	}
};

onMounted(() => {
    getUser();
});

</script>
