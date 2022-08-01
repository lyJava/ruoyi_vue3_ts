package com.ruoyi.common.utils.file;

/**
 * 媒体类型工具类
 *
 * @author ruoyi
 */
public class MimeTypeUtils {

    /**
     * 图片——PNG
     */
    public static final String IMAGE_PNG = "image/png";

    /**
     * 图片——JPG
     */
    public static final String IMAGE_JPG = "image/jpg";

    /**
     * 图片——JPEG
     */
    public static final String IMAGE_JPEG = "image/jpeg";

    /**
     * 图片——BMP
     */
    public static final String IMAGE_BMP = "image/bmp";

    /**
     * 图片——GIF
     */
    public static final String IMAGE_GIF = "image/gif";

    /**
     * 图片mime类型数组
     */
    public static final String[] IMAGE_EXTENSION = {"bmp", "gif", "jpg", "jpeg", "png"};

    /**
     * flash的mime类型数组
     */
    public static final String[] FLASH_EXTENSION = {"swf", "flv"};

    /**
     * media的mime类型数组
     */
    public static final String[] MEDIA_EXTENSION = {"swf", "flv", "mp3", "wav", "wma", "wmv", "mid", "avi", "mpg", "asf", "rm", "rmvb"};

    /**
     * mp4的mime类型数组
     */
    public static final String[] VIDEO_EXTENSION = {"mp4", "avi", "rmvb"};

    /**
     * 图片格式、文档格式、压缩文件格式、视频格式与pdf等数组
     */
    public static final String[] DEFAULT_ALLOWED_EXTENSION = {
            // 图片
            "bmp", "gif", "jpg", "jpeg", "png",
            // word excel powerpoint
            "doc", "docx", "xls", "xlsx", "ppt", "pptx", "html", "htm", "txt",
            // 压缩文件
            "rar", "zip", "gz", "bz2",
            // 视频格式
            "mp4", "avi", "rmvb",
            // pdf
            "pdf"};

    public static String getExtension(String prefix) {
        switch (prefix) {
            case IMAGE_PNG:
                return "png";
            case IMAGE_JPG:
                return "jpg";
            case IMAGE_JPEG:
                return "jpeg";
            case IMAGE_BMP:
                return "bmp";
            case IMAGE_GIF:
                return "gif";
            default:
                return "";
        }
    }
}
