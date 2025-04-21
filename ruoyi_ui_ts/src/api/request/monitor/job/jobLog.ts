import { cleanJobLog, delJobLog, listJobLog } from "@/api/system/jobLog";
import { ElForm, ElTable } from "element-plus";

export interface LogFormData {
	pageNum: number;
	pageSize: number;
	/**
	 * 日志序号
	 */
	jobLogId?: string;
	/**
	 * 任务名称
	 */
	jobName?: string;
	/**
	 * 任务分组
	 */
	jobGroup?: string;
	/**
	 * 调用方法
	 */
	invokeTarget?: string;
	/**
	 * 日志信息
	 */
	jobMessage?: string;
	/**
	 * 执行状态
	 */
	status?: string;
	/**
	 * 异常信息
	 */
	exceptionInfo?: string;
	createTime?: string;
}

export interface LogListData {
	jobLogId: string;
	jobName: string;
	jobGroup: string;
	invokeTarget: string;
	jobMessage: string;
	status: string;
	createTime: string;
}

export default () => {
	const router = useRouter();
	const proxy = useSafeInstance();
	// prettier-ignore
	const { sys_job_group, sys_job_status } = proxy.useDict("sys_job_group","sys_job_status");
	// 遮罩层
	const loading = ref<boolean>(true);
	// 导出遮罩层
	const exportLoading = ref<boolean>(false);
	// 选中数组
	let ids: any = [];
	// 非多个禁用
	const multiple = ref<boolean>(false);
	// 显示搜索条件
	const showSearch = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 调度日志表格数据
	const jobLogList = ref<LogListData[]>([]);
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 日期范围
	const dateRange = ref<any>();
	// 是否显示弹出层
	// 表单参数
	const formData = ref<LogFormData>({
		pageNum: 1,
		pageSize: 10,
	});
	// 查询参数
	const queryParams = ref<LogFormData>({
		pageNum: 1,
		pageSize: 10,
		jobName: undefined,
		jobGroup: undefined,
		status: undefined,
	});
	const pageTableRef = useComponentRef(ElTable)
	const queryFormRef = useComponentRef(ElForm)
	const getList = () => {
		loading.value = true;
		// prettier-ignore
		listJobLog(proxy.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
            if (response.code === 200) {
				const data = response.data;
				jobLogList.value = data.content;
				total.value = parseInt(data.records);
				loading.value = false;
		    }
        });
	};
	// 返回按钮
	const handleClose = () => {
		router.push({ path: "/monitor/job" });
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	const cleanSelect = () => {
		proxy.cleanTableSelection(pageTableRef);
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		dateRange.value = [];
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids = selection.map((item: { jobLogId: any }) => item.jobLogId);
		multiple.value = !selection.length;
	};
	/** 详细按钮操作 */
	const handleView = (row: any) => {
		open.value = true;
		formData.value = row;
		proxy.setTableRowSelected(pageTableRef, row, true);
	};
	/** 删除按钮操作 */
	const handleDeleteOne = (row: any) => {
		proxy.setTableRowSelected(pageTableRef, row, true);
		ids.push(row.jobId);
		const jobLogIds = ids;
		// 遮罩层
		proxy.$modal
			.confirm(
				'是否确认删除调度日志编号为"【' + row.jobId + '】"的数据项？'
			)
			.then(() => {
				return delJobLog(jobLogIds);
			})
			.then((response: any) => {
				if (response.code === 200) {
					getList();
					proxy.$modal.msgSuccess("删除成功");
				}
			})
			.catch(() => {
				cleanSelect();
				console.log("取消了删除");
			});
	};
	const handleDelete = () => {
		// prettier-ignore
		proxy.$modal.confirm('是否确认删除调度日志编号为"' + ids + '"的数据项？')
			.then(() => {
				return delJobLog(ids);
			})
			.then((response: any) => {
				if (response.code === 200) {
					getList();
					proxy.$modal.msgSuccess("删除成功");
				}
			})
			.catch(() => {
                cleanSelect();
				console.log("取消了删除");
			});
	};
	/** 清空按钮操作 */
	const handleClean = () => {
		// prettier-ignore
		proxy.$modal.confirm("是否确认清空所有调度日志数据项?", "警告")
        .then(() => {
            return cleanJobLog();
        })
        .then((response: any) => {
            if (response.code === 200) {
                getList();
                proxy.$modal.msgSuccess("清空成功");
            }
        })
        .catch(() => {
            console.log("清空日志操作取消");
        });
	};
	/** 导出按钮操作 */
	const handleExport = () => {
		// prettier-ignore
		proxy.download('/monitor/jobLog/exportByStream', {...queryParams}, `调度日志导出${new Date().getTime()}.xlsx`);
	};

	// const jobId = proxy.$route.query.jobId;
	// if (jobId !== undefined && jobId != 0) {
	// 	getJob(jobId).then((response: any) => {
	// 		queryParams.value.jobName = response.data.jobName;
	// 		queryParams.value.jobGroup = response.data.jobGroup;
	// 		getList();
	// 	});
	// } else {}
	getList();

	// prettier-ignore
	return {
        loading, exportLoading, multiple, showSearch, total, jobLogList, open, dateRange, formData, queryParams, sys_job_group, sys_job_status, 
        pageTableRef, queryFormRef, getList, handleClose, handleQuery, resetQuery, handleSelectionChange, handleView, handleDelete, handleDeleteOne, handleClean, 
        handleExport, cleanSelect, 
    }
};
