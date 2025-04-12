package com.ruoyi.web.controller.common;

import cn.hutool.core.util.IdUtil;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.google.code.kaptcha.Producer;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.utils.sign.Base64;
import com.ruoyi.common.utils.uuid.IdUtils;
import com.ruoyi.web.model.CaptchaInfo;
import com.wf.captcha.ArithmeticCaptcha;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import org.springframework.util.FastByteArrayOutputStream;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * 验证码操作处理
 *
 * @author ruoyi
 */
@ApiSort(value = 20)
@Api(tags = "验证码控制器")
@RestController
public class CaptchaController {

    private static final Logger log = LoggerFactory.getLogger(CaptchaController.class);

    @Resource(name = "captchaProducer")
    Producer captchaProducer;

    @Resource(name = "captchaProducerMath")
    Producer captchaProducerMath;

    @Resource
    RedisCache redisCache;

    // 验证码类型
    @Value("${ruoyi.captchaType}")
    private String captchaType;

    /**
     * 生成验证码
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "生成google-captcha验证码")
    @GetMapping(value = "/captchaImage", produces = {"application/json;charset=UTF-8"})
    public AjaxResult<CaptchaInfo> getCode() {
        StopWatch watch = new StopWatch();
        watch.start("google-captcha生成验证码");
        // 保存验证码信息
        String uuid = IdUtils.simpleUUID();
        String verifyKey = Constants.CAPTCHA_CODE_KEY + uuid;

        String capStr, code = null;
        BufferedImage image = null;

        // 生成验证码
        if ("math".equals(captchaType)) {
            String capText = this.captchaProducerMath.createText();
            capStr = capText.substring(0, capText.lastIndexOf("@"));
            code = capText.substring(capText.lastIndexOf("@") + 1);
            image = this.captchaProducerMath.createImage(capStr);
        } else if ("char".equals(captchaType)) {
            capStr = code = this.captchaProducer.createText();
            image = this.captchaProducer.createImage(capStr);
        }

        this.redisCache.setCacheObject(verifyKey, code, Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        // 转换流信息写出
        FastByteArrayOutputStream os = new FastByteArrayOutputStream();
        try {
            Assert.notNull(image, "验证码image不能为空");
            ImageIO.write(image, "jpg", os);
        } catch (IOException e) {
            return AjaxResult.error(e.getMessage());
        }

        watch.stop();
        log.info("生成验证码【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(new CaptchaInfo(Base64.encode(os.toByteArray()), uuid));
    }


    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "生成easy-captcha验证码")
    @GetMapping(value = "/captchaImage2", produces = {"application/json;charset=UTF-8"})
    public AjaxResult<CaptchaInfo> getCode2() {
        StopWatch watch = new StopWatch();
        watch.start("easy-captcha验证码");
        final ArithmeticCaptcha captcha = new ArithmeticCaptcha(160, 48);
        // 设置字体
        captcha.setFont(new Font("Verdana", Font.PLAIN, 40));
        // 设置几位运算，默认2位
        captcha.setLen(2);

        final String uuid = IdUtils.simpleUUID();
        // captcha.text()这是计算的结果
        this.redisCache.setCacheObject(Constants.CAPTCHA_CODE_KEY + uuid, captcha.text(), Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);

        watch.stop();
        log.info("生成验证码【{}】耗时--->{}ms", watch.getLastTaskName(), watch.getLastTaskTimeMillis());
        return AjaxResult.success(new CaptchaInfo(captcha.toBase64(), uuid));
    }


    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "验证码图片")
    @GetMapping(value = "/captchaStream")
    public void getCodeStream(HttpServletResponse response) throws IOException {
        response.setHeader("content-type", MediaType.IMAGE_JPEG_VALUE);

        String uuid = IdUtil.fastSimpleUUID();
        response.setHeader("captcha-uuid", uuid);

        String code = null;
        BufferedImage image = null;

        // 生成验证码
        if ("math".equals(captchaType)) {
            String capText = this.captchaProducerMath.createText();
            String capStr = capText.substring(0, capText.lastIndexOf("@"));
            code = capText.substring(capText.lastIndexOf("@") + 1);
            image = this.captchaProducerMath.createImage(capStr);
        } else if ("char".equals(captchaType)) {
            String capStr = code = this.captchaProducer.createText();
            image = this.captchaProducer.createImage(capStr);
        }

        this.redisCache.setCacheObject(Constants.CAPTCHA_CODE_KEY + uuid, code, Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        Assert.notNull(image, "验证码image不能为空");

        ImageIO.write(image, "jpg", response.getOutputStream());
    }


    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "Arithmetic验证码图片")
    @GetMapping(value = "/arithmeticCaptchaImage")
    public void getArithmeticCode(HttpServletResponse response) throws IOException {
        response.setHeader("content-type", MediaType.IMAGE_JPEG_VALUE);

        final String uuid = IdUtil.fastSimpleUUID();
        response.setHeader("captcha-uuid", uuid);
        final ArithmeticCaptcha captcha = new ArithmeticCaptcha(160, 48);
        // 设置字体
        captcha.setFont(new Font("Verdana", Font.PLAIN, 40));
        // 设置几位运算，默认2位
        captcha.setLen(2);

        // 获取计算符号
        final String arithmeticString = captcha.getArithmeticString();
        // 去掉减法，避免出现负数结果
        String arithmeticStr = arithmeticString.replaceAll("-", "+");
        captcha.setArithmeticString(arithmeticStr);
        // captcha.text()这是计算的结果
        this.redisCache.setCacheObject(Constants.CAPTCHA_CODE_KEY + uuid, captcha.text(), Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        captcha.out(response.getOutputStream());
    }
}
