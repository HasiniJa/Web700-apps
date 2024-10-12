var HTTP_PORT =process.env.PORT ||8080;
var express = require("express");
var app = express();
const collegeData = require('./modules/collegeData');
const path = require('path');

// Middleware to serve static files
app.use(express.static("views"));

//Get Students route
app.get('/students', (req, res) => {
   
    if (req.query.course) {
        const course = parseInt(req.query.course);  
        
        if (course >= 1 && course <= 7) {
            
            collegeData.getStudentsByCourse(course)
                .then((students) => {
                   
                    res.json(students);
                })
                .catch((err) => {
                    
                    res.json({ message: "no results" });
                });
        } else {
           
            res.status(400).json({ message: "Invalid course value. Must be between 1 and 7." });
        }
    } else {
       
        collegeData.getAllStudents()
            .then((students) => {
              
                res.json(students);
            })
            .catch((err) => {
               
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


// Route to handle /student/num
app.get('/student/:num', (req, res) => {
    const studentNum = req.params.num; 
    collegeData.getStudentByNumber(studentNum)
        .then(student => {
            res.json(student); 
        })
        .catch(err => {
            res.json({ message: "no results" });
        });
});

// Route for serving the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
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
