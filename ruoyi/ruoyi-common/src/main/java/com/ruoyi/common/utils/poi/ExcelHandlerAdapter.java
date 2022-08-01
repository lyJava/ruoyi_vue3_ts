package com.ruoyi.common.utils.poi;

/**
 * @author liyang
 * @date 2022-07-10 17:21
 */
public interface ExcelHandlerAdapter {

    /**
     * 格式化
     *
     * @param value 单元格数据值
     * @param args  excel注解args参数组
     * @return 处理后的值
     */
    Object format(Object value, String[] args);

}
