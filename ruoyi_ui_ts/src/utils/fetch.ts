import { getToken } from "./auth";

// src/utils/fetch.ts
type RequestConfig = {
	baseURL?: string;
	timeout?: number;
	headers?: HeadersInit;
};

// 全局配置
const fetchConfig: RequestConfig = {
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 1000 * 200, // 200秒
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
        "Authorization": "Bearer " + getToken(),
	},
};

// 类型安全 URL 转换器
const resolveInput = (input: RequestInfo): string => {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	return input.url; // 处理 Request 类型
};

// 创建增强版 fetch 实例
export const createFetch = (config?: RequestConfig) => {
	const mergedConfig = { ...fetchConfig, ...config };

	return async <T = any>(
		input: RequestInfo,
		init?: RequestInit
	): Promise<{ data: T }> => {
		const controller = new AbortController();
		const timer = setTimeout(
			() => controller.abort(),
			mergedConfig.timeout
		);

		try {
			
			const url = mergedConfig.baseURL + input.toString();

			//const path = resolveInput(input);
			//const url = mergedConfig.baseURL ? new URL(path, mergedConfig.baseURL).toString(): path;

			const response = await Promise.race([
				fetch(url, {
					...init,
					headers: { ...mergedConfig.headers, ...init?.headers },
					signal: controller.signal,
				}),
				new Promise<Response>((_, reject) =>
					setTimeout(
						() => reject(new Error("请求超时")),
						mergedConfig.timeout
					)
				),
			]);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const data: T = await response.json();
			return { data };
		} catch (error) {
			console.error("fetch请求失败:", error);
			throw error;
		} finally {
			clearTimeout(timer);
		}
	};
};

export const uploadFile = async (file: File) => {
	const formData = new FormData();
	formData.append("file", file);

	const { data } = await createFetch()("/upload", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: formData,
	});

	return data;
};

/**
 * 创建默认实例（对应原 axios.create()）
 */
export const useCusFetch = createFetch();
