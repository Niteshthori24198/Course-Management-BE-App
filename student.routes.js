const { Router } = require('express');

const studentRouter = Router();

const { students, courses } = require('./models/index');

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')



studentRouter.post("/register", async (req, res) => {

    let { Name, Email, CourseId, Pass } = req.body;

    if (!Name || !Email || !CourseId || !Pass) {
        return res.send({
            "error": "Kindly Enter All valid details to register."
        })
    }

    try {

        const iscoursevalid = await courses.findAll({
            where: {
                id: CourseId
            }
        })


        if (iscoursevalid.length == 0) {
            return res.send({
                "error": "Kindly Select a valid Course for register."
            })
        }

        const isregistered = await students.findAll({
            where: {
                CourseId: CourseId
                ,
                Email: Email
            }
        })

        if (isregistered.length) {
            return res.send({
                "error": "Student is Already registered with Course."
            })
        }


        const hashPass = bcrypt.hashSync(Pass, 5);


        const student = await students.create({
            Name, Email, CourseId, Pass: hashPass
        })

        return res.send({
            "msg": "Student has been registered Successfully..",
            "data": student
        })


    } catch (error) {
        return res.send({
            "error": error.message
        })
    }


})



studentRouter.post("/login", async (req, res) => {

    const { Email, Pass } = req.body;

    if (!Email || !Pass) {
        return res.send({
            "error": "Kindly Enter required Details.."
        })
    }


    try {


        const isvalid = await students.findAll({
            where: {
                Email: Email
            }
        })

        if (isvalid.length == 0) {
            return res.send({
                "error": "Student Doesn't exists..kindly register yourself first to login."
            })
        }

        const passcheck = bcrypt.compareSync(Pass, isvalid[0].Pass);

        if (!passcheck) {
            return res.send({
                "error": "Invalid Password Deected.."
            })
        }

        const token = jwt.sign({ UserID: isvalid[0].id }, "secretkey", { expiresIn: "24h" })

        return res.send({
            "msg": "Login Successfull.",
            "token": token
        })





    } catch (error) {

        return res.send({
            "error": error.message
        })

    }


})



studentRouter.get("/logout", async (req, res) => {

    res.send({
        "msg": "Logout Done."
    })

})



studentRouter.get("/getall", async (req, res) => {

    // to populate feild : 

    courses.hasMany(students, { foreignKey: "CourseId" });
    students.belongsTo(courses, { foreignKey: "CourseId" });


    try {

        const data = await students.findAll({
            include: [courses]
        })

        return res.send({
            "msg": "Student fetched Successfully.",
            "Students": data
        })

    } catch (error) {

        return res.send({
            "error": error.message
        })

    }

})




studentRouter.get("/getone/:sid", async (req, res) => {

    const { sid } = req.params;


    courses.hasMany(students, { foreignKey: "CourseId" });
    students.belongsTo(courses, { foreignKey: "CourseId" });


    try {

        const data = await students.findAll({
            where: {
                id: sid
            },
            include: [courses]
        })


        if (data.length == 0) {
            return res.send({
                "error": "Student doesn't exists.."
            })

        }

        return res.send({
            "msg": "Student fetched successfully.",
            "Student": data
        })

    } catch (error) {
        return res.send({
            "error": error.message
        })
    }

})




studentRouter.patch("/update/:sid", async (req, res) => {

    const { sid } = req.params;

    const { CourseId } = req.body;


    courses.hasMany(students, { foreignKey: "CourseId" });
    students.belongsTo(courses, { foreginKey: "CourseId" });


    try {

        const isvalidstudent = await students.findAll({
            where: {
                id: sid
            }
        })

        if (isvalidstudent.length == 0) {
            return res.send({
                "error": "Student doesn't Exists..Enter a valid student-ID"
            })
        }

        if (CourseId) {

            const iscoursevalid = await courses.findAll({
                where: {
                    id: CourseId
                }
            })

            if (iscoursevalid.length == 0) {
                return res.send({
                    "error": "Kindly Choose a valid course. the course you pick isn't exists."
                })
            }

        }


        const updateddata = await students.update(
            {...req.body},
            {
                where:{
                    id:sid
                }
            }

        )

        const newdata = await students.findAll({
            where: {
                id: sid
            },
            include: [courses]
        })


        return res.send({
            "msg": "Student has been updated.",
            "Student": newdata
        })


    } catch (error) {
        return res.send({
            "error": error.message
        })
    }

})




studentRouter.delete("/delete/:sid", async (req, res) => {

    const { sid } = req.params;

    try {

        const isvalidstudent = await students.findAll({
            where: {
                id: sid
            }
        })

        if (isvalidstudent.length == 0) {
            return res.send({
                "error": "Student doesn't Exists..Enter a valid student-ID"
            })
        }


        const data = await students.destroy({
            where: {
                id: sid
            }
        })


        return res.send({
            "msg": "Student has been removed successfully."
        })

    } catch (error) {
        return res.send({
            "error": error.message
        })
    }

})




module.exports = { studentRouter }