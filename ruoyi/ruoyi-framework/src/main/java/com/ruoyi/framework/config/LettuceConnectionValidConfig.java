package com.ruoyi.framework.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author liyang
 * @date 2022-07-10 21:39
 */
//@Component
public class LettuceConnectionValidConfig implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(LettuceConnectionValidConfig.class);

    @Resource
    RedisConnectionFactory redisConnectionFactory;

    @Override
    public void afterPropertiesSet() {
        if (redisConnectionFactory instanceof LettuceConnectionFactory) {
            LettuceConnectionFactory connectionFactory = (LettuceConnectionFactory) redisConnectionFactory;
            if (!connectionFactory.getValidateConnection()) {
                connectionFactory.setValidateConnection(true);
                log.info("lettuce连接验证设置为true");
            }
        }
    }

}
