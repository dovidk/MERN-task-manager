const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./db/mongoose');
const Task = require('./models/task');

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const port = process.env.PORT || 80;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use('/user', userRouter);
app.use('/task', taskRouter);





app.listen(port, () => {
    console.log('app is up');
});