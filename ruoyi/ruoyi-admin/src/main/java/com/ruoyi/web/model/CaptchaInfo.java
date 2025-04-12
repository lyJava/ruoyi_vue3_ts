package com.ruoyi.web.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * 验证码信息
 */
@ApiModel(value = "验证码信息")
public class CaptchaInfo implements Serializable {

    @ApiModelProperty(value = "验证码base64")
    private String img;

    @ApiModelProperty(value = "验证码uuid")
    private String uuid;

    public CaptchaInfo() {
    }

    public CaptchaInfo(String img, String uuid) {
        this.img = img;
        this.uuid = uuid;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
