/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Hasini Jayasekara Student ID: 165513235 Date: 11/02/2024
*
*  Online (Vercel) Link:https://vercel.com/hasini-jayasekaras-projects/assignment5
*
********************************************************************************/ 
 
const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const collegeData = require('./modules/collegeData');
const path = require('path');
const { addStudent } = require('./modules/collegeData');

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Middleware to set the activeRoute based on the current URL path
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + route.replace(/\/(.*)/, "");
    next();
});

// Middleware to register helpers for navigation links
app.locals.navLink = function(url, options) {
    return '<li' + 
        ((url === app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
};

app.locals.equal = function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Ejs Helper 'equal' needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
};


// Route to display all students with optional course filter
app.get('/students', (req, res) => {
    if (req.query.course) {
        const course = parseInt(req.query.course);
        if (course >= 1 && course <= 7) {
            collegeData.getStudentsByCourse(course)
                .then((students) => {
                    res.render('students', { students: students });
                })
                .catch((err) => {
                    res.render('students', { message: "No results" });
                });
        } else {
            res.status(400).render('students', { message: "Invalid course value. Must be between 1 and 7." });
        }
    } else {
        collegeData.getAllStudents()
            .then((students) => {
                res.render('students', { students: students });
            })
            .catch((err) => {
                res.render('students', { message: "No results" });
            });
    }
});

// Route to display all courses
app.get('/courses', (req, res) => {
    collegeData.getAllCourses()
        .then(courses => {
            res.render('courses', { courses: courses });
        })
        .catch(error => {
            res.render('courses', { message: "No results" });
        });
});

// Add Student Form Route
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
            res.redirect('/students');
        })
        .catch((err) => {
            res.status(500).send("Unable to add student");
        });
});

app.get('/students/:studentNum', (req, res) => {
    const studentNum = req.params.studentNum;  // Get the student number from the URL

    collegeData.getStudentByNumber(studentNum)
        .then((student) => {
            if (student) {
                res.render('student', { student: student });
            } else {
                res.status(404).send('Student not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Error retrieving student details.');
        });
});

// Update Student Route
app.post('/student/update', (req, res) => {
    const studentData = {
        studentNum: req.body.studentNum,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA === 'on',
        status: req.body.status,
        course: req.body.course
    };

    collegeData.updateStudent(studentData)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            console.error('Error updating student:', err);
            res.status(500).send('Unable to update student');
        });
});

// Generic route for dynamic pages like About, HTML Demo
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.render('main', { title: page.charAt(0).toUpperCase() + page.slice(1) });
});



// Define routes
app.get('/', (req, res) => {
  res.render('main', { body: '<h1>Welcome to the Home Page</h1>', activeRoute: '/' });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo');
});

app.get('/addstudent', (req, res) => {
    res.render('addstudent');
});


app.get('/', (req, res) => {
    res.render('main', {
      body: 'This is the body content',
      activeRoute: activeRoute
    });
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
