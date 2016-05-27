import {
	getUrl,
	testUrl,
	makeTemplate,
	listContents,
	findImages,
} from './functions';

const fs     = require('fs');
const url    = require('url');
const filter = require('array-promise-filter');

//helpful values
var cwd = process.cwd();
var host;
const check = (value)=>{
	console.log('Checking -> ',value);
	return fs.lstatSync(`${cwd}/Templates/${host}/${value}`).isDirectory();
};


getUrl()
	.then( url => testUrl(url))
	.then( url => makeTemplate(url))
	.then( result =>  {
		host = url.parse(result).hostname;
		return listContents(`${cwd}/Templates/${host}`);
	})
	.then( data => findImages(`${__dirname}/Templates/${host}`))
	.then( data => data.split('\n'))
	.then(data => {
		console.log(data);
		process.exit(0);
	})
	.catch( (err) => {
		console.log('Promise rejected');
		console.log(err);
		process.exit(1);
	});
