package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysDictData;
import com.ruoyi.common.core.domain.entity.SysDictType;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.service.ISysDictTypeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * 数据字典信息
 *
 * @author ruoyi
 */
@ApiSort(value = 60)
@Api(tags = "数据字典类型信息控制器")
@RestController
@RequestMapping("/system/dict/type")
public class SysDictTypeController extends BaseController {

    @Resource
    ISysDictTypeService dictTypeService;

    /**
     * 数据字典类分页数据
     *
     * @param dictType 字典类型对象
     * @return 分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "数据字典类分页数据")
    @PreAuthorize("@ss.hasPermi('system:dict:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysDictData>> list(SysDictType dictType) {
        startPage();
        List<SysDictType> list = this.dictTypeService.selectDictTypeList(dictType);
        return getDataTable(list);
    }

    /**
     * 查询字典类型详细导出
     */
    @ApiOperationSupport(order = 2)
    @Log(title = "字典类型", businessType = BusinessType.EXPORT)
    @ApiImplicitParam(name = "dictType", value = "字典类型对象", paramType = "query", dataTypeClass = SysDictType.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:export')")
    @GetMapping("/export")
    public AjaxResult<String> export(SysDictType dictType) {
        List<SysDictType> list = this.dictTypeService.selectDictTypeList(dictType);
        ExcelUtil<SysDictType> util = new ExcelUtil<>(SysDictType.class);
        return util.exportExcel(list, "字典类型");
    }


    /**
     * 查询字典类型详细导出(返回流)
     *
     * @param dictType 字典类型对象
     * @param response 返回
     */
    @ApiOperation(value = "查询字典类型详细导出(返回流)")
    @Log(title = "字典类型", businessType = BusinessType.EXPORT)
    @ApiImplicitParam(name = "dictType", value = "字典类型对象", paramType = "query", dataTypeClass = SysDictType.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportByStream(SysDictType dictType, HttpServletResponse response) {
        new ExcelUtil<>(SysDictType.class).exportExcel(response, this.dictTypeService.selectDictTypeList(dictType), "字典类型");
    }

    /**
     * 查询字典类型详细
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "字典类型列表")
    @ApiImplicitParam(name = "id", value = "字典类型ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult<SysDictType> getInfo(@PathVariable Long id) {
        return AjaxResult.success(this.dictTypeService.selectDictTypeById(id));
    }

    /**
     * 新增字典类型
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "新增字典类型")
    @ApiImplicitParam(name = "dictType", value = "字典类型对象", paramType = "query", dataTypeClass = SysDictType.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:add')")
    @Log(title = "字典类型", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysDictType dictType) {
        if (UserConstants.NOT_UNIQUE.equals(this.dictTypeService.checkDictTypeUnique(dictType))) {
            return AjaxResult.error("新增字典'" + dictType.getDictName() + "'失败，字典类型已存在");
        }
        dictType.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.dictTypeService.insertDictType(dictType));
    }

    /**
     * 修改字典类型
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "修改字典类型")
    @ApiImplicitParam(name = "dict", value = "字典类型对象", paramType = "query", dataTypeClass = SysDictType.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:edit')")
    @Log(title = "字典类型", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysDictType dictType) {
        if (UserConstants.NOT_UNIQUE.equals(this.dictTypeService.checkDictTypeUnique(dictType))) {
            return AjaxResult.error("修改字典'" + dictType.getDictName() + "'失败，字典类型已存在");
        }
        dictType.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.dictTypeService.updateDictType(dictType));
    }

    /**
     * 删除字典类型
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "删除字典类型")
    @ApiImplicitParam(name = "ids", value = "字典类型ID数组", paramType = "path", dataTypeClass = Long.class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:remove')")
    @Log(title = "字典类型", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{ids}")
    public AjaxResult<String> remove(@PathVariable Long[] ids) {
        return toAjax(this.dictTypeService.deleteDictTypeByIds(ids));
    }

    /**
     * 清空缓存
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "字典类型清空缓存")
    @PreAuthorize("@ss.hasPermi('system:dict:remove')")
    @Log(title = "字典类型", businessType = BusinessType.CLEAN)
    @DeleteMapping(value = "/clearCache")
    public AjaxResult<String> clearCache() {
        this.dictTypeService.clearCache();
        return AjaxResult.success();
    }

    /**
     * 获取字典选择框列表
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "获取字典选择框列表")
    @GetMapping(value = "/optionselect")
    public AjaxResult<List<SysDictType>> optionSelect() {
        final List<SysDictType> dictTypes = this.dictTypeService.selectDictTypeAll();
        return AjaxResult.success(CollectionUtils.isEmpty(dictTypes) ? Collections.emptyList() : dictTypes);
    }


    /**
     * 修改字典类型状态
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "修改字典类型状态")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "字典类型ID", paramType = "path", dataTypeClass = Long.class, required = true),
            @ApiImplicitParam(name = "status", value = "字典类型状态", paramType = "path", dataTypeClass = String.class, required = true)
    })
    @GetMapping(value = "/status/{id}/{status}")
    public AjaxResult<String> updateStatus(@PathVariable Long id, @PathVariable String status) {
        AjaxResult<String> ajaxResult;
        SysDictType dictType = new SysDictType();
        dictType.setDictId(id);
        dictType.setStatus(status);
        dictType.setUpdateBy(SecurityUtils.getUsername());
        dictType.setUpdateTime(LocalDateTime.now());
        final int count = this.dictTypeService.updateByPrimaryKeySelective(dictType);
        if (count > 0) {
            ajaxResult = AjaxResult.success(StringUtils.equals("1", status) ? "停用成功！" : "启用成功！");
        } else {
            ajaxResult = AjaxResult.success("状态修改失败！");
        }
        return ajaxResult;
    }

}
