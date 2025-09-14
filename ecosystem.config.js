module.exports = {
  apps: [
    {
      name: "gliwicka111",
      // Run the Next.js production server via npm
      script: "npm",
      args: "start",
      // Environment variables like PORT, HOSTNAME, and NODE_ENV should
      // be provided by the hosting environment, not within this file.
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
