<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryForm"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="系统模块" prop="title">
				<el-input
					style="width: 240px;"
					v-model="queryParams.title"
					placeholder="请输入系统模块"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="操作人员" prop="operName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.operName"
					placeholder="请输入操作人员"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="类型" prop="businessType">
				<el-select
					style="width: 240px;"
					v-model="queryParams.businessType"
					placeholder="操作类型"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="(dict, index) in sys_oper_type"
						:key="index"
						:label="dict.label"
						:value="dict.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select
					style="width: 240px;"
					v-model="queryParams.status"
					placeholder="操作状态"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="(dict, index) in sys_common_status"
						:key="index"
						:label="dict.label"
						:value="dict.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="操作时间" style="font-weight: bold;">
				<el-date-picker
					v-model="dateRange"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					type="datetimerange"
					range-separator="-"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					@change="handleQuery"
				></el-date-picker>
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
					v-hasPermi="['monitor:operlog:remove']"
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
					v-hasPermi="['monitor:operlog:export']"
					>导出</el-button
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
					v-hasPermi="['monitor:operlog:remove']"
					>删除</el-button
				>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"/>
		</el-row>

		<el-table
			stripe
			border
			ref="pageTableRef"
			v-loading="loading"
			:data="list"
			height="560"
			@selection-change="handleSelectionChange"
			:default-sort="defaultSort"
			@sort-change="handleSortChange"
		>
			<!-- prettier-ignore -->
			<el-table-column type="selection" width="55" align="center" />
			<!-- prettier-ignore -->
			<el-table-column label="日志编号" align="center" prop="id" width="150"/>
			<!-- prettier-ignore -->
			<el-table-column label="系统模块" align="center" prop="title" />
			<el-table-column
				label="操作类型"
				align="center"
				width="200"
				prop="businessType"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
					<dict-tag :options="sys_oper_type" :value="scope.row.businessType" />
				</template>
			</el-table-column>
			<el-table-column
				label="请求方式"
				align="center"
				prop="requestMethod"
			/>
			<el-table-column
				label="操作人员"
				align="center"
				prop="operName"
				width="200"
				:show-overflow-tooltip="true"
				sortable="custom"
				:sort-orders="['descending', 'ascending']"
			/>
			<el-table-column
				label="操作地址"
				align="center"
				prop="operIp"
				width="200"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="操作地点"
				align="center"
				prop="operLocation"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="操作状态"
				align="center"
				prop="status"
				width="150"
			>
				<template #default="scope">
					<!-- <el-tag :type="scope.row.status === 0 ? 'success' :'warning'">{{scope.row.status === 0 ? "正常": "异常" }}</el-tag> -->
					<!-- prettier-ignore -->
					<dict-tag :options="sys_common_status" :value="scope.row.status" />
					<!-- <DataSingleTag
						:single-data="scope.row.status.toString()"
						:status-options="sys_common_status"
					/> -->
				</template>
			</el-table-column>
			<el-table-column
				label="操作时间"
				align="center"
				prop="operTime"
				sortable="custom"
				:sort-orders="['descending', 'ascending']"
				width="240"
			>
				<template #default="scope">
					<span>{{ scope.row.operTime }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding fixed-width"
				width="200"
			>
				<template #default="scope">
					<el-link
						type="primary"
						class="table_link_btn"
						:underline="false"
						icon="view"
						@click="handleView(scope.row)"
						v-hasPermi="['monitor:operlog:query']"
						title="点击查看详情"
					>
						<!-- prettier-ignore -->
						<span class="table_link_text">详细</span>
					</el-link>
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
			@pagination="getList()"
		/>

		<!-- 操作日志详细 -->
		<el-dialog
			title="操作日志详细"
			v-model="open"
			width="40%"
			append-to-body
			@close="cleanSelect()"
		>
			<el-form ref="formRef" :model="form" label-width="100px">
				<el-row>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="操作模块：" :show-overflow-tooltip="true">
                            {{ form.title }} / {{ typeFormat(form) }}
                        </el-form-item>
						<!-- prettier-ignore -->
						<el-form-item label="登录信息：" :show-overflow-tooltip="true">
                            <!-- prettier-ignore -->
                            {{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
                        </el-form-item>
					</el-col>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
						<!-- prettier-ignore -->
						<el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<!-- prettier-ignore -->
						<el-form-item label="操作方法：">{{ form.method }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<!-- prettier-ignore -->
						<el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<!-- prettier-ignore -->
						<el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作状态：">
							<!-- <div v-if="form.status === 0">正常</div>
							<div v-else-if="form.status === 1"  style="background: red;">失败</div> -->
							<!-- prettier-ignore -->
							<el-tag class="ml-2" :type="form.status === 0 ? 'success' : 'danger'">
                                {{ form.status === 0 ? '正常':'失败' }}
                            </el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<!-- prettier-ignore -->
						<el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<!-- prettier-ignore -->
						<el-form-item label="异常信息：" v-if="form.status === 1">
							<span style="color: #FFA500;font-size: 16px;">{{ form.errorMsg }}</span>
                        </el-form-item>
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

<script lang="ts" name="OperaLog" setup>
import OperaLog from "@/api/request/monitor/log/operaLog";
// prettier-ignore
const {
    loading, exportLoading, multiple, showSearch, total, list, open, dateRange, defaultSort, form, queryParams, sys_common_status, sys_oper_type, 
    formRef, queryForm, getList, typeFormat, handleQuery, resetQuery, handleSelectionChange, handleSortChange, handleView, handleDelete, handleClean, 
    handleExport, pageTableRef, cleanSelect, 
} = OperaLog();
</script>
