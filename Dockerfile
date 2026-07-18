FROM nginx:alpine
# 复制项目源码到容器
COPY . /usr/share/nginx/html
# 删除nginx默认首页，避免遮挡小程序文件
RUN rm -f /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
