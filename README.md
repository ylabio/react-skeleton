# React Skeleton

Каркас приложения на React & Vite с рендером на сервере (SSR) или клиенте (SPA).
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
По умолчанию определены параметры АПИ, навигации, модулей состояния и других сервисов.

Приложение доступно по адресу `http://localhost:8050`.
Порт меняется в файле конфигурации сервера `server/config.js`.
В конфигурации сервера также настраивается прокси к АПИ для обхода CORS.

```
server: {
  port: 8050,
  proxy: {...}
}
```

В режиме разработки используется сборщик Vite для отслеживания изменения в коде и последующего 
“горячего” обновления приложения в браузере.


## Сборка

Для публикации проекта на сервере сначала выполняется сборка приложения командой:

`npm run build`

или

`npm run build:server` - если нужен сервер рендера (SSR). Выполнится сборка браузерной и 
серверной версии приложения.

Собранные файлы приложения окажутся в папке `/dist`.  [Подробнее](dist/README.md).

## Развертывание и запуск

Для проверки собранного приложения на локальном компьютере выполните команду:

`npm run preview` - запустится локальный сервер для отдачи статических файлов из /dist/client. 
При этом выполнится сборка браузерной версии приложения.

или

`npm run preview:server` - запустится сервер для рендера приложения и отдачи статических файлов. 
При этом выполнится сборка браузерной и серверной версии приложения.

Если приложение уже собрано, то сервер рендера можно запустить командой `ts-node ./server/index.ts`.

Для постоянной работы сервера рендера можно воспользоваться менеджером процессов pm2.

`pm2 start process.json`

На внешний сервер необходимо перенести папки с файлами:
```
- /dist
- /node_modules
- /server
```

Если сервер рендера (SSR) не нужен, то переносится только `/dist/client`

### Nginx

Рекомендуется использовать nginx.

Nginx в режиме **без** рендера должен отдавать только файлы из `./dist/client`.
Если запрос не на файл, то нужно отдавать `./dist/client/index.html`.

Пример настройки nginx

```
server {
  listen 80;
  server_name react-skeleton.com;
  location / {
    root /home/user/react-skeleton/dist/client;
    try_files $uri /index.html;
  }
}
```

В режиме рендера (SSR) запускается приложение на node.js `ts-node ./server/index.ts`. 
Через nginx все запросы на страницы сайта проксируются на сервер рендера.

Можно проксировать вообще все запросы, так как сервер рендера сам выполнит либо рендер, либо
отдаст файлы из ./dist/client/assets/, а также спроксирует запросы к АПИ. 

Для оптимизации отдачу файлов и проксирование к АПИ лучше выполнять через nginx.

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
  # location /assets/ {
  #   root /var/www/newsite/dist/client/;
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
