package com.ruoyi.common.utils.file;

import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.exception.file.FileNameLengthLimitExceededException;
import com.ruoyi.common.exception.file.FileSizeLimitExceededException;
import com.ruoyi.common.exception.file.InvalidExtensionException;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.uuid.Seq;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 文件上传工具类
 *
 * @author ruoyi
 */
public class FileUploadUtils {

    private static final Logger log = LoggerFactory.getLogger(FileUploadUtils.class);


    // 固定大小线程池 (适用于常规场景)
    private static final ExecutorService FIXED_POOL = Executors.newFixedThreadPool(5);
    /**
     * 默认大小 50M
     */
    public static final long DEFAULT_MAX_SIZE = 50 * 1024 * 1024;

    /**
     * 默认的文件名最大长度 100
     */
    public static final int DEFAULT_FILE_NAME_LENGTH = 100;

    /**
     * 默认上传的地址
     */
    private static String defaultBaseDir = RuoYiConfig.getProfile();

    public static void setDefaultBaseDir(String defaultBaseDir) {
        FileUploadUtils.defaultBaseDir = defaultBaseDir;
    }

    public static String getDefaultBaseDir() {
        return defaultBaseDir;
    }

    /**
     * 以默认配置进行文件上传
     *
     * @param file 上传的文件
     * @return 文件名称
     * @throws Exception
     */
    public static String upload(MultipartFile file) throws IOException {
        try {
            return upload(getDefaultBaseDir(), file, MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION);
        } catch (Exception e) {
            throw new IOException(e.getMessage(), e);
        }
    }

    /**
     * 根据文件路径上传
     *
     * @param baseDir 相对应用的基目录
     * @param file    上传的文件
     * @return 文件名称
     * @throws IOException
     */
    public static String upload(String baseDir, MultipartFile file) throws IOException {
        try {
            return upload(baseDir, file, MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION);
        } catch (Exception e) {
            throw new IOException(e.getMessage(), e);
        }
    }

    /**
     * 文件上传
     *
     * @param baseDir          相对应用的基目录
     * @param file             上传的文件
     * @param allowedExtension 上传文件类型
     * @return 返回上传成功的文件名
     * @throws FileSizeLimitExceededException       如果超出最大大小
     * @throws FileNameLengthLimitExceededException 文件名太长
     * @throws IOException                          比如读写文件出错时
     * @throws InvalidExtensionException            文件校验异常
     */
    public static String upload(String baseDir, MultipartFile file, String[] allowedExtension)
            throws FileSizeLimitExceededException, IOException, FileNameLengthLimitExceededException,
            InvalidExtensionException {
        log.info("通用上传文件baseDir==={}", baseDir);
        int fileNameLength = Objects.requireNonNull(file.getOriginalFilename()).length();
        if (fileNameLength > FileUploadUtils.DEFAULT_FILE_NAME_LENGTH) {
            throw new FileNameLengthLimitExceededException(FileUploadUtils.DEFAULT_FILE_NAME_LENGTH);
        }

        assertAllowed(file, allowedExtension);

        String fileName = extractFilename(file);

        String absPath = getAbsoluteFile(baseDir, fileName).getAbsolutePath();
        log.info("通用上传文件absPath==={}", absPath);
        file.transferTo(Paths.get(absPath));
        String pathFileName = getPathFileName(baseDir, fileName);
        log.info("通用上传文件pathFileName==={}", pathFileName);
        return pathFileName;
    }

    public static void delete(String baseDir, String fileName) throws IOException {
        String absolutePath = getAbsoluteFile(baseDir, extractFilename(fileName)).getAbsolutePath();
        FileUtils.delete(FileUtils.getFile(absolutePath));
        log.info("文件==={}删除成功", absolutePath);
    }


    public static CompletableFuture<Void> deleteFiles(String baseDir, List<String> list) {
        if (CollectionUtils.isEmpty(list)) {
            return CompletableFuture.completedFuture(null);
        }
        /*ExecutorService executor = Executors.newFixedThreadPool(10);

        return CompletableFuture.allOf(list.stream()
                        .map(fileName -> CompletableFuture.runAsync(() -> {
                            try {
                                delete(baseDir, fileName);
                            } catch (IOException e) {
                                throw new CompletionException(e);
                            }
                        }, executor)).toArray(CompletableFuture[]::new))
                .exceptionally(e -> {
                    if (e.getCause() instanceof IOException) {
                        throw new CompletionException(e.getCause());
                    }
                    throw new CompletionException(new IOException("删除失败", e));
                })
                .whenComplete((result, e) -> executor.shutdown());*/

        // 使用并行流创建异步任务,合并所有任务并处理异常
        return CompletableFuture.allOf(list.parallelStream()
                        .map(fileName -> CompletableFuture.runAsync(
                                () -> deleteFileSafely(baseDir, fileName),
                                FIXED_POOL
                        )).toArray(CompletableFuture[]::new))
                .exceptionally(ex -> {
                    handleAsyncException(ex);
                    return null;
                });
    }

    private static void deleteFileSafely(String baseDir, String fileName) {
        Path absolutePath = null;
        try {
            Path dirPath = Paths.get(baseDir).normalize().toAbsolutePath();
            if (!Files.isDirectory(dirPath)) {
                log.error("目录不存在: {}", dirPath);
                throw new IOException("Invalid directory: " + dirPath);
            }

            absolutePath = Paths.get(getAbsoluteFile(baseDir, extractFilename(fileName)).getAbsolutePath());

            if (!Files.exists(absolutePath)) {
                log.warn("文件不存在: {}", absolutePath);
                // throw new FileNotFoundException("file not found in directory: " + absolutePath);
                return;
            }

            boolean deleted = Files.deleteIfExists(absolutePath);
            log.info(deleted ? "成功删除文件: {}" : "文件未被删除（可能已被其他进程删除）: {}", absolutePath);
        } catch (IOException e) {
            log.error("删除文件失败: {} | 原因: {}", absolutePath, e.getMessage());
            throw new CompletionException("无法删除文件: " + fileName, e);
        }
    }


    private static void handleAsyncException(Throwable ex) {
        Throwable rootCause = ex instanceof CompletionException ? ex.getCause() : ex;
        if (rootCause instanceof IOException) {
            log.error("File deletion error", rootCause);
        } else {
            log.error("Unexpected error", rootCause);
        }
        // 可扩展：将异常传递给上层或进行其他处理
        throw new CompletionException(rootCause);
    }

    public static String extractFilename(String originalFilename) {
        return StringUtils.format("{}/{}.{}", DateUtils.datePath(), FilenameUtils.getBaseName(originalFilename), FilenameUtils.getExtension(originalFilename));
    }

    /**
     * 编码文件名
     */
    public static String extractFilename(MultipartFile file) {
        return StringUtils.format("{}/{}_{}.{}", DateUtils.datePath(),
                FilenameUtils.getBaseName(file.getOriginalFilename()), Seq.getId(Seq.uploadSeqType), getExtension(file));
    }

    public static File getAbsoluteFile(String uploadDir, String fileName) throws IOException {
        File desc = new File(uploadDir + File.separator + fileName);

        if (!desc.exists()) {
            if (!desc.getParentFile().exists()) {
                desc.getParentFile().mkdirs();
            }
        }
        return desc;
    }

    public static String getPathFileName(String uploadDir, String fileName) throws IOException {
        int dirLastIndex = RuoYiConfig.getProfile().length() + 1;
        String currentDir = StringUtils.substring(uploadDir, dirLastIndex);
        return Constants.RESOURCE_PREFIX + "/" + currentDir + "/" + fileName;
    }

    /**
     * 文件大小校验
     *
     * @param file 上传的文件
     * @return
     * @throws FileSizeLimitExceededException 如果超出最大大小
     * @throws InvalidExtensionException
     */
    public static void assertAllowed(MultipartFile file, String[] allowedExtension)
            throws FileSizeLimitExceededException, InvalidExtensionException {
        long size = file.getSize();
        if (size > DEFAULT_MAX_SIZE) {
            throw new FileSizeLimitExceededException(DEFAULT_MAX_SIZE / 1024 / 1024);
        }

        String fileName = file.getOriginalFilename();
        String extension = getExtension(file);
        if (allowedExtension != null && !isAllowedExtension(extension, allowedExtension)) {
            if (allowedExtension == MimeTypeUtils.IMAGE_EXTENSION) {
                throw new InvalidExtensionException.InvalidImageExtensionException(allowedExtension, extension,
                        fileName);
            } else if (allowedExtension == MimeTypeUtils.FLASH_EXTENSION) {
                throw new InvalidExtensionException.InvalidFlashExtensionException(allowedExtension, extension,
                        fileName);
            } else if (allowedExtension == MimeTypeUtils.MEDIA_EXTENSION) {
                throw new InvalidExtensionException.InvalidMediaExtensionException(allowedExtension, extension,
                        fileName);
            } else if (allowedExtension == MimeTypeUtils.VIDEO_EXTENSION) {
                throw new InvalidExtensionException.InvalidVideoExtensionException(allowedExtension, extension,
                        fileName);
            } else {
                throw new InvalidExtensionException(allowedExtension, extension, fileName);
            }
        }
    }

    /**
     * 判断MIME类型是否是允许的MIME类型
     *
     * @param extension
     * @param allowedExtension
     * @return
     */
    public static boolean isAllowedExtension(String extension, String[] allowedExtension) {
        for (String str : allowedExtension) {
            if (str.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取文件名的后缀
     *
     * @param file 表单文件
     * @return 后缀名
     */
    public static String getExtension(MultipartFile file) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (StringUtils.isEmpty(extension)) {
            extension = MimeTypeUtils.getExtension(Objects.requireNonNull(file.getContentType()));
        }
        return extension;
    }
}
