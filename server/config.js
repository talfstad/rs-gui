module.exports = {
  
  port: 3000,
  
  sessionSecret: 'bb-login-secret',
  
  cookieSecret: 'bb-login-secret',

  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),

  //DB Connection information
  dbConnectionInfo: {
    // host : '54.187.184.91',
    host : 'localhost',
    user : 'root',
    password : 'derekisfat',
    database : 'domains_dev'
  },

  //DB userdata to omit from client
  userDataOmit: ['hash', 'auth_token', 'secret_username', 'id', 'approved'],

};
