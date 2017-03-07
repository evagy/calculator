var status = require('./status.js')

// math method
var util = {
	
	'abs': Math.abs,

	'avg': (...arr) => util.sum.apply(null, arr) / arr.length,

	'sin': Math.sin,

	'cos': Math.cos,

	'tan': Math.tan,

	'cot': num => Math.cos(num) / Math.sin(num),

	'acos': Math.acos,

	'acosh': Math.acosh || function(num) {return Math.log(num + Math.sqrt(num * num - 1))},

	'asin': Math.asin,

	'atan': Math.atan,

	'asinh': Math.asinh || function(num) {return num === -Infinity ? num : Math.log(num + Math.sqrt(num * num + 1))},

	'atanh': Math.atanh || function(num) {return Math.log((1 + num)/(1 - num)) / 2},

	'atan2': Math.atan2,

	'logMutil' : (num1, num2) => Math.log(num1) / Math.log(num2),

	'cbrt': Math.cbrt || function(num) {return Math.pow(num, 1/3)},

	'sum': (...arg) => arg.reduce((s, v)=> s + v, 0),

	'pow': Math.pow,

	'fac': n => new Array(n+1).join('1').split('').reduce((s, v, i) => s*(i+1), 1),

	'HCF': function hcf(a, b) {
		return a%b ? hcf(b, a%b) : b;
	},


	'log': Math.log10 || function(num) {util.log(num, 10)},

	'ln': Math.log,

	// change between angle and radian
	angle2rad: n => n * 2 * Math.PI / 360,
	rad2angle: n => n * 180 / Math.PI
};


// a map for check number of arguments.
let argNumbers = {
	'abs': 1,
	'avg': 2, 
	'sin': 1,
	'cos': 1,
	'tan': 1,
	'cot': 1,
	'acos': 1,
	'acosh': 1,
	'asin': 1,
	'atan': 1,
	'asinh': 1,
	'atanh': 1,
	'atan2': 1,
	'log': 1,
	'ln': 1,
	'logMutil' : 2,
	'cbrt': 1,
	'sum': 2,
	'pow': 2,
	'fac': 1,
	'HCF': 2
};

// a trigonometry function map for next wrap function 
let trigonometry = [	'sin',
						'cos',
						'tan',
						'cot',
						'acos',
						'acosh', 
						'asin',
						'atan',
						'asinh', 
						'atanh', 
						'atan2'    ];

// wrap util method 
// 1. check arguments number
// 2. if the method is trigonometry function, judge the status.isAngle
for(let key in argNumbers) {	
	let oriFn = util[key],
		argNum = argNumbers[key],
		isTrigonometry;
	
	util[key] = function(...arg) {
		let len = arg.length,
			isAngle = status.isAngle,
			isArgStrict = status.isArgStrict;
		// throw new Error if arguments number not match
		// error string will present like 'errCode, methodName'
		if(len < argNum) {
			// if the actual arguments less than require arguments number
			throw new Error(`21, ${key}`);
		} else if(len > argNum) {
			if(isArgStrict) {
				throw new Error(`22, ${key}`);
			}
		}
		isTrigonometry = trigonometry.indexOf(key) > -1;
		return oriFn.apply(null, isTrigonometry && isAngle ? arg.map(v => util.angle2rad(v)) : arg); 
	}
	

	// mount the arguments number on function
	util[key].argNum = argNum;

}


module.exports = util;