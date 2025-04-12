package com.ruoyi.web.model;

import com.ruoyi.common.core.domain.entity.SysRole;
import com.ruoyi.common.core.domain.entity.SysUser;
import com.ruoyi.system.domain.SysPost;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.List;

/**
 * 用户详情
 *
 * @author liyang
 * @date 2022-07-14 14:36
 */
@ApiModel(value = "用户详情")
public class SysUserInfo implements Serializable {

    private static final long serialVersionUID = 1L;


    /**
     * 角色列表
     */
    @ApiModelProperty(value = "角色列表")
    private List<SysRole> roles;

    /**
     * 岗位列表
     */
    @ApiModelProperty(value = "岗位列表")
    private List<SysPost> posts;

    /**
     * 岗位id列表
     */
    @ApiModelProperty(value = "岗位id列表")
    private List<Integer> postIds;

    /**
     * 角色id列表
     */
    @ApiModelProperty(value = "角色id列表")
    private List<Integer> roleIds;

    /**
     * 角色信息
     */
    @ApiModelProperty(value = "角色信息")
    private SysUser data;

    public SysUserInfo() {
        super();
    }

    public List<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SysRole> roles) {
        this.roles = roles;
    }

    public List<SysPost> getPosts() {
        return posts;
    }

    public void setPosts(List<SysPost> posts) {
        this.posts = posts;
    }

    public List<Integer> getPostIds() {
        return postIds;
    }

    public void setPostIds(List<Integer> postIds) {
        this.postIds = postIds;
    }

    public List<Integer> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Integer> roleIds) {
        this.roleIds = roleIds;
    }

    public SysUser getData() {
        return data;
    }

    public void setData(SysUser data) {
        this.data = data;
    }
}
