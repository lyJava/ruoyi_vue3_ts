package com.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 连接池测试
 * @author Administrator
 *
 */
public class JdbcPoolTest {
	public static void main(String[] args) throws SQLException {
		String sql = "select * from student";
		ConnectionPool pool = null;
		for (int i = 0; i < 5; i++) {
			pool = ConnectionPool.getInstance();
			Connection conn = pool.getConnection();
			PreparedStatement stmt = conn.prepareStatement(sql);
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				System.out.println(rs.getString(1) + "\t\t" + rs.getString(2) + "\t\t");
			}
			rs.close();
			stmt.close();
			pool.release(conn);
		}
		pool.closePool();
	}
}
