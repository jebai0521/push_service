
module.exports = function(Task) {

	// 查询任务状态与进度
	Task.status = function(cb) {

		console.log('Current hour is ' + currentHour);
		var response;
		if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
			response = 'We are open for business.';
		} else {
			response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
		}
		cb(null, response);
	};

	Task.remoteMethod(
		'status',
		{
			http: {path: '/status', verb: 'get'},
			returns: {arg: 'status', type: 'string'}
		}
	);

	// 更新任务状态与进度
	Task.statusUpdate = function(data, cb) {

		console.log(data);

		console.log(data.id);

		// task id
		var id = data.id;

		var action = data.action;

		var response;

		if (id && action) {

			var task = Task.findOne({"id":id});

			// 任务不存在
			if (!task) {
				response = "task is not exist";
			} else if (date.action === "start") {
				response = "try to start task";
			} else if (date.action === "stop") {
				response = "try to stop task";
			} else if (date.action === "pause") {
				response = "try to pause task";
			} else if (date.action === "cancel") {
				response = "try to cancel task";
			} else if (date.action === "stop") {
				response = "unknown action";
			}
		} else {
			response = "parameter error";
		}
		cb(null, response);
	};

	Task.remoteMethod(
		'statusUpdate',
		{
			http: {path: '/status', verb: 'put'},
			accepts: {arg: 'data', type: 'object'},
			returns: {arg: 'status', type: 'string'}
		}
	);
};
