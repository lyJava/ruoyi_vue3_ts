import { getGenTable, updateGenTable } from "@/api/tool/gen";
// prettier-ignore
import { optionSelect as getDictOptionselect } from "@/api/system/dict/type";
import { listMenu as getMenuTreeselect } from "@/api/system/menu";

export default () => {
	// 选中选项卡的 name
	const activeName = "cloum";
	// 表格的高度
	const tableHeight = document.documentElement.scrollHeight - 245 + "px";
	// 表信息
	const tables = ref<any>([]);
	// 表列信息
	const cloumns = ref<any>([]);
	// 字典信息
	const dictOptions = ref<any>([]);
	// 菜单信息
	const menus = ref<any>([]);
	// 表详细信息
	const info = ref<any>({});

	const proxy = useSafeInstance();

    const isRouter = ref<boolean>(false);

	/** 提交按钮 */
	const submitForm = () => {
		const basicForm = proxy.$refs.basicInfo.$refs.basicInfoForm;
		const genForm = proxy.$refs.genInfo.$refs.genInfoForm;
		Promise.all([basicForm, genForm].map(getFormPromise)).then(
			(res: any) => {
				const validateResult = res.every((item: any) => !!item);
				if (validateResult) {
					const genTable = Object.assign({}, info.value);
					genTable.columns = cloumns.value;
					genTable.params = {
						treeCode: genTable.treeCode,
						treeName: genTable.treeName,
						treeParentCode: genTable.treeParentCode,
						parentMenuId: genTable.parentMenuId,
					};
					updateGenTable(genTable).then((res: any) => {
						proxy.$modal.msgSuccess(res.msg);
						if (res.code === 200) {
							close();
						}
						proxy.$attrs.onOk();
					});
				} else {
					// prettier-ignore
					proxy.$modal.msgError("表单校验未通过，请重新检查提交内容");
				}
			}
		);
	};
	const getFormPromise = (form: any) => {
		return new Promise((resolve) => {
			form.validate((res: any) => {
				resolve(res);
			});
		});
	};
	/** 关闭按钮 */
	const close = () => {
		//this.$store.dispatch("tagsView/delView", this.$route);
		// useTagsViewStore().delView(this.$route);
		proxy.$router.push({ path: "/tool/gen"} );
	};


    const initTabsData = async (tableId: string) => {
        console.log("传过来的表ID", tableId);
        if (!tableId) {
            console.log("参数异常");
            return;
        }
        // 获取表详细信息
        await getGenTable(tableId).then((response: any) => {
            if (response.code === 200) {
                const data = response.data;
                cloumns.value = data.rows;
                info.value = data.info;
                tables.value = data.tables;
            }
        });
        /** 查询字典下拉列表 */
        await getDictOptionselect().then((response: any) => {
            if (response.code === 200) {
                dictOptions.value = response.data;
            }
        });
        /** 查询菜单下拉列表 */
        await getMenuTreeselect().then((response: any) => {
            if (response.code === 200) {
                menus.value = proxy.handleTree(response.data, "menuId");
            }
        });
    };

    onMounted(() => {
        const tableId = proxy.$route.params && proxy.$route.params.tableId;
        if (tableId) {
            initTabsData(tableId);
            isRouter.value = true;
        }
    });

	// prettier-ignore
	return {
        activeName, tableHeight, tables, cloumns, dictOptions, menus, info, submitForm, close, initTabsData, isRouter
    }
};
