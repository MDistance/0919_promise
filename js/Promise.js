//该文件模拟原生Promise

(function(){

	const PENDING = 'pending' //定义常量，存储初始化状态字符
	const RESOLVED = 'resolved' //定义常量，存储成功状态字符
	const REJECTED = 'rejected' //定义常量，存储失败状态字符

	//Promise构造函数
	function Promise(excutor){
		const self = this //缓存this
		self.status = PENDING //初始化实例的状态
		self.data = undefined //初始化实例所保存的数据（可能是成功的value，或是失败的reason）
		self.callbacks = [] //用于保存一组一组的回调函数，
		/* 
			self.callbacks形如：[
														{onResolved:()=>{},onRejected:()=>{}},
														{onResolved:()=>{},onRejected:()=>{}}
													]
		*/

		//调用resolve会：1.内部状态改为resolved，2.保存成功的value，3.去callbacks中取出所有的onResolved依次异步调用
		function resolve(value){
			//1.内部状态改为resolved
			self.status = RESOLVED
			//2.保存成功的value
			self.data = value
			//3.去callbacks中取出所有的onResolved依次异步调用
			setTimeout(()=>{
				self.callbacks.forEach((cbkObj)=>{
					cbkObj.onResolved(value)
				})
			})
		}

		//调用reject会：1.内部状态改为rejected，2.保存失败的reason，3.去callbacks中取出所有的onRejected依次异步调用
		function reject(reason){
			//1.内部状态改为rejected
			self.status = REJECTED
			//2.保存失败的reason
			self.data = reason
			//3.去callbacks中取出所有的onRejected依次异步调用
			setTimeout(()=>{
				self.callbacks.forEach((cbkObj)=>{
					cbkObj.onRejected(reason)
				})
			})
		}

		excutor(resolve,reject)
	}

	Promise.prototype.then = function(onResolved,onRejected){
		const self = this
		//存onResolved,onRejected两个回调
		self.callbacks.push({onResolved,onRejected})
	}

//替换掉window上的Promise
window.Promise = Promise
})()