("use strict");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
      paranoid: true,
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.post, {
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };
  return User;
};
