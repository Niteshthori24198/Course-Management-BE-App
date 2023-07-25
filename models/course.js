
module.exports = (sequelize,datatype)=>{

    const Course = sequelize.define("courses",{
        courseName:{
            type:datatype.STRING,
            allowNull:false,
            unique:true
        },
        price:{
            type:datatype.INTEGER,
            defaultValue:100
        }
    });

    return Course

}