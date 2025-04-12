package com.ruoyi.web.controller.common;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.file.FileUploadUtils;
import com.ruoyi.common.utils.file.FileUtils;
import com.ruoyi.framework.config.ServerConfig;
import com.ruoyi.web.model.UploadedFileInfo;
import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * 通用请求处理
 *
 * @author ruoyi
 */
@ApiSort(value = 10)
@Api(tags = "通用请求处理控制器")
@RestController
public class CommonController {

    private static final Logger log = LoggerFactory.getLogger(CommonController.class);

    @Resource
    ServerConfig serverConfig;

    /**
     * 通用下载请求
     *
     * @param fileName 文件名称
     * @param delete   是否删除
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "通用下载请求")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "fileName", value = "文件名称", paramType = "query", dataTypeClass = String.class),
            @ApiImplicitParam(name = "delete", value = "是否删除", paramType = "query", dataTypeClass = Boolean.class)
    })
    @ApiResponse(code = 200, message = "下载成功")
    @GetMapping(value = "/common/download")
    public void fileDownload(String fileName, Boolean delete, HttpServletResponse response, HttpServletRequest request) {
        StopWatch watch = new StopWatch();
        watch.start("下载");
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        try {
            if (!FileUtils.checkAllowDownload(fileName)) {
                throw new Exception(StringUtils.format("文件名称({})非法，不允许下载。 ", fileName));
            }
            String realFileName = System.currentTimeMillis() + fileName.substring(fileName.indexOf("_") + 1);
            String filePath = RuoYiConfig.getDownloadPath() + fileName;

            FileUtils.setAttachmentResponseHeader(response, realFileName);
            FileUtils.writeBytes(filePath, response.getOutputStream());
            if (delete) {
                FileUtils.deleteFile(filePath);
            }
            watch.stop();
            log.info("通用请求【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        } catch (Exception e) {
            log.error("下载文件失败", e);
        }
    }

    /**
     * 通用上传请求
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "通用上传请求")
    @ApiImplicitParam(name = "file", value = "上传文件", paramType = "form", dataType = "MultipartFile", dataTypeClass = MultipartFile.class)
    @ApiResponse(code = 200, message = "上传成功")
    @PostMapping(value = "/common/upload")
    public AjaxResult<UploadedFileInfo> uploadFile(@RequestPart("file") MultipartFile file) {
        StopWatch watch = new StopWatch();
        watch.start("上传");
        try {
            // 上传文件路径
            String filePath = RuoYiConfig.getProfile();
            // 上传并返回新文件名称
            String fileName = FileUploadUtils.upload(filePath, file);
            String url = serverConfig.getUrl() + fileName;
            watch.stop();
            log.info("通用请求【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
            return AjaxResult.success(new UploadedFileInfo(fileName, url));
        } catch (Exception e) {
            log.error("通用上传异常", e);
            return AjaxResult.error(e.getMessage());
        }
    }

    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "通用删除请求")
    @ApiImplicitParam(name = "name", value = "删除文件", paramType = "query", dataType = "string")
    @ApiResponse(code = 200, message = "删除成功")
    @RequestMapping(value = "/common/delete", method = {RequestMethod.GET, RequestMethod.POST})
    public AjaxResult<String> deleteFile(@RequestParam("name") String name) throws IOException {
        FileUploadUtils.delete(RuoYiConfig.getProfile(), name);
        return AjaxResult.success(name + "删除成功");
    }

    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "通用批量删除请求")
    @ApiResponse(code = 200, message = "批量删除成功")
    @PostMapping(value = "/common/batchDelete")
    public AjaxResult<String> deleteFiles(@RequestBody List<String> files) {
        FileUploadUtils.deleteFiles(RuoYiConfig.getProfile(), files);
        return AjaxResult.success(files + "批量删除成功");
    }

    /**
     * 本地资源通用下载
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation(value = "本地资源通用下载")
    @ApiImplicitParam(name = "resource", value = "资源参数", paramType = "query", dataTypeClass = String.class, required = true)
    @GetMapping(value = "/common/download/resource", produces = "application/octet-stream")
    public void resourceDownload(String resource, HttpServletResponse response) {
        StopWatch watch = new StopWatch();
        watch.start("本地资源下载");
        try {
            if (!FileUtils.checkAllowDownload(resource)) {
                throw new Exception(StringUtils.format("资源文件({})非法，不允许下载。 ", resource));
            }
            // 本地资源路径
            String localPath = RuoYiConfig.getProfile();
            // 数据库资源地址
            String downloadPath = localPath + StringUtils.substringAfter(resource, Constants.RESOURCE_PREFIX);
            // 下载名称
            String downloadName = StringUtils.substringAfterLast(downloadPath, "/");
            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            FileUtils.setAttachmentResponseHeader(response, downloadName);
            FileUtils.writeBytes(downloadPath, response.getOutputStream());
            watch.stop();
            log.info("通用请求【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        } catch (Exception e) {
            log.error("下载文件失败", e);
        }
    }
}
