package com.ruoyi.generator.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.constant.GenConstants;
import com.ruoyi.common.core.text.CharsetKit;
import com.ruoyi.common.exception.CustomException;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.generator.domain.GenTable;
import com.ruoyi.generator.domain.GenTableColumn;
import com.ruoyi.generator.mapper.GenTableColumnMapper;
import com.ruoyi.generator.mapper.GenTableMapper;
import com.ruoyi.generator.util.GenUtils;
import com.ruoyi.generator.util.VelocityInitializer;
import com.ruoyi.generator.util.VelocityUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 业务 服务层实现
 *
 * @author ruoyi
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class GenTableServiceImpl implements IGenTableService {

    private static final Logger log = LoggerFactory.getLogger(GenTableServiceImpl.class);

    @Resource
    GenTableMapper genTableMapper;

    @Resource
    GenTableColumnMapper genTableColumnMapper;

    /**
     * 查询业务信息
     *
     * @param id 业务ID
     * @return 业务信息
     */
    @Override
    @Transactional(readOnly = true)
    public GenTable selectGenTableById(Long id) {
        GenTable genTable = this.genTableMapper.selectGenTableById(id);
        setTableFromOptions(genTable);
        return genTable;
    }

    /**
     * 查询业务列表
     *
     * @param genTable 业务信息
     * @return 业务集合
     */
    @Override
    @Transactional(readOnly = true)
    public List<GenTable> selectGenTableList(GenTable genTable) {
        return this.genTableMapper.selectGenTableList(genTable);
    }

    /**
     * 查询据库列表
     *
     * @param genTable 业务信息
     * @return 数据库表集合
     */
    @Override
    @Transactional(readOnly = true)
    public List<GenTable> selectDbTableList(GenTable genTable) {
        return this.genTableMapper.selectDbTableList(genTable);
    }

    /**
     * 查询据库列表
     *
     * @param tableNames 表名称组
     * @return 数据库表集合
     */
    @Override
    @Transactional(readOnly = true)
    public List<GenTable> selectDbTableListByNames(String[] tableNames) {
        return this.genTableMapper.selectDbTableListByNames(tableNames);
    }

    /**
     * 查询所有表信息
     *
     * @return 表信息集合
     */
    @Override
    @Transactional(readOnly = true)
    public List<GenTable> selectGenTableAll() {
        return this.genTableMapper.selectGenTableAll();
    }

    /**
     * 修改业务
     *
     * @param genTable 业务信息
     * @return 结果
     */
    @Override
    public void updateGenTable(GenTable genTable) {
        String options = JSON.toJSONString(genTable.getParams());
        genTable.setOptions(options);
        int row = this.genTableMapper.updateGenTable(genTable);
        if (row > 0) {
            for (GenTableColumn cenTableColumn : genTable.getColumns()) {
                this.genTableColumnMapper.updateGenTableColumn(cenTableColumn);
            }
        }
    }

    /**
     * 删除业务对象
     *
     * @param tableIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public void deleteGenTableByIds(Long[] tableIds) {
        if (tableIds == null || tableIds.length == 0) {
            throw new CustomException("参数异常，删除失败");
        }
        this.genTableMapper.deleteGenTableByIds(tableIds);
        this.genTableColumnMapper.deleteGenTableColumnByIds(tableIds);
    }

    /**
     * 导入表结构
     *
     * @param tableList 导入表列表
     */
    @Override
    public void importGenTable(List<GenTable> tableList) {
        if (CollectionUtils.isEmpty(tableList)) {
            throw new CustomException("导入的表不能为空！");
        }
        String operName = SecurityUtils.getUsername();
        try {
            for (GenTable table : tableList) {
                String tableName = table.getTableName();
                GenUtils.initTable(table, operName);
                final int count = this.genTableMapper.selectCountByTableName(tableName);
                if (count > 0) {
                    throw new CustomException("【" + tableName + "】已经导入，请勿重复操作！");
                }
                int row = this.genTableMapper.insertGenTable(table);
                if (row > 0) {
                    // 保存列信息
                    List<GenTableColumn> genTableColumns = this.genTableColumnMapper.selectDbTableColumnsByName(tableName);
                    for (GenTableColumn column : genTableColumns) {
                        GenUtils.initColumnField(column, table);
                        //this.genTableColumnMapper.insertGenTableColumn(column);
                    }
                    // 使用批量新增
                    this.genTableColumnMapper.batchInsert(genTableColumns);
                }
            }
        } catch (Exception e) {
            throw new CustomException("导入失败：" + e.getMessage());
        }
    }

    /**
     * 预览代码
     *
     * @param tableId 表编号
     * @return 预览数据列表
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, String> previewCode(Long tableId) {
        Map<String, String> dataMap = new LinkedHashMap<>();
        // 查询表信息
        GenTable table = this.genTableMapper.selectGenTableById(tableId);
        if (Objects.isNull(table)) {
            throw new CustomException("当前表信息不存在，无法预览");
        }
        // 设置主子表信息
        setSubTable(table);
        // 设置主键列信息
        setPkColumn(table);
        VelocityInitializer.initVelocity();

        VelocityContext context = VelocityUtils.prepareContext(table);

        // 获取模板列表
        List<String> templates = VelocityUtils.getTemplateList(table.getTplCategory(), table.getVueVersion());
        for (String template : templates) {
            // 渲染模板
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            dataMap.put(template, sw.toString());
        }
        return dataMap;
    }

    /**
     * 生成代码（下载方式）
     *
     * @param tableName 表名称
     * @return 数据
     */
    @Override
    public byte[] downloadCode(String tableName) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        generatorCode(tableName, zip);
        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }

    /**
     * 生成代码（自定义路径）
     *
     * @param tableName 表名称
     */
    @Override
    @Transactional(readOnly = true)
    public void generatorCode(String tableName) {
        // 查询表信息
        GenTable table = this.genTableMapper.selectGenTableByName(tableName);
        if (Objects.nonNull(table)) {
            // 设置主子表信息
            setSubTable(table);
            // 设置主键列信息
            setPkColumn(table);

            VelocityInitializer.initVelocity();

            VelocityContext context = VelocityUtils.prepareContext(table);

            final Integer vueVersion = table.getVueVersion();
            // 获取模板列表
            List<String> templates = VelocityUtils.getTemplateList(table.getTplCategory(), vueVersion);
            if (CollectionUtils.isNotEmpty(templates)) {
                for (String template : templates) {
                    if (!StringUtils.containsAny(template, "sql.vm" , "api.js.vm" , "index.vue.vm" , "index-tree.vue.vm")) {
                        // 渲染模板
                        StringWriter sw = new StringWriter();
                        Template tpl = Velocity.getTemplate(template, Constants.UTF8);
                        tpl.merge(context, sw);
                        try {
                            String path = getGenPath(table, template);
                            FileUtils.writeStringToFile(new File(path), sw.toString(), CharsetKit.UTF_8);
                        } catch (IOException e) {
                            throw new CustomException("渲染模板失败，表名：" + table.getTableName());
                        }
                    }
                }
            }
        }
    }

    /**
     * 同步数据库
     *
     * @param tableName 表名称
     */
    @Override
    public void synchDb(String tableName) {
        GenTable table = this.genTableMapper.selectGenTableByName(tableName);
        List<GenTableColumn> tableColumns = table.getColumns();
        List<String> tableColumnNames = tableColumns.stream().map(GenTableColumn::getColumnName).collect(Collectors.toList());

        List<GenTableColumn> dbTableColumns = this.genTableColumnMapper.selectDbTableColumnsByName(tableName);
        if (StringUtils.isEmpty(dbTableColumns)) {
            throw new CustomException("同步数据失败，原表结构不存在");
        }
        List<String> dbTableColumnNames = dbTableColumns.stream().map(GenTableColumn::getColumnName).collect(Collectors.toList());

        dbTableColumns.forEach(column -> {
            if (!tableColumnNames.contains(column.getColumnName())) {
                GenUtils.initColumnField(column, table);
                this.genTableColumnMapper.insertGenTableColumn(column);
            }
        });

        List<GenTableColumn> delColumns = tableColumns.stream().filter(column -> !dbTableColumnNames.contains(column.getColumnName())).collect(Collectors.toList());
        if (StringUtils.isNotEmpty(delColumns)) {
            this.genTableColumnMapper.deleteGenTableColumns(delColumns);
        }
    }

    /**
     * 批量生成代码（下载方式）
     *
     * @param tableNames 表数组
     * @return 数据
     */
    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCode(Set<String> tableNames) {
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        for (String tableName : tableNames) {
            this.generatorCode(tableName, zip);
        }
        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }

    /**
     * 查询表信息并生成代码
     */
    @Transactional(readOnly = true)
    public void generatorCode(String tableName, ZipOutputStream zip) {
        // 查询表信息
        GenTable table = this.genTableMapper.selectGenTableByName(tableName);
        if (Objects.isNull(table)) {
            throw new CustomException("当前表信息不存在，无法进行下载");
        }
        // 设置主子表信息
        setSubTable(table);
        // 设置主键列信息
        setPkColumn(table);

        VelocityInitializer.initVelocity();

        VelocityContext context = VelocityUtils.prepareContext(table);

        // 获取模板列表
        List<String> templates = VelocityUtils.getTemplateList(table.getTplCategory());
        for (String template : templates) {
            // 渲染模板
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            try {
                // 添加到zip
                zip.putNextEntry(new ZipEntry(VelocityUtils.getFileName(template, table)));
                IOUtils.write(sw.toString(), zip, Constants.UTF8);
                IOUtils.closeQuietly(sw);
                zip.flush();
                zip.closeEntry();
            } catch (IOException e) {
                log.error("渲染模板失败，表名：" + table.getTableName(), e);
            }
        }
    }

    /**
     * 修改保存参数校验
     *
     * @param genTable 业务信息
     */
    @Override
    @Transactional(readOnly = true)
    public void validateEdit(GenTable genTable) {
        if (GenConstants.TPL_TREE.equals(genTable.getTplCategory())) {
            String options = JSON.toJSONString(genTable.getParams());
            JSONObject paramsObj = JSONObject.parseObject(options);
            if (StringUtils.isEmpty(paramsObj.getString(GenConstants.TREE_CODE))) {
                throw new CustomException("树编码字段不能为空");
            } else if (StringUtils.isEmpty(paramsObj.getString(GenConstants.TREE_PARENT_CODE))) {
                throw new CustomException("树父编码字段不能为空");
            } else if (StringUtils.isEmpty(paramsObj.getString(GenConstants.TREE_NAME))) {
                throw new CustomException("树名称字段不能为空");
            } else if (GenConstants.TPL_SUB.equals(genTable.getTplCategory())) {
                if (StringUtils.isEmpty(genTable.getSubTableName())) {
                    throw new CustomException("关联子表的表名不能为空");
                } else if (StringUtils.isEmpty(genTable.getSubTableFkName())) {
                    throw new CustomException("子表关联的外键名不能为空");
                }
            }
        }
    }


    @Override
    public int updateStatusOrVersion(String str, Long id, Integer status) {
        int count = 0;
        GenTable genTable = new GenTable();
        genTable.setTableId(id);
        genTable.setUpdateBy(SecurityUtils.getUsername());
        if (StringUtils.equals("s" , str)) {
            genTable.setSwagger(status);
        } else if (StringUtils.equals("e" , str)) {
            genTable.setExcelExport(status);
        } else if (StringUtils.equals("v" , str)) {
            genTable.setVueVersion(status);
        }
        count = this.genTableMapper.updateGenTable(genTable);
        return count;
    }

    /**
     * 设置主键列信息
     *
     * @param table 业务表信息
     */
    public void setPkColumn(GenTable table) {
        for (GenTableColumn column : table.getColumns()) {
            if (column.isPk()) {
                table.setPkColumn(column);
                break;
            }
        }
        if (StringUtils.isNull(table.getPkColumn())) {
            table.setPkColumn(table.getColumns().get(0));
        }
        if (GenConstants.TPL_SUB.equals(table.getTplCategory())) {
            for (GenTableColumn column : table.getSubTable().getColumns()) {
                if (column.isPk()) {
                    table.getSubTable().setPkColumn(column);
                    break;
                }
            }
            if (StringUtils.isNull(table.getSubTable().getPkColumn())) {
                table.getSubTable().setPkColumn(table.getSubTable().getColumns().get(0));
            }
        }
    }

    /**
     * 设置主子表信息
     *
     * @param table 业务表信息
     */
    public void setSubTable(GenTable table) {
        String subTableName = table.getSubTableName();
        if (StringUtils.isNotEmpty(subTableName)) {
            table.setSubTable(this.genTableMapper.selectGenTableByName(subTableName));
        }
    }

    /**
     * 设置代码生成其他选项值
     *
     * @param genTable 设置后的生成对象
     */
    public void setTableFromOptions(GenTable genTable) {
        JSONObject paramsObj = JSONObject.parseObject(genTable.getOptions());
        if (StringUtils.isNotNull(paramsObj)) {
            String treeCode = paramsObj.getString(GenConstants.TREE_CODE);
            String treeParentCode = paramsObj.getString(GenConstants.TREE_PARENT_CODE);
            String treeName = paramsObj.getString(GenConstants.TREE_NAME);
            String parentMenuId = paramsObj.getString(GenConstants.PARENT_MENU_ID);
            String parentMenuName = paramsObj.getString(GenConstants.PARENT_MENU_NAME);

            genTable.setTreeCode(treeCode);
            genTable.setTreeParentCode(treeParentCode);
            genTable.setTreeName(treeName);
            genTable.setParentMenuId(parentMenuId);
            genTable.setParentMenuName(parentMenuName);
        }
    }

    /**
     * 获取代码生成地址
     *
     * @param table    业务表信息
     * @param template 模板文件路径
     * @return 生成地址
     */
    public static String getGenPath(GenTable table, String template) {
        String genPath = table.getGenPath();
        if (StringUtils.equals(genPath, "/")) {
            return System.getProperty("user.dir") + File.separator + "src" + File.separator + VelocityUtils.getFileName(template, table);
        }
        return genPath + File.separator + VelocityUtils.getFileName(template, table);
    }
}