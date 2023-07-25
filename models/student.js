
module.exports = (sequelize,datatype)=>{

    const Student = sequelize.define("students",{
        Name:{
            type:datatype.STRING,
            allowNull:false
        },
        Email:{
            type:datatype.STRING,
            allowNull:false,
            unique:true
        },
        Pass:{
            type:datatype.STRING
        }
        ,
        CourseId:{
            type:datatype.INTEGER,
            references:{
                key:"id",
                model:"courses"
            }
        }
    });

    return Student
}