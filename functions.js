import rl from './input';

var child_process 	= require('child_process');
const vu 			= require('valid-url');
const fs 			= require('fs');

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

export const testUrl = (link) => {
	return new Promise((resolve,reject) => {
		if(vu.isWebUri(link)){
			resolve(link);
		} else {
			reject(link);
		}
	});
};

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

	child_process.exec(`find ${newPath} -name \"*.jpg\" -or -name \"*.png\" -or -name \"*.svg\"`,(err,stdout,stderr) => {
		if(err){
			reject(err);
		}	else {
			//console.log('Error from find command:',stderr);
			resolve(stdout);
		}
	});
});
}
