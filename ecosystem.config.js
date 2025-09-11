module.exports = {
  apps: [
    {
      name: "gliwicka111",
      // Run standalone server produced by `next build`
      script: "node",
      args: ".next/standalone/server.js",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: "56788",
        HOSTNAME: "127.0.0.1"
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
