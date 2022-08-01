package com.ruoyi;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.context.request.RequestContextListener;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.TimeZone;

/**
 * 启动程序
 *
 * @author ruoyi
 */
@EnableScheduling
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class RuoYiApplication {

    private static final Logger log = LoggerFactory.getLogger(RuoYiApplication.class);

    public static void main(String[] args) throws UnknownHostException {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        //SpringApplication.run(RuoYiApplication.class, args);
        // 防止在docker容器中输出日志相差八小时
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
        // 启动输出访问地址信息等
        final ConfigurableApplicationContext applicationContext = SpringApplication.run(RuoYiApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  若依启动成功   ლ(´ڡ`ლ)ﾞ  \n" +
                " .-------.       ____     __        \n" +
                " |  _ _   \\      \\   \\   /  /    \n" +
                " | ( ' )  |       \\  _. /  '       \n" +
                " |(_ o _) /        _( )_ .'         \n" +
                " | (_,_).' __  ___(_ o _)'          \n" +
                " |  |\\ \\  |  ||   |(_,_)'         \n" +
                " |  | \\ `'   /|   `-'  /           \n" +
                " |  |  \\    /  \\      /           \n" +
                " ''-'   `'-'    `-..-'              ");
        final ConfigurableEnvironment environment = applicationContext.getEnvironment();
        final String ip = InetAddress.getLocalHost().getHostAddress();
        final String port = environment.getProperty("server.port");
        String path = environment.getProperty("server.servlet.context-path");
        if (StringUtils.isBlank(path)) {
            path = "";
        }
        log.info("\nCurrent Application is running....\n\t请求地址如下\n\tLocal访问地址：\t\t{}" +
                        "\n\tExternal访问地址：\t{}\n\tSwagger3访问地址：\t{}\n\tknife4j文档访问地址：\t{}\n\t",
                "http://localhost:" + port + path,
                "http://" + ip + ":" + port + path,
                "http://" + ip + ":" + port + path + "swagger-ui/index.html",
                "http://" + ip + ":" + port + path + "doc.html");
    }

    /**
     * 增加监听
     * TODO springboot从2.2升级到2.6.6增加的
     *
     * @return
     */
    @Bean
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }


}
