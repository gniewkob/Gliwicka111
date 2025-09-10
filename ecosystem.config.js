module.exports = {
  apps: [
    {
      name: "gliwicka111",
      // Use Next.js binary directly to avoid shell indirection
      script: "node_modules/next/dist/bin/next",
      args: "start -p 56788 -H 127.0.0.1",
      cwd: "./",
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      time: true,
      // Optional log files (PM2 also manages its own logs if omitted)
      out_file: ".pm2/out.log",
      error_file: ".pm2/err.log"
    }
  ]
};
