exports.header = 'apikey';

exports.facebook = {
	secret: '3309bf7e09cce0f74b27c6f1dcf66757',
	appID: '233000996867576'
};

exports.listen = process.env.PORT || 5000;
console.log(DATABASE_URL)
exports.db = process.env.DATABASE_URL || 'pg://lveutcjeuydedd:CUHx571cS0jr6PESlTk-Uj1oFd@localhost:5432/dchtsmvsngop0o';

exports.basePath = 'http://imguploader.herokuapp.com/';