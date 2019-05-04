import express from 'express'
import bodyParser from 'body-parser';

import userRoute from './routes/userRoute';
import loanRoute from './routes/loanRoute';


var app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(userRoute);
app.use(loanRoute);

const port = process.env.PORT || 4000;

app.get('/', (req,res) =>{
	res.send({ status:200, message:'Welcome to Quick credit web application'});
});
app.listen(port, () =>{
	console.log(`Server is runnig on (http://127.0.0.1:${port})`);
})
export default app;