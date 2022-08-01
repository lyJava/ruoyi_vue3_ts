package com.ruoyi.web.controller.monitor;

import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.framework.web.domain.Server;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 服务器监控
 *
 * @author ruoyi
 */
@ApiSort(value = 510)
@Api(tags = "服务器监控控制器")
@RestController
@RequestMapping(value = "/monitor", produces = MediaType.APPLICATION_JSON_VALUE)
public class ServerController {

    @ApiOperation(value = "服务器信息")
    @PreAuthorize("@ss.hasPermi('monitor:server:list')")
    @GetMapping(value = "/server")
    public AjaxResult<Server> getInfo() throws Exception {
        Server server = new Server();
        server.copyTo();
        return AjaxResult.success(server);
    }
}
