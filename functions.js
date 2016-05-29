'use strict';

import rl from './input';

var child_process 	= require('child_process');
const request		= require('request');
const vu 			= require('valid-url');
const fs 			= require('fs');

//take url link as input
export const getUrl = () => {
	return new Promise((resolve,reject) => {
		rl.question('Enter the root url:- ', (url) =>{
			if(url.length > 0){
				rl.close();
				resolve(url);
			} else {
				rl.close();
				reject(url);
			}
		});
	});
};

//check validity of a url - accepts of http or https
export const testUrl = (link) => {
	return new Promise((resolve,reject) => {
		if(vu.isWebUri(link)){
			resolve(link);
		} else {
			reject(link);
		}
	});
};

//execute the wget mirror command to duplicate the website for running locally
export const makeTemplate = (link) => {
	return new Promise((resolve,reject) => {
		var cwd  = process.cwd();
		var wget = child_process.spawn('wget',['--mirror','-p','--convert-links','-P',cwd+'/Templates',link]);
		var progress 		= require('progressbar').create().step('Downloading Mirror Website');

		
		progress.setTotal(50);

		wget.stdout.on('data',(data) => {
			console.log('Wget Data',data);
		});

		wget.stderr.on('data', (data) => {
			progress.setTick(data.length);
		});

		wget.on('close',(code)=> {
			progress.finish();
			console.log('Child process exited with',code);
			resolve(link);
		});

		wget.on('error', (err)=> {
			reject(err);
		});
	});
};

//list contents of a directory
export const listContents = (directory) => {
	console.log(directory);
	return new Promise((resolve,reject)=> {
		fs.readdir(directory,(err,result)=> {
			if(err){
				reject(err);
			}
			else{
				resolve(result);
			}
		});
	});
};

//finds all images i.e. files with extension jpg, png and svg
export const findImages = (directory,format) => {
	return new Promise((resolve,reject)=> {

	let array = directory.split(' ');
		let newPath=array[0];
		let count=1;
		while(count<=array.length-1){
			newPath += '\\ '+array[count];
			count += 1;
		}

	child_process.exec(`find ${newPath} -name \"*.jpg\" -or -name \"*.png\" -or -name \"*.JPG\"`,(err,stdout,stderr) => {
		if(err){
			reject(err);
		}	else {
			//console.log('Error from find command:',stderr);
			resolve(stdout);
		}
	});
});
}

export const mkdir = (path,name) => {
	return new Promise((resolve,reject) => {
		const finalPath = path+'/'+name;
		fs.mkdir(finalPath, (err,result) => {
			if(err !== null && err.code !== 'EEXIST')
				reject(err);
			console.log('directory created successfully');
			resolve(result);
		});
	});
}

/*
	fetches placeholders and places them in the "test" folder
	also attaches "holder" property to the img object
	which has the absolute path to the place holder
*/
export const getHolder = (imgSet) => {

	var picCount = imgSet.length;//this keeps tracks of how many pictures we have

	return new Promise((resolve,reject) => {
		
		imgSet.forEach((img,index) => {
		
		const temp 		= img.path.split('/');
		const fileName 	= temp[temp.length-1];
		const link 		= `http://placehold.it/${img.w}x${img.h}.${img.ext}`;
		
		console.log('Fetching placeholder for',fileName);
			
			request.head(link,(err,res,body) => {
				if(err){
					reject(err);
				}
				// console.log('Content-type',res.headers['content-type']);
				// console.log('Conetent-length',res.headers['content-length']);

				request(link).pipe(fs.createWriteStream(`${__dirname}/Templates/test/${fileName}`))
				.on('close',()=>{
					console.log('Completed with',fileName);
					img['holder'] = `${__dirname}/Templates/test/${fileName}`;
					picCount -= 1;//decrease the count since we have got placeholder for 1 image
					if(picCount === 0){
						//condition is satisfied means that all the placeholders have been fetched
						resolve(imgSet);
					}					
				});
			});
		});		
	});
};

/*
	function to replace one file with another
	file1 and file2 are absolute paths
*/
export const replace = (file1, file2) => {
	return new Promise((resolve,reject) => {
		//first delte the original image
		//then start copying the placeholder
		fs.unlink(file1,()=>{
			fs.createReadStream(file2).pipe(fs.createWriteStream(file1))
			.on('close',()=>{
			resolve('Completed');
		});	
		});
	});
};

/*
	dummy function resolves anything that is passed to it, only for testing 
	purposes
*/

export const dummy = (value) => {
	return new Promise((resolve,reject) => {
		resolve(value);
	});
}