"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      paranoid: true,
    }
  );

  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Post;
};
