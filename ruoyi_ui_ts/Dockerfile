# FROM nginx:1.25.3

# RUN echo 'alias ll="ls -l"' >> ~/.bashrc

# RUN apt-get update

# RUN apt-get install -y bash vim

# RUN apt-get install -y iputils-ping

# # 安装语言配置包，防止中文乱码
# RUN apt-get install -y locales

# RUN locale-gen en_US.UTF-8
FROM nginx:1.25.3-alpine

RUN echo 'alias ll="ls -l"' >> ~/.bashrc

RUN apk update && apk add \
    bash \
    vim \
    iputils \
    net-tools \
    tzdata

# 设置语言环境变量，防止出现中文乱码
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# 安装net-tools包，以便使用netstat命令
# RUN apt-get install -y net-tools

# 将vue打包后到复制到nginx的html目录下
COPY ./dist /home/vue/dist

# 替换nginx默认配置
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_dev.conf /etc/nginx/conf.d

RUN rm /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 7001