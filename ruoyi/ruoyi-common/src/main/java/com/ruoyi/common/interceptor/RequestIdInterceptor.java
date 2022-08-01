package com.ruoyi.common.interceptor;

import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.uuid.UUID;
import org.slf4j.MDC;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 追加请求ID拦截器
 * <p>
 * 拦截所有请求，从 header 中获取 requestId 然后放到 MDC 中，如果没有获取到，则直接用 UUID 生成一个
 */
@Component
public class RequestIdInterceptor implements HandlerInterceptor {

    public static final String REQUEST_ID = "requestId";

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, Exception arg3) {
        MDC.clear();
    }

    @Override
    public void postHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, ModelAndView arg3) {
    }

    @Override
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        // TODO request.getHeader()不区分大小写
        String requestId = request.getHeader(REQUEST_ID);
        MDC.put(REQUEST_ID, StringUtils.isBlank(requestId) ? UUID.fastUUID().toString() : requestId);
        return true;
    }

}
