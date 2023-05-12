const Employee   = require('../models/Employee');

//get all employees
const getAllEmployees = async(req, res)=>{
   const employees = await Employee.find();
   if(!employees) return res.status(204).json({'message': 'No employees found'})
   res.json(employees)
   console.log(employees)
}

//creating new employee
const createNewEmployee = async (req, res)=>{ 
    //set required to true for dateOfBirth and Gender yourself if you wish to be added during employee creation
 if(!req?.body.firstname || !req?.body.secondname || !req?.body.email || !req?.body.phone){
    return res.status(400).json({'message': 'First and Second names are required'}) //returning bad request, these are required
 }
 //exists?
 try {
    const result = await Employee.create({
        firstname: req.body.firstname,
        secondname: req.body.secondname,
        email: req.body.email,
        phone: req.body.phone
    });
    res.status(201).json(result)// successful created status with the resulsts
    
 } catch (err) {
    console.error(err)
 }
}

//update employee
const updateEmployee = async (req, res)=>{
if(!req.body?.id){
    return res.status(400).json({'message': 'ID is required'}) //returning bad request, this is required
}
const employee = await Employee.findOne({_id: req.body.id}).exec(); //Mongo is going to get this
    if(!employee){
        return res.status(204).json({'message': `No employees matches the ID ${req.body.id}`}); //returning not existing status/not found
    }

    if(req.body?.firstname) employee.firstname = req.body.firstname; //first name and last name is set to new parameter if provided
    if(req.body?.secondname) employee.secondname = req.body.secondname;
    if(req.body?.email) employee.email = req.body.email;
    if(req.body?.phone) employee.phone = req.body.phone;
    const result = await employee.save();
    res.json(result);
    // console.log(result)
}

//delete employee
const deleteEmployee = async (req, res)=>{
    if(!req.body?.id){
        return res.status(400).json({'message': 'ID is required'}) //returning bad request, this is required
    }
    const employee = await Employee.findOne({_id: req.body.id}).exec(); //Mongo is going to get this
    if(!employee){
        return res.status(204).json({'message': `No employees matches the ID ${req.body.id}`});
    }
    const result = await employee.deleteOne({_id: req.body.id})//delete employee with the id
    res.json(result);

}

const getEmployee = async (req, res)=>{
    if(!req?.params?.id) return res.status(400).json({'message': 'ID is required'}) //returning bad request, this is required
    const employee = await Employee.findOne({_id: req.params.id}); // getting id of the employee
    if(!employee){
        return res.status(204).json({'message': `No employee matches the ID ${req.params.id}`});
    }
    res.json({employee});
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}