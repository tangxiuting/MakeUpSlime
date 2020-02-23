
## 使用之前一定要先构建，工程文件结构里面存在 /build/jsb-link/src
## 打包前需要修改 
## version 打包的版本号 
## url 域名
## upToCloud OSS文件名字
## 直接拖到终端，回车即可执行


echo "--------------执行压缩打包-----------------------"
upToCloud=$"UnicornCake/cake_1/"
version=$"1.0"
url=$"http://youngcnfoodhall.top/"$upToCloud
assets=$"newVersion"

path=$(cd `dirname $0`;pwd)
dire=${path}"/newVersion"

[ -d "$dire" ] && rmdir "$dire"
mkdir "$dire"

cd $path
cd .. cd

lastpath="`pwd`"
echo $lastpath
srcpath=${lastpath}"/build/jsb-link/src"
respath=${lastpath}"/build/jsb-link/res"

echo "赋值资源文件"
cp -rf $srcpath ${path}"/newVersion/"
cp -rf $respath ${path}"/newVersion/"

echo "开始压缩"
cd $path
ls
python pngcompress.py -p ${path}"/newVersion/res"

echo "--------------压缩完成-----------------------"
cd $path"/newVersion/"
zip -r game.zip res src
echo "--------------打包完成-----------------------"
rm -rf res
rm -rf src

cd .. cd
node version_generator.js -v $version -u $url -d ${assets}"/"
echo "--------------生成配置文件-----------------------"
echo "开始上传"
cd $path"/newVersion/"
./ossutilmac64 cp game.zip "oss://"$upToCloud
./ossutilmac64 cp project.manifest "oss://"$upToCloud
./ossutilmac64 cp version.manifest "oss://"$upToCloud


echo "本次打包版本："$version
echo "上传文件路径："$url
echo "--------------上传完成-----------------------"



