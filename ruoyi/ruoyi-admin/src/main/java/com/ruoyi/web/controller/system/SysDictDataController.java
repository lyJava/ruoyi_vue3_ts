package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysDictData;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.service.ISysDictDataService;
import com.ruoyi.system.service.ISysDictTypeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 数据字典信息
 *
 * @author ruoyi
 */
@ApiSort(value = 50)
@Api(tags = "数据字典信息")
@RestController
@RequestMapping("/system/dict/data")
public class SysDictDataController extends BaseController {

    @Resource
    ISysDictDataService dictDataService;

    @Resource
    ISysDictTypeService dictTypeService;

    /**
     * 字典类型列表
     *
     * @param dictData 字典对象
     * @return
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "字典类型列表")
    @PreAuthorize("@ss.hasPermi('system:dict:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysDictData>> list(SysDictData dictData) {
        startPage();
        final List<SysDictData> list = this.dictDataService.selectDictDataList(dictData);
        return getDataTable(list);
    }

    /**
     * 字典类型导出
     *
     * @param dictData 字典对象
     * @return
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "字典类型导出")
    @Log(title = "字典数据", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:dict:export')")
    @GetMapping("/export")
    public AjaxResult<String> export(SysDictData dictData) {
        final List<SysDictData> list = this.dictDataService.selectDictDataList(dictData);
        ExcelUtil<SysDictData> util = new ExcelUtil<>(SysDictData.class);
        return util.exportExcel(list, "字典数据");
    }

    /**
     * 字典类型导出(返回流)
     *
     * @param dictData 字典对象
     * @return 流
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "字典类型导出(返回流)")
    @Log(title = "字典数据", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:dict:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportByStream(SysDictData dictData, HttpServletResponse response) {
        new ExcelUtil<>(SysDictData.class).exportExcel(response, this.dictDataService.selectDictDataList(dictData), "字典数据");
    }

    /**
     * 根据编码查询字典详情
     *
     * @param dictCode 字典编码
     * @return
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "根据编码查询字典详情")
    @ApiImplicitParam(name = "dictCode", value = "字典编码", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:query')")
    @GetMapping(value = "/{dictCode}")
    public AjaxResult<SysDictData> getInfo(@PathVariable Long dictCode) {
        return AjaxResult.success(this.dictDataService.selectDictDataById(dictCode));
    }

    /**
     * 根据字典类型查询字典数据信息
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "根据类型查询字典详情")
    @ApiImplicitParam(name = "dictType", value = "字典类型", paramType = "path", dataTypeClass = String.class, required = true)
    @GetMapping(value = "/type/{dictType}")
    public AjaxResult<List<SysDictData>> dictType(@PathVariable String dictType) {
        List<SysDictData> dictDataList = this.dictTypeService.selectDictDataByType(dictType);
        return AjaxResult.success(CollectionUtils.isEmpty(dictDataList) ? Collections.emptyList() : dictDataList);
    }

    /**
     * 新增字典类型
     *
     * @param dict 字典对象
     * @return
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "新增字典类型")
    @PreAuthorize("@ss.hasPermi('system:dict:add')")
    @Log(title = "字典数据", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysDictData dict) {
        dict.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.dictDataService.insertDictData(dict));
    }

    /**
     * 修改保存字典类型
     *
     * @param dict 字典对象
     * @return
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "修改字典类型")
    @PreAuthorize("@ss.hasPermi('system:dict:edit')")
    @Log(title = "字典数据", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysDictData dict) {
        dict.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.dictDataService.updateDictData(dict));
    }

    /**
     * 删除字典类型
     *
     * @param dictCodes 字典ID数组
     * @return
     */
    @ApiOperationSupport(order = 10)
    @ApiOperation(value = "删除字典类型")
    @ApiImplicitParam(name = "dictCodes", value = "数据字典ID数组", paramType = "path", dataTypeClass = Long.class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:dict:remove')")
    @Log(title = "字典类型", businessType = BusinessType.DELETE)
    @DeleteMapping("/{dictCodes}")
    public AjaxResult<String> remove(@PathVariable Long[] dictCodes) {
        return toAjax(this.dictDataService.deleteDictDataByIds(dictCodes));
    }
}
