import useUserStore from "@/store/modules/user";
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { ElForm } from "element-plus";
import { lodashFunc } from "@/utils/ruoyi";
//mport { ILoginForm } from "./module/loginForm";

export default () => {
	const loginFormRef = ref<InstanceType<typeof ElForm>>();
	const codeUrl = ref<string>("");
	const loginForm = ref<any>({
		username: "admin",
		password: "admin123",
		rememberMe: false,
		code: "",
		uuid: "",
	});

	const loginRules = {
		username: [
			{ required: true, trigger: "blur", message: "用户名不能为空" },
		],
		password: [
			{ required: true, trigger: "blur", message: "密码不能为空" },
		],
		code: [
			{ required: true, trigger: "change", message: "验证码不能为空" },
		],
	};

	let loading = ref<boolean>(false);
	const redirect = ref<any>(undefined);

	const userStore = useUserStore();
	const router = useRouter();

	const getCodeBase64 = async () => {
		await getCodeImg().then((res: any) => {
			if (res.code === 200) {
				const data = res.data;
				loginForm.value.uuid = data.uuid;
				const img = data.img;
				if (img.indexOf("data:image") > -1) {
					codeUrl.value = img;
				} else {
					codeUrl.value = "data:image/png;base64," + img;
				}
			}
		});
	};

    // 验证码防抖，设置每700毫秒才能点击一次
	const getCode = lodashFunc(getCodeBase64, 700);

	const getCookie = () => {
		const username = Cookies.get("username");
		const password = Cookies.get("password");
		const rememberMe = Cookies.get("rememberMe");
		// prettier-ignore
		loginForm.value.username = username === undefined ? loginForm.value.username : username;
		// prettier-ignore
		loginForm.value.password = password === undefined ? loginForm.value.password : decrypt(password) as string;
		// prettier-ignore
		loginForm.value.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
	};

	const handleLogin = () => {
		loginFormRef.value?.validate((valid: boolean) => {
			if (valid) {
				loading.value = true;
				if (loginForm.value.rememberMe) {
					// prettier-ignore
					Cookies.set("username", loginForm.value.username, { expires: 30,});
					// prettier-ignore
					Cookies.set("password", encrypt(loginForm.value.password).toString(), {expires: 30, });
					// prettier-ignore
					Cookies.set("rememberMe", loginForm.value.rememberMe.toString(), { expires: 30, });
				} else {
					Cookies.remove("username");
					Cookies.remove("password");
					Cookies.remove("rememberMe");
				}

				// prettier-ignore
				userStore.userLogin(loginForm.value, true)
				.then(() => {
					router.push({ path: redirect.value || "/" }).catch(() => {});
				})
				.catch((error) => {
					console.log("登录失败", error);
					loading.value = false;
					getCode();
				});
			}
		});
	};

	onMounted(() => {
		getCodeBase64();
		getCookie();
	});
    // prettier-ignore
	return { 
        loginFormRef, loginForm, loginRules, codeUrl, loading, getCode, handleLogin, 
    };
};
