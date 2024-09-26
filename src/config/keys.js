require("dotenv").config();

module.exports = {



  app: {
    serverURL: process.env.BASE_SERVER_URL,
    apiURL: process.env.BASE_API_URL,
    clientURL: "http://localhost:3000" || process.env.BASE_CLIENT_URL,
  },




  database: process.env.DB_CONNECT,
  
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenLife: process.env.ACCESS_TOKEN_LIFE,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
  },
 
   instance :{
    key_id: process.env.KEY_ID,
     key_secret:  process.env.KEY_SECRET
  },

 

}
