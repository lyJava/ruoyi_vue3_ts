package com.ruoyi.framework.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
/**
 * 定时验证redis的lettuce连接
 *
 * @author liyang
 * @date 2022-07-10 21:42
 */
//@Component
public class LettuceConnectionValidTask {

    private static final Logger log = LoggerFactory.getLogger(LettuceConnectionValidTask.class);

    @Resource
    RedisConnectionFactory redisConnectionFactory;

    @Scheduled(cron = "0/60 * * * * ?")
    public void task() {
        if (redisConnectionFactory instanceof LettuceConnectionFactory) {
            LettuceConnectionFactory connectionFactory = (LettuceConnectionFactory) redisConnectionFactory;
            connectionFactory.validateConnection();
            log.info("定时验证lettuce连接：{}", connectionFactory.getConnection().info());
        }
    }

}
