package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysRole;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.service.ISysPostService;
import com.ruoyi.system.service.ISysRoleService;
import com.ruoyi.system.service.ISysUserService;
import com.ruoyi.web.model.SysUserInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户信息
 *
 * @author ruoyi
 */
@ApiSort(value = 130)
@Api(tags = "用户信息控制器")
@RestController
@RequestMapping("/system/user")
public class SysUserController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(SysUserController.class);

    @Resource
    ISysUserService userService;

    @Resource
    ISysRoleService roleService;

    @Resource
    ISysPostService postService;

    @Resource
    TokenService tokenService;

    /**
     * 获取用户列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取用户列表")
    @PreAuthorize("@ss.hasPermi('system:user:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysUser>> list(SysUser user) {
        StopWatch watch = new StopWatch();
        watch.start("获取用户列表");
        startPage();
        final List<SysUser> list = this.userService.selectUserList(user);
        final TableDataInfo<List<SysUser>> tableDataInfo = getDataTable(list);
        watch.stop();
        log.info("用户信息【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return tableDataInfo;
    }

    /**
     * 导出用户
     *
     * @param user
     * @return
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "导出用户")
    @Log(title = "用户管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:user:export')")
    @GetMapping("/export")
    public AjaxResult<String> export(SysUser user) {
        final List<SysUser> list = userService.selectUserList(user);
        ExcelUtil<SysUser> util = new ExcelUtil<>(SysUser.class);
        return util.exportExcel(list, "用户数据");
    }

    /**
     * 导出用户(返回流)
     *
     * @param user     用户对象
     * @param response 返回
     * @return 流
     */
    @ApiOperation(value = "导出用户(返回流)")
    @Log(title = "用户管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:user:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportByStream(SysUser user, HttpServletResponse response) {
        new ExcelUtil<>(SysUser.class).exportExcel(response, this.userService.selectUserList(user), "用户数据");
    }

    /**
     * 用户导入
     *
     * @param file          文件
     * @param updateSupport 是否更新
     * @return
     * @throws Exception
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "用户导入")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "file", value = "文件", dataType = "MultipartFile", dataTypeClass = MultipartFile.class, required = true),
            @ApiImplicitParam(name = "updateSupport", value = "是否更新", dataTypeClass = Boolean.class, required = true)
    })
    @Log(title = "用户管理", businessType = BusinessType.IMPORT)
    @PreAuthorize("@ss.hasPermi('system:user:import')")
    @PostMapping(value = "/importData")
    public AjaxResult<String> importData(@RequestPart MultipartFile file, boolean updateSupport) throws Exception {
        ExcelUtil<SysUser> util = new ExcelUtil<>(SysUser.class);
        final List<SysUser> userList = util.importExcel(file.getInputStream());
        final LoginUser loginUser = this.tokenService.getLoginUser(ServletUtils.getRequest());
        final String username = loginUser.getUsername();
        final String message = this.userService.importUser(userList, updateSupport, username);
        return AjaxResult.success(message);
    }

    /**
     * 导入用户
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "导入用户")
    @PostMapping(value = "/importTemplate")
    public void importTemplate(HttpServletResponse response) {
        new ExcelUtil<>(SysUser.class).importTemplateExcel(response, "用户数据");
    }

    /**
     * 根据用户编号获取详细信息
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "根据用户编号获取详细信息")
    @ApiImplicitParam(name = "userId", value = "用户编号", dataTypeClass = Long.class)
    @PreAuthorize("@ss.hasPermi('system:user:query')")
    @GetMapping(value = {"/", "/{userId}"})
    public AjaxResult<SysUserInfo> getInfo(@PathVariable(value = "userId", required = false) Long userId) {
        final List<SysRole> roles = this.roleService.selectRoleAll();
        SysUserInfo sysUserInfo = new SysUserInfo();
        sysUserInfo.setRoles(SysUser.isAdmin(userId) ? roles : roles.stream().filter(r -> !r.isAdmin()).collect(Collectors.toList()));
        sysUserInfo.setPosts(this.postService.selectPostAll());
        if (StringUtils.isNotNull(userId)) {
            sysUserInfo.setData(this.userService.selectUserById(userId));
            sysUserInfo.setPostIds(this.postService.selectPostListByUserId(userId));
            sysUserInfo.setRoleIds(this.roleService.selectRoleListByUserId(userId));
        }
        return AjaxResult.success(sysUserInfo);
    }

    /**
     * 新增用户
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "新增用户")
    @PreAuthorize("@ss.hasPermi('system:user:add')")
    @Log(title = "用户管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysUser user) {
        if (UserConstants.NOT_UNIQUE.equals(userService.checkUserNameUnique(user.getUserName()))) {
            return AjaxResult.error("新增用户'" + user.getUserName() + "'失败，登录账号已存在");
        } else if (StringUtils.isNotEmpty(user.getPhonenumber())
                && UserConstants.NOT_UNIQUE.equals(userService.checkPhoneUnique(user))) {
            return AjaxResult.error("新增用户'" + user.getUserName() + "'失败，手机号码已存在");
        } else if (StringUtils.isNotEmpty(user.getEmail())
                && UserConstants.NOT_UNIQUE.equals(userService.checkEmailUnique(user))) {
            return AjaxResult.error("新增用户'" + user.getUserName() + "'失败，邮箱账号已存在");
        }
        user.setCreateBy(SecurityUtils.getUsername());
        user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        return toAjax(this.userService.insertUser(user));
    }

    /**
     * 修改用户
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "修改用户")
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysUser user) {
        this.userService.checkUserAllowed(user);
        if (StringUtils.isNotEmpty(user.getPhonenumber())
                && UserConstants.NOT_UNIQUE.equals(this.userService.checkPhoneUnique(user))) {
            return AjaxResult.error("修改用户'" + user.getUserName() + "'失败，手机号码已存在");
        } else if (StringUtils.isNotEmpty(user.getEmail())
                && UserConstants.NOT_UNIQUE.equals(this.userService.checkEmailUnique(user))) {
            return AjaxResult.error("修改用户'" + user.getUserName() + "'失败，邮箱账号已存在");
        }
        user.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.userService.updateUser(user));
    }

    /**
     * 批量删除用户
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "批量删除用户")
    @ApiImplicitParam(name = "userIds", value = "用户ID数组", dataTypeClass = Long.class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:user:remove')")
    @Log(title = "用户管理", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{userIds}")
    public AjaxResult<String> remove(@PathVariable Long[] userIds) {
        return toAjax(this.userService.deleteUserByIds(userIds));
    }

    /**
     * 重置密码
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "重置密码")
    @PreAuthorize("@ss.hasPermi('system:user:resetPwd')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE)
    @PutMapping(value = "/resetPwd")
    public AjaxResult<String> resetPwd(@RequestBody SysUser user) {
        this.userService.checkUserAllowed(user);
        user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        user.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.userService.resetPwd(user));
    }

    /**
     * 状态修改
     */
    @ApiOperationSupport(order = 10)
    @ApiOperation(value = "状态修改")
    @PreAuthorize("@ss.hasPermi('system:user:edit')")
    @Log(title = "用户管理", businessType = BusinessType.UPDATE)
    @PutMapping(value = "/changeStatus")
    public AjaxResult<String> changeStatus(@RequestBody SysUser user) {
        this.userService.checkUserAllowed(user);
        user.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.userService.updateUserStatus(user));
    }
}
