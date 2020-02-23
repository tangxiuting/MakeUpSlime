# -* - coding: UTF-8 -* -
import os
from optparse import OptionParser
# 脚本路径
scriptPath = os.path.split(os.path.realpath(__file__))[0]
# 依赖pngquant路径
PngquantExe=scriptPath+"/pngquant"

# 获取指定路径下所有指定后缀的文件
def GetFileFromThisRootDir(dir, ext = None):
    allfiles = []
    needExtFilter = (ext != None)
    for root,dirs,files in os.walk(dir):
        for filespath in files:
            filepath = os.path.join(root, filespath)
            extension = os.path.splitext(filepath)[1][1:]
            if needExtFilter and extension == ext in ext:
                allfiles.append(filepath)
    return allfiles

# 压缩目录下所有图片
def CompressPng(dir):
    if os.path.isdir(dir):
        imgFiles=GetFileFromThisRootDir(dir, 'png')
        for file in imgFiles:
            print("压缩图片---->" + file);
            cmd = "\"" + PngquantExe + "\"" + " --ext .png --force --speed=3 "+ file
            os.system(cmd)
    elif os.path.splitext(dir)[1][1:] == 'png':
        cmd = "\"" + PngquantExe + "\"" + " --ext .png --force --speed=3 "+ dir
        print("压缩图片---->" + file);
        os.system(cmd)

#-------------------------------脚本入口点，以及执行逻辑----------------------------------
if __name__ == '__main__':
    # 定义参数获取
    parser = OptionParser()
    parser.add_option("-p", "--path", dest="path",help="path of dir to compress png", metavar="/Users/...")
    (options, args) = parser.parse_args()
    # 获取参数
    print(options)
    compressDir=options.path
    # 压缩目录下所有图片
    print(compressDir)
    CompressPng(compressDir)
