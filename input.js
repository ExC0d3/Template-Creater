const readline = require('readline');

const rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});
console.log('Created Readline Interface');
export default rl;