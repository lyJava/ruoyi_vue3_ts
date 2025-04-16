import useDictStore from "@/store/modules/dict";
import { getDicts, getDictsFetch } from "@/api/system/dict/data";
import { Ref, ref, toRefs } from "vue";

/**
 * 获取字典数据
 */
const useDict = (...args: any[]) => {
	const res = ref<Record<string, any[]>>({});
	const dictStore = useDictStore();
	return (() => {
		args.forEach((dictType) => {
			res.value[dictType] = [];
			const dicts = dictStore.getDict(dictType);
			if (dicts) {
				res.value[dictType] = dicts;
			} else {
				getDicts(dictType).then((resp) => {
					res.value[dictType] = resp.data.map(
						(p: {
							dictLabel: any;
							dictValue: any;
							listClass: any;
							cssClass: any;
						}) => ({
							label: p.dictLabel,
							value: p.dictValue,
							elTagType: p.listClass,
							elTagClass: p.cssClass,
						})
					);
					dictStore.setDict(dictType, res.value[dictType]);
				});
			}
		});
		return toRefs(res.value);
	})();
};

interface DictItem {
	label: string;
	value: string | number;
	elTagType?: string;
	elTagClass?: string;
}

// 定义响应式字典结构
type DictResult = Record<string, Ref<DictItem[]>>;
/**
 * 获取字典数据==改进版？？
 * 使用fetch
 */
const useDict2 = <T extends string[]>(...dictTypes: T): DictResult => {
	const res = ref<Record<string, DictItem[]>>({});
	const dictStore = useDictStore()
	dictTypes.forEach(async (dictType) => {
		// 初始化字典项
		res.value[dictType] = [];

		// 检查缓存
		const cached = dictStore.getDict(dictType);
		if (cached) {
			res.value[dictType] = cached;
			return;
		}

		try {
			// 请求字典数据
			const resp = await getDictsFetch(dictType);

			// 转换数据结构
			const dictData: DictItem[] = resp.data.data.map(
				(p: {
					dictLabel: any;
					dictValue: any;
					listClass: any;
					cssClass: any;
				}) => ({
					label: p.dictLabel,
					value: p.dictValue,
					elTagType: p.listClass,
					elTagClass: p.cssClass,
				})
			);

			// 更新响应式数据和缓存
			res.value[dictType] = dictData;
			dictStore.setDict(dictType, dictData);
		} catch (error) {
			console.error(`Failed to load dict ${dictType}:`, error);
			res.value[dictType] = [];
		}
	});

	// 转换为响应式引用
	return toRefs(res.value) as DictResult;
};

export default useDict;
