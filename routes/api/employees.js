const express  = require('express');
const router   = express.Router();

const verifyJWT = require('../../middleware/verifyJWT');

const employeesController  = require('../../controllers/employeesController');
//your CRUD operation functions
router.route('/')
.get(employeesController.getAllEmployees)
.post(employeesController.createNewEmployee)
.put(employeesController.updateEmployee)
.delete(employeesController.deleteEmployee)

//for a single employee
router.route('/:id')
.get(employeesController.getEmployee);
module.exports = router


// router.get('/', authenticate, EmployeeController.index)
// router.post('/show', EmployeeController.show)
// router.post('/store', upload.array('avatar[]'), EmployeeController.store)
// router.post('/update',EmployeeController.update)
// router.post('/delete', EmployeeController.destroy)