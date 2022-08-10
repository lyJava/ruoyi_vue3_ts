<template>
	<el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
		<el-row>
			<el-col :span="10">
				<el-form-item prop="tplCategory">
					<template #label>生成模板</template>
					<el-select
						v-model="info.tplCategory"
						@change="tplSelectChange"
						style="width: 80%"
						filterable
					>
						<el-option label="单表（增删改查）" value="crud" />
						<el-option label="树表（增删改查）" value="tree" />
						<el-option label="主子表（增删改查）" value="sub" />
					</el-select>
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item prop="packageName">
					<template #label>
						生成包路径
						<el-tooltip
							content="生成在哪个java包下，例如 com.ruoyi.system"
							placement="top"
						>
							<el-icon><question-filled /></el-icon>
						</el-tooltip>
					</template>

					<el-input v-model="info.packageName" style="width: 80%" />
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item prop="moduleName">
					<template #label>
						生成模块名
						<el-tooltip
							content="可理解为子系统名，例如 system"
							placement="top"
						>
							<el-icon><question-filled /></el-icon>
						</el-tooltip>
					</template>
					<el-input v-model="info.moduleName" style="width: 80%" />
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item prop="businessName">
					<template #label>
						生成业务名
						<el-tooltip
							content="可理解为功能英文名，例如 user"
							placement="top"
						>
							<el-icon><question-filled /></el-icon>
						</el-tooltip>
					</template>

					<el-input v-model="info.businessName" style="width: 80%" />
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item prop="functionName">
					<template #label>
						生成功能名
						<el-tooltip
							content="用作类描述，例如 用户"
							placement="top"
						>
							<el-icon><question-filled /></el-icon>
						</el-tooltip>
					</template>

					<el-input v-model="info.functionName" style="width: 80%" />
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item>
					<template #label>
						上级菜单
						<!-- prettier-ignore -->
						<el-tooltip content="分配到指定菜单下，例如 系统管理" placement="top">
						    <el-icon><question-filled /></el-icon>
					    </el-tooltip>
					</template>

					<!-- prettier-ignore -->
					<el-tree-select
						append-to-body
						v-model="info.parentMenuId"
						:props="{ value: 'menuId',label: 'menuName', children: 'children', }"
						:data="menus"
						value-key="menuId"
						:normalizer="normalizer"
						:show-count="true"
						placeholder="请选择系统菜单"
						check-strictly
						filterable
						:render-after-expand="false"
						style="width: 80%"
					/>
				</el-form-item>
			</el-col>

			<el-col :span="10">
				<el-form-item prop="genType">
					<template #label>
						生成代码方式
						<!-- prettier-ignore -->
						<el-tooltip content="默认为zip压缩包下载，也可以自定义生成路径" placement="top">
                            <el-icon><question-filled /></el-icon>
                        </el-tooltip>
					</template>
					<!-- prettier-ignore -->
					<el-radio v-model="info.genType" label="0">zip压缩包</el-radio>
					<!-- prettier-ignore -->
					<el-radio v-model="info.genType" label="1">自定义路径</el-radio>
				</el-form-item>
			</el-col>

			<el-col :span="24" v-if="info.genType == '1'">
				<el-form-item prop="genPath">
					<template #label>
						自定义路径
						<el-tooltip
							content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下"
							placement="top"
						>
							<el-icon><question-filled /></el-icon>
						</el-tooltip>
					</template>

					<el-input v-model="info.genPath" style="width: 74.7%">
						<template #append>
							<el-dropdown>
								<el-button type="primary">
									最近路径快速选择
									<i
										class="el-icon-arrow-down el-icon--right"
									></i>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											@click="info.genPath = '/'"
											>恢复默认的生成基础路径</el-dropdown-item
										>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
					</el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<template v-if="info.tplCategory == 'tree'">
			<h4 class="form-header">其他信息</h4>
			<el-row v-show="info.tplCategory == 'tree'">
				<el-col :span="10">
					<el-form-item>
						<template #label>
							树编码字段
							<el-tooltip
								content="树显示的编码字段名， 如：dept_id"
								placement="top"
							>
								<el-icon><question-filled /></el-icon>
							</el-tooltip>
						</template>

						<el-select
							v-model="info.treeCode"
							placeholder="请选择"
							filterable
							style="width: 80%"
						>
							<!-- prettier-ignore -->
							<el-option
                                v-for="(column, index) in info.columns"
                                :key="index"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                            />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="10">
					<el-form-item>
						<template #label>
							树父编码字段
							<el-tooltip
								content="树显示的父编码字段名， 如：parent_Id"
								placement="top"
							>   
                                <!-- prettier-ignore -->
								<el-icon><question-filled/></el-icon>
                            </el-tooltip
						></template>

						<el-select
							v-model="info.treeParentCode"
							placeholder="请选择"
							filterable
							style="width: 80%"
						>
							<!-- prettier-ignore -->
							<el-option
                                v-for="(column, index) in info.columns"
                                :key="index"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                            />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item>
						<template #label>
							树名称字段
							<el-tooltip
								content="树节点的显示名称字段名， 如：dept_name"
								placement="top"
							>
								<el-icon><question-filled /></el-icon>
							</el-tooltip>
						</template>

						<el-select
							v-model="info.treeName"
							placeholder="请选择"
							filterable
							style="width: 80%"
						>
							<!-- prettier-ignore -->
							<el-option
                                v-for="(column, index) in info.columns"
                                :key="index"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                            />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</template>
		<template v-if="info.tplCategory == 'sub'">
			<h4 class="form-header">关联信息</h4>
			<el-row>
				<el-col :span="10">
					<el-form-item>
						<template #label>
							关联子表的表名
							<!-- prettier-ignore -->
							<el-tooltip content="关联子表的表名， 如：sys_user" placement="top">
                                <el-icon><question-filled /></el-icon>
                            </el-tooltip>
						</template>

						<el-select
							v-model="info.subTableName"
							placeholder="请选择"
							@change="subSelectChange"
							style="width: 80%"
							filterable
						>
							<!-- prettier-ignore -->
							<el-option
                                v-for="(table, index) in tables"
                                :key="index"
                                :label="table.tableName + '：' + table.tableComment"
                                :value="table.tableName"
                            />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item>
						<template #label>
							子表关联的外键名
							<!-- prettier-ignore -->
							<el-tooltip content="子表关联的外键名， 如：user_id" placement="top">
                                <el-icon><question-filled /></el-icon>
                            </el-tooltip>
						</template>
						<el-select
							v-model="info.subTableFkName"
							placeholder="请选择"
							style="width: 80%"
							filterable
						>
							<!-- prettier-ignore -->
							<el-option
                                v-for="(column, index) in subColumns"
                                :key="index"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                            />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</template>
	</el-form>
</template>
<script lang="ts" name="GenInfoForm" setup>
import { listMenu } from "@/api/system/menu";
import { ref, getCurrentInstance, watch } from "vue";

const props = defineProps({
	info: {
		type: Object,
		default: null,
	},
	tables: {
		type: Object,
		default: [],
	},
	menus: {
		type: Array,
		default: [],
	},
});

const { proxy } = getCurrentInstance() as any;
const subColumns = ref<any>();
const menuOptions = ref<any>();
const rules = ref({
	tplCategory: [
		{
			required: true,
			message: "请选择生成模板",
			trigger: "blur",
		},
	],
	packageName: [
		{
			required: true,
			message: "请输入生成包路径",
			trigger: "blur",
		},
	],
	moduleName: [
		{
			required: true,
			message: "请输入生成模块名",
			trigger: "blur",
		},
	],
	businessName: [
		{
			required: true,
			message: "请输入生成业务名",
			trigger: "blur",
		},
	],
	functionName: [
		{
			required: true,
			message: "请输入生成功能名",
			trigger: "blur",
		},
	],
});
// prettier-ignore
watch(() => 
    props.info.subTableName, (val) => {
		setSubTableColumns(val);
	}
);

/** 转换菜单数据结构 */
const normalizer = (node: any) => {
	if (node.children && !node.children.length) {
		delete node.children;
	}
	return {
		id: node.menuId,
		label: node.menuName,
		children: node.children,
	};
};
/** 选择子表名触发 */
const subSelectChange = (value: any) => {
	props.info.subTableFkName = "";
};
/** 选择生成模板触发 */
const tplSelectChange = (value: any) => {
	if (value !== "sub") {
		props.info.subTableName = "";
		props.info.subTableFkName = "";
	}
};
/** 设置关联外键 */
const setSubTableColumns = (value: any) => {
	for (const item in props.tables as any) {
		const name = props.tables[item].tableName;
		if (value === name) {
			subColumns.value = props.tables[item].columns;
			break;
		}
	}
};

/** 查询菜单下拉树结构 */
const getMenuTreeselect = () => {
	listMenu().then((response: any) => {
		menuOptions.value = proxy.handleTree(response.data, "menuId");
	});
};

//getMenuTreeselect();
</script>
