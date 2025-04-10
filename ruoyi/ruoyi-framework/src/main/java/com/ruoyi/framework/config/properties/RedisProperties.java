package com.ruoyi.framework.config.properties;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "redis")
public class RedisProperties {

    /**
     * 主机
     */
    private String host;

    /**
     * 端口
     */
    private Integer port;

    /**
     * 数据库索引
     */
    private Integer db;
    /**
     * 密码
     */
    private String password;

    /**
     * 超时(毫秒)
     */
    private Integer timeout;

    /**
     * 最大连接数
     */
    private Integer maxTotal;

    /**
     * 空闲连接数
     */
    private Integer minIdle;
    /**
     * 空闲连接数
     */
    private Integer maxIdle;

    /**
     * 返回连接到连接池是否检查可用性
     */
    private Boolean testOnReturn;

    /**
     * 获取redis实例是否检查连接可用
     */
    private Boolean testOnBorrow;

    /**
     * true，表示有一个idle object evitor线程对idle object进行扫描，如果validate失败，此object会被从pool中drop掉；
     * 这一项只有在timeBetweenEvictionRunsMillis大于0时才有意义
     */
    private Boolean testWhileIdle;

    /**
     * 表示一个对象至少停留在idle状态的最短时间，然后才能被idle object evitor扫描并驱逐；
     * 这一项只有在timeBetweenEvictionRunsMillis大于0时才有意义
     */
    private Long minEvictableIdleTimeMillis;

    /**
     * 在minEvictableIdleTimeMillis基础上，加入了至少minIdle个对象已经在pool里面了。如果为-1，evicted不会根据idle time驱逐任何对象。
     * 如果minEvictableIdleTimeMillis>0，则此项设置无意义，且只有在timeBetweenEvictionRunsMillis大于0时才有意义
     */
    private Long timeBetweenEvictionRunsMillis;

    /**
     * 表示idle object evitor每次扫描的最多的对象数
     */
    private Integer numTestsPerEvictionRun;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public Integer getDb() {
        return db;
    }

    public void setDb(Integer db) {
        this.db = db;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    public Integer getMaxTotal() {
        return maxTotal;
    }

    public void setMaxTotal(Integer maxTotal) {
        this.maxTotal = maxTotal;
    }


    public Integer getMinIdle() {
        return minIdle;
    }

    public void setMinIdle(Integer minIdle) {
        this.minIdle = minIdle;
    }

    public Integer getMaxIdle() {
        return maxIdle;
    }

    public void setMaxIdle(Integer maxIdle) {
        this.maxIdle = maxIdle;
    }

    public Boolean getTestOnReturn() {
        return testOnReturn;
    }

    public void setTestOnReturn(Boolean testOnReturn) {
        this.testOnReturn = testOnReturn;
    }

    public Boolean getTestOnBorrow() {
        return testOnBorrow;
    }

    public void setTestOnBorrow(Boolean testOnBorrow) {
        this.testOnBorrow = testOnBorrow;
    }

    public Boolean getTestWhileIdle() {
        return testWhileIdle;
    }

    public void setTestWhileIdle(Boolean testWhileIdle) {
        this.testWhileIdle = testWhileIdle;
    }

    public Long getMinEvictableIdleTimeMillis() {
        return minEvictableIdleTimeMillis;
    }

    public void setMinEvictableIdleTimeMillis(Long minEvictableIdleTimeMillis) {
        this.minEvictableIdleTimeMillis = minEvictableIdleTimeMillis;
    }

    public Long getTimeBetweenEvictionRunsMillis() {
        return timeBetweenEvictionRunsMillis;
    }

    public void setTimeBetweenEvictionRunsMillis(Long timeBetweenEvictionRunsMillis) {
        this.timeBetweenEvictionRunsMillis = timeBetweenEvictionRunsMillis;
    }

    public Integer getNumTestsPerEvictionRun() {
        return numTestsPerEvictionRun;
    }

    public void setNumTestsPerEvictionRun(Integer numTestsPerEvictionRun) {
        this.numTestsPerEvictionRun = numTestsPerEvictionRun;
    }
}
