'use strict';

exports.appHeaders = (req, res, next) => {
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
	);

	res.header('Access-Control-Expose-Headers', 'x-access-token');

	next();
};
