FROM nginx:1.25.3

# 设置语言环境变量，防止中文乱码
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

RUN echo 'alias ll="ls -l"' >> ~/.bashrc

# 安装相关依赖包，locales防止中文乱码，net-tools以便使用netstat命令
RUN apt-get update && apt-get install -y bash vim iputils-ping locales net-tools

# 将vue打包后到复制到nginx的html目录下
COPY ./dist /home/vue/dist

# 替换nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_dev.conf /etc/nginx/conf.d

# 暴露端口
EXPOSE 7001