module.exports = {
  rows: 100,
  cols: 100,
  maxplayers: 100,
  port: process.env.PORT || 3000,
  cookieSecret: "terceseikooc",
  db:
  // {
  //   host: "mnio.database.windows.net",
  //   user: "shallowred",
  //   password: "Lucastom2!",
  //   database: "mniosql"
  // }
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "mniosql"
  }
};
