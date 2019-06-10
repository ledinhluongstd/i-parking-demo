const Student = require('../models/student.model.js');

// Create and Save a new Student
exports.mqtt = (req, res) => {
    // console.log(123)
    //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
    // socket.emit("Server-sent-data", data);
    res.send('Xin chào')
}
exports.create = (req, res) => {
    // Validate request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Student content can not be empty"
    //     });
    // }

    // Create a Student
    const student = new Student({
        sex: req.body.Sex,
        nation: req.body.Nation,
        address: req.body.Address,
        area: req.body.Area,
        block: req.body.Block,
        test_score: req.body.Test_score,
        faculty: req.body.Faculty,
        education_program: req.body.Education_program,
        result: req.body.Result
    });

    // Save Student in the database
    student.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Student."
            });
        });
};

exports.createMulti = (req, res) => {
    // console.log('111')
    req.body.map(item => {
        const student = new Student({
            sex: item.Sex,
            nation: item.Nation,
            address: item.Address,
            area: item.Area,
            block: item.Block,
            test_score: item.Test_score,
            faculty: item.Faculty,
            education_program: item.Education_program,
            result: item.Result
        });

        // Save Student in the database
        student.save()
    })
}
// Retrieve and return all students from the database.
exports.findAll = (req, res) => {
    Student.find()
        .then(student => {
            res.send(student);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Student."
            });
        });
};

// Find a single student with a studentId
exports.findOne = (req, res) => {
    Student.findById(req.params.studentId)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                message: "Error retrieving student with id " + req.params.studentId
            });
        });
};

// Update a Student identified by the StudentId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Student content can not be empty"
        });
    }

    // Find Student and update it with the request body
    Student.findByIdAndUpdate(req.params.studentId, {
        title: req.body.title || "Untitled Student",
        content: req.body.content
    }, { new: true })
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                message: "Error updating student with id " + req.params.studentId
            });
        });
};

// Delete a Student with the specified StudentId in the request
exports.delete = (req, res) => {
    Student.findByIdAndRemove(req.params.studentId)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            res.send({ message: "Student deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                message: "Could not delete Student with id " + req.params.studentId
            });
        });
};
