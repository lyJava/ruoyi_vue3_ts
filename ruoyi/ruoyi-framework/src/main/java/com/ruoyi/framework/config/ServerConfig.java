package com.ruoyi.framework.config;

import com.ruoyi.common.utils.ServletUtils;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 服务相关配置
 *
 * @author ruoyi
 */
@Component
public class ServerConfig {

    /**
     * 获取完整的请求路径，包括：域名，端口，上下文访问路径
     *
     * @return 服务地址
     */
    public String getUrl() {
        return this.getDomain(ServletUtils.getRequest());
    }

    public String getDomain(HttpServletRequest request) {
        final StringBuffer url = request.getRequestURL();
        final String contextPath = request.getServletContext().getContextPath();
        return url.delete(url.length() - request.getRequestURI().length(), url.length()).append(contextPath).toString();
    }

}
