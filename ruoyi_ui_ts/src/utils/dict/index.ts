import Dict from "./Dict";
import { mergeOptions } from "./DictOptions";

export default function (Vue: any, options: any) {
	mergeOptions(options);
	Vue.mixin({
		data() {
			// prettier-ignore
			if (this.$options.dicts === undefined || this.$options.dicts === null) {
				return {};
			}
			const dict = new Dict();
			dict.owner = this;
			return {
				dict,
			};
		},
		created() {
			if (!(this.dict instanceof Dict)) {
				return;
			}
			options.onCreated && options.onCreated(this.dict);
			this.dict.init(this.$options.dicts).then(() => {
				options.onReady && options.onReady(this.dict);
				this.$nextTick(() => {
					this.$emit("dictReady", this.dict);
					// prettier-ignore
					if (this.$options.methods && this.$options.methods.onDictReady instanceof Function) {
						this.$options.methods.onDictReady.call(this, this.dict);
					}
				});
			});
		},
	});
}
