import { ElForm, ElTable } from "element-plus";
import { getCurrentInstance, onMounted, ref } from "vue";
// prettier-ignore
import { addJob, changeJobStatus, delJob, getJob, listJob, runJob, updateJob, } from "@/api/system/job";
// coron 验证
import { isValidCron } from "cron-validator";

export default () => {
	const { proxy } = getCurrentInstance() as any;
	// 遮罩层
	const loading = ref<boolean>(true);
	// 选中数组
	const ids = ref<any>();
	// 非单个禁用
	const single = ref<boolean>(true);
	// 非多个禁用
	const multiple = ref<boolean>(true);
	// 显示搜索条件
	const showSearch = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 定时任务表格数据
	const jobList = ref<any>();
	// 弹出层标题
	const title = ref<string>("");
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 是否显示详细弹出层
	const openView = ref<boolean>(false);
	// 任务组名字典
	const jobGroupOptions = ref<any>();
	// 状态字典
	const statusOptions = ref<any>();
	// 查询参数
	const queryParams = ref<any>({
		pageNum: 1,
		pageSize: 10,
		jobName: undefined,
		jobGroup: undefined,
		status: undefined,
	});
	const queryFormRef = ref<InstanceType<typeof ElForm>>();
	const formRef = ref<InstanceType<typeof ElForm>>();
	const pageTableRef = ref<InstanceType<typeof ElTable>>();
	// 表单参数
	const formData = ref<any>();
	// prettier-ignore
	const checkCoreExpression = (rule: any, value: any, callback: any) => {
        if (!value) {
            return callback(new Error('cron表达式不能为空！'))
        }
        setTimeout(() => {
            // 验证cron表达式
            if (!isValidCron(value, {
                alias: true,
                seconds: true,
                allowBlankDay: true,
                allowSevenAsSunday: true,
            } )) {
                callback(new Error('cron表达式不正确！'))
            } else {
                callback();
            }
        }, 150);
      }
	// 表单校验
	const rules = ref({
		jobName: [
			{
				required: true,
				message: "任务名称不能为空",
				trigger: ["blur", "change"],
			},
		],
		jobGroup: [
			{
				required: true,
				message: "请选择分组",
				trigger: "change",
			},
		],
		invokeTarget: [
			{
				required: true,
				message: "调用目标字符串不能为空",
				trigger: ["blur", "change"],
			},
		],
		cronExpression: [
			{
                required: true,
				validator: checkCoreExpression,
				trigger: ["blur", "change"],
			},
			/* {
				required: true,
				message: "cron执行表达式不能为空",
				trigger: "blur",
			}, */
		],
	});

	const getList = async () => {
		loading.value = true;
		await listJob(queryParams.value).then((response: any) => {
			jobList.value = response.rows;
			total.value = parseInt(response.total);
			loading.value = false;
		});
	};
	// 任务组名字典翻译
	const jobGroupFormat = (row: any) => {
		return proxy.selectDictLabel(jobGroupOptions.value, row.jobGroup);
	};
	// 状态字典翻译
	const statusFormat = (row: any) => {
		return proxy.selectDictLabel(statusOptions.value, row.status);
	};

	const cleanSelect = () => {
		proxy.cleanTableSelection(pageTableRef);
		proxy.resetForm(formRef);
	};

	// 取消按钮
	const cancel = () => {
		open.value = false;
		reset();
		cleanSelect();
	};
	// 表单重置
	const reset = () => {
		formData.value = {
			jobId: undefined,
			jobName: undefined,
			jobGroup: undefined,
			invokeTarget: undefined,
			cronExpression: undefined,
			misfirePolicy: 1,
			concurrent: 1,
			status: "0",
		};
		proxy.resetForm(formRef);
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: { jobId: any }) => item.jobId);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/* 立即执行一次 */
	const handleRun = (row: any) => {
		proxy.setTableRowSelected(pageTableRef, row, true);
		// prettier-ignore
		proxy.$modal.confirm('确认要立即执行一次"' + row.jobName + '"任务吗？')
			.then(() => {
				return runJob(row.jobId, row.jobGroup);
			})
			.then((response: any) => {
				if (response.code === 200) {
                    proxy.$modal.msgSuccess("执行成功");
                    proxy.setTableRowSelected(pageTableRef, row, false);
                }
			})
			.catch(() => {
                proxy.setTableRowSelected(pageTableRef, row, false);
				console.log("确定执行操作取消");
			});
	};
	/** 任务详细信息 */
	const handleView = (row: any) => {
		getJob(row.jobId).then((response) => {
			formData.value = response.data;
			proxy.setTableRowSelected(pageTableRef, row, true);
			openView.value = true;
		});
	};
	/** 任务日志列表查询 */
	const handleJobLog = (row: any) => {
		//this.$router.push("/job/log");
		const jobId = row.jobId || 0;
		proxy.$router.push({
			path: "/monitor/job-log/index",
			query: { jobId: jobId },
		});
	};
	// 更多操作触发
	const handleCommand = (command: string, row: any) => {
		switch (command) {
			case "handleRun":
				handleRun(row);
				break;
			case "handleView":
				handleView(row);
				break;
			case "handleJobLog":
				handleJobLog(row);
				break;
			default:
				break;
		}
	};
	// 任务状态修改
	const handleStatusChange = (row: {
		status: string;
		jobName: string;
		jobId: string;
	}) => {
		let text = row.status === "0" ? "启动" : "停止";
		proxy.setTableRowSelected(pageTableRef, row, true);
		// prettier-ignore
		proxy.$modal.confirm('确认要' + text + '【' + row.jobName + '】任务吗？')
			.then(function () {
				return changeJobStatus(row.jobId, row.status);
			})
			.then((response:  any) => {
				if (response.code === 200) {
                    proxy.$modal.msgSuccess(text + "成功");
                }
			})
			.catch(() => {
				row.status = row.status === "0" ? "1" : "0";
                proxy.setTableRowSelected(pageTableRef, row, false);
			});
	};

	/** 新增按钮操作 */
	const handleAdd = () => {
		reset();
		open.value = true;
		title.value = "添加任务";
	};
	/** 修改按钮操作 */
	const handleUpdate = (row: any) => {
		reset();
		const jobId = row.jobId || ids.value;
		getJob(jobId).then((response) => {
			formData.value = response.data;
			title.value = "修改任务";
			// 设置当前行被选中
			proxy.setTableRowSelected(pageTableRef, row, true);
			open.value = true;
		});
	};
	/** 提交按钮 */
	const submitForm = () => {
		formRef.value?.validate((valid: boolean) => {
			if (valid) {
				if (formData.value.jobId !== undefined) {
					updateJob(formData.value)
						.then((response: any) => {
							if (response.code === 200) {
								proxy.$modal.msgSuccess("修改成功");
							}
						})
						.finally(() => {
							open.value = false;
							getList();
						});
				} else {
					addJob(formData.value)
						.then((response: any) => {
							if (response.code === 200) {
								proxy.$modal.msgSuccess("新增成功");
							}
						})
						.finally(() => {
							open.value = false;
							getList();
						});
				}
			}
		});
	};
	/** 删除按钮操作 */
	const handleDelete = (row: any) => {
		const jobIds = row.jobId || ids.value;
		if (row) {
			// 设置当前行被选中
			proxy.setTableRowSelected(pageTableRef, row, true);
		}
		// prettier-ignore
		proxy.$modal.confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项？')
			.then(() => {
				return delJob(jobIds);
			})
			.then((response: { code: number }) => {
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
	/** 导出按钮操作 */
	const handleExport = () => {
		// prettier-ignore
		proxy.download('/monitor/job/exportByStream', {...queryParams}, `定时任务${new Date().getTime()}.xlsx`);
	};

	onMounted(() => {
		getList();
		proxy.getDicts("sys_job_group").then((response: any) => {
			jobGroupOptions.value = response.data;
		});
		proxy.getDicts("sys_job_status").then((response: any) => {
			statusOptions.value = response.data;
		});
	});

	// prettier-ignore
	return {
        loading, single, multiple, showSearch, total, jobList, title, open, openView, jobGroupOptions, statusOptions, formRef, formData, rules, 
        getList, jobGroupFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleCommand, handleStatusChange, cleanSelect,   
        handleJobLog, handleAdd, handleUpdate, submitForm, handleDelete, handleExport, queryParams, queryFormRef, pageTableRef, 
    }
};
