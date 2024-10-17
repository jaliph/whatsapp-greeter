# whatsapp-greeter


Automatically send scheduled messages on Whatsapp at the configured cron intervals.

configurations to be done in config.json

On boot, it will print the qr-code on the terminal, scan with you whatsapp to pair it with you account. Keep this app running, and it will keep sending messages at the cron specified time.

Helpful for automating Good morning and Good night messages, or system checks at regular intervals and automate message sending on whatsapp.


# Build

```
docker run -it -v /Users/akash/Documents/Code/wsdata:/usr/src/app/data  whatsapp-greeter:test1  sh

docker run -it -v /Users/akash/Documents/Code/wsdata:/usr/src/app/data  jaliph/whatsapp-greeter:latest  bash

docker run -v /Users/akash/Documents/Code/wsdata:/usr/src/app/data  jaliph/whatsapp-greeter:latest 

docker buildx build --platform linux/amd64 --no-cache -t whatsapp-greeter:latest --load .

docker buildx build --platform linux/amd64 --no-cache -t jaliph/whatsapp-greeter:latest --load .


docker run -it -v /volume1/docker/data:/usr/src/app/data  jaliph/whatsapp-greeter:latest  bash
```

