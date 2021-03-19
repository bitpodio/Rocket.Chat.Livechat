FROM rocketchat/rocket.chat:3.12.1

RUN rm -rf /app/bundle/programs/web.browser/app/livechat/*

COPY ["/_build/","/app/bundle/programs/web.browser/app/livechat/"]

RUN rm -rf /app/bundle/programs/web.browser.legacy/app/livechat/*

COPY ["/_build/","/app/bundle/programs/web.browser.legacy/app/livechat/"]

RUN rm -rf /app/bundle/programs/server/assets/app/livechat/*

COPY ["/_build/index.html","/app/bundle/programs/server/assets/app/livechat/"]

