import sys,os
def replaceFile(filepath,scrStr,newStr):
	try:
		f = open(filepath,'r+')
		all_lines = f.readlines();
		f.seek(0)
		f.truncate()
		for line in all_lines:
			line = line.replace(scrStr,newStr)
			f.write(line)
		f.seek(0)
		f.close()
	except Exception, e:
		print e
def changeClass(rootPath,srcClass,newClass):	
	for root,subdirs,files in os.walk(rootPath):
		for filePath in files:
			fullFilePath = os.path.join(root, filePath);
			if(fullFilePath.endswith(".ts") or fullFilePath.endswith(".js")):
				f = open(fullFilePath,'r+')
				all_lines = f.readlines();
				f.seek(0);
				f.truncate();
				for line in all_lines:
					line = line.replace('/' + srcClass + '"','/'+newClass + '"')
					line = line.replace("/" + srcClass + "'","/"+newClass + "'")
					f.write(line)
				f.seek(0)
				f.close()
def changeUUID(rootPath,srcClass,newClass):	
	for root,subdirs,files in os.walk(rootPath):
		for filePath in files:
			fullFilePath = os.path.join(root, filePath);
			if(fullFilePath.endswith("uuid-to-mtime.json")):
				f = open(fullFilePath,'r+')
				all_lines = f.readlines();
				f.seek(0);
				f.truncate();
				for line in all_lines:
					line = line.replace('/' + srcClass + '.ts','/' + newClass + '.ts')
					line = line.replace('/' + srcClass + '.js','/' + newClass + '.js')
					f.write(line)
				f.seek(0)
				f.close()
def visitDir(rootPathassets, rootPath):
	for root,subdirs,files in os.walk(rootPathassets):
		for filePath in files:
			# print "filePath: "+ filePath;
			fullFilePath = os.path.join(root, filePath);
			if(fullFilePath.endswith(".ts") or fullFilePath.endswith(".js")) and (not filePath.startswith(parentPath)):
				fileNameArray = filePath.split('.');
				className = fileNameArray[0]
				className1 = fileNameArray[1]
				suffix = fileNameArray[-1]
				
				# replaceFile(fullFilePath,'"PNG/','"'+parentPath+'/PNG/')
				changeClass(rootPathassets, className, className + needAddName)
				changeUUID(rootPath, className, className + needAddName)
				newname = className
				print "change:" + "--" + root +'/'+className + needAddName + "." + className1
				os.rename(fullFilePath, root +'/'+className + needAddName + "." + className1)
			
			if(fullFilePath.endswith(".js.meta")):
				fileNameArray = filePath.split('.');
				className = fileNameArray[0]
				className1 = fileNameArray[1]
				suffix = fileNameArray[-1]
				print "change" + "--" + root +'/'+className + needAddName + ".js.meta"
				os.rename(fullFilePath, root +'/'+className + needAddName + ".js.meta")
			if(fullFilePath.endswith(".ts.meta")):
				fileNameArray = filePath.split('.');
				className = fileNameArray[0]
				className1 = fileNameArray[1]
				suffix = fileNameArray[-1]
				print "change" + "--" + root +'/'+className + needAddName + ".ts.meta"
				os.rename(fullFilePath, root +'/'+className + needAddName + ".ts.meta")
				
rootPath = sys.path[0]
needAddName = "MS"
rootPathassets = rootPath + "/assets"
strArray = rootPath.split('/')
parentPath =  strArray[-1]
print "dirPath: "+ parentPath;
visitDir(rootPathassets, rootPath);