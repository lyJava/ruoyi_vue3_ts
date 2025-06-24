package com.ruoyi.common.enums;


/**
 * 验证码类型枚举
 */
public enum CaptchaType {

    MATH("math"),
    CHAR("char");

    private final String value;

    CaptchaType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
