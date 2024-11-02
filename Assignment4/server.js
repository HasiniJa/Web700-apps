/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Hasini Jayasekara Student ID: 165513235 Date: 11/02/2024
*
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/ 
 


const HTTP_PORT =process.env.PORT ||8080;
const express = require('express');
const app = express();
const collegeData = require('./modules/collegeData');
const path = require('path');
const { addStudent } = require('./modules/collegeData');


// Middleware to serve static files
app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get('/students', (req, res) => {
    
    if (req.query.course) {
        const course = parseInt(req.query.course);

        
        if (course >= 1 && course <= 7) {
            collegeData.getStudentsByCourse(course)
                .then((students) => {
                    if (students.length > 0) {
                        res.json(students); 
                    } else {
                        res.json({ message: "no results" }); 
                    }
                })
                .catch((err) => {
                    console.error('Error fetching students by course:', err); 
                    res.json({ message: "no results" }); 
                });
        } else {
          
            res.status(400).json({ message: "Invalid course value. Must be between 1 and 7." });
        }
    } else {
     
        collegeData.getAllStudents()
            .then((students) => {
                if (students.length > 0) {
                    res.json(students); 
                    
                }
            })
            .catch((err) => {
                console.error('Error fetching all students:', err); 
                res.json({ message: "no results" }); 
            });
    }
});

app.get('/courses',(req,res)=>{

    collegeData.getCourses()
    .then((courses) => {

        res.json(courses);
    })
    .catch((err)=>{

        res.json({ message: "no results" });

    });
});

app.get('/tas',(req,res)=>{

    collegeData.getTAs()
    .then((tas)=>{
        res.json(tas);
    })
    .catch((err)=>{

        res.json({ message: "no results" });

    });
});


app.get('/students/:num', (req, res) => {
    const Num = req.params.num;

    collegeData.getStudentByNumber(Num)
        .then(students => {
            console.log(students);  // Add this line to log the result
            if (students) {
                res.json(students);
            } else {
                res.json({ message: "no results" });
            }
        })
        .catch(err => {
            console.error('Error fetching student by number:', err);
            res.json({ message: "no results" });
        });
});

// Route to handle form submission for adding a new student
app.post('/addstudent', (req, res) => {

    const studentData = {
        studentNum: req.body.studentNum,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA === 'true', 
        status: req.body.status,     
        course: req.body.course
    };


    addStudent(studentData)
        .then(() => {
            res.redirect('/students'); // Redirect to a different page or send a response
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send("Unable to add student");
        });
});


// Route to display the list of students
app.get('/students', (req, res) => {
    collegeData.getStudents()
        .then((students) => {
            res.send(students); 
        })
        .catch((err) => {
            res.status(500).send("Error retrieving students: " + err);
        });
});



// Route to serve the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route for serving the about.html file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route for serving  the htmldemo file
app.get('/htmlDemo',(req,res)=>{

    res.sendFile(path.join(__dirname,'views','htmlDemo.html'));

});

//Route for serving the 404.html file
app.get('/404',(req,res)=>{

    res.sendFile(path.join(__dirname,'views','404.html'));

});

//Route for serving the addstudents.html file
app.get('/addstudent', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','addstudent.html'));
});

// Initialize the data and start the server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to start the server: ${err}`);
    });
