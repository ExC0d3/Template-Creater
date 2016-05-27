import {
	getUrl,
	testUrl,
	makeTemplate,
	listContents,
	findImages,
	mkdir,
} from './functions';

const fs     	= require('fs');
const url    	= require('url');
const fileType	= require('file-type');
const imgsize 	= require('image-size');
const filter 	= require('array-promise-filter');

//helpful values
var cwd = process.cwd();
var host;
const checkDirectory = (value)=>{
	console.log('Checking -> ',value);
	return fs.lstatSync(`${cwd}/Templates/${host}/${value}`).isDirectory();
};
//check if directory is a valid name
const checkEmpty = (value) =>{
	return value.length > 0;
}


getUrl()
	.then( url 		=> testUrl(url))
	.then( url 		=> makeTemplate(url))
	.then( result 	=>  {
		host = url.parse(result).hostname;
		return listContents(`${cwd}/Templates/${host}`);
	})
	.then( data 	=> findImages(`${__dirname}/Templates/${host}`))
	.then( data 	=> data.split('\n'))
	.then( data 	=> filter(data,checkEmpty))
	.then( data 	=> {
		mkdir(`${__dirname}/Templates`,'test');
		return data;
	})
	.then( images 	=> {
		const base = 'http://placehold.it';
		console.log('Total Images: ',images.length);
		images.forEach((image) => {
		console.log('Parsing Image',image);
		const dimensions 	= imgsize(image);//get dimensions of the image
		const width  		= dimensions.width;//width of image
		const height 		= dimensions.height;//height of image
		
		 const buffer 		= fs.readFileSync(image);
		 const ext          = fileType(buffer) !== null ? fileType(buffer).ext : '.svg';

		const imgProps 		= {
			path:image,
			w:width,
			h:height,
			ext:ext
		};

		console.log(imgProps);
	});
		
		process.exit(0);
	})
	.catch( (err) 	=> {
		console.log('Promise rejected');
		console.log(err);
		process.exit(1);
	});