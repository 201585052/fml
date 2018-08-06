npm install 一下 node app.js即可运行，如果挂在服务器上可以用forever模块 forever start ，mongodb的安装版本3.4强烈建议按照官网上安装，不要乱看博客。

若有报错
{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' } 
  js-bson: Failed to load c++ bson extension, using pure JS version
  
cp node_modules/bson/browser_build/bson.js node_modules/bson/build/Release/

[移动端项目地址](https://201585052.github.io/fml)

已提升与改善的地方：

* 图像上传文件限制
* 代码精简
* 针对pc的部分css优化
