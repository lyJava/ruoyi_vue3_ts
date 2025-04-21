<template>
	<div class="app-container">
		<el-form
			ref="queryFormRef"
			:model="queryParams"
			:inline="true"
			label-width="68px"
		>
			<el-form-item label="登录地址" prop="ip">
				<el-input
					v-model="queryParams.ip"
					placeholder="请输入登录地址"
					clearable
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="用户名称" prop="userName">
				<el-input
					v-model="queryParams.userName"
					placeholder="请输入用户名称"
					clearable
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<!-- prettier-ignore -->
			<form-search @reset="resetQuery" @search="handleQuery" />
		</el-form>
		<!-- prettier-ignore -->
		<el-table
			v-loading="loading"
			:data="tableList"
			style="width: 100%;"
			stripe
			border
		>
			<el-table-column label="序号" type="index" align="center" width="55">
				<template #default="scope">
                    <!-- prettier-ignore -->
					<span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="用户ID"
				align="center"
                width="120"
				prop="id"
			/>
			<el-table-column
				label="会话编号"
				align="center"
                width="200"
				prop="uuid"
				show-overflow-tooltip
			/>
			<el-table-column
				label="登录名称"
				align="center"
				prop="username"
				:show-overflow-tooltip="true"
			/>
			<el-table-column label="部门名称" align="center" prop="deptName" />
			<el-table-column
				label="主机"
				align="center"
				prop="ip"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="登录地点"
				align="center"
				prop="loginLocation"
				:show-overflow-tooltip="true"
			/>
			<el-table-column label="浏览器" align="center" prop="browser" />
			<el-table-column label="操作系统" align="center" prop="os" />
			<el-table-column
				label="登录时间"
				align="center"
				prop="loginTime"
				width="180"
			>
				<template #default="scope">
					<span>{{ parseTime(scope.row.loginTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
                        :underline="false"
                        class="table_link_btn"
						size="small"
						type="warning"
						icon="delete"
						@click="handleForceLogout(scope.row)"
						v-hasPermi="['monitor:online:forceLogout']"
						><span class="table_link_text">强退</span></el-link
					>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
		/>
	</div>
</template>

<script lang="ts" name="Online" setup>
import Online from "@/api/request/monitor/online";
// prettier-ignore
const { loading, total, tableList, queryParams, queryFormRef, handleQuery, resetQuery, handleForceLogout, } = Online();
</script>
