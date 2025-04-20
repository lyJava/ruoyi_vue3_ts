<template>
	<div class="top-right-btn">
		<el-row>
			<el-tooltip
				class="item"
				effect="dark"
				:content="showSearch ? '隐藏搜索' : '显示搜索'"
				placement="top"
			>
				<el-button
					size="small"
					circle
					icon="search"
					@click="toggleSearch()"
				/>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="刷新"
				placement="top"
			>
				<el-button
					size="small"
					circle
					icon="refresh"
					@click="refresh()"
				/>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="显隐列"
				placement="top"
				v-if="columns"
			>
				<el-button
					size="small"
					circle
					icon="menu"
					@click="showColumn()"
				/>
			</el-tooltip>
		</el-row>
		<el-dialog :title="title" v-model="open" append-to-body>
			<el-transfer
				:titles="['显示', '隐藏']"
				v-model="value"
				:data="columns"
				@change="dataChange"
			></el-transfer>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
const value = ref([]);
// 弹出层标题
const title = ref("显示/隐藏");
// 是否显示弹出层
const open = ref(false);

interface ColumnItem {
	key: string;
	visible: boolean;
	label?: string;
	prop?: string;
}

const props = defineProps({
	showSearch: {
		type: Boolean,
		default: true,
	},
	columns: {
		type: Array as PropType<ColumnItem[]>,
		default: () => [],
	},
});

const emit = defineEmits<{
    (e: "update:showSearch", value: boolean): void;
    (e: "queryTable"): void;
}>();
// 搜索
const toggleSearch = () => {
	emit("update:showSearch", !props.showSearch);
};
// 刷新
const refresh = () => {
	emit("queryTable");
};

const isColumnItem = (item: any): item is ColumnItem => {
  return typeof item === 'object' && 'key' in item && 'visible' in item;
};

// 右侧列表元素变化
const dataChange = (data: any) => {
	props.columns.forEach ((item) =>{
		if (isColumnItem(item)) {
		    item.visible = !data.includes(item.key);
        }
	});
};
// 打开显隐列dialog
const showColumn = () => {
	open.value = true;
};
</script>
<style lang="scss" scoped>
:v-deep .el-transfer__button {
	border-radius: 50%;
	padding: 12px;
	display: block;
	margin-left: 0px;
}
:v-deep .el-transfer__button:first-child {
	margin-bottom: 10px;
}
</style>
