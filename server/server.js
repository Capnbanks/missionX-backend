const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const cors = require("cors")


//enable express
const app = express();


//middleware
app.use(cors())

app.use(express.json())

//create pool connect to database
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:5
});

//test connection 
app.get("/", (req,res) => {
    pool.query("SELECT * from student;", (err,result) => {
        if (err) {
         console.log(err);
        }
        console.log("endpoint hit!!");
        res.send(result);
        
    })
 })

 app.get("/student-projects", (req,res) => {
    pool.query("select name, profile_pic,date_submitted,date_started,date_completed,submission from student inner join student_projects on student.student_id = student_projects.student_id;", (err,result) => {
        if (err) {
         console.log(err);
        }
        console.log("endpoint hit!!");
        res.send(result);
        
    })
 })

app.post("/project-submissions", (req,res) => {
    pool.execute("Insert into student_projects (student_id, project_id,submission,date_submitted) value (3,3,?,curdate())",
    [req.body.url ],
    (err,result)=> {
        if (err) return console.log(err);
        console.log(result);
        return res.sendStatus(200)
    }
    )
    console.log(req.body.url);
} )


 //port
const PORT = process.env.PORT
app.listen(PORT,(err)=>{
    if(err) {
        console.log(err);
    }else {
        console.log(`server listening on http://localhost:${PORT}`);
    }
})