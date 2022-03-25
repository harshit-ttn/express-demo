// Here / means -> /api/courses

const express = require('express');
const router = express.Router();

const courses = [
    {id:1,name:'course1'},
    {id:2,name:'course2'},
    {id:3,name:'course3'},
];


router.get('/',(req,res)=>{
    res.send(courses);
});


// POST HTTP Method
router.post('/',(req,res) =>{
    
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
router.delete('/:id',(req,res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);
})


// PUT HTTP Method
router.put('/:id',(req,res) => {
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


router.get('/:id',(req,res) =>{
    const course = courses.find((c) => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    res.send(course);
})


module.exports = router;
