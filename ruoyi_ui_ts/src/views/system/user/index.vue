<template>
	<div class="app-container">
		<el-row :gutter="20">
			<splitpanes :horizontal="useAppStore().$state.device === 'mobile'" class="default-theme">
				<pane size="12">
					<!--部门数据-->
					<el-col>
						<div>
							<el-input
								v-model="deptName"
								placeholder="请输入部门名称"
								clearable
								prefix-icon="search"
								style="margin-bottom: 10px;"
							/>
						</div>
						<div class="head-container">
							<el-tree
								ref="deptTreeRef"
								:data="deptOptions"
								:props="defaultProps"
								:expand-on-click-node="false"
								:filter-node-method="filterNode"
								default-expand-all
								@node-click="handleNodeClick"
							/>
						</div>
					</el-col>
				</pane>	
				<pane size="88">
					<!--用户数据-->
					<el-col>
						<transition name="fade">
							<el-form
								:model="queryParams"
								ref="queryFormRef"
								:inline="true"
								v-show="showSearch"
								label-width="70px"
							>
								<el-form-item label="用户名称" prop="username" for="username1">
									<el-input
										style="width: 200px;"
										v-model="queryParams.username"
										placeholder="请输入用户名称"
										clearable
										@clear="handleQuery"
										@keyup.enter.native="handleQuery"
										id="username1"
									/>
								</el-form-item>
								<el-form-item label="用户昵称" prop="nickname">
									<el-input
										style="width: 200px;"
										v-model="queryParams.nickname"
										placeholder="请输入用户昵称"
										clearable
										@clear="handleQuery"
										@keyup.enter.native="handleQuery"
									/>
								</el-form-item>
								<el-form-item label="手机号码" prop="phoneNo">
									<el-input
										style="width: 150px;"
										v-model="queryParams.phoneNo"
										placeholder="请输入手机号码"
										clearable		
										@clear="handleQuery"
										@keyup.enter.native="handleQuery"
									/>
								</el-form-item>
								<el-form-item label="性别" prop="sex" for="sex">
									<el-select
										id="sex"
										style="width: 120px;"
										v-model="queryParams.sex"
										placeholder="请选择性别"	
										clearable
										@change="handleQuery"
									>
										<el-option
											v-for="(dict, index) in sys_user_sex"
											:key="dict.value"
											:label="dict.label"
											:value="dict.value"
										></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="状态" prop="userStatus">
									<el-select
										style="width: 120px;"
										v-model="queryParams.userStatus"
										placeholder="请选择状态"
										clearable
										@change="handleQuery"
										id="userStatus"
									>
										<el-option
											v-for="dict in sys_normal_disable"
											:key="dict.value"
											:label="dict.label"
											:value="dict.value"
										/>
									</el-select>
								</el-form-item>
								<el-form-item
									label="创建时间"
									style="font-weight: bold;"
								>
									<el-date-picker
										v-model="dateRange"
										format="YYYY-MM-DD"
										value-format="YYYY-MM-DD"
										type="daterange"
										range-separator="-"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
									></el-date-picker>
								</el-form-item>
								<form-search
									@reset="resetQuery"
									@search="handleQuery"
								/>
							</el-form>
						</transition>

						<el-row :gutter="10" class="mb8">
							<el-col :span="1.5">
								<el-button
									type="primary"
									plain
									icon="plus"
									size="small"
									@click="handleAdd"
									v-hasPermi="['system:user:add']"
									>新增</el-button
								>
							</el-col>
							<el-col :span="1.5">
								<el-button
									type="info"
									plain
									icon="upload"
									size="small"
									@click="handleImport"
									v-hasPermi="['system:user:import']"
									>导入</el-button
								>
							</el-col>
							<el-col :span="1.5">
								<el-button
									type="warning"
									plain
									icon="download"
									size="small"
									@click="handleExport"
									v-hasPermi="['system:user:export']"
									>导出</el-button
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
									v-hasPermi="['system:user:edit']"
									>修改</el-button
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
									v-hasPermi="['system:user:remove']"
									>删除</el-button
								>
							</el-col>
							<!-- prettier-ignore -->
							<right-toolbar v-model:showSearch="showSearch" @queryTable="getPageList" />
						</el-row>

						<el-table
							stripe
							border
							v-loading="loading"
							ref="pageTableRef"
							:data="userList"
							@selection-change="handleSelectionChange"
						>
							<el-table-column
								type="selection"
								width="50"
								align="center"
								:selectable="checkSelected"
							/>
							<el-table-column
								label="编号"
								width="120"
								align="center"
								key="id"
								prop="id"
								v-if="columns[0].visible"
							/>
							<el-table-column
								label="名称"
								width="150"
								align="center"
								key="username"
								prop="username"
								v-if="columns[1].visible"
								:show-overflow-tooltip="true"
							/>
							<el-table-column
								label="性别"
								width="100"
								align="center"
								key="sex"
								prop="sex"
								v-if="columns[2].visible"
							>
								<template #default="scope">
									<span v-if="scope.row.sex === '0'">男</span>
									<span v-else-if="scope.row.sex === '1'">女</span>
									<!-- prettier-ignore -->
									<span v-else style="color: #f2b53a;font-weight: bolder;">未知</span>
								</template>
							</el-table-column>
							<el-table-column
								label="昵称"
								width="150"
								align="center"
								key="nickname"
								prop="nickname"
								v-if="columns[2].visible"
								:show-overflow-tooltip="true"
							/>
							<el-table-column
								label="部门"
								align="center"
								key="deptName"
								prop="deptName"
								v-if="columns[3].visible"
								:show-overflow-tooltip="true"
							/>
							<el-table-column
								label="岗位"
								align="center"
								prop="postNameArray"
								:show-overflow-tooltip="true"
							>
								<template #default="scope">
									<!-- prettier-ignore -->
									<data-tag v-model:roles-array="scope.row.postNameArray"/>
								</template>
							</el-table-column>
							<el-table-column
								label="角色"
								align="center"
								prop="roleNameArray"
							>
								<template #default="scope">
									<!-- prettier-ignore -->
									<data-tag v-model:roles-array="scope.row.roleNameArray"/>
								</template>
							</el-table-column>
							<el-table-column
								label="手机号码"
								width="120"
								align="center"
								key="phoneNo"
								prop="phoneNo"
								v-if="columns[4].visible"
							/>
							<el-table-column
								label="邮箱"
								width="200"
								align="center"
								key="email"
								prop="email"
							/>
							<el-table-column
								label="状态"
								width="100"
								align="center"
								key="userStatus"
								v-if="columns[5].visible"
							>
								<template #default="scope">
									<!-- prettier-ignore -->
									<status-switch
										:disabled="scope.row.id === '1'"
										:status-data.sync="scope.row.userStatus"
										:activeColor.sync="'#00CD00'.toString()"
										:inactiveColor.sync="'#CDBA96'.toString()"
										@handleChange="handleStatusChange($event, scope.row)"
									/>
									<!-- <el-switch
										v-model="scope.row.status"
										class="mb-2"
										:active-value="0"
										:inactive-value="1"
										style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
										@change="handleStatusChange($event, scope.row)"
									/> -->
									<!-- <el-select
										v-model="scope.row.status"
										@change="handleStatusChange($event, scope.row)"
									>
										<el-option label="启用" value="0"></el-option>
										<el-option label="停用" value="1"></el-option>
									</el-select> -->
								</template>
							</el-table-column>
							<el-table-column
								label="创建时间"
								align="center"
								fixed="right"
								prop="createTime"
								v-if="columns[6].visible"
								width="160"
							>
								<template #default="scope">
									<span>{{ parseTime(scope.row.createTime) }}</span>
								</template>
							</el-table-column>
							<el-table-column
								label="操作"
								width="200"
								align="center"
								fixed="right"
								class-name="small-padding fixed-width"
							>
								<template #default="scope">
									<div v-if="scope.row.id === '1'">无法操作</div>
									<div v-else>
										<!-- prettier-ignore -->
										<el-link
											class="table_link_btn"
											:underline="false"
											size="small"
											type="primary"
											icon="Edit"
											:disabled="scope.row.admin"
											@click="handleUpdate(scope.row)"
											v-hasPermi="['system:user:edit']"
										>
											<span class="table_link_text">修改</span>
										</el-link>
										<!-- prettier-ignore -->
										<el-link
											class="table_link_btn"
											:underline="false"
											size="small"
											type="primary"
											icon="Refresh"
											@click="handleResetPwd(scope.row)"
											v-hasPermi="['system:user:resetPwd']"
										>
											<span class="table_link_text">重置</span>
										</el-link>
										<!-- prettier-ignore -->
										<el-link
											class="table_link_btn"
											:underline="false"
											:disabled="scope.row.id === '1'"
											size="small"
											type="danger"
											icon="Delete"
											@click="handleDelete(scope.row)"
											v-hasPermi="['system:user:remove']"
										>
											<!-- prettier-ignore -->
											<span class="table_link_text">删除</span>
										</el-link>
									</div>
								</template>
							</el-table-column>
						</el-table>

						<pagination
							v-show="total > 0"
							:total="total"
							v-model:page="queryParams.pageNum"
							v-model:limit="queryParams.pageSize"
							@pagination="getPageList"
						/>
					</el-col>
				</pane>
			</splitpanes>
		</el-row>
			
		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="40%" append-to-body destroy-on-close @close="cleanSelect">
			<!-- prettier-ignore -->
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px"  status-icon>
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户昵称" prop="nickname" for="nickname">
							<el-input
								v-model="form!.nickname"
								placeholder="请输入用户昵称"
								id="nickname"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="归属部门" prop="deptId" for="deptId">
							<el-tree-select
								id="deptId"
                                check-strictly
								v-model="form!.deptId"
								:data="deptOptions"
                                :props="defaultProps"
                                value-key="id"
                                style="width: 100%;"
								placeholder="请选择归属部门"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手机号码" prop="phoneNo" for="phoneNo">
							<el-input
								v-model="form!.phoneNo"
								placeholder="请输入手机号码"
								maxlength="11"
								id="phoneNo"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户邮箱" prop="email" for="email">
							<el-input
								v-model="form!.email"
								placeholder="请输入邮箱"
								maxlength="50"
								id="email"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item
							v-if="form!.id == undefined"
							label="用户名称"
							prop="username"
							for="username"
						>
							<el-input
								v-model="form!.username"
								placeholder="请输入用户名称"
								id="username"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							v-if="form!.id == undefined"
							label="用户密码"
							prop="password"
							for="password"
						>
							<el-input
								v-model="form!.password"
								placeholder="请输入用户密码"
								type="password"
                                show-password
								id="password"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户性别">
							<el-select v-model="form!.sex" placeholder="请选择性别" style="width: 100%;">
								<el-option
									v-for="dict in sys_user_sex"
									:key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户状态" for="userStatus">
							<el-radio-group v-model="form!.userStatus" style="width: 100%;" @change="statusChange" id="userStatus">
								<el-radio
                                    v-for="dict in sys_normal_disable"
                                    :key="dict.label"
                                    :value="dict.value"
                                    >{{ dict.label }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户岗位" for="postIds">
							<el-select
								id="postIds"
								v-model="form!.postIds"
								multiple
								placeholder="请选择岗位"
                                style="width: 100%;"
							>
								<el-option
									v-for="item in postOptions"
									:key="parseInt(item.id)"
									:label="item.postName"
									:value="parseInt(item.id)"
									:disabled="item.postStatus == '1'"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属角色" for="roleIds">
							<el-select
								id="roleIds"
								v-model="form!.roleIds"
								multiple
								placeholder="请选择角色"
                                style="width: 100%;"
							>
								<el-option
									v-for="item in roleOptions"
									:key="parseInt(item.id)"
									:label="item.roleName"
									:value="parseInt(item.id)"
									:disabled="item.userStatus == '1'"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注信息" for="remarks">
							<el-input
								v-model="form!.remarks"
                                :autosize="{ minRows: 4, maxRows: 8 }"
								type="textarea"
								placeholder="请输入内容"
								id="remarks"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm(formRef)"
						>确 定</el-button
					>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 用户导入对话框 -->
		<el-dialog
			:title="upload.title"
			v-model="upload.open"
			width="400px"
			append-to-body
            @close="cleanUploadRef()"
		>
			<!-- prettier-ignore -->
			<el-upload
				ref="uploadRef"
				:limit="1"
				accept=".xlsx, .xls"
				:headers="upload.headers"
				:action="upload.url + '?updateSupport=' + upload.updateSupport"
				:disabled="upload.isUploading"
				:on-progress="handleFileUploadProgress"
				:on-success="handleFileSuccess"
				:auto-upload="false"
				drag
			>
				<i class="upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip">
                    <!-- prettier-ignore -->
					<el-checkbox v-model="upload.updateSupport"/>是否更新已经存在的用户数据
					<el-link
						type="info"
						style="font-size:12px"
						@click="importTemplate"
						>下载模板</el-link
					>
				</div>
                <!-- prettier-ignore -->
				<div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
			</el-upload>
			<template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button type="primary" @click="submitFileForm">确 定</el-button>
                    <!-- prettier-ignore -->
				    <el-button @click="upload.open = false">取 消</el-button>
                </div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="User" setup>
import User from "@/api/request/system/user";
import useAppStore from "@/store/modules/app";
import { Splitpanes, Pane } from "Splitpanes";
import "splitpanes/dist/splitpanes.css";

// prettier-ignore
const {
        loading, queryFormRef, formRef, sys_normal_disable, deptTreeRef, single, multiple, showSearch, total, userList, title, deptOptions, open, 
        deptName, dateRange, sys_user_sex, postOptions, roleOptions, form, defaultProps, upload, queryParams, columns, rules, pageTableRef, uploadRef,
        getPageList, filterNode, handleNodeClick, handleStatusChange, cancel, handleQuery, resetQuery, handleSelectionChange, statusChange,
        handleAdd, handleUpdate, handleResetPwd, submitForm, handleDelete, handleExport, handleImport, importTemplate, handleFileUploadProgress, 
        handleFileSuccess, submitFileForm, checkSelected, cleanSelect, cleanUploadRef
    } = User();
</script>
<style>
.splitpanes.default-theme .splitpanes__pane {
    background-color: #ffffff;
}
.post-tag {
	float: left;
	margin: 5px 0 0 5px;
}
</style>
