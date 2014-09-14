#!/usr/bin/env python
# Ubuntu 12.04
# GR_CHEATSHEET_DIR = /home/grzhan/Document/PDF/cheatsheet
# Dependencies : sh
"""Cheatsheet: a simple program can open cheatsheet prepared in advance.

Usage:
    cheatsheet -o <language>
    cheatsheet [options]

Options:
    -o <language>               Open specified cheatsheet
    -h --help                   Show this help and exit
    --version                   Show version and exit
    -l --list                   List avaliable cheatsheets
"""

import os
import sys
import getopt
try:
    import sh
except ImportError:
    exit('This script requires that `sh` library is installed:\n\
        pip install sh\n\
        Complete documentation @ http://amoffat.github.com/sh')
try:
	from docopt import docopt
except ImportError:
    exit('This script requires that `docopt` library is installed:\n\
        pip install docopt\n\
        Detailed @ https://github.com/docopt/docopt')

def cheatsheet_exec(filename,ext):
	file_ = filename  + ext
	if ext.strip('.') =='pdf':
		sh.evince(file_)
	elif ext.strip('.') in ['png','jpg','jpeg']:
		sh.eog(file_)
	elif ext.strip('.') == 'html':
		sh.firefox(file_)

def usage():
    arguments = docopt(__doc__, version='1.0')
    print arguments


path = os.getenv('GR_CHEATSHEET_DIR');

if len(sys.argv) < 2:
    usage()
    sys.exit()

try:
    options,args = getopt.getopt(sys.argv[1:],"hlo:",["help","list"])
except getopt.GetoptError:
    sys.exit()

flag = False
for name,value in options:
    flag = True
    if name in ("-h","--help"):
        usage()
    elif name in ("-l","--list"):
        print "Avaliable Cheasheets: "
        for file_ in os.listdir(path):
            filename = os.path.splitext(file_)[0]
            print ' ' + filename
    elif name == "-o":
        sflag = False
        for file_ in os.listdir(path):
            filename,ext = os.path.splitext(file_)
            if filename == value:
                sflag = True
                print 'Openning', (path + filename + ext)
                cheatsheet_exec(path + filename,ext)
        if not sflag:
            print 'There is no cheatsheet for ' + value
if not flag:
    print 'Please specify a programming language name'
    usage()


