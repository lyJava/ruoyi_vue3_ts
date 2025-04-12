package com.ruoyi.web.controller.monitor;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.SysOperLog;
import com.ruoyi.system.service.ISysOperLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 操作日志控制器
 *
 * @author ruoyi
 */
@ApiSort(value = 530)
@Api(tags = "操作日志控制器")
@RestController
@RequestMapping(value = "/monitor/operlog", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysOperlogController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(SysOperlogController.class);

    @Resource
    ISysOperLogService logService;

    /**
     * 操作日志分页数据
     *
     * @param operation 操作日志对象
     * @return 分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "操作日志分页数据")
    @ApiImplicitParam(name = "operation", value = "操作日志对象", dataTypeClass = SysOperLog.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('monitor:operlog:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysOperLog>> list(SysOperLog operation) {
        StopWatch watch = new StopWatch();
        watch.start("操作日志分页");
        startPage();
        final TableDataInfo<List<SysOperLog>> dataTable = getDataTable(this.logService.selectOperLogList(operation));
        watch.stop();
        log.info("操作日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataTable;
    }

    /**
     * 操作日志导出
     *
     * @param operation 操作日志对象
     * @return 结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "操作日志导出")
    @Log(title = "操作日志", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('monitor:operlog:export')")
    @GetMapping(value = "/export")
    public AjaxResult<String> export(SysOperLog operation) {
        return new ExcelUtil<>(SysOperLog.class).exportExcel(this.logService.selectOperLogList(operation), "操作日志");
    }

    /**
     * 操作日志导出(流形式)
     *
     * @param operation 日志对象
     * @param response  返回
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "操作日志导出(流形式)")
    @Log(title = "操作日志", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('monitor:operlog:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportByStream(SysOperLog operation, HttpServletResponse response) {
        StopWatch watch = new StopWatch();
        watch.start("导出(流形式)");
        new ExcelUtil<>(SysOperLog.class).exportExcel(response, this.logService.selectOperLogList(operation), "操作日志");
        watch.stop();
        log.info("操作日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
    }

    /**
     * 操作日志删除
     *
     * @param ids 操作日志ID数组
     * @return 结果
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "操作日志删除")
    @ApiImplicitParam(name = "ids", value = "操作日志ID数组", paramType = "path", allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('monitor:operlog:remove')")
    @DeleteMapping("/{ids}")
    public AjaxResult<String> remove(@PathVariable Long[] ids) {
        return toAjax(this.logService.deleteOperLogByIds(ids));
    }

    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "操作日志清除")
    @Log(title = "操作日志", businessType = BusinessType.CLEAN)
    @PreAuthorize("@ss.hasPermi('monitor:operlog:remove')")
    @DeleteMapping("/clean")
    public AjaxResult<String> clean() {
        this.logService.cleanOperLog();
        return AjaxResult.success();
    }
}
