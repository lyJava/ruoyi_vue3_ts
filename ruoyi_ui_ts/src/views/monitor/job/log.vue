<template>
	<div class="app-container">
		<transition name="fade">
			<el-form
				:model="queryParams"
				ref="queryFormRef"
				:inline="true"
				v-show="showSearch"
				label-width="68px"
			>
				<el-form-item label="任务名称" prop="jobName">
					<el-input
						style="width: 240px;"
						v-model="queryParams.jobName"
						placeholder="请输入任务名称"
						clearable
                        @change="handleQuery"
						@keyup.enter.native="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="任务组名" prop="jobGroup">
					<el-select
						style="width: 240px"
						v-model="queryParams.jobGroup"
						placeholder="请选择组名"
						clearable
                        @change="handleQuery"
					>
						<el-option
							v-for="dict in sys_job_group"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="执行状态" prop="status">
					<el-select
						style="width: 240px;"
						v-model="queryParams.status"
						placeholder="请选择执行状态"
						clearable
                        @change="handleQuery"
					>
						<el-option
							v-for="dict in sys_job_status"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="执行时间">
					<el-date-picker
						style="width: 240px;"
						v-model="dateRange"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
                        @change="handleQuery"
					></el-date-picker>
				</el-form-item>
				<!-- prettier-ignore -->
			    <form-search @reset="resetQuery" @search="handleQuery" />
			</el-form>
		</transition>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5" v-if="!multiple">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					:disabled="multiple"
					@click="handleDelete"
					v-hasPermi="['monitor:job:remove']"
					>删除</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					@click="handleClean"
					v-hasPermi="['monitor:job:remove']"
					>清空</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="download"
					size="small"
					:loading="exportLoading"
					@click="handleExport"
					v-hasPermi="['monitor:job:export']"
					>导出</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="close"
					size="small"
					@click="handleClose"
					>关闭</el-button
				>
			</el-col>
            <!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			v-loading="loading"
			stripe
			border
			height="560px"
            ref="pageTableRef"
			:data="jobLogList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column
				label="日志编号"
				width="100"
				align="center"
				prop="jobLogId"
			/>
			<el-table-column
				label="任务名称"
				align="center"
				width="300"
				prop="jobName"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="任务组名"
				align="center"
				width="200"
				prop="jobGroup"
				:show-overflow-tooltip="true"
			>
				<template #default="scope">
					<dict-tag
						:options="sys_job_group"
						:value="scope.row.jobGroup"
					/>
				</template>
			</el-table-column>
			<el-table-column
				label="调用目标字符串"
				align="center"
				prop="invokeTarget"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="日志信息"
				align="center"
				prop="jobMessage"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="执行状态"
				align="center"
				prop="status"
				width="200"
			>
				<template #default="scope">
					<dict-tag
						:options="sys_job_status"
						:value="scope.row.status"
					/>
				</template>
			</el-table-column>
			<el-table-column
				label="执行时间"
				align="center"
				prop="createTime"
				width="200"
			>
				<template #default="scope">
					<span>{{ parseTime(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding fixed-width"
				width="250"
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
						size="small"
						type="primary"
						icon="view"
						@click="handleView(scope.row)"
						v-hasPermi="['monitor:job:query']"
						><span class="table_link_text">详细</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						size="small"
						type="danger"
						icon="delete"
						@click="handleDeleteOne(scope.row)"
						v-hasPermi="['monitor:job:query']"
						><span class="table_link_text">删除</span></el-link
					>
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

		<!-- 调度日志详细 -->
		<el-dialog
			title="调度日志详细"
			v-model="open"
			width="30%"
			append-to-body
            @close="cleanSelect()"
		>
			<el-form
				ref="formRef"
				:model="formData"
				label-width="100px"
				size="small"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="日志序号：">{{
							formData!.jobLogId
						}}</el-form-item>
						<el-form-item label="任务名称：">{{
							formData!.jobName
						}}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务分组：">{{
							formData!.jobGroup
						}}</el-form-item>
						<el-form-item label="执行时间：">{{
							formData!.createTime
						}}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="调用方法：">{{
							formData!.invokeTarget
						}}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="日志信息：">{{
							formData!.jobMessage
						}}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="执行状态：">
							<div v-if="formData!.status == '0'">正常</div>
							<div v-else-if="formData!.status == '1'">失败</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item
							label="异常信息："
							v-if="formData!.status == '1'"
							>{{ formData?.exceptionInfo }}</el-form-item
						>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="open = false">关 闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="JobLog" setup>
import JobLog from '@/api/request/monitor/job/jobLog';
// prettier-ignore
const  {
    loading, exportLoading, multiple, showSearch, total, jobLogList, open, dateRange, formData, queryParams, sys_job_group, sys_job_status, 
    pageTableRef, queryFormRef, getList, handleClose, handleQuery, resetQuery, handleSelectionChange, handleView, handleDelete, handleDeleteOne, handleClean, 
    handleExport, cleanSelect, 
} = JobLog();
</script>
