<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="68px"
		>
			<el-form-item label="任务名称" prop="jobName">
				<el-input
					style="width: 300px;"
					v-model="queryParams.jobName"
					placeholder="请输入任务名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="任务组名" prop="jobGroup">
				<el-select
					style="width: 240px;"
					v-model="queryParams.jobGroup"
					placeholder="请选择任务组名"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="dict in jobGroupOptions"
						:key="dict.dictValue"
						:label="dict.dictLabel"
						:value="dict.dictValue"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="任务状态" prop="status">
				<el-select
					style="width: 240px;"
					v-model="queryParams.status"
					placeholder="请选择任务状态"
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
			<!-- prettier-ignore -->
			<form-search @reset="resetQuery" @search="handleQuery" />
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					icon="plus"
					size="small"
					@click="handleAdd"
					v-hasPermi="['monitor:job:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="download"
					size="small"
					@click="handleExport"
					v-hasPermi="['monitor:job:export']"
					>导出</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="info"
					plain
					icon="operation"
					size="small"
					@click="handleJobLog"
					v-hasPermi="['monitor:job:query']"
					>日志</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="!single">
				<el-button
					type="success"
					plain
					icon="edit"
					size="small"
					:disabled="single"
					@click="handleUpdate"
					v-hasPermi="['monitor:job:edit']"
					>修改</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!multiple">
				<el-button
					type="primary"
					plain
					icon="stopwatch"
					size="small"
					:disabled="multiple"
					@click="handleChange"
					v-hasPermi="['monitor:job:remove']"
					>启动/停止</el-button
				>
			</el-col>
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
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			v-loading="loading"
			border
			stripe
			height="560px"
			ref="pageTableRef"
			:data="jobList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="任务编号" align="center" prop="jobId" />
			<el-table-column
				label="任务名称"
				align="center"
				prop="jobName"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="任务组名"
				align="center"
				prop="jobGroup"
				:formatter="jobGroupFormat"
			/>
			<el-table-column
				label="调用目标字符串"
				align="center"
				prop="invokeTarget"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="cron执行表达式"
				align="center"
				prop="cronExpression"
				:show-overflow-tooltip="true"
			/>
			<el-table-column label="运行状态" align="center">
				<template #default="scope">
					{{ scope.row.status === "1" ? "已停止" : "运行中" }}
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				width="280"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
					<el-switch
						v-model="scope.row.status"
						active-value="0"
						inactive-value="1"
						@click="handleStatusChange(scope.row)"
						:before-change="() => false"
						:title="scope.row.status === '0' ? '运行中(点击停止)' : '已停止(点击运行)'"
					></el-switch>
					<!--<el-button
                            size="small"
                            type="text"
                            icon="caret-right"
                            @click="handleRun(scope.row)"
                            v-hasPermi="['monitor:job:changeStatus']"
                        >执行一次</el-button> -->
					<!-- <el-button
                            size="small"
                            type="text"
                            icon="view"
                            @click="handleView(scope.row)"
                            v-hasPermi="['monitor:job:query']"
                        >详细</el-button>-->
					<el-link
						class="table_link_btn"
						style="margin-left: 10px"
						:underline="false"
						icon="edit"
						size="small"
						type="primary"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['monitor:job:edit']"
						>修改</el-link
					>
					<!-- prettier-ignore -->
					<el-dropdown
						size="small"
						@command="(command) => handleCommand(command, scope.row)"
						v-hasPermi="['monitor:job:changeStatus','monitor:job:query',]"
					>
						<el-link
							class="table_link_btn"
							style="margin-top: 5px"
							:underline="false"
							type="primary"
							@click="handleDelete(scope.row)"
							v-hasPermi="['monitor:job:remove']"
							>更多</el-link
						>
						<template #dropdown>
							<el-dropdown-menu slot="dropdown">
								<div v-hasPermi="['monitor:job:changeStatus']">
									<el-dropdown-item
										command="handleRun"
										icon="caret-right"
										>执行一次</el-dropdown-item
									>
								</div>
								<div v-hasPermi="['monitor:job:query']">
									<el-dropdown-item
										command="handleView"
										icon="view"
										>任务详细</el-dropdown-item
									>
								</div>

								<div v-hasPermi="['monitor:job:query']">
									<el-dropdown-item
										command="handleJobLog"
										icon="s-operation"
										>调度日志</el-dropdown-item
									>
								</div>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-link
						class="table_link_btn"
						:underline="false"
						icon="delete"
						size="small"
						type="danger"
						@click="handleDelete(scope.row)"
						v-hasPermi="['monitor:job:remove']"
						>删除</el-link
					>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList()"
		/>

		<!-- 添加或修改定时任务对话框 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="30%"
			append-to-body
			@closed="cleanSelect()"
		>
			<el-form
				ref="formRef"
				:model="formData"
				:rules="rules"
				label-width="100px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="任务名称" prop="jobName">
							<!-- prettier-ignore -->
							<el-input v-model="formData!.jobName" placeholder="请输入任务名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务分组" prop="jobGroup">
							<!-- prettier-ignore -->
							<el-select v-model="formData!.jobGroup" placeholder="请选择" style="width: 100%;">
								<el-option
									v-for="dict in jobGroupOptions"
									:key="dict.dictValue"
									:label="dict.dictLabel"
									:value="dict.dictValue"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="调用方法" prop="invokeTarget">
							<div slot="label">
								<div>
									Bean调用示例：ryTask.ryParams('ry')
									<br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
									<br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型"
								</div>
							</div>
							<!-- prettier-ignore -->
							<el-input v-model="formData!.invokeTarget" placeholder="请输入调用目标字符串" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="cron表达式" prop="cronExpression">
							<!-- prettier-ignore -->
							<el-input v-model="formData!.cronExpression" placeholder="请输入cron执行表达式">
								<template #append>
									<el-button type="primary" @click="handleShowCron">
										生成表达式
										<el-icon class="icon-right" style="margin-left: 4px;"><Timer/></el-icon>
									</el-button>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否并发" prop="concurrent">
							<!-- prettier-ignore -->
							<el-radio-group v-model="formData!.concurrent">
								<!-- prettier-ignore -->
                                <el-radio-button value="1">禁止</el-radio-button>
								<!-- prettier-ignore -->
								<el-radio-button value="0">允许</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="错误策略" prop="misfirePolicy">
							<!-- prettier-ignore -->
							<el-radio-group	v-model="formData!.misfirePolicy">
								<!-- prettier-ignore -->
								<el-radio-button value="1">立即执行</el-radio-button>
								<!-- prettier-ignore -->
								<el-radio-button value="2">执行一次</el-radio-button>
                                <!-- prettier-ignore -->
								<el-radio-button value="3">放弃执行</el-radio-button>
								<!-- prettier-ignore -->
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-radio-group v-model="formData!.status">
								<el-radio
									v-for="dict in statusOptions"
									:key="dict.dictValue"
									:value="dict.dictValue"
									>{{ dict.dictLabel }}</el-radio
								>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<!-- prettier-ignore -->
					<el-button type="primary" @click="submitForm()">确 定</el-button>
					<!-- prettier-ignore -->
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog title="Cron表达式生成器" v-model="openCron" append-to-body destroy-on-close class="scrollbar" :before-close="() => openCron = false">
			<cron-express v-if="openCron" @hide="openCron=false" @fill="cronInputFill" :expression="expression"></cron-express>
		</el-dialog>

		<!-- 任务日志详细 -->
		<el-dialog
			title="任务详细"
			v-model="openView"
			width="30%"
			append-to-body
			@close="cleanSelect()"
		>
			<el-form ref="form" :model="formData">
				<el-row>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="任务编号：">{{ formData?.jobId }}</el-form-item>
						<!-- prettier-ignore -->
						<el-form-item label="任务名称：">{{ formData?.jobName }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="任务分组：">{{ jobGroupFormat(formData) }}</el-form-item>
						<!-- prettier-ignore -->
						<el-form-item label="创建时间：">{{ formData?.createTime }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="cron表达式：">{{ formData?.cronExpression }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="下次执行时间：">{{ parseTime(formData?.nextValidTime) }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<!-- prettier-ignore -->
						<el-form-item label="调用目标方法：">{{ formData?.invokeTarget }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务状态：">
							<div v-if="formData?.status == '0'">正常</div>
							<div v-else-if="formData?.status == '1'">失败</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否并发：">
							<div v-if="formData?.concurrent == '0'">允许</div>
							<div v-else-if="formData?.concurrent == '1'">禁止</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="执行策略：">
							<div v-if="formData?.misfirePolicy == '0'">
								默认策略
							</div>
							<div v-else-if="formData?.misfirePolicy == '1'">
								立即执行
							</div>
							<div v-else-if="formData?.misfirePolicy == '2'">
								执行一次
							</div>
							<div v-else-if="formData?.misfirePolicy == '3'">
								放弃执行
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="openView = false">关 闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Job" setup>
import Job from "@/api/request/monitor/job";
import CronExpress from "@/components/CronExpress/index.vue";

// prettier-ignore
const {
    loading, single, multiple, showSearch, total, jobList, title, open, openView, jobGroupOptions, statusOptions, formRef, formData, rules, 
    getList, jobGroupFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleCommand, handleStatusChange, cleanSelect, openCron,  
    handleJobLog, handleAdd, handleUpdate, submitForm, handleDelete, handleExport, handleChange, cronInputFill, queryParams, queryFormRef, 
	pageTableRef, expression, handleShowCron,
} = Job();
</script>
