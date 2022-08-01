package com.ruoyi.quartz.controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.quartz.domain.SysJobLog;
import com.ruoyi.quartz.service.ISysJobLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 调度日志操作处理
 *
 * @author ruoyi
 */
@Api(tags = "调度日志控制器")
@ApiSort(value = 550)
@RestController
@RequestMapping("/monitor/jobLog")
public class SysJobLogController extends BaseController {

    @Resource
    ISysJobLogService jobLogService;

    /**
     * 查询定时任务调度日志列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "定时任务调度日志分页数据")
    @ApiImplicitParam(name = "sysJobLog" , value = "日志对象" , dataTypeClass = SysJobLog.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('monitor:job:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysJobLog>> list(SysJobLog sysJobLog) {
        StopWatch watch = new StopWatch();
        watch.start("调度日志分页查询");
        startPage();
        final TableDataInfo<List<SysJobLog>> dataTable = getDataTable(this.jobLogService.selectJobLogList(sysJobLog));
        watch.stop();
        logger.info("调度日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataTable;
    }

    /**
     * 导出定时任务调度日志列表
     *
     * @param sysJobLog 日志对象
     * @return 结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "导出定时任务调度日志数据")
    @ApiImplicitParam(name = "sysJobLog" , value = "日志对象" , dataTypeClass = SysJobLog.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('monitor:job:export')")
    @Log(title = "任务调度日志" , businessType = BusinessType.EXPORT)
    @GetMapping(value = "/export")
    public AjaxResult<String> export(SysJobLog sysJobLog) {
        List<SysJobLog> list = this.jobLogService.selectJobLogList(sysJobLog);
        ExcelUtil<SysJobLog> util = new ExcelUtil<>(SysJobLog.class);
        return util.exportExcel(list, "调度日志");
    }

    /**
     * 导出定时任务调度日志列表(返回流)
     *
     * @param sysJobLog 日志对象
     * @param response  返回
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "导出定时任务调度日志(返回流)")
    @ApiImplicitParam(name = "sysJobLog" , value = "日志对象" , dataTypeClass = SysJobLog.class, paramType = "query")
    @PreAuthorize("@ss.hasPermi('monitor:job:export')")
    @Log(title = "任务调度日志" , businessType = BusinessType.EXPORT)
    @PostMapping(value = "/exportByStream" , produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportStream(SysJobLog sysJobLog, HttpServletResponse response) {
        StopWatch watch = new StopWatch();
        watch.start("导出(返回流)");
        new ExcelUtil<>(SysJobLog.class).exportExcel(response, this.jobLogService.selectJobLogList(sysJobLog), "调度日志");
        watch.stop();
        logger.info("调度日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
    }

    /**
     * 根据调度编号获取详细信息
     *
     * @param id 调度编号
     * @return 结果
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "根据调度编号获取详细信息")
    @ApiImplicitParam(name = "id" , value = "调度编号" , dataTypeClass = Long.class, paramType = "path")
    @PreAuthorize("@ss.hasPermi('monitor:job:query')")
    @GetMapping(value = "/{id}")
    public AjaxResult<SysJobLog> getInfo(@PathVariable Long id) {
        return AjaxResult.success(this.jobLogService.selectJobLogById(id));
    }


    /**
     * 删除定时任务调度日志
     *
     * @param ids 调度编号数组
     * @return 结果
     */
    @ApiOperationSupport(order = 5)
    @ApiImplicitParam(name = "id" , value = "调度编号" , dataTypeClass = Long.class, allowMultiple = true, paramType = "path")
    @PreAuthorize("@ss.hasPermi('monitor:job:remove')")
    @Log(title = "定时任务调度日志" , businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{ids}")
    public AjaxResult<String> remove(@PathVariable Long[] ids) {
        return toAjax(this.jobLogService.deleteJobLogByIds(ids));
    }

    /**
     * 清空定时任务调度日志
     *
     * @return 结果
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "清空定时任务调度日志")
    @PreAuthorize("@ss.hasPermi('monitor:job:remove')")
    @Log(title = "调度日志" , businessType = BusinessType.CLEAN)
    @DeleteMapping(value = "/clean")
    public AjaxResult<String> clean() {
        this.jobLogService.cleanJobLog();
        return AjaxResult.success();
    }

}
