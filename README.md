# React skeleton

Скелет frontend приложения на React & Vite с рендером на сервере или клиенте.
Открытая структура кода для свободного изменения.

## Новый проект

Новый проект создается форком или клонированием репозитория react-skeleton,
чтобы в дальнейшем свободно модифицировать код под особенности проекта. 

## Требования

- Node.js >= 18

## Установка

`npm install`

## Запуск для разработки

В режиме разработки приложение запускается командой:

`npm start`

или

`npm run start:server` С рендером на сервере (SSR)

Конфигурация приложения определяется в файле `src/config.js`. 
По умолчанию определены параметры АПИ, навигации, модулей состояния и других сервисов

Приложение по умолчанию доступно по адресу `http://localhost:8050`.
Порт меняется в файле конфигурации сервера `server/config.js` и может отличаться от указанного.

```javascript
server: {
  port: 8050,
}
```

В режиме разработки используется сборщик Vite для отслеживания изменения в коде и последующего 
“горячего” обновления приложения в браузере.

## Сборка

Для публикации проекта на сервере сначала выполняется сборка приложения командой:

`npm run build` - сборка клиентской и серверной части приложения

или

`npm run build:client` - сборка только клиентской части приложения, если не нужен SSR.

Собранные и минимизированные файлы приложения помещаются в папку `/dist`.  [Подробнее](dist/README.md).

## SSR

SSR - это рендер приложения на сервере, чтобы клиент по первому запросу получал готовый html. 
В первую очередь для обработки поисковиками. В последнюю для сокращения времени первого отображения.

Проверить production версию можно командой `npm run preview:server`. При этом выполнится сборка и 
запуститься сервер приложения. В режиме разработки используйте команду `npm run start:server`

Если приложение уже собрано, то его можно запустить командой `node ./server/index.js`.

Для постоянной работы сервера рендера можно воспользоваться менеджером процессов pm2.

`pm2 start process.json`

На внешний сервер необходимо перенести папки с файлами:
- dist
- node_modules
- server

Если SSR не нужен, то переносится только `dist/client`

## Nginx

Рекомендуется использовать nginx.

Nginx в режиме **без** рендера должен отдавать только статичные файлы из `./dist/client`.
Если запрос на не существующий файл, то нужно отдавать `./dist/client/index.html`.

Пример настройки nginx

```
server {
  listen 80;
  server_name react-skeleton.com;
  location / {
    root /home/user/react-skeleton/dist/web;
    try_files $uri /index.html;
  }
}
```

В режиме рендера (SSR) запускается приложение на node.js `node ./server/index.js`
и в nginx проксируются запросы на него для рендера html вместо отдачи index.html.

Можно проксировать все запросы, так как приложение само выполнит рендер или отдаст файлы из
./dist/client/assets/, а также перенаправит запрос к серверу АПИ. 
Но для оптимизации отдачу файлов и проксирование к АПИ лучше выполнять через nginx.

```
server {
  listen 80;
  server_name react-skeleton.com;
  client_max_body_size 10M;
  
  # # Прокси к АПИ 
  # location /api/ {
  #     proxy_redirect off;
  #     proxy_set_header Host api.react-skeleton.com; 
  #     proxy_set_header X-Real-IP $remote_addr;
  #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  #     proxy_set_header X-Forwarded-Proto $scheme;
  #     proxy_set_header X-Frame-Options SAMEORIGIN;
  #     proxy_pass https://api.react-skeleton.com;
  #  }
  
  # # Запросы к файлам 
  # location ~ \.(js|css|png|pdf|svg|webp|ico|ttf) {
  #   root /var/www/newsite/dist/web/;
  #   try_files $uri $uri/ =404; 
  # }

  # Рендер - проксирование запроса в приложение
  location / {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Frame-Options SAMEORIGIN;
    proxy_pass http://127.0.0.1:8050;
  }
}
```
