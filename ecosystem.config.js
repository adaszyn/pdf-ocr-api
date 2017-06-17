module.exports = {
  apps : [

    // First application
    {
      name      : 'OCR-API',
      script    : 'server.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy : {
    production : {
      user : 'wojtek',
      host : process.env.EC2_INSTANCE_IP,
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/opt/ocr-api',
      'post-deploy' : 'NODE_ENV=development npm install && pm2 reload ecosystem.config.js --env production'
    }
  //   dev : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/development',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
  //     env  : {
  //       NODE_ENV: 'dev'
  //     }
  //   }
  }
};
