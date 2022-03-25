const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet')
const Joi = require('joi')
const logger = require('./logger')
const express = require('express');
const app = express();


console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

app.set('view engine','pug');
app.set('views','./views');  //default

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());


// Configuration
console.log('Application Name: '+config.get('name'));
console.log('Mail Server: '+config.get('mail.host'));
console.log('Mail Password: '+config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}


// Db work...
dbDebugger('Connected to the database...');




app.use(logger);

app.use(function(req,res,next){
    console.log('Authenticating...');
    next();
})

const courses = [
    {id:1,name:'course1'},
    {id:2,name:'course2'},
    {id:3,name:'course3'},
];

app.get('/',(req,res) => {
    // res.send('Hello World!!!');
    res.render('index',{title: 'My Express App',message:'Hello'});
});

app.get('/api/courses',(req,res)=>{
    res.send(courses);
});



// POST HTTP Method
app.post('/api/courses',(req,res) =>{
    
    const { error } = validateCourse(req.body);
    if(error){
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }


    const course = {
        id:courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});


// DELETE HTTP Method
app.delete('/api/courses/:id',(req,res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);
})


// PUT HTTP Method
app.put('/api/courses/:id',(req,res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find((c) => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    // Validate
    const { error } = validateCourse(req.body); //destructuring
    
    // If invalid, return 400 - Bad request
    if(error){
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    // Update course
    course.name = req.body.name
    //Return the updated course
    res.send(course);
});

// function for input validation
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course,schema);
}




app.get('/api/courses/:id',(req,res) =>{
    const course = courses.find((c) => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    res.send(course);
})

app.get('/api/post/:year/:month',(req,res) =>{
    // res.send(req.params);  
    res.send(req.query);  // for query string
})

// PORT
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}...`));



