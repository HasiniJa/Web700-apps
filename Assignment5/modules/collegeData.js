const fs = require('node:fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize function
function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
            if (err) {
                reject('Unable to read students.json');
                return;
            }

            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    reject('Unable to read courses.json');
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

// getAllStudents function
function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject('No results returned');
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
                reject('No TAs found');
            }
        } else {
            reject('Data not initialized');
        }
    });
}

// getCourses function
function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject('No courses found');
        }
    });
}

// getStudentsByCourse function
function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course === course);
        if (filteredStudents.length > 0) {
            resolve(filteredStudents);
        } else {
            reject('No results found');
        }
    });
}

// getStudentByNumber function
function getStudentByNumber(num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(student => student.studentNum === parseInt(num));
        if (student) {
            resolve(student);
        } else {
            reject('No results found');
        }
    });
}

// addStudent function
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        if (!studentData) reject('No student data provided');
        
        studentData.TA = studentData.TA ? true : false;
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);

        resolve();
    });
}

// getAllCourses function
function getAllCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject('No courses available');
        }
    });
}

// getCourseById function
function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId === id);
        if (course) {
            resolve(course);
        } else {
            reject('Course not found');
        }
    });
}

// updateStudent function
function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        const studentIndex = dataCollection.students.findIndex(student => student.studentNum === studentData.studentNum);

        if (studentIndex !== -1) {
            // Update the student in the array
            dataCollection.students[studentIndex] = { ...dataCollection.students[studentIndex], ...studentData };
            resolve();
        } else {
            reject('Student not found');
        }
    });
}

module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNumber,
    addStudent,
    getCourseById,
    getAllCourses,
    updateStudent
};
