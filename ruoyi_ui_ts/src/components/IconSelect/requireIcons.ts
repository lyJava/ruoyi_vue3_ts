// const req = require.context('../../assets/icons/svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys()

// const re = /\.\/(.*)\.svg/

// const icons = requireAll(req).map(i => {
//   return i.match(re)[1]
// })

const icons = [] as string[];
const modules = import.meta.glob("../../assets/icons/svg/*.svg");
for (const path in modules) {
	const p = path.split("assets/icons/svg/")[1].split(".svg")[0];
	icons.push(p);
}

export default icons;
