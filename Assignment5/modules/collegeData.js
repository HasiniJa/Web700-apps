const fs = require('node:fs');

class Data{
    constructor(students,courses){
        this.students=students;
        this.courses=courses;
    }
}

let dataCollection=null;

// Initialize Function

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
            if (err) {
                reject('unable to read students.json');
                return;
            }

            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    reject('unable to read courses.json');
                    return;
                }

                let students = JSON.parse(studentDataFromFile);
                let courses = JSON.parse(courseDataFromFile);

               
                dataCollection = new Data(students, courses);
                
            
                resolve();
            });
        });
    });
}

// getallstudents function
function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject('no results returned');
        }
    });
}

// getTAs function
function getTAs() {
    return new Promise((resolve, reject) => {
        if (dataCollection) {
            let tas = dataCollection.students.filter(student => student.TA === true);
            if (tas.length > 0) {
                resolve(tas);
            } else {
                reject('no results returned');
            }
        } else {
            reject('data not initialized');
        }
    });
}

// getcourses function
function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject('no results returned');
        }
    });
}

//get students by course function

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {

        // Filter students by the specified course
       
        const filteredStudents = dataCollection.students.filter(student => student.course === course);

        // Check if any students were found
        if (filteredStudents.length > 0) {
            
 
            resolve(filteredStudents);
        } else {
            // Reject if no results are found
            reject("No results returned");
        }
    });
}

// get student by their student number function
function getStudentByNumber(num) {
    return new Promise((resolve, reject) => {
       
        // Find the student
        const student = dataCollection.students.find(student => student.studentNum === IntParse(num));

         // Check if any students were found
         if (filteredStudents.length == 1) {
            
            resolve(filteredStudents);
        } else {
            // Reject if no results are found
            reject("No results returned");
        }
        /*if (student) {        
            resolve(student);
        } else {
            reject(`No results returned for student number: ${num}`);
        }*/
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
      if (!studentData) reject("No student data provided");
      
      studentData.TA = studentData.TA ? true : false;
      studentData.studentNum = dataCollection.students.length + 1;
      dataCollection.students.push(studentData);
  
      resolve();
    });
  }
  


module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNumber,
    addStudent
};



