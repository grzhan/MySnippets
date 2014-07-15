#!/usr/bin/env python
# -*- coding:utf-8 -*-
# ====================
# Environment:
#   Linux Ubuntu 12.04 LTS
# Dependencies:
#   libnotify
# ====================

import os
import os.path
import logging
import pynotify
import time
import sys
import requests


logging.basicConfig(filename = os.path.join("/home/grzhan/Util/log/dir_watch.log"),
	level = logging.DEBUG,
	format='%(asctime)s - %(levelname)s: %(message)s')

try:
	pynotify.init('DirectoryWatcherScript@Linux')
	li = os.listdir('/home/grzhan/Downloads')
	count = len([x for x in li if x[0]!='.'])

	hd = pynotify.Notification(u"Directory Watcher 启动了",u"现在有%s个文件在Downloads文件夹" % (count))
	hd.set_property('icon-name','/home/grzhan/Util/icons/download.png')
	hd.show()

	logging.info('The Program Started.')

	while True:
		# PLUS : Refresh OSC info in the remote server
		try:
			requests.get("http://www.shuosc.org/ext/renren_update.php");
		except BaseException:
			pass

		li = os.listdir('/home/grzhan/Downloads')
		count = len([x for x in li if x[0]!='.'])
		hidden = len(li) - count
		if count > 5:
			hd = pynotify.Notification(u"Downloads文件夹需要整理了",
				u"共有  %d  个文件需要整理(另外有  %d  个隐藏文件，可以查看一下)."
				% (count,hidden))
			hd.set_property('icon-name','/home/grzhan/Util/icons/download.png')
			hd.show()
		time.sleep(300)
except BaseException:
	logging.error(sys.exc_info()[0])

