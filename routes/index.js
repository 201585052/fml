var crypto = require('crypto'),
  User = require('../models/user.js'),
  Post = require('../models/post.js'),
  Comment = require('../models/comment.js');
const multer = require('multer');
const path = require('path');
module.exports = function(app) {
  var dd,xx,cc;//被迫无奈使用的全局变量
  //dd:所发布需求的序号
  //xx:对应积分数
  //cc:解决问题者名字
  app.get('/', function(req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(null, page, function(err, posts, total) {
      if (err) {
        posts = [];
      }
      res.render('index', {
        title: 'fml',
        statu: 0,
        user: req.session.user,
        idss: req.session.idss,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        total: total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/', function(req, res) {
    var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var name = req.body.name;
    var owner = req.session.user.name;
    var kcz = 1;
    var content = req.body.content;
    var idc = req.body.idc;
    var newComment = new Comment(name, owner, kcz, content, idc);
    newComment.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      req.flash('success', '留言成功!');
      //console.log(content);
      res.redirect('/');
    });
  });
  app.get('/search', function(req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.sgetTen(req.query.keyword, page, function(err, posts, total) {
      if (err) {
        posts = [];
      }
      res.render('search', {
        title: 'SEARCH' + req.query.keyword,
        subtil:req.query.keyword,
        statu: req.session.statu,
        user: req.session.user,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        total: total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  //这里要在search结果页面追加一个和主页一样的post效果
  app.post('/search', function(req, res) {
    var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var name = req.body.name;
    var owner = req.session.user.name;
    var kcz = 1;
    var content = req.body.content;
    var idc = req.body.idc;
    var newComment = new Comment(name, owner, kcz, content, idc);
    newComment.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      req.flash('success', '留言成功!');
      //console.log(content);
      res.redirect('/');
    });
  });

  app.get('/messa', checkLogin);
  app.get('/messa', function(req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.mgetTen(req.session.user.name, page, function(err, posts, total) {
      if (err) {
        posts = [];
      }
      res.render('messa', {
        title: '我的消息',
        statu: 0,
        user: req.session.user,
        idss: req.session.idss,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        total: total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', {
      title: '注册',
      statu: req.session.statu,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
    req.session.statu = 0; //既未注册也未登录的客户是级别0
  });
  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
    var name = req.body.nickname,
      school = req.body.school,
      email = req.body['form-email'],
      password = req.body['form-password'],
      password_re = req.body['form-repeat-password'],
      mark = 30,
      sex = "",
      phone = "",
      introd = "",
      hashe = 0,
      hbehe = 0;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致!');
      return res.redirect('/reg'); //返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5');
    password = md5.update(String(req.body['form-password'])).digest('hex');
    var newUser = new User({
      name: name,
      school: school,
      email: email,
      password: password,
      mark: mark,
      sex: sex,
      phone: phone,
      introd: introd,
      hashe: hashe,
      hbehe: hbehe
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', '用户已存在!');
        return res.redirect('/reg'); //返回注册页
      }
      //如果不存在则新增用户
      newUser.save(function(err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg'); //注册失败返回主册页
        }
        //req.session.user = user;//用户信息存入 session
        req.session.statu = 1; //标记刚注册过的特殊状态为1
        req.flash('success', '注册成功!');
        res.redirect('/'); //注册成功后返回主页
      });
    });
  });

  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '登录',
      statu: req.session.statu,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
      password = md5.update(String(req.body['form-password'])).digest('hex');
    //检查用户是否存在
    User.get(req.body['nickname'], function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在!');
        console.log("没有这个用户");
        return res.redirect('/login'); //用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        req.flash('error', '密码错误!');
        return res.redirect('/login'); //密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.session.statu = 2; //既注册又登录的用户是级别2
      req.flash('success', '登陆成功!');
      res.redirect('/'); //登陆成功后跳转到主页
    });
  });
  app.get('/post', checkLogin);
  app.get('/post', function(req, res) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin);
  app.post('/post', function(req, res) {
    if (!req.session.idss) {
      req.session.idss = 1;
    } else {
      req.session.idss = req.session.idss + 1;
    }
    var currentUser = req.session.user,
      post = new Post(currentUser.name, 0, req.body.post, [], req.session.idss, req.body.xmark, currentUser.school);
    post.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发布成功!');
      res.redirect('/'); //发表成功跳转到主页
    });
  });
  app.get('/remove/:name/:idd/:xmark/:coname', checkLogin);
  app.get('/remove/:name/:idd/:xmark/:coname', function(req, res) {

    var currentUser = req.session.user;
    //如果只是自己删除自己的悬赏就把悬赏值默认为-1
    var xmark = parseInt(req.params.xmark);
    //console.log(xmark);
    if(xmark>0)
    {
      Post.remove(currentUser.name, req.params.idd, xmark, req.params.coname, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        req.session.idss = req.session.idss - 1;
        console.log(req.session.idss + "\n");
        //console.log("删除成功！");
        dd=req.params.idd;
        xx=xmark;
        cc=req.params.coname;
        res.redirect('/remove/s1');
      });
    }else{
      Post.remove(currentUser.name, req.params.idd, -1, 0, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        req.session.idss = req.session.idss - 1;
        //console.log(req.session.idss + "\n");
        res.redirect('/');
      });
    }
  });
  app.get('/remove/s1', function(req, res) {
    var currentUser = req.session.user;
    User.xsj(currentUser.name, dd, xx, cc, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log("积分加成功！");
      console.log(xx);
      res.redirect('/remove/s2');
    });
  });
  app.get('/remove/s2', function(req, res) {
    var currentUser = req.session.user;
    User.xsjn(currentUser.name, dd, xx, cc, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log("积分减成功！");
      res.redirect('/remove/h1');
    });
  });
  app.get('/remove/h1', function(req, res) {
    User.helj(cc,function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log("解决悬赏者帮助数增加");
      res.redirect('/remove/h2');
    });
  });
  app.get('/remove/h2', function(req, res) {
    var currentUser = req.session.user;
    User.hels(currentUser.name, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log("悬赏主人受到帮助数增加！");
      res.redirect('/remove/zj');
    });
  });
  //从monggodb中提数据出来存到session
  app.get('/remove/zj', function(req, res) {
    User.get(req.session.user.name, function(err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.session.user.hashe = user.hashe;
        req.session.user.hbehe = user.hbehe;
        req.session.user.mark = user.mark;
      }
      console.log("从数据库里抓取成功");
      res.redirect('/');
    });
  });

  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.session.statu = 1;
    req.flash('success', '登出成功!');
    res.redirect('/'); //登出成功后跳转到主页
  });
  app.get('/gerr', checkLogin);
  app.get('/gerr', function(req, res) {
    res.render('gerr', {
      title: '个人中心',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/touxiang', checkLogin);
  app.get('/touxiang', function(req, res) {
    res.render('touxiang', {
      title: '更改头像',
      user: req.session.user,
    });
  });
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.resolve('public/uploads'));
    },
    filename: function(req, file, cb) {
      //Date.now()
      cb(null, req.session.user.name + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage
  });
  app.post('/touxiang', checkLogin);
  app.post('/touxiang', upload.single('avatar'), function(req, res, next) {
    res.send({
      err: null,
      //path.basename(req.file.path)
      filePath: 'uploads/' + req.session.user.name
    });
  });
  app.get('/gerr2', checkLogin);
  app.get('/gerr2', function(req, res) {
    res.render('gerr2', {
      title: '个人中心',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/gerr2', checkLogin);
  app.post('/gerr2', function(req, res) {
    //console.log("看看我post出去了没");
    //var password = currentUser.password;
    //var mark = currentUser.mark;
    if (req.body['form-email']) {
      var currentUser = req.session.user;
      User.update(req.body.nickname, req.body.school, req.body['form-email'], req.body['sex'], req.body['phone'], req.body['introd'], function(err) {
        //var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
        //console.log("看看我进来了没？");
        //console.log(req.body.nickname)
        if (err) {
          req.flash('error', err);
          console.log(err);
          return res.redirect('/gerr2'); //出错！返回信息页
        }
        req.flash('success', '修改成功!');
        var name = req.body.nickname,
          school = req.body.school,
          email = req.body['form-email'],
          sex = req.body['sex'],
          phone = req.body['phone'],
          introd = req.body['introd'];
        req.session.user.name = name;
        req.session.user.school = school;
        req.session.user.email = email;
        req.session.user.sex = sex;
        req.session.user.phone = phone;
        req.session.user.introd = introd;
        res.redirect('/gerr2'); //成功！返回信息页
      });
    } else if (req.body['form-password']) {
      var md5 = crypto.createHash('md5');
      password1 = md5.update(String(req.body['form-password'])).digest('hex');
      var md5 = crypto.createHash('md5');
      passwordy = md5.update(String(req.body['formla-password'])).digest('hex');
      if (req.session.user.password != passwordy) {
        req.flash('success', '原密码输入错误！');
        //console.log(333333);
        //console.log(req.session.user.password);
        //console.log(passwordy);
        res.redirect('/gerr2'); //成功！返回信息页
      } else {
        User.mupdate(req.session.user.email, password1, function(err) {
          if (err) {
            req.flash('error', err);
            console.log(err);
            return res.redirect('/gerr2'); //出错！返回信息页
          }
          req.flash('success', '密码修改成功!');
          req.session.user.password = password1;
          res.redirect('/gerr2'); //成功！返回信息页
        });
      }
    }
  });
  app.get('/xsqd',checkLogin);
  app.get('/xsqd', function(req, res) {
    res.render('xsqd', {
      title: '悬赏清单'
    });
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录!');
      res.redirect('/login');
    }
    next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!');
      res.redirect('back');
    }
    next();
  }
};
