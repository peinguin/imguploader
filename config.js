exports.header = 'apikey';

exports.memcache = {
	host: 'pub-memcache-18622.us-east-1-3.1.ec2.garantiadata.com',
	port: 18622
};

exports.facebook = {
	secret: '3309bf7e09cce0f74b27c6f1dcf66757',
	appID: '233000996867576'
};

exports.listen = process.env.PORT || 5000;

if(process.env.HEROKU_POSTGRESQL_OLIVE_URL){
	exports.db = process.env.HEROKU_POSTGRESQL_OLIVE_URL.replace("postgres://", "pg://");
}else{
	exports.db = 'pg://lveutcjeuydedd:CUHx571cS0jr6PESlTk-Uj1oFd@ec2-54-246-101-204.eu-west-1.compute.amazonaws.com:5432/dchtsmvsngop0o?ssl=true';
}

exports.basePath = 'http://imguploader.herokuapp.com/';

exports.parsecom = {
	'AppID':'N7sjuzD6D04MY4MQeG0n1wvQNEoRhP4Qqok3fzE9',
	'ApiKEY':'0SSBb7lBjB2b3WqDI8fCn2T5iXZWK4jjSgYtMcuy'
}