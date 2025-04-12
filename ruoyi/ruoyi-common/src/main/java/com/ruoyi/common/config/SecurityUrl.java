package com.ruoyi.common.config;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Arrays;


/**
 * 安全访问白名单
 */
@Component
@ConfigurationProperties(prefix = "security")
public class SecurityUrl {

    /**
     * 访问白名单
     */
    private String[] loginAbout;

    /**
     * 静态资源
     */
    private String[] staticResource;

    /**
     * swagger资源
     */
    private String[] swaggerResource;

    /**
     * 通用请求
     */
    private String[] commonAbout;


    public String[] getLoginAbout() {
        return loginAbout;
    }

    public void setLoginAbout(String[] loginAbout) {
        this.loginAbout = loginAbout;
    }

    public String[] getStaticResource() {
        return staticResource;
    }

    public void setStaticResource(String[] staticResource) {
        this.staticResource = staticResource;
    }

    public String[] getSwaggerResource() {
        return swaggerResource;
    }

    public void setSwaggerResource(String[] swaggerResource) {
        this.swaggerResource = swaggerResource;
    }

    public String[] getCommonAbout() {
        return commonAbout;
    }

    public void setCommonAbout(String[] commonAbout) {
        this.commonAbout = commonAbout;
    }

    @Override
    public String toString() {
        return "SecurityUrl{" + "\r\n" +
                "登陆相关=" + Arrays.toString(loginAbout) + "\r\n" +
                "静态资源=" + Arrays.toString(staticResource) + "\r\n" +
                "文档资源=" + Arrays.toString(swaggerResource) + "\r\n" +
                "通用请求=" + Arrays.toString(commonAbout) +
                '}';
    }
}
