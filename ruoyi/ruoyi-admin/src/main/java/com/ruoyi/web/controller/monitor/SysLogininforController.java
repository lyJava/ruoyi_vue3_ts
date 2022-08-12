package com.ruoyi.web.controller.monitor;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.RelativeDateUtils;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.SysLoginInfo;
import com.ruoyi.system.service.ISysLoginInfoService;
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
 * 登录日志控制器
 *
 * @author ruoyi
 */
@ApiSort(value = 520)
@Api(tags = "登录日志控制器")
@RestController
@RequestMapping(value = "/monitor/logininfor", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysLogininforController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(SysLogininforController.class);

    @Resource
    ISysLoginInfoService logininforService;

    /**
     * 登录日志分页数据
     *
     * @param info 日志对象
     * @return 日志分页数据
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "登录日志列表")
    @ApiImplicitParam(name = "info", value = "日志对象", paramType = "query", dataTypeClass = SysLoginInfo.class)
    @PreAuthorize("@ss.hasPermi('monitor:logininfor:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysLoginInfo>> list(SysLoginInfo info) {
        StopWatch watch = new StopWatch();
        watch.start("登录日志分页查询");
        startPage();
        final TableDataInfo<List<SysLoginInfo>> dataInfo = getDataTable(this.logininforService.selectLoginInfoList(info));
        watch.stop();
        log.info("登录日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return dataInfo;
    }

    /**
     * 导出登录信息
     *
     * @param loginInfo 日志对象
     * @return 结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "导出登录日志")
    @Log(title = "登录日志", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('monitor:logininfor:export')")
    @GetMapping(value = "/export")
    public AjaxResult<String> export(SysLoginInfo loginInfo) {
        StopWatch watch = new StopWatch();
        watch.start("导出登录日志");
        List<SysLoginInfo> list = this.logininforService.selectLoginInfoList(loginInfo);
        ExcelUtil<SysLoginInfo> util = new ExcelUtil<>(SysLoginInfo.class);
        final AjaxResult<String> result = util.exportExcel(list, "登录日志");
        watch.stop();
        log.info("登录日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return result;
    }

    /**
     * 导出登录日志(流方式)
     *
     * @param loginInfo 日志对象
     * @param response  返回
     */
    @ApiOperation(value = "导出登录日志(流方式)")
    @Log(title = "登录日志", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('monitor:logininfor:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportByStream(SysLoginInfo loginInfo, HttpServletResponse response) {
        StopWatch watch = new StopWatch();
        watch.start("导出(流方式)");
        new ExcelUtil<>(SysLoginInfo.class).exportExcel(response, this.logininforService.selectLoginInfoList(loginInfo), "登录日志");
        watch.stop();
        log.info("登录日志【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
    }

    /**
     * 登录日志删除
     *
     * @param ids 日志ID数组
     * @return 结果
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "登录日志删除")
    @ApiImplicitParam(name = "ids", value = "日志ID数组", paramType = "path", allowMultiple = true, required = true)
    @Log(title = "登录日志", businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermi('monitor:logininfor:remove')")
    @DeleteMapping(value = "/{ids}")
    public AjaxResult<String> remove(@PathVariable Long[] ids) {
        return toAjax(this.logininforService.deleteLoginInfoByIds(ids));
    }

    /**
     * 登录日志清空
     *
     * @return 结果
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "登录日志清空")
    @Log(title = "登录日志", businessType = BusinessType.CLEAN)
    @PreAuthorize("@ss.hasPermi('monitor:logininfor:remove')")
    @DeleteMapping(value = "/clean")
    public AjaxResult<String> clean() {
        this.logininforService.cleanLoginInfo();
        return AjaxResult.success();
    }

    /**
     * 最后登录时间
     *
     * @return 结果
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "最后登录时间")
    @GetMapping(value = "/lastLogin")
    public AjaxResult<String> lastLogin() {
        final String username = SecurityUtils.getUsername();
        SysLoginInfo loginInfo = new SysLoginInfo();
        loginInfo.setUserName(username);
        loginInfo.setStatus("0");
        loginInfo.setMsg("登录成功");
        String loginTime = this.logininforService.selectLastLoginByUserName(loginInfo);
        final String format = RelativeDateUtils.format(RelativeDateUtils.strToDate(loginTime, "yyyy-MM-dd HH:mm:ss"));
        return AjaxResult.success(200, format);
    }

}
