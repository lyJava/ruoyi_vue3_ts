package com.ruoyi.framework.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * RedissonClient配置
 *
 * @author liyang
 * @date 2023-08-03
 */

@Component
@ConfigurationProperties(prefix = "redisson.client")
public class RedissonClientProperties {

    /**
     * 超时(毫秒)
     */
    private Integer timeout;

    /**
     * 空闲连接超时(毫秒)
     */
    private Integer idleConnectionTimeout;

    /**
     * 连接最小空闲数
     */
    private Integer connectionMinimumIdleSize;

    /**
     * 连接池大小
     */
    private Integer connectionPoolSize;


    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    public Integer getIdleConnectionTimeout() {
        return idleConnectionTimeout;
    }

    public void setIdleConnectionTimeout(Integer idleConnectionTimeout) {
        this.idleConnectionTimeout = idleConnectionTimeout;
    }

    public Integer getConnectionMinimumIdleSize() {
        return connectionMinimumIdleSize;
    }

    public void setConnectionMinimumIdleSize(Integer connectionMinimumIdleSize) {
        this.connectionMinimumIdleSize = connectionMinimumIdleSize;
    }

    public Integer getConnectionPoolSize() {
        return connectionPoolSize;
    }

    public void setConnectionPoolSize(Integer connectionPoolSize) {
        this.connectionPoolSize = connectionPoolSize;
    }
}
