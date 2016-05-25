import {
	getUrl,
	testUrl,
	makeTemplate,
	listContents,
} from './functions';

const fs = require('fs');

const filter = require('array-promise-filter');

//helpful values
var cwd = process.cwd();

const check = (value)=>{
	return fs.lstatSync(`${cwd}/Templates/excode.me/${value}`).isDirectory();
}


getUrl()
	.then( url => testUrl(url))
	.then( url => makeTemplate(url))
	.then( result =>  listContents(`${cwd}/Templates/${result}`))
	.then( data => filter(data, check))
	.then( data => {
		console.log(data);
		process.exit(0);
	})
	.catch( (err) => {
		console.log('Promise rejected');
		console.log(err);
		process.exit(1);
	});