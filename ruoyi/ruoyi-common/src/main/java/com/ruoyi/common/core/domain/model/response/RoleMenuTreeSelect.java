package com.ruoyi.common.core.domain.model.response;

import com.ruoyi.common.core.domain.TreeSelect;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @author liyang
 * @date 2022-07-14 14:46
 */
@ApiModel(value = "角色菜单treeSelect")
public class RoleMenuTreeSelect {

    @ApiModelProperty(value = "选中的节点id集合")
    private List<Integer> checkedKeys;

    @ApiModelProperty(value = "treeSelect集合")
    private List<TreeSelect> menus;

    public List<Integer> getCheckedKeys() {
        return checkedKeys;
    }

    public void setCheckedKeys(List<Integer> checkedKeys) {
        this.checkedKeys = checkedKeys;
    }

    public List<TreeSelect> getMenus() {
        return menus;
    }

    public void setMenus(List<TreeSelect> menus) {
        this.menus = menus;
    }
}
