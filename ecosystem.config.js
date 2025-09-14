module.exports = {
  apps: [
    {
      name: "gliwicka111",
      // Run the Next.js production server via npm
      script: "npm",
      args: "start",
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
