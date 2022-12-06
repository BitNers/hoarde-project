const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('Users',{
        
        UserID:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4,100]
            }

        },
        
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [5, 200]
              }
        },

        EmailConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },

        EmailConfirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        ID_Role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
       
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
    
        },

        PasswordSalt: {
            type: DataTypes.STRING,
            allowNull:false,
        },

        PasswordBunker: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        SaltBunker: {
            type: DataTypes.STRING,
            allowNull: true,

        },

        LastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        },

        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
    
        }
        
},
    {
        freezeTableName: true,
        timestamps: true,
    });
    
}