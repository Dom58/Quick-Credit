import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
// import userRoute from './routes/userRoute';
// import loanRoute from './routes/loanRoute';
import pool from './models/dbCon';
import createTables from './models/createTables';
import documentation from '../swagger.json';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(userRoute);
// app.use(loanRoute);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send({ status: 200, message: 'Welcome to Quick credit web application' });
});
app.use('/api/documentations', swaggerUi.serve, swaggerUi.setup(documentation));
app.listen(port, () => {
  console.log(`Server is runnig on (http://127.0.0.1:${port})`);
});
export default (app, pool);
