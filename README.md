MySnippets
==========

为了方便个人生活工作写的一点小脚本

## 介绍

### downloads\_directory\_watcher

一个在Ubuntu环境下用来提示自己整理下载文件夹的python脚本, 利用了 libnotify

所以如果下载文件夹文件数过多，那么每隔一段时间脚本就会产生如图通知：

![notify.jpg][1]

注意pynotify这个依赖，图标资源是在Ubuntu系统里直接找的

另外关于开机自动启动的次序，要等到图形界面开启后再启动这个脚本。


### ele.me.js

![eleme_js.png][2]

跑在dotjs上的一个自动刷饿了么订单评分的程序

其实就是个油猴脚本

jquery需要，因为ele.me自带所以没有dotjs的话打开浏览器的console可以直接载入使用

*TODO ： 因为之前不会用deferred & promise 来处理同步异步，所以之后代码应该会有所改进*

`$.getScript('https://rawgithub.com/grzhan/MySnippets/master/ele.me.js',function(){main();});`


### cheatsheet.py

简单的cheatsheet开启脚本

依赖Python库： docopt,sh (可使用 pip install 安装)

因为不同操作系统的PDF、图片等查看程序会不一致，当前只确保在Ubuntu 12.04上运行

	用法： cheatsheet.py -o <language>



[1]: http://image-hosting.qiniudn.com/notify.png
[2]: http://image-hosting.qiniudn.com/elems_js.png


