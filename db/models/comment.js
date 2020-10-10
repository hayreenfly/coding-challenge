"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment", {
      comment: DataTypes.STRING,
    }, {
      paranoid: true,
    }
  );

  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.post, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });

    Comment.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Comment;
};