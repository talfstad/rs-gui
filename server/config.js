module.exports = {
  
  port: 3000,

  sessionSecret: 'bb-login-secret',
  
  cookieSecret: 'bb-login-secret',

  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),

  //DB Connection information
  dbConnectionInfo: {
    //host : '54.149.38.119',
    host : 'localhost',
    user : 'root',
    password : 'derekisfat',
    database : 'domains_dev',
    multipleStatements: true
  },

  //DB userdata to omit from client
  userDataOmit: ['hash', 'auth_token', 'secret_username', 'id', 'approved'],

  //base_clickjacker_dir: '/Users/Troy/git/cjgui'
  //base_clickjacker_dir: '/Users/alfstad/Desktop/cjguiMarionette/test/notworking/cjgui'
  
  base_clickjacker_dir: '/var/www/cjgui',

  api_key_map: {
    admin : '321ccbdbe5133ef3df9d3bf1db18580153c0e5a70844b193cfa4e40c3194f623',
    balling : '137a51e0d546fb392034b1d91e5b104555955e2ec25f5d3379300947855a65fc'
  }

};
