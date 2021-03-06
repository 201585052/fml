﻿
var mongodb = require('./db');

function Post(name, res, post, comments, idd, xmark, school) {
  this.name = name; //悬赏发起者名称
  this.res = res; //1表示有人回复，0则没人
  this.post = post; //记录悬赏内容
  this.comments = comments; //记录回复内容
  this.idd = idd; // 数据库里的文章序号
  this.xmark = xmark; //文章悬赏得分
  this.school = school;  //悬赏所在学校
}



//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year: date.getFullYear(),
      month: date.getFullYear() + "-" + (date.getMonth() + 1),
      day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
    }
    //要存入数据库的文档
  var post = {
    name: this.name,
    res: this.res,
    post: this.post,
    comments: [],
    idd: this.idd,
    time: time,
    xmark: this.xmark,
    school: this.school
  };
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function(err) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null); //返回 err 为 null
      });
    });
  });
};

//读取文章及其相关信息
Post.get = function(name, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //根据 query 对象查询文章
      collection.find(query).sort({
        time: -1
      }).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null, docs); //成功！以数组形式返回查询的结果
      });
    });
  });
};
//一次获取十篇文章
Post.getTen = function(name, page, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      var moh = new RegExp(name, "i");
      if (name) {
        query.name = moh;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function(err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
          skip: (page - 1) * 10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function(doc) {
            doc.post = markdown.toHTML(doc.post);
          });
          callback(null, docs, total);
        });
      });
    });
  });
};
//mget是提取我的消息
Post.mgetTen = function(name, page, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
        query.res = 1;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function(err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
          skip: (page - 1) * 10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function(doc) {
            doc.post = markdown.toHTML(doc.post);
          });
          //console.log(total);
          callback(null, docs, total);
        });
      });
    });
  });
};
//sget是搜索学校
Post.sgetTen = function(school, page, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      var moh = new RegExp(school, "i");
      if (school) {
        query.school = moh;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function(err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
          skip: (page - 1) * 10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function(err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function(doc) {
            doc.post = markdown.toHTML(doc.post);
          });
          callback(null, docs, total);
        });
      });
    });
  });
};
//删除一篇文章
Post.remove = function(name, idd, xmark, coname, callback) {
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
      //根据用户名、日期和标题查找并删除一篇文章
      idd = parseInt(idd);
      collection.remove({
        "name": name,
        "idd": idd
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
module.exports = Post;
