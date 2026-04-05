FROM nginx:alpine

COPY suivi_concours_SAEG.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
