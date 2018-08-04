var mongodb = require('./db');
markdown = require('markdown').markdown;

function User(user) {
  this.name = user.name;
  this.school = user.school;
  this.email = user.email;
  this.password = user.password;
  this.mark = user.mark;
  this.sex = user.sex;
  this.phone = user.phone;
  this.introd = user.introd;
  this.hashe = user.hashe; //用户已经帮助过的人数：has helped
  this.hbehe = user.hbehe; //用户已经受到的帮助数 :has been helped
};
//password和mark 是相对于个人信息较独立的变量
module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var user = {
      name: this.name,
      school: this.school,
      email: this.email,
      password: this.password,
      mark: this.mark,
      sex: this.sex,
      phone: this.phone,
      introd: this.introd,
      hashe: this.hashe,
      hbehe: this.hbehe
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

//读取用户信息
User.get = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        /*docs.forEach(function (doc) {
          doc.user = markdown.toHTML(doc.user);
        });*/
        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};
User.edit = function(name,school,email,sex,phone,introd,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据人的相关信息进行查询
      collection.findOne({
        "name": name,
        "school": school,
        "email": email,
        "sex": sex,
        "phone": phone,
        "introd": introd
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);//返回查询的个人信息（markdown 格式）
        //console.log("获取查询没问题");
      });
    });
  });
};
//更新一用户及其相关信息
User.update = function(name1,school1,email1,sex1,phone1,introd1,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection("users",function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //console.log(phone1);
      //更新文章内容
      collection.update({
        "email": email1 //这个其实是个找的过程，update的第一个参数是作用对象
      }, {
        $set: {phone: phone1,school:school1,introd:introd1,sex:sex1,name:name1}
      },{
        multi:true
      },
      function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
User.mupdate = function(email1,password1,callback){
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection("users",function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //console.log(phone1);
      //更新文章内容
      collection.update({
        "email": email1 //这个其实是个找的过程，update的第一个参数是作用对象
      }, {
        $set: {password:password1}
      },
      function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
//被悬赏者积分增加
User.xsj = function(name, idd, xmark, coname, callback){
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection("users",function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "name": coname //这个其实是个找的过程，update的第一个参数是作用对象
      }, {
        $inc: {mark: xmark}
      },
      function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
//悬赏者积分减少
User.xsjn = function(name, idd, xmark, coname, callback){
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection("users",function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "name": name //这个其实是个找的过程，update的第一个参数是作用对象
      }, {
        $inc: {mark: -xmark}
      },
      function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
// 解决悬赏者帮助数+1,悬赏者收到帮助数+1
User.helj = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      collection.update({
        "name":name
      },{
        $inc: {hashe: 1}
      },function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
      });
    });
  });
};
User.hels = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      collection.update({
        "name":name
      },{
        $inc: {hbehe: 1}
      },function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
      });
    });
  });
};
