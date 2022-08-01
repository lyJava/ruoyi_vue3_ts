package com.ruoyi.common.core.domain.model.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * @author liyang
 * @date 2022-07-14 14:28
 */
@ApiModel(value = "个人信息")
public class Profile<T> implements Serializable {

    /**
     * 用户信息
     */
    private T data;

    /**
     * 角色分组
     */
    @ApiModelProperty(value = "角色分组")
    private String roleGroup;

    /**
     * 部门分组
     */
    @ApiModelProperty(value = "部门分组")
    private String postGroup;


    public Profile() {
    }

    public Profile(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getRoleGroup() {
        return roleGroup;
    }

    public void setRoleGroup(String roleGroup) {
        this.roleGroup = roleGroup;
    }

    public String getPostGroup() {
        return postGroup;
    }

    public void setPostGroup(String postGroup) {
        this.postGroup = postGroup;
    }
}
