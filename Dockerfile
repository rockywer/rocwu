# 小程序静态资源基础镜像
FROM nginx:alpine
# 拷贝小程序构建产物
COPY dist /usr/share/nginx/html
# 暴露端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
