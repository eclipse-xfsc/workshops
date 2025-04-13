# Running Federation1
** First: you must ensure that the `conf/ui.env` and `conf/zonemanager.conf` files have Linux style file endings! Change CRLF to LF in VScode for example.**

1. Opening a Terminal in the 02_TDZM/federation1 folder
2. Start the TDZM with `docker compose up -d fed1-dns`

You can now check out it is running by logs, or the postman health status.


# Running Federation2
** First: you must ensure that the `conf/ui.env` and `conf/zonemanager.conf` files have Linux style file endings! Change CRLF to LF in VScode for example.**

1. Opening a Terminal in the 02_TDZM/federation2 folder
2. Start the TDZM with `docker compose up -d fed2-dns`

You can now check out it is running by logs, or the postman health status.

