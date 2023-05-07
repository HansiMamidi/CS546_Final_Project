import { Router } from "express";
import path from "path";
import { studentsInfo } from "../data/index.js";
import assignmentData from '../data/assignments.js'
import { title } from "process";
import validator from "../validator.js";

const router = Router();
router
  .route("/")
  // .get(async (req, res) => {
  //   //code here for GET
  //   try{
  //     res.render('register', {title: "Register"});
  //   } catch (e) {
  //     res.status(404).json({error: e});
  //   }

  // })
  .post(async (req, res) => {
    let isclicked = req.body.clicked;
    console.log(isclicked);
    if (isclicked === "registered") {
      let firstName = req.body.first_name;
      let lastName = req.body.last_name;
      let emailId = req.body.email_id;
      let CWID = req.body.cwid;
      let program = req.body.program;
      let major = req.body.major;
      let password = req.body.create_pass;
      let confirmPassword = req.body.confirm_pass;
      try {
        firstName = validator.checkString(firstName, "First Name");
        lastName = validator.checkString(lastName, "Last Name");
        emailId = validator.checkString(emailId, "Email Id");
        emailId = validator.validateEmailId(emailId);
        program = validator.checkString(program, "Program");
        major = validator.checkString(major, "Major");
        password = validator.checkString(password, "Password");
        password = validator.validPassword(password);
        confirmPassword = validator.checkString(
          confirmPassword,
          "Confirm Password"
        );
        confirmPassword = validator.validPassword(confirmPassword);

        if (password === confirmPassword) {
          const student = await studentsInfo.create(
            firstName,
            lastName,
            emailId,
            CWID,
            program,
            major,
            password,
            confirmPassword
          );
          res.json(student);
        } else {
          const error = "Confirm password must be similar to password.";
          return res.status(400).render("register", {
            title: "Register",
            loginPage: false,
            firstName: firstName,
            lastName: lastName,
            CWID: CWID,
            emailId: emailId,
            program: program,
            major: major,
            error,
          });
        }
      } catch (e) {
        res.status(404).render("register", {
          title: "Register",
          loginPage: false,
          firstName: firstName,
          lastName: lastName,
          emailId: emailId,
          CWID: CWID,
          program: program,
          major: major,
          password: password,
          confirmPassword: confirmPassword,
          error: e,
        });
        return;
      }
    }
    if (isclicked === "loggedIn") {
      let emailId = req.body.emailId;
      let password = req.body.password;
      try {
        emailId = validator.checkString(emailId, "Email Id");
        emailId = validator.validateEmailId(emailId);
        password = validator.checkString(password, "Password");

        const loginData = await studentsInfo.get_details(emailId, password);
        if(!loginData) res.status(400).render('login', {error: "Couldn't Login"})
        req.session.user= {studentId: loginData._id, firstName: loginData.firstName, lastName: loginData.lastName, emailAddress: loginData.emailId}
        console.log(req.session.user)

        res.json(loginData);
      } catch (e) {
        res.status(404).render("register", {
          title: "Login",
          loginPage: true,
          emailId: emailId,
          error: e,
        });
        return;
      }
    }
  });

  router
  .route('/homepage')
  .get(async (req, res) => {
    res.sendFile(path.resolve('MainPageUpdated_2/mainpage.html'));
    //code here for GET
  })
  .post(async (req, res) => {
    console.log("homepage",req.body)
    try{
      let task_details=req.body
      let studentId = req.session.user.studentId
      let todo_assignment = task_details.lane_todo
      let doing_assignment = task_details.lane_doing
      let done_assignment = task_details.lane_done
      let priority = "low" //check the id for priority from form
      let grade = "0"
      let subject = task_details.subject_dropdown 
      let dueDate = "00/00/0000" //check the id for due date from form
      let notes = task_details.form_notes

      studentId = validator.checkId(studentId, "Student ID");
      priority = validator.checkString(priority, 'Priority');
      grade = validator.checkNumber(grade, 'Grade');
      subject = validator.checkString(subject, 'Subject');
      dueDate = validator.checkString(dueDate, 'Due Date');
      notes = validator.checkString(notes, 'Notes');

      if(todo_assignment){
        let assignmentName = todo_assignment
        let status = "to-do"
        // let grade = "0"

        assignmentName = validator.checkString(assignmentName, 'Assignment Name');
        status = validator.checkString(status, 'Status');  

        let insertData =await assignmentData.create(studentId, assignmentName, status, priority, grade, subject, dueDate, notes)
        res.json(insertData)
      }
      else if(doing_assignment){
        let assignmentName = doing_assignment
        let status = "doing"
        let assignmentId = await assignmentData.getId(assignmentName)
        assignmentId = validator.checkId(assignmentId, 'Assignment ID');
        // let grade = "0"

        assignmentName = validator.checkString(assignmentName, 'Assignment Name');
        status = validator.checkString(status, 'Status');  

        let insertData =await assignmentData.update(studentId, assignmentId, assignmentName, status, priority, grade, subject, dueDate, notes)
        res.json(insertData)

      }
      else if(done_assignment){
        let assignmentName = doing_assignment
        let status = "done"
        let assignmentId = await assignmentData.getId(assignmentName)
        assignmentId = validator.checkId(assignmentId, 'Assignment ID');
        // let grade = "0"

        assignmentName = validator.checkString(assignmentName, 'Assignment Name');
        status = validator.checkString(status, 'Status');  

        let insertData =await assignmentData.update(studentId, assignmentId, assignmentName, status, priority, grade, subject, dueDate, notes)
        res.json(insertData)

      }  
    } catch(e){
      // console.log(e)
      res.status(500).json({error: e});
    }
  });


  // router
  // .route('/courses')
  // .get(async (req, res) => {
  //   res.render('courses',{title:"Add Courses"})
  //   //code here for GET
  // })
  // .post(async (req, res) => {
  //   console.log(req.body.courseDetails)

  // });
  
export default router;
 