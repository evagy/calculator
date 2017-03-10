let util = require('./util.js'),
	constants = require('./constants.js'),
	status = require('./status.js');

// 处理运算符
let op = {
	'+': (a, b) => +a + +b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'%': (a, b) => a % b,
	'^': (a, b) => Math.pow(a, b)
}
// 比较运算符的优先级
const compareLevel = (a, b) => {
	var levelMap = {
		'(': 4,
		'^': 3,
		'*': 2,
		'/': 2,
		'%': 2,	
		'+': 1,
		'-': 1	
	};
	return levelMap[a] > levelMap[b];	
}

let isNum = n => /^[+\-]?\d+(\.\d*)?$/.test(n);
let isMethodName = n => /^[a-z][a-z\d]*$/i.test(n);
let isOperate = n => /^[+\-\*/^%(,]$/.test(n);
let isBlank = n => /^\s$/.test(n);
let isConstant = n => !!constants[n];
let isMethod = n => !!util[n];

// 核心函数, 传入运算字符串，返回运算结果 
// 如果传入字符串格式错误，则返回包含错误信息的数组。
// 错误信息的格式为 [错误码, 错误内容, 错误位置]
function caculate(str) {
	let res;
	function innerCaculate(str) {
		let len = str.length,
			opStack = [],
			valueStack = [],
			lastValue = '',
			spaceLen = 0,
			curChar,
			isFirstOp;
		for(var pos = 0; pos < len; pos++) {

			curChar = str[pos];

			// 如果是π
			// 其前面只能为运算符, 右括号, 逗号, 或者什么都不跟, 遇到其他情况就报错。
			// 如果是以正负号开头, 则应该当做π的前缀运算符
			if(curChar === 'π') {
				if(/[(,+\-*/%^]/.test(lastValue)) {
					if(/[\-+]/.test(lastvalue) && isFirstOp) {
						isFirstOp = false;
						lastValue += 'π';
					}
				} else if(lastValue !== '') {
					throw new Error(`18, π, ${pos}`);
				}
				lastValue = 'π';
				spaceLen = 0;
			}

			// 如果是空格类
			// 有很多可能
			// 1. 存在最前面的或前面还有空格的空格 可以忽略， 判断条件,lastValue没有值 
			// 2. 其他情况则用spaceLen++, 来监控space的数量
			// 不额外处理，某种意义上就像忽略了空格, 但是因为有spaceLen监控可以正确的拿到错误的索引
			else if(isBlank(curChar)) {
 				if(lastValue === '') {
 					continue;
 				}
 				spaceLen++;
			}			

			// 如果是数字的话，可能是方法名或常量名的一部分，也可能是数字的一部分
			// 如果数字之前有空格隔开的变量或者常量的话，那么应该报错，如 (12 12)这种表达式
			// 其不能跟在右括号")"后面
			else if(/\d/.test(curChar)) {
				if(isNum(lastValue) || isMethodName(lastValue)) {
					// 数字间不合法的空格，报错。如(123 123)
					if(spaceLen) throw new Error(`53, ${curChar}, ${pos}`);
					lastValue += curChar;
				} else if(isOperate(lastValue)) {
					if(isFirstOp && /[+\-]/.test(lastValue)) {
						isFirstOp = false;
						lastValue += curChar;
					} else {
						lastValue = curChar;
					}
				} else if(lastValue === '') {
					lastValue = curChar;
				} else {
					throw new Error(`19, ${curChar}, ${pos}`)
				}

				spaceLen = 0;
			}

			// 如果是小数点
			// 前面已经有小数点的数字，或者不是数字都理应报错
			// 如果前面是还没有存在小数点的数字，应该加上去
			else if(/\./.test(curChar)) {
				if(/^[+\-]?\d+$/.test(lastValue) && !spaceLen) {
					lastValue += '.';
				} else if(isNum(lastValue)) {
					throw new Error(`51, ., ${pos}`);
				} else {
					throw new Error(`52, ., ${pos}`);
				}
			}

			// 如果是字母的话，只能是方法名或者常量名的一部分
			else if(isMethodName(curChar)) {
				if(/^[a-z\d]+$/i.test(lastValue)) {
					if(spaceLen) throw new Error(`53, ${curChar}, ${pos - spaceLen}`);	
					if(/^\d$/.test(lastValue)) throw new Error(`33, ${lastValue}, ${pos - 1}`);
					lastValue += curChar;
				} else if(isOperate(lastValue) || lastValue === '') {
					if(isFirstOp && /[+\-]/.test(lastValue)) {
						isFirstOp = false;
						lastValue += curChar;
					}
					else lastValue = curChar;
				} else {
					throw new Error(`61, ${curChar}, ${pos}`);
				}
				spaceLen = 0;
			}

			// 如果是右圆括号的话, 只能跟在'(', ',' '' 变量名的后面
			else if(curChar === '(') {
				if(/^\(|,$/.test(lastValue) || lastValue === '') {
					opStack.unshift(curChar);	
				} else if(isOperate(lastValue)) {
					if(isFirstOp && /^[+\-]$/.test(lastValue)) {
						isFirstOp = false;
						opStack.unshift(lastValue + curChar);
					} else {
						opStack.unshift(curChar);
					}
				} else if(isMethodName(lastValue)) {
					if(isMethod(lastValue)) {
						opStack.unshift(lastValue + curChar);
					} else {
						throw new Error(`32, ${lastValue}, ${pos - spaceLen - lastValue.length}`)
					}
				} else {
					throw new Error(`14, ${curChar}, ${pos}`);
				}
				lastValue = curChar;
				spaceLen = 0;
			}

			else if(curChar === ',') {
				if(!opStack.some(v => /\(/.test(v))) throw new Error(`15, ${curChar}, ${pos}`);
				if(isMethodName(lastValue) || isNum(lastValue) || /^(π|\))$/.test(lastValue)) {
					if(isMethodName(lastValue) || lastValue === 'π') {
						if(!isConstant(lastValue)) {
							throw new Error(`31, ${lastValue}, ${pos - spaceLen - lastValue.length}`);
						} else {
							valueStack.unshift(constants[lastValue]);
						}
					} else if(isNum(lastValue)) {
						valueStack.unshift(lastValue);
					}
					while( opStack.length && !(/[(,]/.test(opStack[0]))) {
						let num2 = valueStack.shift(), 
							num1 = valueStack.shift();
						valueStack.unshift(op[opStack.shift()](num1, num2));
					}
				} else {
					throw new Error(`15, ${curChar}, ${pos}`)
				}
				opStack.unshift(curChar);
				lastValue = curChar;
				spaceLen = 0;
			}

			else if(curChar === ')') {
				if(isNum(lastValue) || isMethodName(lastValue) || /(π|\))$/.test(lastValue)) {
					if(isNum(lastValue)) {
						valueStack.unshift(lastValue);						
					} else if(lastValue !== ')') {
						if(!isConstant(lastValue)) throw new Error(`31, ${lastValue}, ${pos - spaceLen - lastValue.length}`);
						valueStack.unshift(constants[lastValue]);	
					}

					let arg = [];
					if(!opStack.some(v => /\(/.test(v))) {
						throw new Error(`16, ${curChar}, ${pos}`);
					}

					while(1) {
						if(/^[+\-*/%^]$/.test(opStack[0])) {
							valueStack.unshift(op[opStack.shift()].apply(null, [valueStack.shift(), valueStack.shift()].reverse()));
						} else if(/^,$/.test(opStack[0])) {
							opStack.shift();
							arg.unshift(+valueStack.shift());
						} else if(/\($/.test(opStack[0])) {
							let isPositive = /[+\-]/.test(opStack[0][0]) ? opStack[0][0] === '+' : true;
							if(/[+\-]/.test(opStack[0][0])) opStack[0] = opStack[0].slice(1);
							arg.unshift(+valueStack.shift());
							if(opStack[0].length !== 1) {
								try { 
									valueStack.unshift(util[opStack[0].slice(0, -1)].apply(null, arg) * (isPositive? 1:-1));
								} catch(e) {
									throw new Error(`${e.message}, ${pos}`);
								}
							} else {
								valueStack.unshift(arg.pop() * (isPositive? 1:-1));
							}
							opStack.shift();
							break;
						} else {
							throw(`unknow Error`);
						}
					}

				} else if(lastValue === '(') {
					if(opStack[0].length !== 1) {
						try {
							valueStack.unshift(util[opStack[0].slice(0, -1)]());
						} catch(e) {
							throw new Error(`${e.message}, ${pos}`);
						}
					}
					opStack.shift();
				} else if (lastValue === ',') {
					console.log(lastValue, spaceLen)
					throw new Error(`15, ，, ${pos - spaceLen - 1}`);
				} else {
					throw new Error(`16, ${curChar}, ${pos}`);
				}
				lastValue = curChar;
				spaceLen = 0;
			}

			// 如果是运算符
			else if(isOperate(curChar)) {
				// 当表达式第一位是运算符的时候就应该报错, 如表达式*3+2或3+(%3)
				// 当运算符前面的lastValue不是数值,变量名或者右圆括号)的时候应该报错
				// 但是有例外， 比如-2+3, 又或者3+(-2),这应该是合法的表达式
				// 这时候，应该改变外部变量isFirstOp为true, 并且不报错。
				// 然后等遍历到后续的数字，将带有前置符的数字入栈
				if(/^\(?,?$/.test(lastValue) || lastValue === '') {
					if(/[+\-]/.test(curChar)) {
						isFirstOp = true;
						lastValue = curChar;
						spaceLen = 0;
						continue;
					} else {
						throw new Error(`12, ${curChar}, ${start + pos}`);
					}
				}

				// 结算前面的lastValue
				// lastValue的可能性是(PS: \s类字符已遍历时忽略) 
				// 1. 数字, 入valueStack栈
				// 2. 常量, 计算其值后入valueStack栈, 如果不存在这个常量就报错
				// 3. 右括号 ) , 这种情况什么都不做，在遍历到右括号时候处理
				// 如果不是上面俩种可能，则代表此运算符前还是运算符,报错
				else if(isNum(lastValue)) {
					valueStack.unshift(lastValue);
				} else if(isMethodName(lastValue) || lastValue === 'π') {
					if(isConstant(lastValue)) {
						valueStack.unshift(constants[lastValue]);
					} else {
						throw new Error(`31, ${lastValue}, ${pos - lastValue.length - spaceLen}`)
					}
				} else if(lastValue !== ')') {
					throw new Error(`41, ${curChar}, ${pos}`);
				}
				// 判断栈中内容
				// 如果运算符优先级不大于栈顶，则出运算符栈栈顶的运算符
				// 再出 运算值栈栈顶的俩个元素， 进行运算
				// 将运算结果推入 运算值栈栈顶
				// 然后继续判断优先级， 
				// 直到满足一下条件
			    // 1. 运算符栈有元素
				// 2. 目前的优先级不高于栈顶
				// 3. 栈顶不是逗号或者圆括号：, (
				// 运算符的可能性： + - * / % ^ ( ) ,
				while( opStack.length 
					   && !(/\(|,/.test(opStack[0])) 
					   && !compareLevel(curChar, opStack[0]) ) {
					let num2 = valueStack.shift(), 
						num1 = valueStack.shift();
					valueStack.unshift(op[opStack.shift()](num1, num2));
				}
				// 将目前的运算符推入栈顶
				opStack.unshift(curChar);
				lastValue = curChar;
				spaceLen = 0;
			}

			// 如果以上都不是，那只能直接报错了。
			// 错误代码11, 表示无法识别的字符
			else {
				throw new Error(`11, ${curChar}, ${pos}`);
			}


		}

		if(isOperate(lastValue)) {
			throw new Error(`17, ${lastValue}, ${len - 1 - spaceLen}`)
		} else if(isNum(lastValue)) {
			valueStack.unshift(lastValue);
		} else if(isMethodName(lastValue) || lastValue === 'π') {
			if(!isConstant(lastValue))throw new Error(`31, ${lastValue}, ${pos - spaceLen - lastValue.length}`);
			else valueStack.unshift(constants[lastValue]);
		}

		while(opStack.length && !(/\(|,/.test(opStack[0]))) {
			let num2 = valueStack.shift(), 
				num1 = valueStack.shift();
			valueStack.unshift(op[opStack.shift()](num1, num2));
		}

		if(!opStack.length && valueStack.length === 1) return valueStack[0];
		else {
			if(/^\s*$/.test(str)) throw new Error(`12`);
			throw new Error(`71`);
		}
	}

	try {
		res = innerCaculate(str);
	} catch(e) {
		res = e.message.split(/\s*,\s*/);
	}
	// 如果结果是数字则返回数字， 如果结果是错误字符串，则解析成数组
	// 错误字符串解析成数组后，
	// 第一个元素表示错误代码
	// 第二个元素表示错误字符或方法常量名
	// 第三个元素表示错误所在的位置索引
	return typeof res === 'object' ? res : +(+res).toFixed(15);
}

// 验证新建变量是否合法
// 如果合法，返回true， 反之返回包含错误信息的字符串
const validVarible = (name, value) => {
	if(/^[a-z][a-z\d]*$/i.test(name) && isNum(value)) {
		return constants[name] ? [81] : true;
	} else {
		return /^[a-z_]\w*$/i.test(name) ? [83] : [82];
	}
};

const createVarible = (name, value) => constants[name] = +value;


const validMethod = (name, body) => {
	if(!(/^[a-z][a-z\d]*$/i.test(name))) {
		return [85];
	} else {
		if(util[name]) return [84];
		else {
			// 让方法体跑一遍，就知道其是不是合法的了
			// 这个replace可能与createMethod中的replace重复了
			// 某种意义上可以封装一下后复用
			let res = caculate(body.replace(/\s/g, '')
									.replace(/\b[a-z][a-z\d]*(?!\(|\w)/ig, v => util[v] ? util[v] : 1));
			return typeof res === 'number' ? true : [86];
		}
	}
};


const createMethod = (name, body) => {

	// 外部自定义方法调用
	var arr = [],
		isArgStrict = status.isArgStrict;
	body = body.replace(/\s/g, '')
				.replace(/\b[a-z][a-z\d]*(?!\(|\w)/g, v => {
					if(util[v]) return util[v];
					else {
						if(arr.indexOf(v) === -1) arr.push(v); 
						return v;
					}
				});

	function fn(...arg) {
		var res;
		if(arg.length < arr.length) {
			throw new Error(`21, ${name}`);
		} else if(arg.length > arr.length) {
			if(isArgStrict) throw new Error(`22, ${name}`);
		}
		res = caculate(body.replace(RegExp(`\\b(${arr.join('|')})\\b`, 'g'), v => arg[arr.indexOf(v)] || v));
		if(typeof res !== 'number') throw new Error(`unknow error at custom method`);
		return res;
	}
	util[name] = fn;
};


// 将 改变模式 和 创建新方法或常量 的接口挂载在caculate函数上
caculate.create = {
	validMethod: validMethod,
	createMethod: createMethod,
	validVarible: validVarible,
	createVarible: createVarible
}

caculate.changeModel = {
	changeArgModel: () => status.isArgStrict = !status.isArgStrict,
	changeIsAngle: () => status.isAngle = !status.isAngle
}

module.exports = caculate;