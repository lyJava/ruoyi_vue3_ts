package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.TreeSelect;
import com.ruoyi.common.core.domain.entity.SysMenu;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.core.domain.model.response.RoleMenuTreeSelect;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.service.ISysMenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 菜单信息
 *
 * @author ruoyi
 */
@ApiSort(value = 80)
@Api(tags = "菜单信息控制器")
@RestController
@RequestMapping(value = "/system/menu", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysMenuController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(SysMenuController.class);

    @Resource
    ISysMenuService menuService;

    @Resource
    TokenService tokenService;

    /**
     * 获取菜单列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取菜单列表")
    @PreAuthorize("@ss.hasPermi('system:menu:list')")
    @GetMapping(value = "/list")
    public AjaxResult<List<SysMenu>> list(SysMenu menu, HttpServletRequest request) {
        StopWatch watch = new StopWatch();
        watch.start("菜单列表");
        final LoginUser loginUser = this.tokenService.getLoginUser(request);
        final Long userId = loginUser.getUser().getUserId();
        final List<SysMenu> menus = this.menuService.selectMenuList(menu, userId);
        watch.stop();
        log.info("获取【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(menus);
    }

    /**
     * 获取菜单列表
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "获取菜单分页列表")
    @GetMapping(value = "/page")
    public AjaxResult<TableDataInfo<List<SysMenu>>> pageData(SysMenu menu, HttpServletRequest request) {
        StopWatch watch = new StopWatch();
        watch.start("菜单分页列表");
        final LoginUser loginUser = this.tokenService.getLoginUser(request);
        final Long userId = loginUser.getUser().getUserId();
        startPage();
        final List<SysMenu> menus = this.menuService.selectMenuList(menu, userId);
        final TableDataInfo<List<SysMenu>> dataTable = getDataTable(menus);
        watch.stop();
        log.info("获取【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(dataTable);
    }

    /**
     * 根据菜单编号获取详细信息
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "获取菜单详细信息")
    @ApiImplicitParam(name = "menuId", value = "菜单ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:menu:query')")
    @GetMapping(value = "/{menuId}")
    public AjaxResult<SysMenu> getInfo(@PathVariable Long menuId) {
        return AjaxResult.success(this.menuService.selectMenuById(menuId));
    }

    /**
     * 获取菜单下拉树列表
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "获取菜单下拉树列表")
    @GetMapping("/treeselect")
    public AjaxResult<List<TreeSelect>> treeselect(SysMenu menu, HttpServletRequest request) {
        LoginUser loginUser = this.tokenService.getLoginUser(request);
        Long userId = loginUser.getUser().getUserId();
        List<SysMenu> menus = this.menuService.selectMenuList(menu, userId);
        return AjaxResult.success(this.menuService.buildMenuTreeSelect(menus));
    }

    /**
     * 加载对应角色菜单列表树
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "加载对应角色菜单列表树")
    @ApiImplicitParam(name = "roleId", value = "角色ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @GetMapping(value = "/roleMenuTreeSelect/{roleId}")
    public AjaxResult<RoleMenuTreeSelect> roleMenuTreeSelect(@PathVariable("roleId") Long roleId, HttpServletRequest request) {
        LoginUser loginUser = this.tokenService.getLoginUser(request);
        List<SysMenu> menus = this.menuService.selectMenuList(loginUser.getUser().getUserId());
        RoleMenuTreeSelect treeSelect = new RoleMenuTreeSelect();
        treeSelect.setCheckedKeys(this.menuService.selectMenuListByRoleId(roleId));
        treeSelect.setMenus(this.menuService.buildMenuTreeSelect(menus));
        return AjaxResult.success(treeSelect);
    }

    /**
     * 新增菜单
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "新增菜单")
    @PreAuthorize("@ss.hasPermi('system:menu:add')")
    @Log(title = "菜单管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysMenu menu) {
        if (UserConstants.NOT_UNIQUE.equals(this.menuService.checkMenuNameUnique(menu))) {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，菜单名称已存在");
        } else if (UserConstants.YES_FRAME.equals(menu.getIsFrame())
                && !StringUtils.startsWithAny(menu.getPath(), Constants.HTTP, Constants.HTTPS)) {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，地址必须以http(s)://开头");
        }
        menu.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.menuService.insertMenu(menu));
    }

    /**
     * 修改菜单
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "修改菜单")
    @PreAuthorize("@ss.hasPermi('system:menu:edit')")
    @Log(title = "菜单管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysMenu menu) {
        if (UserConstants.NOT_UNIQUE.equals(this.menuService.checkMenuNameUnique(menu))) {
            return AjaxResult.error("修改菜单'" + menu.getMenuName() + "'失败，菜单名称已存在");
        } else if (UserConstants.YES_FRAME.equals(menu.getIsFrame())
                && !StringUtils.startsWithAny(menu.getPath(), Constants.HTTP, Constants.HTTPS)) {
            return AjaxResult.error("修改菜单'" + menu.getMenuName() + "'失败，地址必须以http(s)://开头");
        } else if (menu.getMenuId().equals(menu.getParentId())) {
            return AjaxResult.error("修改菜单'" + menu.getMenuName() + "'失败，上级菜单不能选择自己");
        }
        menu.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.menuService.updateMenu(menu));
    }

    /**
     * 删除菜单
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "删除菜单")
    @ApiImplicitParam(name = "menuId", value = "菜单ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:menu:remove')")
    @Log(title = "菜单管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{menuId}")
    public AjaxResult<String> remove(@PathVariable("menuId") Long menuId) {
        if (this.menuService.hasChildByMenuId(menuId)) {
            return AjaxResult.error("存在子菜单,不允许删除");
        }
        if (this.menuService.checkMenuExistRole(menuId)) {
            return AjaxResult.error("菜单已分配,不允许删除");
        }
        return toAjax(this.menuService.deleteMenuById(menuId));
    }

    /**
     * 批量删除菜单
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "批量删除菜单")
    @ApiImplicitParam(name = "ids", value = "菜单ID数组", paramType = "path", dataTypeClass = List.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:menu:remove')")
    @Log(title = "菜单管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/batchDel/{ids}")
    public AjaxResult<String> batchRemove(@PathVariable("ids") List<Long> ids) {
        if (CollectionUtils.isNotEmpty(ids)) {
            for (Long menuId : ids) {
                if (this.menuService.hasChildByMenuId(menuId)) {
                    return AjaxResult.error("存在子菜单,不允许删除");
                }
                if (this.menuService.checkMenuExistRole(menuId)) {
                    return AjaxResult.error("菜单已分配,不允许删除");
                }
            }
        }
        return toAjax(this.menuService.deleteByIds(ids));
    }
}