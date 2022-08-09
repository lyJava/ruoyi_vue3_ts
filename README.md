# ruoyi_vue3_ts

#### 介绍
前端参考来着若依[vue3的js](https://github.com/yangzongzhuan/RuoYi-Vue3)版本与[若依前后端分离版](https://gitee.com/y_project/RuoYi-Vue)，改写为ts版本，后端依赖于[若依](https://gitee.com/y_project/RuoYi-Vue)中的后端版本，具体文档参见[若依文档](http://ruoyi.vip/)。再次感谢若依！
####
注意：
###  前后端与若依原本的有所差异，启动项目之前请先使用sql脚本初始化好数据库，并且在对应的配置文件中配置好数据库与redis
** ** 
#### 相关说明
1.  后端——ruoyi,前端——ruoyi_ui_ts。springboot版本升级到2.6.6；
2.  jjwt版本升级到0.9.1，对应升级其相关的依赖，并对之前版本过时方法代码进行了改写；
3.  增加了swagger注释，集成了[knife4j文档](https://doc.xiaominfo.com/)（原生swagger用起来不够方便）；
4.  增加了使用easy-captcha生成验证码(看来还凑合，使用起来更简单)；
5.  代码生成增加了是否增加swagger注释，是否增加导出Excel注释与选择vue2或者vue3模板的功能；
6.  后端统一返回改为泛型对象。时间范围增加了可设置年月日时分秒，具体改动请参见相关代码；
7.  前端element-plus版本升级到2.2.5，vue3版本为3.2.35以及相对应的其他插件版本的改动。

## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 接口文档：knife4j文档与swagger文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 缓存监控：对系统的缓存信息查询，命令统计等。
17. 在线构建器：拖动表单元素生成相应的HTML代码。
18. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。

## 演示视频
https://www.bilibili.com/video/BV1Bd4y1T7vH/?vd_source=935858b05b95ca34b13b681f7ac5231a

## 相关截图


#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
