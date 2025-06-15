module.exports = {
  apps: [
    {
      name: "dotheg",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: "cluster",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
