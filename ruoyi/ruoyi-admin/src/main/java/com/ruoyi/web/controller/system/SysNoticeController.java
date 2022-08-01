package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.system.domain.SysNotice;
import com.ruoyi.system.service.ISysNoticeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 公告 信息操作处理
 *
 * @author ruoyi
 */
@ApiSort(value = 90)
@Api(tags = "公告操作控制器")
@RestController
@RequestMapping(value = "/system/notice", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysNoticeController extends BaseController {

    @Resource
    ISysNoticeService noticeService;

    /**
     * 获取通知公告列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取通知公告列表")
    @PreAuthorize("@ss.hasPermi('system:notice:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysNotice>> list(SysNotice notice) {
        startPage();
        List<SysNotice> list = this.noticeService.selectNoticeList(notice);
        return getDataTable(list);
    }

    /**
     * 根据通知公告编号获取详细信息
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "获取岗位列表")
    @ApiImplicitParam(name = "noticeId", value = "公告ID", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:notice:query')")
    @GetMapping(value = "/{noticeId}")
    public AjaxResult<SysNotice> getInfo(@PathVariable Long noticeId) {
        return AjaxResult.success(this.noticeService.selectNoticeById(noticeId));
    }

    /**
     * 新增通知公告
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "新增通知公告")
    @PreAuthorize("@ss.hasPermi('system:notice:add')")
    @Log(title = "通知公告", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysNotice notice) {
        notice.setCreateBy(SecurityUtils.getUsername());
        return toAjax(this.noticeService.insertNotice(notice));
    }

    /**
     * 修改通知公告
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "修改通知公告")
    @PreAuthorize("@ss.hasPermi('system:notice:edit')")
    @Log(title = "通知公告", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysNotice notice) {
        notice.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(this.noticeService.updateNotice(notice));
    }

    /**
     * 删除通知公告
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "删除通知公告")
    @ApiImplicitParam(name = "noticeIds", value = "公告ID数组", dataTypeClass = Long.class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:notice:remove')")
    @Log(title = "通知公告", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{noticeIds}")
    public AjaxResult<String> remove(@PathVariable Long[] noticeIds) {
        return toAjax(this.noticeService.deleteNoticeByIds(noticeIds));
    }
}
