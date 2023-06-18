const app = require("./src/app");
const sequelize = require('./src/db');

const port = process.env.PORT || 3001;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`------- SERVER ACTIVO ${port} ------`);
    });
});