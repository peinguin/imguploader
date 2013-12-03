exports.header = 'apikey';

exports.facebook = {
	secret: '3309bf7e09cce0f74b27c6f1dcf66757',
	appID: '233000996867576'
};

exports.listen = process.env.PORT || 5000;
console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
if(process.env.DATABASE_URL){
	exports.db = process.env.DATABASE_URL.replace("postgres://", "pg://");//'pg://lveutcjeuydedd:CUHx571cS0jr6PESlTk-Uj1oFd@ec2-54-246-101-204.eu-west-1.compute.amazonaws.com:5432/dchtsmvsngop0o';
}else{
	exports.db = 'pg://lveutcjeuydedd:CUHx571cS0jr6PESlTk-Uj1oFd@localhost:5432/dchtsmvsngop0o';
}
exports.basePath = 'http://imguploader.herokuapp.com/';