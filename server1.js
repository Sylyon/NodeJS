var http = require('http');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer(function(req, res) {
	var pageCall = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);
	console.log(pageCall);
	console.log(params);
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	if (pageCall == '/' || pageCall == '/home')
	{
	res.write('<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>Home</title>' +
		'    </head>' +
		'    <body>' +
		'     	<p><strong>Home page</strong> !</p>' +
		'    </body>' +
		'</html>');
	}
	else if(pageCall == '/about' )
	{
	res.write('<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>About</title>' +
		'    </head>' +
		'    <body>' +
		'     	<p>It\'s me Mario  ! '+
		'			and you are '+params['firstname']+' <span style="text-transform:uppercase">'+params['lastname']+'</span>'+
		'		</p>' +
		'    </body>' +
		'</html>');
	}
	else
	{
	res.writeHead(404, {
		"Content-Type": "text/html"
	});
	res.write('<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>Error</title>' +
		'    </head>' +
		'    <body>' +
		'     	<p><strong>404</strong> !</p>' +
		'    </body>' +
		'</html>');
	}
	res.end();
});
server.listen(8080);