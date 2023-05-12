const express = require('express');
const app = express();
const {connect, connection} = require('mongoose');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const verifyJWT = require('./middleware/verifyJWT');
const PORT = 3001;
const {urlencoded, json} = require('body-parser');

try {
    //password is john
    connect('mongodb+srv://john:john@grondycluster.fgxqih1.mongodb.net/?retryWrites=true&w=majority',{
        useNewUrlParser: true,
       
        // useFindAndModify: false, use this to create an error and see if your error handlers are working
        useUnifiedTopology: true
    }).then(()=>{
        app.get('/', (req, res)=>{
            res.send('hello world');//sending text to server, test
        })
    })

//ensuring a connection is established to database, if it fails, throws a database error, notice db.once and not db.on, i tested it and db.on was not throwing an error, maybe its deprecated
const db = connection
db.once('error',(err) => {
    console.error(`connection fail => ${err}`)
})
db.once('open',() => {
    console.log('Database Connection Established!')
})

//Remember this works like a waterfall, as it goes downwards to empoyees route
app.use(urlencoded({extended: false}));
app.use(json());
// app.use('/uploads', express.static('uploads'))

// const PORT = process.env.PORT || 5001 u can still use this
// app.use('api/employee', EmployeeRoute);
// app.use('/api', AuthRoute)

//all your REST APIs are excecuted from here, these are the end points
//smthing like locahost:3001/auth ...etc
app.use("/register", require('./routes/api/register '));
app.use("/auth", require('./routes/api/auth'));
app.use("/refresh", require('./routes/api/refresh'));
app.use("/logout", require('./routes/api/logout'));

app.use(verifyJWT);//protecting the routes when accessing employees with jwt
app.use("/employees", require('./routes/api/employees'));


} catch (error) {
    console.error(`error occured here ${error}`); //still will catch any error that might occure in the course of code execution
}
/*
N/B the code is wrapped inside try, then comes the catch error that throws an
 error for anything during code execution, even if u mispell or trying to access something that doesn't exist or undefined
 */
app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});