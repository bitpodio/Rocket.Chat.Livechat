FROM rocketchat/rocket.chat:3.12.1

COPY ["/_build/","/app/bundle/programs/web.browser/app/livechat/"]

