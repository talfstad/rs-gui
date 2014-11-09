module.exports = {
  
  port: 9000,
  
  sessionSecret: 'bb-login-secret',
  
  cookieSecret: 'bb-login-secret',

  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),

  //DB Connection information
  dbConnectionInfo: {
    host : '54.187.151.91',
    user : 'root',
    password : 'derekisfat',
    database : 'domains_dev'
  },

  //DB userdata to omit from client
  userDataOmit: ['hash', 'auth_token', 'secret_username', 'id', 'approved'],



  /* 
   * DEPLOYMENT MODE: client-mode will serve only
   * the client service calls. true to enable
   * false to disable. If false, server will be in
   * admin mode and will serve only user admin pages
   */
  clientMode: false




};
