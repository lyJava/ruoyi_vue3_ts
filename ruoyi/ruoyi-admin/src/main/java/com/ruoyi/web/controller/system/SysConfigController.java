package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.annotation.RepeatSubmit;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.SysConfig;
import com.ruoyi.system.service.ISysConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 参数配置 信息操作处理
 *
 * @author ruoyi
 */
@ApiSort(value = 30)
@Api(tags = "参数配置")
@RestController
@RequestMapping("/system/config")
public class SysConfigController extends BaseController {

    @Resource
    ISysConfigService configService;

    /**
     * 获取参数配置列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取参数配置列表")
    @PreAuthorize("@ss.hasPermi('system:config:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysConfig>> list(SysConfig config) {
        startPage();
        final List<SysConfig> list = this.configService.selectConfigList(config);
        return getDataTable(list);
    }

    /**
     * 参数导出
     *
     * @param config 参数对象
     * @return 结果
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "参数管理")
    @Log(title = "参数管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:config:export')")
    @GetMapping(value = "/export")
    public AjaxResult<String> export(SysConfig config) {
        final List<SysConfig> list = this.configService.selectConfigList(config);
        ExcelUtil<SysConfig> util = new ExcelUtil<>(SysConfig.class);
        return util.exportExcel(list, "参数数据");
    }

    /**
     * 参数导出(返回流)
     *
     * @param config 参数对象
     */
    @ApiOperation(value = "参数管理导出(返回流)")
    @Log(title = "参数管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:config:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportStream(SysConfig config, HttpServletResponse response) {
        new ExcelUtil<>(SysConfig.class).exportExcel(response, this.configService.selectConfigList(config), "参数数据");
    }

    /**
     * 根据参数编号获取详细信息
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "根据编号获取详细信息")
    @ApiImplicitParam(name = "configId", value = "编号", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:config:query')")
    @GetMapping(value = "/{configId}")
    public AjaxResult<SysConfig> getInfo(@PathVariable Long configId) {
        return AjaxResult.success(this.configService.selectConfigById(configId));
    }

    /**
     * 根据参数键名查询参数值
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "根据参数键名查询参数值")
    @ApiImplicitParam(name = "configKey", value = "参数键名", paramType = "path", dataTypeClass = Long.class, required = true)
    @GetMapping(value = "/configKey/{configKey}")
    public AjaxResult<String> getConfigKey(@PathVariable String configKey) {
        return AjaxResult.success(this.configService.selectConfigByKey(configKey));
    }

    /**
     * 新增参数配置
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "新增参数配置")
    @PreAuthorize("@ss.hasPermi('system:config:add')")
    @Log(title = "参数管理", businessType = BusinessType.INSERT)
    @PostMapping
    @RepeatSubmit
    public AjaxResult<String> add(@Validated @RequestBody SysConfig config) {
        if (UserConstants.NOT_UNIQUE.equals(this.configService.checkConfigKeyUnique(config))) {
            return AjaxResult.error("新增参数'" + config.getConfigName() + "'失败，参数键名已存在");
        }
        config.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.configService.insertConfig(config));
    }

    /**
     * 修改参数配置
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "修改参数配置")
    @PreAuthorize("@ss.hasPermi('system:config:edit')")
    @Log(title = "参数管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysConfig config) {
        if (UserConstants.NOT_UNIQUE.equals(this.configService.checkConfigKeyUnique(config))) {
            return AjaxResult.error("修改参数'" + config.getConfigName() + "'失败，参数键名已存在");
        }
        config.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.configService.updateConfig(config));
    }

    /**
     * 删除参数配置
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "删除参数配置")
    @PreAuthorize("@ss.hasPermi('system:config:remove')")
    @ApiImplicitParam(name = "configIds", value = "参数ID数据", paramType = "path", dataTypeClass = Long[].class, required = true)
    @Log(title = "参数管理", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{configIds}")
    public AjaxResult<String> remove(@PathVariable Long[] configIds) {
        return toAjax(this.configService.deleteConfigByIds(configIds));
    }

    /**
     * 清空缓存
     */
    @ApiOperationSupport(order = 8)
    @ApiOperation(value = "清空缓存")
    @PreAuthorize("@ss.hasPermi('system:config:remove')")
    @Log(title = "参数管理", businessType = BusinessType.CLEAN)
    @DeleteMapping(value = "/clearCache")
    public AjaxResult<String> clearCache() {
        this.configService.resetConfigCache();
        return AjaxResult.success();
    }
}
