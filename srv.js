'use strict'


const http = require("http");
const { Client } = require('@elastic/elasticsearch')
const express = require("express");
const bodyParser = require('body-parser');
const proxy = require('proxy-agent');

//http.createServer(listener).listen(3000);
//var router = express.Router();
const client = new Client({ node: 'http://localhost:9200',
log : 'trace',
createNodeAgent: () => { return proxy(process.env.HTTP_PROXY);}
});
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();
app.set('view engine', 'pug');
var indices;
var types = ['regexp','match'];
var fields = ['body','header','admin','robots'];
app.use('/static', express.static('static'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Elasticsearch interface', indices: indices, types: types, fields: fields });
})

app.post('/search',urlencodedParser, async function (req,res){
  var result = await search(req.body.index, req.body.es_query, req.body.stype, req.body.field, req.body.filter, req.body.filter_field);
//console.log(result.body.hits.total.value);
//res.send(result);
//var total = result.body.hits.total.value;
//var data;
//result.hits.hits.forEach(function(hit){
//        consile.out(hit);
//      })
//result.body.hits.hits.foreach(function(rec){
//console.log( result.body.hits.hits);
//data= result.body.hits.hits;
//console.log( data);
//}

//res.send("huita");
res.render('result', { title: 'Elasticsearch interface', result: result});
});

async function search (index, es_query, stype, field, filter, filter_field){
  var out;
  var query = {
    method: "GET",
    path: "/"+index+"/_search/template",
    body:{
      "id": "jin_regexp_query",
      "params": {
        "query_string": es_query,
        "field_string": field,
        "field_filter": filter_field,
        "filter_string": filter
      }
    }
  }
   console.log(query);

  out = client.transport.request(query);

   //out=(req.body.index);
   //out+=(req.body.query);index
   //console.log(out);
   return out;
   //res.send(out);
}

app.get('/huita/', function (req,res){
   res.send('huita');
});

/*var highlight = (function(html){
  html.replace.('88huita99','<text color="red">'); html.replace.('99huita00','</text>'); return html;
});*/


var server = app.listen(3000);
async function listener(req, resp){
  resp.end("huita");
}

async function getIndices() {
	var {body} = await client.transport.request({
		method: 'GET',
		//path: '/_cat/indices'
		path: '/_aliases'
	});

	indices = Object.keys(body);
	//indices.forEach(function(index){
	//console.log(index); });

}
getIndices().catch(console.log);
