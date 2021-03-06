"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post", {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      photo: DataTypes.STRING(400),
    }, {
      paranoid: true,
    }
  );

  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Post.hasMany(models.comment, {
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };

  return Post;
};