<!-- @format -->

<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="登录地址" prop="ipaddr">
				<el-input
					style="width: 240px;"
					v-model="queryParams.ipaddr"
					placeholder="请输入登录地址"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="用户名称" prop="userName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.userName"
					placeholder="请输入用户名称"
					clearable
                    @clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select
					style="width: 240px;"
					v-model="queryParams.status"
					placeholder="登录状态"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="dict in statusOptions"
						:key="dict.dictValue"
						:label="dict.dictLabel"
						:value="dict.dictValue"
					/>
				</el-select>
			</el-form-item>
            <el-form-item label="操作信息" prop="msg">
				<el-input
					v-model="queryParams.msg"
					placeholder="请输入操作信息"
					clearable
					style="width: 240px"
                    @clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="登录时间" style="font-weight: bold;">
				<el-date-picker
					v-model="dateRange"
                    format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					type="datetimerange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
                    @change="handleQuery"
				>
				</el-date-picker>
			</el-form-item>
			<!-- prettier-ignore -->
			<form-search @reset="resetQuery" @search="handleQuery" />
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					@click="handleClean"
					v-hasPermi="['monitor:logininfor:remove']"
					>清空</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="download"
					size="small"
					@click="handleExport"
					v-hasPermi="['monitor:logininfor:export']"
					>导出</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="!multiple && ids.length >= 1">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					:disabled="multiple"
					@click="handleDelete"
					v-hasPermi="['monitor:logininfor:remove']"
					>删除</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="!multiple">
				<el-button
					type="primary"
					plain
					icon="edit"
					size="small"
					:disabled="multiple"
					@click="unlock"
					v-hasPermi="['monitor:logininfor:unlock']"
					>解除锁定</el-button
				>
			</el-col>
            <!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			v-loading="loading"
			:data="list"
			height="500"
			stripe
			border
            ref="pageTableRef"
			@selection-change="handleSelectionChange"
		>
			<!-- <el-table-column type="selection" width="55" align="center" :selectable="checkSelected"/> -->
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column
				label="编号"
				align="center"
				prop="infoId"
				width="100"
			/>
			<el-table-column
				label="用户名称"
				align="center"
				prop="userName"
				width="150"
			/>
			<el-table-column
				label="登录地址"
				align="center"
				prop="ipaddr"
				width="150"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="登录地点"
				align="center"
				width="200"
				prop="loginLocation"
				:show-overflow-tooltip="true"
			/>
			<el-table-column label="浏览器" align="center" prop="browser" width="200"/>
			<el-table-column label="操作系统" align="center" prop="os" width="200"/>
			<el-table-column
				label="登录状态"
				align="center"
				width="150"
				prop="status"
				:formatter="statusFormat"
			>
				<template #default="scope">
					<!-- <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{scope.row.status === "0" ? "成功" : "失败"}}</el-tag> -->
                    <!-- <dict-tag
						:options="dict.type.sys_common_status"
						:value="scope.row.status"
					/> -->
                    <DataSingleTag :single-data="scope.row.status" :status-options="statusOptions"/>
				</template>
			</el-table-column>
			<el-table-column label="操作信息" align="center" prop="msg" width="150"/>
			<el-table-column label="操作信息" header-align="left" align="left" prop="token" show-overflow-tooltip  width=""/>
			<el-table-column
				label="登录时间"
				align="center"
				prop="loginTime"
				width="200"
			>
				<template #default="scope">
					<!-- <span>{{ parseTime(scope.row.loginTime, '{y}-{m}-{d}') }}</span> -->
					<span>{{ scope.row.loginTime }}</span>
				</template>
			</el-table-column>
            <el-table-column
				label="删除"
				align="center"
				fixed="right"
				class-name="small-padding fixed-width"
				width="150"
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
                        type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['monitor:operlog:query']"
					>
						<!-- prettier-ignore -->
						<span class="table_link_text">删除</span>
					</el-link>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
	</div>
</template>

<script lang="ts" name="LoginLog" setup>
import LoginLog from '@/api/request/monitor/log/loginLog';

const {
    queryFormRef,
	loading,
	multiple,
	showSearch,
	total,
	list,
	ids,
	statusOptions,
	dateRange,
	queryParams,
    pageTableRef,
	getList,
	statusFormat,
	handleQuery,
	resetQuery,
	handleSelectionChange,
	handleDelete,
	handleClean,
	handleExport,
    unlock,
    checkSelected
} = LoginLog();
</script>
