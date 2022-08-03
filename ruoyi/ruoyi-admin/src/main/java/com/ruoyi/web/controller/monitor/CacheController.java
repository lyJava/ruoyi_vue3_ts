package com.ruoyi.web.controller.monitor;

import com.alibaba.fastjson2.JSON;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.constant.CacheConstants;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.domain.SysCache;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.redis.connection.RedisServerCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;

/**
 * 缓存监控
 *
 * @author ruoyi
 */
@ApiSort(value = 500)
@Api(tags = "缓存监控控制器")
@RestController
@RequestMapping(value = "/monitor/cache", produces = MediaType.APPLICATION_JSON_VALUE)
public class CacheController {

    @Resource
    RedisTemplate<String, String> redisTemplate;

    @Resource
    RedisCache redisCache;

    private final static List<SysCache> caches = new ArrayList<>();

    static {
        caches.add(new SysCache(CacheConstants.LOGIN_TOKEN_KEY, "用户信息"));
        caches.add(new SysCache(CacheConstants.SYS_CONFIG_KEY, "配置信息"));
        caches.add(new SysCache(CacheConstants.SYS_DICT_KEY, "数据字典"));
        caches.add(new SysCache(CacheConstants.CAPTCHA_CODE_KEY, "验证码"));
        caches.add(new SysCache(CacheConstants.REPEAT_SUBMIT_KEY, "防重提交"));
        caches.add(new SysCache(CacheConstants.RATE_LIMIT_KEY, "限流处理"));
        caches.add(new SysCache(CacheConstants.PWD_ERR_CNT_KEY, "密码错误次数"));
    }

    /**
     * 缓存监控信息
     *
     * @return 信息
     */
    @ApiOperation(value = "缓存监控信息")
    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @GetMapping
    public AjaxResult<Map<String, Object>> getInfo() {
        Properties info = (Properties) redisTemplate.execute((RedisCallback<Object>) RedisServerCommands::info);
        Properties commandStats = (Properties) redisTemplate.execute((RedisCallback<Object>) connection -> connection.info("commandstats"));
        Object dbSize = redisTemplate.execute((RedisCallback<Object>) RedisServerCommands::dbSize);

        Map<String, Object> result = new HashMap<>(3);
        result.put("info", info);
        result.put("dbSize", dbSize);

        List<Map<String, String>> pieList = new ArrayList<>();
        Assert.notNull(commandStats, "执行状态不能为空");
        commandStats.stringPropertyNames().forEach(key -> {
            Map<String, String> data = new HashMap<>(2);
            String property = commandStats.getProperty(key);
            data.put("name", StringUtils.removeStart(key, "cmdstat_"));
            data.put("value", StringUtils.substringBetween(property, "calls=", ",usec"));
            pieList.add(data);
        });
        result.put("commandStats", pieList);
        return AjaxResult.success(result);
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @GetMapping("/getNames")
    public AjaxResult<List<SysCache>> cache() {
        return AjaxResult.success(caches);
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @GetMapping("/getKeys/{cacheName}")
    public AjaxResult<Set<String>> getCacheKeys(@PathVariable String cacheName) {
        Set<String> cacheKeys = redisTemplate.keys(cacheName + "*");
        return AjaxResult.success(cacheKeys);
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @GetMapping(value = "/getValue/{cacheName}/{cacheKey}")
    public AjaxResult<SysCache> getCacheValue(@PathVariable String cacheName, @PathVariable String cacheKey) {
        // String cacheValue = redisTemplate.opsForValue().get(cacheKey);
        // TODO 这里可能会出现对象转换到String异常
        String cacheValue = null;
        if (redisCache.getCacheObject(cacheKey) instanceof String) {
            cacheValue = redisCache.getCacheObject(cacheKey);
        } else if (redisCache.getCacheObject(cacheKey) != null) {
            cacheValue = JSON.toJSONString(redisTemplate.opsForValue().get(cacheKey));
        }
        SysCache sysCache = new SysCache(cacheName, cacheKey, cacheValue);
        return AjaxResult.success(sysCache);
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @DeleteMapping(value = "/clearCacheName/{cacheName}")
    public AjaxResult<String> clearCacheName(@PathVariable String cacheName) {
        Collection<String> cacheKeys = redisTemplate.keys(cacheName + "*");
        Assert.notNull(cacheKeys, "缓存key不能为空");
        redisTemplate.delete(cacheKeys);
        return AjaxResult.success();
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @DeleteMapping(value = "/clearCacheKey/{cacheKey}")
    public AjaxResult<String> clearCacheKey(@PathVariable String cacheKey) {
        redisTemplate.delete(cacheKey);
        return AjaxResult.success();
    }

    @PreAuthorize("@ss.hasPermi('monitor:cache:list')")
    @DeleteMapping("/clearCacheAll")
    public AjaxResult<String> clearCacheAll() {
        Collection<String> cacheKeys = redisTemplate.keys("*");
        Assert.notNull(cacheKeys, "缓存key不能为空");
        redisTemplate.delete(cacheKeys);
        return AjaxResult.success();
    }

}
