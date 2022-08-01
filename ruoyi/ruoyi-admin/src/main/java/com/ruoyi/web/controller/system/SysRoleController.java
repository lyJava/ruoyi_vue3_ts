package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysRole;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.framework.web.service.SysPermissionService;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.service.ISysRoleService;
import com.ruoyi.system.service.ISysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 角色信息
 *
 * @author ruoyi
 */
@ApiSort(value = 120)
@Api(tags = "角色信息控制器")
@RestController
@RequestMapping(value = "/system/role")
public class SysRoleController extends BaseController {

    @Resource
    ISysRoleService roleService;

    @Resource
    TokenService tokenService;

    @Resource
    SysPermissionService permissionService;

    @Resource
    ISysUserService userService;

    /**
     * 获取角色分页数据
     *
     * @param role 角色对象
     * @return 分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取角色分页数据")
    @ApiImplicitParam(name = "role", value = "角色对象", paramType = "query", dataTypeClass = SysRole.class)
    @PreAuthorize("@ss.hasPermi('system:role:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysRole>> list(SysRole role) {
        StopWatch watch = new StopWatch();
        watch.start("角色分页查询");
        startPage();
        final List<SysRole> roleList = this.roleService.selectRoleList(role);
        final TableDataInfo<List<SysRole>> dataTable = getDataTable(roleList);
        watch.stop();
        logger.info("角色信息【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataTable;
    }

    /**
     * 角色导出
     *
     * @param role 角色对象
     * @return 导出结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "角色导出")
    @ApiImplicitParam(name = "role", value = "角色对象", paramType = "query", dataTypeClass = SysRole.class)
    @Log(title = "角色管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:role:export')")
    @PostMapping(value = "/export")
    public AjaxResult<String> export(SysRole role) {
        List<SysRole> list = this.roleService.selectRoleList(role);
        return new ExcelUtil<>(SysRole.class).exportExcel(list, "角色数据");
    }

    /**
     * 角色导出角色导出(流形式)"
     *
     * @param role     角色
     * @param response 返回
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "角色导出(流形式)")
    @Log(title = "角色管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:role:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void responseStream(SysRole role, HttpServletResponse response) {
        new ExcelUtil<>(SysRole.class).exportExcel(response, this.roleService.selectRoleList(role), "角色数据");
    }

    /**
     * 根据角色编号获取详细信息
     *
     * @param roleId 角色id
     * @return 角色对象
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "根据角色编号获取详情")
    @ApiImplicitParam(name = "roleId", value = "角色数组", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:role:query')")
    @GetMapping(value = "/{roleId}")
    public AjaxResult<SysRole> getInfo(@PathVariable Long roleId) {
        return AjaxResult.success(this.roleService.selectRoleById(roleId));
    }

    /**
     * 新增角色
     *
     * @param role 角色对象
     * @return 结果
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "新增角色")
    @PreAuthorize("@ss.hasPermi('system:role:add')")
    @Log(title = "角色管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysRole role) {
        if (UserConstants.NOT_UNIQUE.equals(this.roleService.checkRoleNameUnique(role))) {
            return AjaxResult.error("新增角色'" + role.getRoleName() + "'失败，角色名称已存在");
        } else if (UserConstants.NOT_UNIQUE.equals(this.roleService.checkRoleKeyUnique(role))) {
            return AjaxResult.error("新增角色'" + role.getRoleName() + "'失败，角色权限已存在");
        }
        role.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.roleService.insertRole(role));
    }

    /**
     * 修改角色
     *
     * @param role 角色对象
     * @return 结果
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "修改角色")
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysRole role) {
        this.roleService.checkRoleAllowed(role);
        if (UserConstants.NOT_UNIQUE.equals(this.roleService.checkRoleNameUnique(role))) {
            return AjaxResult.error("修改角色'" + role.getRoleName() + "'失败，角色名称已存在");
        } else if (UserConstants.NOT_UNIQUE.equals(this.roleService.checkRoleKeyUnique(role))) {
            return AjaxResult.error("修改角色'" + role.getRoleName() + "'失败，角色权限已存在");
        }
        role.setUpdateBy(SecurityUtils.getUsername());

        if (this.roleService.updateRole(role) > 0) {
            // 更新缓存用户权限
            LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());
            if (StringUtils.isNotNull(loginUser.getUser()) && !loginUser.getUser().isAdmin()) {
                loginUser.setPermissions(permissionService.getMenuPermission(loginUser.getUser()));
                loginUser.setUser(userService.selectUserByUserName(loginUser.getUser().getUserName()));
                tokenService.setLoginUser(loginUser);
            }
            return AjaxResult.success();
        }
        return AjaxResult.error("修改角色'" + role.getRoleName() + "'失败，请联系管理员");
    }

    /**
     * 修改保存数据权限
     *
     * @param role 角色对象
     * @return 结果
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "角色数据权限保存")
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.UPDATE)
    @PutMapping("/dataScope")
    public AjaxResult<String> dataScope(@RequestBody SysRole role) {
        this.roleService.checkRoleAllowed(role);
        return toAjax(this.roleService.authDataScope(role));
    }

    /**
     * 角色状态修改
     *
     * @param role 角色对象
     * @return 结果
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "角色状态修改")
    @PreAuthorize("@ss.hasPermi('system:role:edit')")
    @Log(title = "角色管理", businessType = BusinessType.UPDATE)
    @PutMapping("/changeStatus")
    public AjaxResult<String> changeStatus(@RequestBody SysRole role) {
        this.roleService.checkRoleAllowed(role);
        role.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.roleService.updateRoleStatus(role));
    }

    /**
     * 批量删除角色
     *
     * @param roleIds 角色ID数组
     * @return 结果
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "批量删除角色")
    @ApiImplicitParam(name = "roleIds", value = "角色ID数组", dataTypeClass = Long.class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:role:remove')")
    @Log(title = "角色管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{roleIds}")
    public AjaxResult<String> remove(@PathVariable Long[] roleIds) {
        return toAjax(this.roleService.deleteRoleByIds(roleIds));
    }

    /**
     * 获取角色选择框列表
     *
     * @return 角色选择框列表
     */
    @ApiOperationSupport(order = 10)
    @ApiOperation(value = "获取角色选择框列表")
    @PreAuthorize("@ss.hasPermi('system:role:query')")
    @GetMapping("/optionselect")
    public AjaxResult<List<SysRole>> optionSelect() {
        return AjaxResult.success(this.roleService.selectRoleAll());
    }
}
