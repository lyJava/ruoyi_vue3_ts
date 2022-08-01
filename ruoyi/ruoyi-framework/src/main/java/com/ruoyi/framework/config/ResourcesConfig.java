package com.ruoyi.framework.config;

import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.interceptor.RequestIdInterceptor;
import com.ruoyi.framework.interceptor.RepeatSubmitInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * 通用配置
 *
 * @author ruoyi
 */
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(ResourcesConfig.class);

    @Resource
    RepeatSubmitInterceptor repeatSubmitInterceptor;

    @Resource
    ObjectMapper objectMapper;

    @Resource
    RequestIdInterceptor requestIdInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 本地文件上传路径
        registry.addResourceHandler(Constants.RESOURCE_PREFIX + "/**").addResourceLocations("file:" + RuoYiConfig.getProfile() + "/");
        log.info("增加本地文件上传路径");

        // Swagger配置
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
        // Knife4访问配置(不设置访问出现404)
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        log.info("swagger配置放行");
    }

    /**
     * 自定义拦截规则
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestIdInterceptor).addPathPatterns("/**");
        log.info("注册请求标识ID拦截器");
        registry.addInterceptor(repeatSubmitInterceptor).addPathPatterns("/**");
        log.info("注册防重复提交拦截器");
    }

    /**
     * 跨域配置
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // 设置访问源地址
        //config.addAllowedOrigin("*");
        // TODO springboot版本从2.2更新到2.6改动为addAllowedOriginPattern("*")
        config.addAllowedOriginPattern("*");
        // 设置访问源请求头
        config.addAllowedHeader("*");
        // 设置访问源请求方法
        config.addAllowedMethod("*");
        // 对接口配置跨域设置
        source.registerCorsConfiguration("/**", config);
        log.info("corsFilter配置完成");
        return new CorsFilter(source);
    }

    /**
     * 解决返回中文出现乱码问题及jackson的LocalDateTime全局序列化不生效
     *
     * @param converters 转换器
     */
    @Override
    public void configureMessageConverters(@NonNull List<HttpMessageConverter<?>> converters) {
        // TODO 解决jackson的LocalDateTime全局序列化不生效(存在fastjson的情况下，移除fastjson转换器，重新添加已经配置好序列化与反序列化的ObjectMapper)
        converters.removeIf(httpMessageConverter -> httpMessageConverter instanceof FastJsonHttpMessageConverter);
        converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
        // TODO 真正生效的地方
        converters.forEach(converter -> {
            if (converter instanceof StringHttpMessageConverter) {
                ((StringHttpMessageConverter) converter).setDefaultCharset(StandardCharsets.UTF_8);
            } else if (converter instanceof MappingJackson2HttpMessageConverter) {
                ((MappingJackson2HttpMessageConverter) converter).setDefaultCharset(StandardCharsets.UTF_8);
            }
        });
        log.info("返回中文乱及jackson的LocalDateTime全局序列化配置完成");
    }

}