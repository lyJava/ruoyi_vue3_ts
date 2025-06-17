FROM nginx:1.25.3-bookworm

RUN echo 'alias ll="ls -l"' >> ~/.bashrc

# 切换为国内镜像源以避免 deb.debian.org 连接失败
RUN sed -i 's|http://deb.debian.org|http://mirrors.aliyun.com|g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        vim \
        iputils-ping \
        locales \
        net-tools \
    && rm -rf /var/lib/apt/lists/*

RUN locale-gen en_US.UTF-8

# 设置语言环境变量，防止出现中文乱码
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# 安装net-tools包，以便使用netstat命令
RUN apt-get install -y net-tools

# 将vue打包后到复制到nginx的html目录下
COPY ./dist /home/vue/dist

# 替换nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_dev.conf /etc/nginx/conf.d

# 暴露端口
EXPOSE 7001