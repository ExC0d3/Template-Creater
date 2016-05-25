import rl from './input';

export const getUrl = () => {
	return new Promise((resolve,reject) => {
		rl.question('Enter the url:- ', (url) =>{
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

export const testUrl = (url) => {
	return new Promise((resolve,reject) => {


	});
}