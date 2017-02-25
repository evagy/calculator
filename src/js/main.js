// 接受一个需要解析的字符串， 
// 如果正确，返回一个结果字符串
// 如果错误，则返回一个错误字符串
function caculate (str) {
	var curStr = str.replace(/\s/g, ''), res, err;

	// 如果匹配到非法字符就直接返回错误
	if(/[^\w()+\-*/\.π\^,%]/.test(curStr)) {
		console.log('初始匹配出现的问题');
		return '输入的算式格式不正确';
	}

	
	// 将方法名替换成挂载在全局变量cacu上的相关方法名
	// 过程中如果发现未定义的方法，则手动设置err
	curStr = curStr.replace(/(\b[a-z]+\b)|π/gi, (v) => {
		if(replaceMethods[v]) return `replaceMethods.${v}`;
		else err = true;
	});
	console.log(curStr);
	if(err) return `算术方法不存在`;

	// 将^幂运算替换成 Math.pow
	// 底数和次方数可能的情况大致有四种 
	// 1: 纯数字 (eg: 54)
	// 2: 包括左右括号的数字运算式 (eg: (4 + 4))
	// 3: 全局算术方法运算 (eg: Math.sin(5))
	// 4：以上混合 (eg: ( Math.sin(5+6) + Math.cos(3-1) + 5 + (5-1) ) )
	// 但是这里只考虑第一种和第二种。第三种和第四种以后考虑。
	if(/\^/.test(curStr)) {
		curStr = curStr.replace(/\b(\(?\d+\)?)\^(\(?\d+\)?)\b/g, (v, a, b) => `replaceMethods.pow(${a},${b})`);
	}

	// 尝试用eval解析， 如果解析失败则捕捉错误并返回错误代码
	try {
		res = eval(curStr);
		console.log(res);
	} catch(e) {
		console.log('catch出现的问题');
		console.log(curStr)
		return [0, '输入的算式格式不正确'];
	}
	// 只精确到小数点后15位， 避免双浮点精度丢失
	// 15位防止Math.sin精度丢失 16位防止0.1+0.2这种情况
    return (res = res+'').indexOf('Infinity') > -1 ? res.replace(/Infinity/, 'n') : +(+res).toFixed(15);
}

let status = {
	isAngle: true
}

// 一个储存自己数学方法的仓库
let util = {
	avg: (...arr) => arr.map(Number).reduce((s, v) => s + v, 0) / arr.length,

	cot: num => Math.cos(num) / Math.sin(num),
	//存在浮点型精度问题。
	log: (num1, num2) => Math.log(num1) / Math.log(num2),

	log10: function(num) {
		return util.log(num, 10);
	},
	
	acosh: Math.acosh || function(num) {return Math.log(num + Math.sqrt(num * num - 1))},

	asinh: Math.asinh || function(num) {return num === -Infinity ? num : Math.log(num + Math.sqrt(num * num + 1))},

	atanh: Math.atanh || function(num) {return Math.log((1 + num)/(1 - num)) / 2},

	//可能存在浮点型精度问题
	cbrt: Math.cbrt || function(num) {return Math.pow(num, 1/3)}, 

	sum: (a, b) => a + b,

	pow: Math.pow,

	angle2rad: n => n * 2 * Math.PI / 360,

	rad2angle: n => n * 180 / Math.PI
}
// 对于JS中Math对象中有的方法进行替换， 没有的方法则自己实现
let replaceMethods = {
	// 导师给定需要实现的方法。
	'abs': Math.abs,
	'avg': util.avg,

	'sin': Math.sin,
	'cos': Math.cos,
	'tan': Math.tan,
	'cot': util.cot,

	'acos': Math.acos,
	'acosh': util.acosh,
	'asin': Math.asin,
	'atan': Math.atan,
	'asinh': util.asinh,
	'atanh': util.atanh,
	'atan2': Math.atan2,
	// ES6中Math对象上有等同性质的函数Math.log10
	//但是根据MDN(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
	//大多浏览器(新版本chrome上支持良好)不予支持, 故自己实现
	'log': util.log10,
	'ln': Math.log,

	// 导师给定的常量
	'e': Math.E,
	'π': Math.PI,

	// 个人实现的方法
	'logMutil' : util.log,
	'cbrt': util.cbrt,
	'sum': util.sum,
	'pow': util.pow
};

// 将方法中的三角函数类方法再加工，根据设置(status.isAngle)
// 判断输入是角度还是弧度
[	'sin',
	'cos',
	'tan',
	'cot',
	'acos',
	'acosh', 
	'asin',
	'atan',
	'asinh', 
	'atanh', 
	'atan2'  ].map(v => {
		var oriFn = replaceMethods[v];
		replaceMethods[v] = n => status.isAngle ? oriFn(util.angle2rad(n)) : oriFn(n);
	});

// 挂载到全局上， 方便eval内部使用
//window && (window.cacu = caculate);


function addCustomMethods (name, str) {
	replaceMethods[name] = function(...arg) {
		var count = 0;
		// 变量名可以包括大小写字母、下划线和数字，
		// 但只允许以下划线或者字母开头，
		// 判断自定义方法的运算体是否合法的逻辑放在按钮点击时
		// 这里只负责添加，不负责判断
		return str.replace(/\b([a-z_]\w*)\b/gi, v => arg[count++]);
	}
}

module.exports = caculate;