package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysMenu;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.core.domain.model.LoginBody;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.framework.web.service.SysLoginService;
import com.ruoyi.framework.web.service.SysPermissionService;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.domain.vo.RouterVo;
import com.ruoyi.system.service.ISysMenuService;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 登录验证
 *
 * @author ruoyi
 */
@ApiSort(value = 10)
@Api(tags = "登录验证控制器")
@RestController
public class SysLoginController {

    private static final Logger log = LoggerFactory.getLogger(SysLoginController.class);

    @Resource
    SysLoginService loginService;

    @Resource
    ISysMenuService menuService;

    @Resource
    SysPermissionService permissionService;

    @Resource
    TokenService tokenService;

    /**
     * 登录方法
     *
     * @param loginBody 登录信息
     * @return 结果
     */
    @PostMapping("/login")
    public AjaxResult<Map<String, Object>> login(@RequestBody LoginBody loginBody) {
        StopWatch watch = new StopWatch();
        watch.start("用户登录");
        // 生成令牌
        String token = loginService.login(loginBody.getUsername(), loginBody.getPassword(), loginBody.getCode(), loginBody.getUuid());
        Map<String, Object> map = new HashMap<>(1);
        map.put(Constants.TOKEN, token);
        watch.stop();
        log.info("登录【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(map);
    }

    /**
     * 获取用户信息
     *
     * @return 用户信息（角色与权限）
     */
    @GetMapping("/getInfo")
    public AjaxResult<Map<String, Object>> getInfo(HttpServletRequest request) {
        StopWatch watch = new StopWatch();
        watch.start("获取用户信息");
        final LoginUser loginUser = tokenService.getLoginUser(request);
        final SysUser user = loginUser.getUser();
        // 角色集合
        final Set<String> roles = permissionService.getRolePermission(user);
        // 权限集合
        final Set<String> permissions = permissionService.getMenuPermission(user);
        Map<String, Object> map = new HashMap<>(3);
        map.put("user", user);
        map.put("roles", roles);
        map.put("permissions", permissions);
        watch.stop();
        log.info("登录【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(map);
    }

    /**
     * 获取路由信息
     *
     * @return 路由信息
     */
    @GetMapping("/getRouters")
    public AjaxResult<List<RouterVo>> getRouters(HttpServletRequest request) {
        StopWatch watch = new StopWatch();
        watch.start("获取路由信息");
        final LoginUser loginUser = tokenService.getLoginUser(request);
        // 用户信息
        final SysUser user = loginUser.getUser();
        final List<SysMenu> menus = menuService.selectMenuTreeByUserId(user.getUserId());
        final List<RouterVo> routerVos = menuService.buildMenus(menus);
        watch.stop();
        log.info("登录【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(routerVos);
    }
}
