var mongodb = require('./db');

function Comment(name, owner, kcz, content, idc) {
  this.name = name;
  this.owner = owner;
  this.kcz = kcz;
  this.content = content;
  this.idc = idc; // 评论所在文章的编号
}

//存储一条留言信息
Comment.prototype.save = function(callback) {
  var name= this.name, //记录文章的主人
      owner = this.owner, //记录留言的主人
      kcz = this.kcz,
      content = this.content,
      idc = parseInt(this.idc); //记录被留文章的序号
  //console.log(content);
  var comment={
      name: name,
      owner: owner,
      kcn: kcz,
      content: content,
      idc: idc
  };
  //console.log(sec);
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
      collection.update({
        "name": name,
        "idd": idc
      }, {
        $push: {"comments": comment},
        $set: {"res": 1}
      } ,{
        multi:true
      }, function (err) {
          mongodb.close();
          if (err) {
            console.log(err);
            return callback(err);
          }
          callback(null);
      });
    });
  });
};
module.exports = Comment;
