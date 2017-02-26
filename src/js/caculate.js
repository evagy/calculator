function caculate (str) {
	var result;
	function innerCaculate (str) {
		var ori = str,
			index = 0,
			res;
		// 第一步  替换掉所有的空白类字符
		str = str.replace(/\s/g, '');
		if(!str) throw new Error('并没有输入任何有意义的运算');
		// 第二步  将常量名转换为常量值   π比较特殊，不算在\w里面, 正则中另做处理
		str = str.replace(/(\b[a-z_]\w*\b|\Bπ\B)(?!\()/gi, v => {
			if(!replaceMethods[v]) {
				throw new Error(`不存在的常量名: ${v}`);
			} else if(replaceMethods[v] && typeof replaceMethods[v] !== 'number') {
				throw new Error(`不能把方法: ${v} 当常量用`);
			} else {
				return replaceMethods[v];
			}
		});
		
		// 第三步  将幂运算符及前后数值进行计算，转化为结果数值
		// 把^幂运算装换为pow方法  ^前后只能有单数字或常量，不能嵌套圆括号或者方法
		// 如果你想嵌套，可以使用pow
		// eg: (5+2) ^ Math.abs(2.4)   错误，报错“错误的使用: ^幂运算符”，请改用pow
		//     pow((5+2), Math.abs(2.4)) 正确
		str = str.replace(/\b(\d(?:\.\d*)?)\^((\d(?:\.\d*)?))\b/, (v, a, b) => Math.pow(a, b));

		// 第四步 在第三步替换掉幂运算符后如果还存在^， 代表其使用错误，报错。
		if(/\^/.test(str)) throw new Error('错误的使用: ^幂运算符');

		// 第五步 处理方法或者圆括号内的内容, 将其转换为确切的数值.
		while(/\b([a-z_]\w*)?\([^(]*?\)/i.test(str)) {
			str = str.replace(/\b([a-z_]\w*)?\(([^(]*?)\)/i, (...arg) => {
				let res, method = arg[1];
		
				// 如果没有匹配到方法名， 代表是纯运算式，直接eval求值。
				if(method === undefined) {
					try {
						res = eval(arg[0])
					} catch(e) {
						throw new Error('不正确的算术格式~')
					}
				} else {
					let usage = replaceMethods[method];
					if(usage) {
						// 如果匹配到的方法名存在且是函数形式，则带参数求值
						// 不需要考虑参数数量限制， 这个判断逻辑放在replaceMethods的相应方法中
						if(usage instanceof Function) {
							try {
								res = eval(`replaceMethods.${arg[1]}(${arg[2]})`);
							} catch(e) {
								throw new Error('不正确的算术格式~');
							}
						} else if(typeof usage === 'number') {
							throw new Error(`不能将常量 ${method} 当方法用`);
						} 
					} else {
						// 如果匹配到的方法名不存在，则报错
						throw new Error(`不存在的方法名: ${method}`);
					}
				}
				return res;
			});
		}
		try {
			res = eval(str);
		} catch(e) {
			throw new Error('不正确的算术格式~');
		}
		return res;
	}

	// 捕获错误，并在catch中提示用户。
	try {

		result = innerCaculate(str);

	} catch(e) {

		return e.message;

	}
	// 只精确到小数点后15位， 避免双浮点精度丢失
	// 15位防止Math.sin精度丢失 16位防止0.1+0.2这种情况
	return +result.toFixed(15);
};

// 管理计算器的状态 
let status = {
	isAngle: true,
	argModel: 0
};

// 一个储存自己数学方法的仓库
let util = {
	avg: (...arr) => util.sum.apply(null, arr) / arr.length,

	cot: num => Math.cos(num) / Math.sin(num),
	
	log: (num1, num2) => Math.log(num1) / Math.log(num2),

	log10: function(num) {
		return util.log(num, 10);
	},
	
	acosh: Math.acosh || function(num) {return Math.log(num + Math.sqrt(num * num - 1))},

	asinh: Math.asinh || function(num) {return num === -Infinity ? num : Math.log(num + Math.sqrt(num * num + 1))},

	atanh: Math.atanh || function(num) {return Math.log((1 + num)/(1 - num)) / 2},

	//可能存在浮点型精度问题
	cbrt: Math.cbrt || function(num) {return Math.pow(num, 1/3)}, 

	sum: (...arg) => arg.reduce((s, v)=> s + v, 0),

	pow: Math.pow,

	angle2rad: n => n * 2 * Math.PI / 360,

	rad2angle: n => n * 180 / Math.PI
};
// 对于JS中Math对象中有的方法进行替换， 没有的方法则自己实现
let replaceMethods = {
	
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

	// 常量
	'e': Math.E,
	'π': Math.PI,

	
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

// 参数数量表 根据status.argModel判断是否是严格模式
// 在普通模式下，参数过多忽略，参数过少会提醒。代码：0
// 在严格模式时候，参数过多和参数过少都会提醒。 代码： 1
let argNum = {
	'abs': 1,
	'avg': 'n', // 代表可以用n个参数;
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
	'sum': 'n',
	'pow': 2
};

// 如果合法，返回true， 反之返回包含错误信息的字符串
const validVarible = (name, body) => {
	if(/^[a-z_]\w*$/i.test(name) && /\d+(\.\d+)?/.test(body)) {
		return replaceMethods[name] ? '已经有同名常量或方法存在' : true;
	} else {
		return /^[a-z_]\w*$/i.test(name) ? '常量值不是数字！' : '不合法的常量名';
	}
};
const createVarible = (name, body) => replaceMethods[name] = +body;


const validMethod = (name, body) => {
	if(!(/^[a-z_]\w*$/i.test(name))) {
		return '不合法的方法名';
	} else {

	}
};
const createMethod = (name, body, argNum) => {
	if(typeof body === 'string') {
		var arr = [];
		body = body.replace(/\s/g, '');
		body = body.replace(/\b[a-z_]\w*(?!\()/g, v => {
			if(replaceMethods[v]) return replaceMethods[v];
			else {
				if(arr.indexOf(v) === -1) arr.push(v); 
				return v;
			}
		});
		argNum[name] = arr.length;
		return function fn(...arg) {
			return body.replace(RegExp(`\\b(${arr.join('|')})\\b`, 'g'), v => arg[arr.indexOf(v)]);
		}
	} else {
		return function(...arg) {
			if(arg.length < argNum) throw new Errow(`传入${name}方法的参数过少`);
			else if(arg.length > argNum) {
				if(status.argModel === 0) return body.apply(null, arg);
				else if(status.argModel === 1) throw new Error('传入${name}方法的参数过多');
			} else {
				return body.apply(null, arg);
			}
		}
	}
};

//  绑定已有方法的参数数量
for(let key in argNum) {
	replaceMethods[key] = createMethod(key, replaceMethods[key], argNum[key]);
};



module.exports = caculate;