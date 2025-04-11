package com.ruoyi.web.controller.system;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.common.core.domain.model.LoginUser;
import com.ruoyi.common.core.domain.model.response.Profile;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.file.FileUploadUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.system.service.ISysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * 个人信息 业务处理
 *
 * @author ruoyi
 */
@ApiSort(value = 110)
@Api(tags = "个人信息控制器")
@RestController
@RequestMapping(value = "/system/user/profile", produces = {"application/json;charset=UTF-8"})
public class SysProfileController extends BaseController {

    @Resource
    ISysUserService userService;

    @Resource
    TokenService tokenService;

    /**
     * 个人信息
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation(value = "个人信息")
    @GetMapping
    public AjaxResult<Profile<SysUser>> profile(HttpServletRequest request) {
        LoginUser loginUser = tokenService.getLoginUser(request);
        SysUser user = loginUser.getUser();
        Profile<SysUser> profile = new Profile<>(user);
        profile.setRoleGroup(userService.selectUserRoleGroup(loginUser.getUsername()));
        profile.setPostGroup(userService.selectUserPostGroup(loginUser.getUsername()));
        return AjaxResult.success(profile);
    }

    /**
     * 修改用户
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation(value = "修改用户")
    @Log(title = "个人信息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult<String> updateProfile(@RequestBody SysUser user, HttpServletRequest request) {
        if (userService.updateUserProfile(user) > 0) {
            LoginUser loginUser = tokenService.getLoginUser(request);
            // 更新缓存用户信息
            loginUser.getUser().setNickName(user.getNickName());
            loginUser.getUser().setPhonenumber(user.getPhonenumber());
            loginUser.getUser().setEmail(user.getEmail());
            loginUser.getUser().setSex(user.getSex());
            tokenService.setLoginUser(loginUser);
            return AjaxResult.success();
        }
        return AjaxResult.error("修改个人信息异常，请联系管理员");
    }

    /**
     * 修改密码
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation(value = "修改密码")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "oldPassword", value = "旧密码", dataTypeClass = String.class, required = true),
            @ApiImplicitParam(name = "newPassword", value = "新密码", dataTypeClass = String.class, required = true)
    })
    @Log(title = "个人信息", businessType = BusinessType.UPDATE)
    @PutMapping(value = "/updatePwd")
    public AjaxResult<String> updatePwd(String oldPassword, String newPassword) {
        final LoginUser loginUser = SecurityUtils.getLoginUser();
        final String userName = loginUser.getUsername();
        final String password = userService.getPasswordById(loginUser.getUser().getUserId());
        if (!SecurityUtils.matchesPassword(oldPassword, password)) {
            return AjaxResult.error("修改密码失败，旧密码错误");
        }
        if (SecurityUtils.matchesPassword(newPassword, password)) {
            return AjaxResult.error("新密码不能与旧密码相同");
        }
        if (userService.resetUserPwd(userName, SecurityUtils.encryptPassword(newPassword)) > 0) {
            // 更新缓存用户密码
            loginUser.getUser().setPassword(SecurityUtils.encryptPassword(newPassword));
            tokenService.setLoginUser(loginUser);
            return AjaxResult.success();
        }
        return AjaxResult.error("修改密码异常，请联系管理员");
    }

    /**
     * 头像上传
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation(value = "头像上传")
    @ApiImplicitParam(name = "avatarfile", value = "用户头像文件", paramType = "query", dataTypeClass = MultipartFile.class, required = true)
    @Log(title = "用户头像", businessType = BusinessType.UPDATE)
    @PostMapping(value = "/avatar")
    public AjaxResult<String> avatar(@RequestPart("avatarfile") @RequestParam("avatarfile") MultipartFile file, HttpServletRequest request) throws IOException {
        if (!file.isEmpty()) {
            LoginUser loginUser = tokenService.getLoginUser(request);
            String avatar = FileUploadUtils.upload(RuoYiConfig.getAvatarPath(), file);
            if (userService.updateUserAvatar(loginUser.getUsername(), avatar)) {
                /*AjaxResult ajax = AjaxResult.success();
                ajax.put("imgUrl", avatar);*/
                // 更新缓存用户头像
                loginUser.getUser().setAvatar(avatar);
                tokenService.setLoginUser(loginUser);
                return AjaxResult.success("修改成功", avatar);
            }
        }
        return AjaxResult.error("上传图片异常，请联系管理员");
    }
}
