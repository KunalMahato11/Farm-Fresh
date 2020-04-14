const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
//Synchronous Way

// const text = a.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

// const textOut = `This is what we know about the avocado: ${text}.\nCreated on ${Date.now()}`;
// a.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

//Asynchronous Way

// a.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
// 	a.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		a.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);
// 			a.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
// 				console.log('file WRITTIEN !!');
// 			});
// 		});
// 	});
// });

// console.log('will read file');

/////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/Markups/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/Markups/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/Markups/Product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	//Overview Page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHeader(200, { 'Content-type': 'text/html' });

		const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');

		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

		res.end(output);

		//Product Page
	} else if (pathname === '/product') {
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.writeHeader(200, { 'Content-type': 'text/html' });
		res.end(output);

		//API
	} else if (pathname === '/api') {
		res.writeHead(200, { 'Content-type': 'application/json' });
		res.end(data);

		//Not Found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-world',
		});
		res.end('<h1>Page not found<h1>');
	}

	res.end('Hello from the Server');
});

server.listen(8000, '127.0.0.1', () => {
	console.log('listening to request on port 8000');
});
