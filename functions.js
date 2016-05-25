import rl from './input';

var child_process = require('child_process');

const vu = require('valid-url');

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
		if(vu.isHttpUri(link)){
			resolve(link);
		} else {
			reject(link);
		}
	});
}