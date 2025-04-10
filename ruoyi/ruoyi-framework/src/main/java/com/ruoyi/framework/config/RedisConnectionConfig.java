package com.ruoyi.framework.config;

import com.ruoyi.framework.config.properties.RedisProperties;
import com.ruoyi.framework.config.properties.RedissonClientProperties;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import redis.clients.jedis.JedisPoolConfig;

import javax.annotation.Resource;
import java.time.Duration;

/**
 * redis连接工厂设置
 */
@Configuration
public class RedisConnectionConfig {

    private static final Logger log = LoggerFactory.getLogger(RedisConnectionConfig.class);
    @Resource
    RedisProperties properties;

    @Resource
    RedissonClientProperties redissonClientProperties;


    @Bean
    @Primary
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig config = new JedisPoolConfig();
        // 控制一个pool可分配多少个jedis实例，通过pool.getResource()来获取；
        // 如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。
        config.setMaxTotal(properties.getMaxTotal());
        config.setMinIdle(properties.getMinIdle());
        // 控制一个pool最多有多少个状态为idle(空闲的)的jedis实例。
        config.setMaxIdle(properties.getMaxIdle());
        config.setTestOnReturn(properties.getTestOnReturn());
        // 在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；
        config.setTestOnBorrow(properties.getTestOnBorrow());
        // 开启空闲连接检测
        config.setTestWhileIdle(properties.getTestWhileIdle());
        // JedisPool中连接的空闲时间阈值，当达到这个阈值时，空闲连接就会被移除。Redis的默认值是30分钟，太长，所以JedisPoolConfig的默认值是1分钟
        config.setMinEvictableIdleTime(Duration.ofMillis(properties.getTimeBetweenEvictionRunsMillis()));
        // 检测空闲连接的周期
        config.setTimeBetweenEvictionRuns(Duration.ofMillis(properties.getTimeBetweenEvictionRunsMillis()));
        // 每次检测时，取多少个连接进行检测。如果设置成-1，就表示检测所有链接
        config.setNumTestsPerEvictionRun(properties.getNumTestsPerEvictionRun());
        return config;
    }

    @Bean
    public JedisConnectionFactory jedisConnectionFactory(JedisPoolConfig config) {
        JedisConnectionFactory factory = null;
        log.info("JedisPoolConfig----{}", config);
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(properties.getHost());
        redisStandaloneConfiguration.setPassword(properties.getPassword());
        redisStandaloneConfiguration.setPort(properties.getPort());
        redisStandaloneConfiguration.setDatabase(properties.getDb());
        JedisClientConfiguration.JedisClientConfigurationBuilder configurationBuilder = JedisClientConfiguration.builder();
        JedisClientConfiguration jedisClientConfiguration = configurationBuilder.usePooling().poolConfig(config).build();
        try {
            factory = new JedisConnectionFactory(redisStandaloneConfiguration, jedisClientConfiguration);
            log.info("JedisConnectionFactory===={}", factory);
        } catch (Exception e) {
            log.error("JedisConnectionFactory初始化异常", e);
        }
        return factory;
    }

    @Primary
    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        Config config = new Config();
        // 单机
        config.useSingleServer()
                .setAddress("redis://" + properties.getHost() + ":" + properties.getPort())
                .setPassword(properties.getPassword())
                .setTimeout(properties.getTimeout())
                .setIdleConnectionTimeout(redissonClientProperties.getIdleConnectionTimeout())
                .setConnectionMinimumIdleSize(redissonClientProperties.getConnectionMinimumIdleSize())
                .setConnectionPoolSize(redissonClientProperties.getConnectionPoolSize());
        // 集群
        // config.useClusterServers().addNodeAddress("redis://192.31.21.1:6379","redis://192.31.21.2:6379")
        RedissonClient redissonClient = Redisson.create(config);
        log.info("redisson客户端初始化配置成功：{}", redissonClient);
        return redissonClient;
    }

}
