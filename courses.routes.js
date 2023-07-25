const { Router } = require('express');

const courseRouter = Router()


const { students, courses } = require('./models/index');


courseRouter.post("/addnew", async (req, res) => {

    const { courseName, price } = req.body;

    if (!courseName) {
        return res.send({
            "msg": "Kindly provide valid course details."
        })
    }

    try {

        const ispresent = await courses.findAll({
            where: {
                courseName: courseName
            }
        })

        if (ispresent.length !== 0) {
            return res.send({
                "error": "Course is Already present. kindly add some other new course."
            })
        }

        const course = await courses.create({
            courseName, price
        })

        return res.send({
            "msg": "Course has been created Succesfully.",
            "course": course
        })


    } catch (error) {
        return res.send({
            "error": error.message
        })
    }


})



courseRouter.get("/getall", async (req, res) => {

    try {

        const CoursesData = await courses.findAll({})

        return res.send({
            "msg": "Courses fetched successfully",
            "Courses": CoursesData
        })

    } catch (error) {
        return res.send({
            "error": error.message
        })

    }
})



courseRouter.get("/getone/:cid", async (req, res) => {

    const { cid } = req.params;

    courses.hasMany(students, {foreignKey:"CourseId"});
    students.belongsTo(courses, {foreignKey:"CourseId"})

    try {

        const coursedata = await courses.findAll({
            where: {
                id: cid
            },
            include:[students]
        })

        if (coursedata.length == 0) {
            return res.send({
                "error": "Course Not Found.."
            })
        }

        return res.send({
            "msg": "Course fetched successfully..",
            "Course": coursedata
        })

    } catch (error) {
        return res.send({
            "error": error.message
        })
    }

})



courseRouter.patch("/update/price/:cid", async (req, res) => {

    const { cid } = req.params;

    const { price } = req.body;

    if (!price) {
        return res.send({
            "error": "Kindly enter valid feild [price] details."
        })
    }

    try {


        const ispresent = await courses.findAll({
            where: {
                id: cid
            }
        })

        if (ispresent.length == 0) {
            return res.send({
                "error": "Course Doesn't Exists..Kindly select valid course."
            })
        }

        const updateddata = await courses.update(
            {
               price:price
            },
            {
                where:{
                    id:cid
                }
            }

        )

        const newdata = await courses.findAll({
            where:{
                id:cid
            }
        })

        return res.send({
            "msg": "Course has been updated successfully",
            "Course": newdata
        })


    } catch (error) {

        return res.send({
            "error": error.message
        })

    }

})



courseRouter.delete("/delete/course/:cid", async(req,res)=>{

    const {cid} = req.params;

    try {
        
        const ispresent = await courses.findAll({
            where:{
                id:cid
            }
        })

        if(ispresent.length==0){
            return res.send({
                "error":"course you want to remove isn't present at all."
            })
        }


        // before removing course remove dependent students.

        const isstudentexists = await students.destroy({
            where:{
                CourseId:cid
            }
        })

        // remove course now

        const deletedcourse = await courses.destroy({
            where:{
                id:cid
            }
        })

        return res.send({
            "msg":"course has been removed successfully."
        })


    } catch (error) {
        return res.send({
            "error":error.message
        })
    }

})



module.exports = { courseRouter }