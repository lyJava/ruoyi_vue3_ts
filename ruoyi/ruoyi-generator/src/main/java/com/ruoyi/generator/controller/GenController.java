package com.ruoyi.generator.controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.core.text.Convert;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.generator.domain.GenTable;
import com.ruoyi.generator.domain.GenTableColumn;
import com.ruoyi.generator.service.IGenTableColumnService;
import com.ruoyi.generator.service.IGenTableService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 代码生成 操作处理
 *
 * @author ruoyi
 */
@ApiSort(value = 560)
@Api(tags = "代码生成控制器")
@RestController
@RequestMapping("/tool/gen")
public class GenController extends BaseController {

    @Resource
    IGenTableService genTableService;

    @Resource
    IGenTableColumnService genTableColumnService;

    /**
     * 查询代码生成列表
     *
     * @param genTable 生成对象
     * @return 分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "查询代码生成分页数据")
    @ApiImplicitParam(name = "genTable", value = "生成对象", dataTypeClass = GenTable.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('tool:gen:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<GenTable>> genList(GenTable genTable) {
        StopWatch watch = new StopWatch();
        watch.start("分页查询");
        startPage();
        final List<GenTable> tableList = this.genTableService.selectGenTableList(genTable);
        final TableDataInfo<List<GenTable>> dataTable = getDataTable(tableList);
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataTable;
    }

    /**
     * 修改代码生成业务
     *
     * @param id 生成ID
     * @return 结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "通过ID获取相关信息")
    @ApiImplicitParam(name = "id", value = "生成ID", dataTypeClass = Long.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult<Map<String, Object>> getInfo(@PathVariable Long id) {
        StopWatch watch = new StopWatch();
        watch.start("通过ID获取相关信息");
        Map<String, Object> map = new HashMap<>(3);

        final GenTable table = this.genTableService.selectGenTableById(id);
        final List<GenTable> tables = this.genTableService.selectGenTableAll();
        final List<GenTableColumn> list = this.genTableColumnService.selectGenTableColumnListByTableId(id);

        map.put("info", table);
        map.put("rows", list);
        map.put("tables", tables);
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(map);
    }

    /**
     * 查询数据库列表
     *
     * @param genTable 生成表对象
     * @return 分页数据
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "查询数据库列表分页数据")
    @ApiImplicitParam(name = "genTable", value = "生成对象", dataTypeClass = GenTable.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('tool:gen:list')")
    @GetMapping(value = "/db/list")
    public TableDataInfo<List<GenTable>> dataList(GenTable genTable) {
        StopWatch watch = new StopWatch();
        watch.start("查询数据库列表分页");
        startPage();
        final List<GenTable> tableList = this.genTableService.selectDbTableList(genTable);
        final TableDataInfo<List<GenTable>> dataTable = getDataTable(tableList);
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataTable;
    }

    /**
     * 通过ID查询数据表字段列表
     *
     * @param id 生成对象ID
     * @return 表格数据
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "通过ID查询数据表字段列表分页数据")
    @ApiImplicitParam(name = "id", value = "生成对象", dataTypeClass = Long.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:list')")
    @GetMapping(value = "/column/{id}")
    public TableDataInfo<List<GenTableColumn>> columnList(@PathVariable Long id) {
        final List<GenTableColumn> list = this.genTableColumnService.selectGenTableColumnListByTableId(id);
        return new TableDataInfo<>(list, list.size());
    }

    /**
     * 导入表结构（保存）
     *
     * @param tables 表名
     * @return 结果
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "导入表结构（保存）")
    @ApiImplicitParam(name = "tables", value = "表名", dataTypeClass = String.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('tool:gen:list')")
    @Log(title = "代码生成", businessType = BusinessType.IMPORT)
    @PostMapping(value = "/importTable")
    public AjaxResult<String> importTableSave(String tables) {
        String[] tableNames = Convert.toStrArray(tables);
        // 查询表信息
        List<GenTable> tableList = this.genTableService.selectDbTableListByNames(tableNames);
        this.genTableService.importGenTable(tableList);
        return AjaxResult.success();
    }

    /**
     * 修改保存代码生成业务
     *
     * @param genTable 生成表格对象
     * @return 结果
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "修改保存代码生成业务")
    @PreAuthorize("@ss.hasPermi('tool:gen:edit')")
    @Log(title = "代码生成", businessType = BusinessType.UPDATE)
    @PutMapping(value = "/edit")
    public AjaxResult<String> editSave(@Validated @RequestBody GenTable genTable) {
        StopWatch watch = new StopWatch();
        watch.start("修改保存");
        this.genTableService.validateEdit(genTable);
        this.genTableService.updateGenTable(genTable);
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success();
    }

    /**
     * 删除代码生成
     *
     * @param tableIds 表格ID数组
     * @return 结果
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "删除代码生成")
    @ApiImplicitParam(name = "tableIds", value = "表格ID数组", dataTypeClass = Long.class, allowMultiple = true, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:remove')")
    @Log(title = "代码生成", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{tableIds}")
    public AjaxResult<String> remove(@PathVariable Long[] tableIds) {
        this.genTableService.deleteGenTableByIds(tableIds);
        return AjaxResult.success();
    }

    /**
     * 预览代码
     *
     * @param tableId 表ID
     * @return 结果
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "预览代码")
    @ApiImplicitParam(name = "tableId", value = "表ID", dataTypeClass = Long.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:preview')")
    @GetMapping(value = "/preview/{tableId}")
    public AjaxResult<Map<String, String>> preview(@PathVariable("tableId") Long tableId) {
        StopWatch watch = new StopWatch();
        watch.start("预览");
        final AjaxResult<Map<String, String>> result = AjaxResult.success(this.genTableService.previewCode(tableId));
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return result;
    }

    /**
     * 生成代码（下载方式）
     *
     * @param tableName 表名
     * @param response  返回
     */
    @ApiOperationSupport(order = 9)
    @ApiOperation(value = "生成代码（下载方式）")
    @ApiImplicitParam(name = "tableName", value = "表名", dataTypeClass = String.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:code')")
    @Log(title = "代码生成", businessType = BusinessType.GENCODE)
    @GetMapping(value = "/download/{tableName}")
    public void download(@PathVariable("tableName") String tableName, HttpServletResponse response) {
        StopWatch watch = new StopWatch();
        watch.start("代码下载");
        byte[] data = this.genTableService.downloadCode(tableName);
        genCode(data, response);
        watch.stop();
        logger.info("代码生成【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
    }

    /**
     * 生成代码（自定义路径）
     *
     * @param tableName 表名
     * @return 结果
     */
    @ApiOperationSupport(order = 10)
    @ApiOperation(value = "生成代码（自定义路径）")
    @ApiImplicitParam(name = "tableName", value = "表名", dataTypeClass = String.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:code')")
    @Log(title = "代码生成", businessType = BusinessType.GENCODE)
    @GetMapping(value = "/genCode/{tableName}")
    public AjaxResult<String> genCode(@PathVariable("tableName") String tableName) {
        this.genTableService.generatorCode(tableName);
        return AjaxResult.success();
    }

    /**
     * 同步数据库
     *
     * @param tableName 表名
     * @return 结果
     */
    @ApiOperationSupport(order = 11)
    @ApiOperation(value = "同步数据库")
    @ApiImplicitParam(name = "tableName", value = "表名", dataTypeClass = String.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('tool:gen:edit')")
    @Log(title = "代码生成", businessType = BusinessType.UPDATE)
    @GetMapping(value = "/synchDb/{tableName}")
    public AjaxResult<String> syanchDb(@PathVariable("tableName") String tableName) {
        this.genTableService.synchDb(tableName);
        return AjaxResult.success();
    }

    /**
     * 批量生成代码
     *
     * @param tables   表格
     * @param response 返回
     */
    @ApiOperationSupport(order = 12)
    @ApiOperation(value = "批量生成代码")
    @ApiImplicitParam(name = "tables", value = "表名", dataTypeClass = String.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('tool:gen:code')")
    @Log(title = "代码生成", businessType = BusinessType.GENCODE)
    @GetMapping(value = "/batchGenCode", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void batchGenCode(String tables, HttpServletResponse response) {
        String[] tableNames = Convert.toStrArray(tables);
        byte[] data = this.genTableService.downloadCode(Arrays.stream(tableNames).collect(Collectors.toSet()));
        this.genCode(data, response);
    }

    /**
     * 生成zip文件
     */
    private void genCode(byte[] data, HttpServletResponse response) {
        response.reset();
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        response.setHeader("Content-Disposition", "attachment; filename=\"ruoyi-" + System.currentTimeMillis() + ".zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");
        try (OutputStream outputStream = response.getOutputStream()) {
            IOUtils.write(data, outputStream);
            outputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 修改swagger/excel注释或者vue版本
     *
     * @param str    注释或者版本
     * @param id     主键ID
     * @param status 状态或版本值
     * @return 结果
     */
    @ApiOperationSupport(order = 15)
    @ApiOperation(value = "修改swagger/excel注释或者vue版本")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "str", value = "注释或者版本", dataTypeClass = String.class, paramType = "path", required = true),
            @ApiImplicitParam(name = "id", value = "主键ID", dataTypeClass = Long.class, paramType = "path", required = true),
            @ApiImplicitParam(name = "status", value = "状态或版本值", dataTypeClass = Integer.class, paramType = "path", required = true)
    })
    @GetMapping("/change/{str}/{id}/{status}")
    public AjaxResult<String> changeStatusOrVersion(@PathVariable String str, @PathVariable Long id, @PathVariable Integer status) {
        int count = this.genTableService.updateStatusOrVersion(str, id, status);
        return count > 0 ? AjaxResult.success("修改成功") : AjaxResult.error("修改失败");
    }

}