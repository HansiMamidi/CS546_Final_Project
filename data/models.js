import { studentCollection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import validator from './validator.js';
const method = {
  async create(firstName,lastName,emailId,CWID,program,major,password,confirmPassword) {
    firstName = validator.checkString(firstName, 'First Name');
    lastName = validator.checkString(lastName, 'Last Name');
    emailId = validator.checkString(emailId, 'Email Id');
    emailId = validator.validateEmailId(emailId);
    program = validator.checkString(program, 'Program');
    major = validator.checkString(major, 'Major');
    password = validator.checkString(password, 'Password');
    password = validator.validatePassword(password);
    confirmPassword = validator.checkString(confirmPassword, 'Confirm Password')
    confirmPassword = validator.validatePassword(confirmPassword);

    const salt = await bcrypt.genSalt(10);
    const passwords = await bcrypt.hash(password, salt);
    const confirmPasswords = await bcrypt.hash(confirmPassword, salt);
    const student_id = new ObjectId();

    let obj1 = {
      _id: student_id,
      student_id,
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      campus_id: CWID,
      program: program,
      major: major,
      password:passwords,
      confirmPassword:confirmPasswords
    };
    const infoCollection = await studentCollection();
    const insertInfo = await infoCollection.insertOne(obj1);
  }
};
export default method;