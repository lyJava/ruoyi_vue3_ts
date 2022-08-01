package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.domain.SysPost;
import com.ruoyi.system.service.ISysPostService;
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
 * 岗位信息操作处理
 *
 * @author ruoyi
 */
@ApiSort(value = 100)
@Api(tags = "岗位信息控制器")
@RestController
@RequestMapping(value = "/system/post", produces = MediaType.APPLICATION_JSON_VALUE)
public class SysPostController extends BaseController {

    @Resource
    ISysPostService postService;

    /**
     * 获取岗位列表
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "获取岗位列表")
    @PreAuthorize("@ss.hasPermi('system:post:list')")
    @GetMapping(value = "/list")
    public TableDataInfo<List<SysPost>> list(SysPost post) {
        startPage();
        List<SysPost> list = this.postService.selectPostList(post);
        return getDataTable(list);
    }

    /**
     * 岗位导出
     *
     * @param post
     * @return
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "岗位导出")
    @Log(title = "岗位管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:post:export')")
    @GetMapping(value = "/export")
    public AjaxResult<String> export(SysPost post) {
        List<SysPost> list = postService.selectPostList(post);
        ExcelUtil<SysPost> util = new ExcelUtil<>(SysPost.class);
        return util.exportExcel(list, "岗位数据");
    }

    /**
     * 岗位导出(流形式)
     *
     * @param post     岗位对象
     * @param response 返回
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "岗位导出(流形式)")
    @Log(title = "岗位管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:post:export')")
    @PostMapping(value = "/exportByStream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void export(SysPost post, HttpServletResponse response) {
        new ExcelUtil<>(SysPost.class).exportExcel(response, this.postService.selectPostList(post), "岗位数据");
    }

    /**
     * 根据岗位编号获取详细信息
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "根据岗位编号获取详情")
    @ApiImplicitParam(name = "postId", value = "岗位编号", paramType = "path", dataTypeClass = Long.class, required = true)
    @PreAuthorize("@ss.hasPermi('system:post:query')")
    @GetMapping(value = "/{postId}")
    public AjaxResult<SysPost> getInfo(@PathVariable Long postId) {
        return AjaxResult.success(postService.selectPostById(postId));
    }

    /**
     * 新增岗位
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "新增岗位")
    @PreAuthorize("@ss.hasPermi('system:post:add')")
    @Log(title = "岗位管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult<String> add(@Validated @RequestBody SysPost post) {
        if (UserConstants.NOT_UNIQUE.equals(postService.checkPostNameUnique(post))) {
            return AjaxResult.error("新增岗位'" + post.getPostName() + "'失败，岗位名称已存在");
        } else if (UserConstants.NOT_UNIQUE.equals(postService.checkPostCodeUnique(post))) {
            return AjaxResult.error("新增岗位'" + post.getPostName() + "'失败，岗位编码已存在");
        }
        post.setCreateBy(SecurityUtils.getUsername());
        return toAjax(postService.insertPost(post));
    }

    /**
     * 修改岗位
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "修改岗位")
    @PreAuthorize("@ss.hasPermi('system:post:edit')")
    @Log(title = "岗位管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> edit(@Validated @RequestBody SysPost post) {
        if (UserConstants.NOT_UNIQUE.equals(postService.checkPostNameUnique(post))) {
            return AjaxResult.error("修改岗位'" + post.getPostName() + "'失败，岗位名称已存在");
        } else if (UserConstants.NOT_UNIQUE.equals(postService.checkPostCodeUnique(post))) {
            return AjaxResult.error("修改岗位'" + post.getPostName() + "'失败，岗位编码已存在");
        }
        post.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(postService.updatePost(post));
    }

    /**
     * 删除岗位
     */
    @ApiOperationSupport(order = 6)
    @ApiOperation(value = "删除岗位")
    @ApiImplicitParam(name = "postIds", value = "岗位ID数组", paramType = "path", dataTypeClass = Long[].class, allowMultiple = true, required = true)
    @PreAuthorize("@ss.hasPermi('system:post:remove')")
    @Log(title = "岗位管理", businessType = BusinessType.DELETE)
    @DeleteMapping(value = "/{postIds}")
    public AjaxResult<String> remove(@PathVariable Long[] postIds) {
        return toAjax(postService.deletePostByIds(postIds));
    }

    /**
     * 获取岗位选择框列表
     */
    @ApiOperationSupport(order = 7)
    @ApiOperation(value = "获取岗位选择框列表")
    @GetMapping(value = "/optionselect")
    public AjaxResult<List<SysPost>> optionSelect() {
        List<SysPost> posts = postService.selectPostAll();
        return AjaxResult.success(this.postService.selectPostAll());
    }
}
