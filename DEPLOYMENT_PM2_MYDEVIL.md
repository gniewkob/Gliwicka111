# Deployment (Next.js + PM2 on mydevil.net)

## One-time setup
1. SSH to the server and go to the project directory, e.g.:
   ```bash
   cd /usr/home/vetternkraft/apps/nodejs/Gliwicka111
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Build production bundle:
   ```bash
   npm run build
   ```
4. Start with PM2 using the ecosystem file:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

## Autostart after reboot (shared hosting)
PM2 system-level startup may not be available. Add a user crontab entry:
```bash
crontab -e
```
And insert (adjust the path to `pm2` from `which pm2`):
```
@reboot /home/vetternkraft/.nvm/versions/node/v20.19.0/bin/pm2 resurrect
```

## Reverse proxy / domain mapping
In the mydevil panel (WWW/Node.js), map your domain to the Node.js app listening on **127.0.0.1:56788**.

## Useful commands
```bash
pm2 status
pm2 logs gliwicka111
pm2 restart gliwicka111 --update-env
pm2 delete gliwicka111
sockstat -4 -l | grep 56788   # Check if port is listening (FreeBSD)
```

## Notes
- The app binds to `127.0.0.1` (required on mydevil) and port `56788`.
- `next start` requires an up-to-date build; re-run `npm run build` after code changes.
- If you prefer env vars instead of CLI args, you can change the app to:
  ```js
  script: "npm",
  args: "start",
  env: { NODE_ENV: "production", PORT: "56788", HOST: "127.0.0.1" }
  ```
  and set your `package.json` "start" to `"next start"`.
```
