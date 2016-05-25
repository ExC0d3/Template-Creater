import {
	getUrl,
	testUrl,
	makeTemplate,
} from './functions';

getUrl()
	.then( url => testUrl(url))
	.then( url => makeTemplate(url))
	.then( result =>  {
		console.log(result);
		process.exit(0);
	})
	.catch( (err) => {
		console.log('Promise rejected');
		console.log(err);
		process.exit(1);
	});