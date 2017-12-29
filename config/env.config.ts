const isProdEnv:boolean = process.env.NODE_ENV === 'production';
let listenPort:Number = 3000;
if(isProdEnv) {
	//listen port
	listenPort = 3000;
}

export default {
	 listenPort,
}