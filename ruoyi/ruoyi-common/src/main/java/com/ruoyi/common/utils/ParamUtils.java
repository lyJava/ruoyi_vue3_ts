package com.ruoyi.common.utils;

import org.apache.commons.collections4.MapUtils;

import java.util.Map;

/**
 * 参数工具类
 *
 * @author liyang
 * @date 2022-07-30 23:30
 */
public class ParamUtils {

    /**
     * 日期查询增加时间
     *
     * @param param     参数
     * @param beginTime 开始时间
     * @param endTime   结束时间
     */
    public static void appendTimeStr(Map<String, Object> param, String beginTime, String endTime) {
        if (MapUtils.isNotEmpty(param)) {
            if ((StringUtils.isBlank(beginTime) && StringUtils.isBlank(endTime))) {
                if (String.valueOf(param.get("beginTime")).length() <= 10) {
                    param.put("beginTime", param.get("beginTime") + " 00:00:00");
                    param.put("endTime", param.get("endTime") + " 23:59:59");
                }
            } else {
                if (String.valueOf(param.get(beginTime)).length() <= 10) {
                    param.put(beginTime, param.get(beginTime) + " 00:00:00");
                    param.put(beginTime, param.get(beginTime) + " 23:59:59");
                }
            }
        }
    }



}
