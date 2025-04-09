package com.ruoyi.system.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


/**
 * mybatis自定义类型转换器，将Boolean转换smallint
 */
@MappedJdbcTypes(JdbcType.SMALLINT)
@MappedTypes(Boolean.class)
public class BooleanToSmallIntTypeHandler extends BaseTypeHandler<Boolean> {

    private static final Logger log = LoggerFactory.getLogger(BooleanToSmallIntTypeHandler.class);
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Boolean aBoolean, JdbcType jdbcType) throws SQLException {
        log.debug("Converting Boolean {} to SMALLINT", aBoolean);
        ps.setInt(i, aBoolean ? 1 : 0);
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, String s) throws SQLException {
        return rs.getInt(s) == 1;
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, int i) throws SQLException {
        int value = rs.getInt(i);
        log.debug("Converting SMALLINT {} to Boolean", value);
        return value == 1;
    }

    @Override
    public Boolean getNullableResult(CallableStatement cs, int i) throws SQLException {
        return cs.getInt(i) == 1;
    }
}
