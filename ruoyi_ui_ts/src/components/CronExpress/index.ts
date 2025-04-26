export interface CrontabValue {
	second: string;
	min: string;
	hour: string;
	day: string;
	month: string;
	week: string;
	year: string;
}

export interface CrontabComponent {
	radioValue?: number;
	cycle01?: number;
	cycle02?: number;
	average01?: number;
	average02?: number;
	checkboxList?: string[];
	workday?: number;
	weekday?: number;
}

export default((props: any, emit: any) => {

    /**
     * tab组件标题数组
     */
    const tabTitles = ["秒", "分钟", "小时", "日", "月", "周", "年"];
    const cronTabValObj = reactive<CrontabValue>({
        second: "*",
        min: "*",
        hour: "*",
        day: "*",
        month: "*",
        week: "?",
        year: "",
    });

    // 子组件引用
    const cronSecond = ref<ComponentPublicInstance & CrontabComponent>();
    const cronMinute = ref<ComponentPublicInstance & CrontabComponent>();
    const cronHour = ref<ComponentPublicInstance & CrontabComponent>();
    const cronDay = ref<ComponentPublicInstance & CrontabComponent>();
    const cronMonth = ref<ComponentPublicInstance & CrontabComponent>();
    const cronWeek = ref<ComponentPublicInstance & CrontabComponent>();
    const cronYear = ref<ComponentPublicInstance & CrontabComponent>();


    const shouldHide = (key: string) => {
        return !props.hideComponent.includes(key);
    };
    
    const resolveExp = () => {
        if (props.expression) {
            const arr = props.expression.split(" ");
            if (arr.length >= 6) {
                const obj: CrontabValue = {
                    second: arr[0],
                    min: arr[1],
                    hour: arr[2],
                    day: arr[3],
                    month: arr[4],
                    week: arr[5],
                    year: arr[6] || "",
                };
                Object.assign(cronTabValObj, obj);
                for (const key in obj) {
                    changeRadio(
                        key as keyof CrontabValue,
                        obj[key as keyof CrontabValue]
                    );
                }
            }
        } else {
            clearCron();
        }
    };
    
    const updateCrontabValue = (
        name: keyof CrontabValue,
        value: string,
        from?: string
    ) => {
        cronTabValObj[name] = value;
        if (from && from !== name) {
            changeRadio(name, value);
        }
    };
    // 赋值到组件
    const changeRadio = (name: keyof CrontabValue, value: string) => {
        const components: Record<string, typeof cronSecond> = {
            second: cronSecond,
            min: cronMinute,
            hour: cronHour,
            day: cronDay,
            month: cronMonth,
            week: cronWeek,
            year: cronYear,
        };
        let insValue = 0; 
    
        const componentRef = components[name]?.value;
        if (!componentRef) return;
    
        if (["second", "min", "hour", "month"].includes(name)) {
            if (value === "*") {
                componentRef.radioValue = 1;
            } else if (value.includes("-")) {
                const [cycle01, cycle02] = value.split("-");
                componentRef.cycle01 = isNaN(Number(cycle01)) ? 0 : Number(cycle01);
                componentRef.cycle02 = Number(cycle02);
                componentRef.radioValue = 2;
            } else if (value.includes("/")) {
                const [average01, average02] = value.split("/");
                componentRef.average01 = isNaN(Number(average01))
                    ? 0
                    : Number(average01);
                componentRef.average02 = Number(average02);
                componentRef.radioValue = 3;
            } else {
                componentRef.checkboxList = value.split(",");
                componentRef.radioValue = 4;
            }
        } else if (name == "day") {
            if (value === "*") {
                insValue = 1;
            } else if (value == "?") {
                insValue = 2;
            } else if (value.indexOf("-") > -1) {
                let indexArr = value.split("-") as any; 
                isNaN(indexArr[0])
                    ? (componentRef.cycle01 = 0)
                    : (componentRef.cycle01 = indexArr[0]);
                componentRef.cycle02 = indexArr[1];
                insValue = 3;
            } else if (value.indexOf("/") > -1) {
                let indexArr = value.split("/") as any;
                isNaN(indexArr[0])
                    ? (componentRef.average01 = 0)
                    : (componentRef.average01 = indexArr[0]);
                componentRef.average02 = indexArr[1];
                insValue = 4;
            } else if (value.indexOf("W") > -1) {
                let indexArr = value.split("W") as any;
                isNaN(indexArr[0])
                    ? (componentRef.workday = 0)
                    : (componentRef.workday = indexArr[0]);
                insValue = 5;
            } else if (value === "L") {
                insValue = 6;
            } else {
                componentRef.checkboxList = value.split(",");
                insValue = 7;
            }
        } else if (name == "week") {
            if (value === "*") {
                insValue = 1;
            } else if (value == "?") {
                insValue = 2;
            } else if (value.indexOf("-") > -1) {
                let indexArr = value.split("-") as any;
                isNaN(indexArr[0])
                    ? (componentRef.cycle01 = 0)
                    : (componentRef.cycle01 = indexArr[0]);
                componentRef.cycle02 = indexArr[1];
                insValue = 3;
            } else if (value.indexOf("#") > -1) {
                let indexArr = value.split("#") as any;
                isNaN(indexArr[0])
                    ? (componentRef.average01 = 1)
                    : (componentRef.average01 = indexArr[0]);
                componentRef.average02 = indexArr[1];
                insValue = 4;
            } else if (value.indexOf("L") > -1) {
                let indexArr = value.split("L") as any;
                isNaN(indexArr[0])
                    ? (componentRef.weekday = 1)
                    : (componentRef.weekday = indexArr[0]);
                insValue = 5;
            } else {
                componentRef.checkboxList = value.split(",");
                insValue = 7;
            }
        } else if (name == "year") {
            if (value == "") {
                insValue = 1;
            } else if (value == "*") {
                insValue = 2;
            } else if (value.indexOf("-") > -1) {
                insValue = 3;
            } else if (value.indexOf("/") > -1) {
                insValue = 4;
            } else {
                componentRef.checkboxList = value.split(",");
                insValue = 5;
            }
        }
        componentRef.radioValue = insValue;
    };
    
    
    const checkNumber = (value: number, minLimit: number, maxLimit: number) => {
        value = Math.floor(value);
        return Math.max(minLimit, Math.min(value, maxLimit));
    };
    
    const hidePopup = () => emit("hide");
    
    const submitFill = () => {
        emit("fill", crontabValueString.value);
        hidePopup();
    };
    
    const clearCron = () => {
        Object.assign(cronTabValObj, {
            second: "*",
            min: "*",
            hour: "*",
            day: "*",
            month: "*",
            week: "?",
            year: "",
        });
        Object.keys(cronTabValObj).forEach((key) => {
            changeRadio(
                key as keyof CrontabValue,
                cronTabValObj[key as keyof CrontabValue]
            );
        });
    };
    
    const crontabValueString = computed(() => {
        const { second, min, hour, day, month, week, year } = cronTabValObj;
        return `${second} ${min} ${hour} ${day} ${month} ${week}${
            year ? " " + year : ""
        }`;
    });
    
    watch(() => props.expression, (newVal, oldVal) => {
      resolveExp()
    }, { immediate: true })
    onMounted(() => {
        resolveExp;
    });


    return {
        cronSecond,
        cronMinute,
        cronHour,
        cronDay,
        cronWeek,
        cronYear,
        cronTabValObj,
        tabTitles,
        crontabValueString,
        shouldHide,
        updateCrontabValue,
        checkNumber,
        submitFill,
        clearCron,
        hidePopup,

    }

});