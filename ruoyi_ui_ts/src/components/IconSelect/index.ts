// const req = require.context('../../assets/icons/svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys()

// const re = /\.\/(.*)\.svg/

// const icons = requireAll(req).map(i => {
//   return i.match(re)[1]
// })

export default () => {
	const name = ref<string>("");
	const iconList = ref<string[]>([]);
	const emit = defineEmits(["selected"]);

	const icons = reactive<string[]>([]);
	const modules = import.meta.glob("../../assets/icons/svg/*.svg");
	for (const path in modules) {
		const p = path.split("assets/icons/svg/")[1].split(".svg")[0];
		icons.push(p);
	}

	const filterIcons = () => {
		iconList.value = icons;
		if (name.value) {
			iconList.value = iconList.value.filter((item) =>
				item.includes(name.value)
			);
		}
	};
	const selectedIcon = (name: string) => {
		emit("selected", name);
		document.body.click();
	};

	const reset = () => {
		name.value = "";
		iconList.value = icons;
	};

	return {
		name,
		iconList,
		filterIcons,
		selectedIcon,
	};
};
