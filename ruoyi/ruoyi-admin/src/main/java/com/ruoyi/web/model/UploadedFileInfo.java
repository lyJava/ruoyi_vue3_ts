package com.ruoyi.web.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;


/**
 * 上传成功返回文件信息
 */
@ApiModel(value = "上传成功返回文件信息")
public class UploadedFileInfo implements Serializable {

    /**
     * 文件名
     */
    @ApiModelProperty(value = "文件名")
    private String fileName;

    /**
     * 访问URL
     */
    @ApiModelProperty(value = "访问URL")
    private String url;

    public UploadedFileInfo() {
    }

    public UploadedFileInfo(String fileName, String url) {
        this.fileName = fileName;
        this.url = url;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
