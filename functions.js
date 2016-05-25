import rl from './input';

var child_process 	= require('child_process');
const vu 			= require('valid-url');
var progressBar 	= require('progress');

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
		var cwd = process.cwd();
		var wget = child_process.spawn('wget',['-r',link,'-P',cwd+'/Templates','-nv']);
		
		var bar = new progressBar('downloading [:bar] :percent :etas',{
			total:20,
			complete:"*",
			incomplete:"^",
			width:20
		});

		wget.stdout.on('data',(data) => {
			console.log('Wget Data',data);
		});

		wget.stderr.on('data', (data) => {
			console.log(data.toString());
		});

		wget.on('close',(code)=> {
			console.log('Child process exited with',code);
			resolve(code);
		});

		wget.on('error', (err)=> {
			reject(err);
		});
});
}
