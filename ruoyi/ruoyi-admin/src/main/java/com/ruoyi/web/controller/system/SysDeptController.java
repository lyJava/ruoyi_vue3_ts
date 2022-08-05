package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.TreeSelect;
import com.ruoyi.common.core.domain.entity.SysDept;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.service.ISysDeptService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 部门信息
 *
 * @author ruoyi
 */
@ApiSort(value = 40)
@Api(tags = "部门信息控制器")
@RestController
@RequestMapping(value = "/system/dept", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class SysDeptController extends BaseController {

    @Resource
    ISysDeptService deptService;

    /**
     * 获取部门列表
     *
     * @return 部门列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取部门列表")
    @PreAuthorize("@ss.hasPermi('system:dept:list')")
    @GetMapping(value = "/list")
    public AjaxResult<List<SysDept>> list(SysDept dept) {
        final List<SysDept> sysDeptList = this.deptService.selectDeptList(dept);
        return AjaxResult.success(sysDeptList);
    }

    /**
     * 获取部门分页列表
     *
     * @return 部门分页列表
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "获取部门分页列表")
    @PreAuthorize("@ss.hasPermi('system:dept:list')")
    @GetMapping(value = "/page")
    public AjaxResult<TableDataInfo<List<SysDept>>> page(SysDept dept, HttpServletRequest request) {
        startPage();
        final List<SysDept> sysDeptList = this.deptService.selectDeptList(dept);
        return AjaxResult.success(getDataTable(sysDeptList));
    }

    /**
     * 查询部门列表（排除节点）
     *
     * @param deptId 部门ID
     * @return 部门列表
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "查询部门列表（排除节点）")
    @ApiImplicitParam(name = "deptId", value = "部门ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dept:list')")
    @GetMapping(value = "/list/exclude/{deptId}")
    public AjaxResult<List<SysDept>> excludeChild(@PathVariable(value = "deptId", required = false) Long deptId) {
        List<SysDept> deptList = this.deptService.selectDeptList(new SysDept());
        deptList.removeIf(d -> d.getDeptId().intValue() == deptId
                || ArrayUtils.contains(StringUtils.split(d.getAncestors(), ","), deptId + ""));
        return AjaxResult.success(CollectionUtils.isEmpty(deptList) ? Collections.emptyList() : deptList);
    }

    /**
     * 根据部门编号获取详细信息
     *
     * @param deptId 部门编号
     * @return 部门对象
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "根据部门编号获取详细信息")
    @ApiImplicitParam(name = "deptId", value = "部门编号", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dept:query')")
    @GetMapping(value = "/{deptId}")
    public AjaxResult<SysDept> getInfo(@PathVariable Long deptId) {
        return AjaxResult.success(this.deptService.selectDeptById(deptId));
    }

    /**
     * 获取部门下拉树列表
     *
     * @param dept 部门对象
     * @return 部门下拉树列表
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "获取部门下拉树列表")
    @GetMapping(value = "/treeselect")
    public AjaxResult<List<TreeSelect>> treeSelect(SysDept dept) {
        List<SysDept> deptList = this.deptService.selectDeptList(dept);
        return AjaxResult.success(this.deptService.buildDeptTreeSelect(deptList));
    }

    /**
     * 加载对应角色部门列表树
     *
     * @param roleId 角色ID
     * @return 列表树
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "加载对应角色部门列表树")
    @GetMapping(value = "/roleDeptTreeselect/{roleId}")
    public AjaxResult<Map<String, Object>> roleDeptTreeSelect(@PathVariable("roleId") Long roleId) {
        List<SysDept> depts = this.deptService.selectDeptList(new SysDept());
        Map<String, Object> map = new HashMap<>(2);
        map.put("checkedKeys", this.deptService.selectDeptListByRoleId(roleId));
        map.put("depts", this.deptService.buildDeptTreeSelect(depts));
        return AjaxResult.success(map);
    }

    /**
     * 新增部门
     *
     * @param dept 部门对象
     * @return 结果
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "新增部门")
    @PreAuthorize("@ss.hasPermi('system:dept:add')")
    @Log(title = "部门管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysDept dept) {
        if (UserConstants.NOT_UNIQUE.equals(this.deptService.checkDeptNameUnique(dept))) {
            return AjaxResult.error("新增部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        }
        dept.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.deptService.insertDept(dept));
    }

    /**
     * 修改
     *
     * @param dept 部门对象
     * @return 结果
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "修改部门")
    @PreAuthorize("@ss.hasPermi('system:dept:edit')")
    @Log(title = "部门管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysDept dept) {
        if (UserConstants.NOT_UNIQUE.equals(this.deptService.checkDeptNameUnique(dept))) {
            return AjaxResult.error("修改部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        } else if (dept.getParentId().equals(dept.getDeptId())) {
            return AjaxResult.error("修改部门'" + dept.getDeptName() + "'失败，上级部门不能是自己");
        } else if (StringUtils.equals(UserConstants.DEPT_DISABLE, dept.getStatus())
                && this.deptService.selectNormalChildrenDeptById(dept.getDeptId()) > 0) {
            return AjaxResult.error("该部门包含未停用的子部门！");
        }
        dept.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.deptService.updateDept(dept));
    }

    /**
     * 删除部门
     *
     * @param deptId 部门ID
     * @return 结果
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "删除部门")
    @ApiImplicitParam(name = "deptId", value = "部门ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dept:remove')")
    @Log(title = "部门管理", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{deptId}")
    public AjaxResult<String> remove(@PathVariable Long deptId) {
        if (this.deptService.hasChildByDeptId(deptId)) {
            return AjaxResult.error("存在下级部门,不允许删除");
        }
        if (this.deptService.checkDeptExistUser(deptId)) {
            return AjaxResult.error("部门存在用户,不允许删除");
        }
        return toAjax(this.deptService.deleteDeptById(deptId));
    }

    /**
     * 批量删除部门
     *
     * @param deptIds 部门ID数组
     * @return 结果
     */
    @ApiOperationSupport(order = 10)
    @ApiOperation(value = "批量删除部门")
    @ApiImplicitParam(name = "deptIds", value = "部门ID数组", paramType = "path", dataTypeClass = List.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dept:remove')")
    @Log(title = "部门管理", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/batchDel/{deptIds}")
    public AjaxResult<String> batchRemove(@PathVariable List<Long> deptIds) {
        if (CollectionUtils.isNotEmpty(deptIds)) {
            for (Long deptId : deptIds) {
                if (this.deptService.hasChildByDeptId(deptId)) {
                    return AjaxResult.error("存在下级部门,不允许删除");
                }
                if (this.deptService.checkDeptExistUser(deptId)) {
                    return AjaxResult.error("部门存在用户,不允许删除");
                }
            }
        }
        return toAjax(this.deptService.batchDeleteDeptByIds(deptIds));
    }

}
