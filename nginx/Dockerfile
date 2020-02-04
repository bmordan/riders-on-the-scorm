FROM jwilder/nginx-proxy
RUN {\
    echo 'try_files $uri $uri/ =404'; \
    echo 'autoindex on;'; \
} > /etc/nginx/conf.d/riders.conf