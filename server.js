var express = require('express'),
		serveIndex = require('serve-index'),
		app = express();
		
port = 8080;

//app.use(express.static(__dirname + "/"))
// app.use('/dev', serveIndex(__dirname + '/dev'));
app.use('/include/js', serveIndex(__dirname + '/include/js'));
app.use(express.static(__dirname + "/include"));

app.listen(port, () => console.log(`Express Server Running on http://localhost:${port}`))	
// console.log('Express Server Running on port:', port);