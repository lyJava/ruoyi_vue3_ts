package com.ruoyi.web.controller.monitor;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.domain.SysUserOnline;
import com.ruoyi.system.service.ISysUserOnlineService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * 在线用户监控
 *
 * @author ruoyi
 */
@ApiSort(value = 540)
@Api(tags = "在线用户控制器")
@RestController
@RequestMapping(value = "/monitor/online", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysUserOnlineController extends BaseController {

    @Resource
    RedisCache redisCache;

    @Resource
    ISysUserOnlineService userOnlineService;

    /**
     * 在线用户分页数据
     *
     * @param ipaddr   IP地址
     * @param userName 用户名
     * @return 分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "在线用户分页数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "ipaddr", value = "IP地址", paramType = "query", required = true),
            @ApiImplicitParam(name = "userName", value = "用户名", paramType = "query", required = true)

    })
    @PreAuthorize("@ss.hasPermi('monitor:online:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysUserOnline>> list(String ipaddr, String userName) {
        final Collection<String> keys = this.redisCache.keys(Constants.LOGIN_TOKEN_KEY + "*");
        List<SysUserOnline> userOnlineList = new ArrayList<>();
        for (String key : keys) {
            final LoginUser user = this.redisCache.getCacheObject(key);
            if (StringUtils.isNotEmpty(ipaddr) && StringUtils.isNotEmpty(userName)) {
                if (StringUtils.equals(ipaddr, user.getIpaddr()) && StringUtils.equals(userName, user.getUsername())) {
                    userOnlineList.add(this.userOnlineService.selectOnlineByInfo(ipaddr, userName, user));
                }
            } else if (StringUtils.isNotEmpty(ipaddr)) {
                if (StringUtils.equals(ipaddr, user.getIpaddr())) {
                    userOnlineList.add(this.userOnlineService.selectOnlineByIpaddr(ipaddr, user));
                }
            } else if (StringUtils.isNotEmpty(userName) && StringUtils.isNotNull(user.getUser())) {
                if (StringUtils.equals(userName, user.getUsername())) {
                    userOnlineList.add(this.userOnlineService.selectOnlineByUserName(userName, user));
                }
            } else {
                userOnlineList.add(this.userOnlineService.loginUserToUserOnline(user));
            }
        }
        Collections.reverse(userOnlineList);
        userOnlineList.removeAll(Collections.singleton(null));
        return getDataTable(userOnlineList);
    }

    /**
     * 强退用户
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "强退用户")
    @ApiImplicitParam(name = "tokenId", value = "令牌ID", paramType = "path", required = true)
    @PreAuthorize("@ss.hasPermi('monitor:online:forceLogout')")
    @Log(title = "在线用户", businessType = BusinessType.FORCE)
    @DeleteMapping(value = "/{tokenId}")
    public AjaxResult<String> forceLogout(@PathVariable String tokenId) {
        redisCache.deleteObject(Constants.LOGIN_TOKEN_KEY + tokenId);
        return AjaxResult.success();
    }
}
