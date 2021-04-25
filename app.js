const Joi = require('joi')
const express = require('express');
const bodyParser= require('body-parser');
const { json } = require('express');
const { min } = require('joi/lib/types/array');
const e = require('express');
app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

const courses =[];
const students=[];
///// HOME
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/home.html')
});

///// COURSES

// Create Course
app.get('/web/courses/create',(req,res)=>{
    res.sendFile(__dirname+'/views/create_course.html')
});

app.post('/api/courses/create',(req,res)=>{
    const { error } = validateCourse(req.body); //result.error
    if (error){
        return res.status(400).send(error.details[0].message);
    }


    const course = {
        c_name: req.body.c_name,
        c_code: req.body.c_code,
        c_id: courses.length+1,
        c_description: req.body.c_description
    };

    courses.push(course);
    printCourse(course,res,true);
});

// Update Courses
app.put('/api/courses/:id',(req,res)=>{
    // Look up the course
    // if not exist. return 404
    const course= courses.find(c => c.c_id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Course not Found!!');
    }  
    // validate
    // if invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); //result.error
    if (error){
        return res.status(400).send(error.details[0].message);
    }

    // update course
    course.c_name= req.body.c_name;
    course.c_code= req.body.c_code;
    course.c_description= req.body.c_description;
    // Return the updated course
    printCourse(course,res,true);
});

// Delete Course
app.delete('/api/courses/:id',(req,res)=>{
    // Look up the course
    // if not exist return 404
    const course= courses.find(c => c.c_id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Course not Found!!');
    } 
    
    
    // Delete
    const index= courses.indexOf(course)
    courses.splice(index,1)

    // return the same deleted course
    printCourse(course,res,true);
});


// Get Courses
app.get('/api/courses',(req,res)=>{
    if (courses.length===0){
        res.send('No Courses Yet!');
    }
    else{
        // courses.forEach(printCourse);
        printCourses(courses,res);
    }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// STUDENTS

// Create Student
app.get('/web/students/create',(req,res)=>{
    res.sendFile(__dirname+'/views/create_student.html')
});

app.post('/api/students/create',(req,res)=>{
    const { error } = validateStudent(req.body); //result.error
    if (error){
        return res.status(400).send(error.details[0].message);
    }


    const student = {
        s_name: req.body.s_name,
        s_code: req.body.s_code,
        s_id: students.length+1
    };

    students.push(student);
    printStudent(student,res,true)

});



// Update Students
app.put('/api/students/:id',(req,res)=>{
    // Look up the course
    // if not exist. return 404
    const student= students.find(c => c.s_id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).send('Student not Found!!');
    }  
    // validate
    // if invalid, return 400 - Bad request
    const { error } = validateStudent(req.body); //result.error
    if (error){
        return res.status(400).send(error.details[0].message);
    }

    // update student
    student.s_name= req.body.s_name;
    student.s_code= req.body.s_code;
    // Return the updated student
    printStudent(student,res,true);
});

// Delete Student
app.delete('/api/students/:id',(req,res)=>{
    // Look up the course
    // if not exist return 404
    const student= students.find(c => c.s_id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).send('Student not Found!!');
    } 
    
    
    // Delete
    const index= students.indexOf(student)
    students.splice(index,1)

    // return the same deleted course
    printStudent(student,res,true);
});

// Get Students
app.get('/api/students',(req,res)=>{
    if (students.length===0){
        res.send('No Students Yet!');
    }
    else{
        // courses.forEach(printCourse);
        printStudents(students,res);
    }
});




//////////////////////
function validateCourse(course){
    const schema = {
        c_name: Joi.string().min(5).required(),
        c_code: Joi.string().regex(/^[a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$/i,'3 Letters Followed by 3 Numbers').required(),
        c_description: Joi.string().max(200).allow('').optional()
    };
    return Joi.validate(course, schema);   
}

function validateStudent(student){
    const schema = {
        s_name: Joi.string().regex(/^[a-zA-Z-']+$/i,'only letters in both cases, apostrophe and dashes are allowed').required(),
        s_code: Joi.string().length(7).required(),
    };
    return Joi.validate(student, schema);
}

function printCourse(course,res,last){
    res.write(`Course Name: ${course.c_name}`);
    res.write('\n');
    res.write(`Course Code: ${course.c_code}`);
    res.write('\n');
    res.write(`Course ID: ${course.c_id}`);
    res.write('\n');
    res.write(`Course Description: ${course.c_description}`);
    res.write('\n');
    res.write('****************');
    res.write('\n');
    if (last){
        res.end();
    }
}

function printStudent(student,res,last){
    res.write(`Student Name: ${student.s_name}`);
    res.write('\n');
    res.write(`Student Code: ${student.s_code}`);
    res.write('\n');
    res.write(`Student ID: ${student.s_id}`);
    res.write('\n');
    res.write('****************');
    res.write('\n');
    if (last){
        res.end();
    }
}

function printCourses(courses,res){
    var i;
    for (i=0 ; i<courses.length; i++){
        if (i === courses.length-1){
            printCourse(courses[i],res,true);
        }
        else{
            printCourse(courses[i],res,false);
        }
    }
}

function printStudents(students,res){
    var i;
    for (i=0 ; i<students.length; i++){
        if (i === students.length-1){
            printStudent(students[i],res,true);
        }
        else{
            printStudent(students[i],res,false);
        }
    }
}
//////////////////////

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}...`));