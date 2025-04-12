package com.ruoyi.web.model;


import com.ruoyi.common.core.domain.entity.SysUser;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Set;

/**
 * 登录后获取用户信息
 *
 * @author liyang
 * @date 2025-04-12 11:04
 */
@ApiModel(value = "登录后获取用户信息")
public class LoginInfo implements Serializable {

    private static final long serialVersionUID = 5711234130492410604L;

    /**
     * 用户
     */
    @ApiModelProperty(value = "用户信息")
    private SysUser user;

    /**
     * 角色集合
     */
    @ApiModelProperty(value = "角色集合")
    private Set<String> roles;

    /**
     * 权限集合
     */
    @ApiModelProperty(value = "权限集合")
    private Set<String> permissions;

    public LoginInfo() {
    }

    public LoginInfo(SysUser user, Set<String> roles, Set<String> permissions) {
        this.user = user;
        this.roles = roles;
        this.permissions = permissions;
    }

    public SysUser getUser() {
        return user;
    }

    public void setUser(SysUser user) {
        this.user = user;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }


}
