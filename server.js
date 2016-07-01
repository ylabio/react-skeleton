/**
 * server
 * @author Vladimir Shestakov <boolive@yandex.ru>
 * @version 1.0
 * @created 01.07.2016
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

/**
 * Вместо базы
 */
var db_ids = 1;
var db_grids = {};

/**
 * Выбор сетки по куке.
 * Если куки нет, то создание новой
 */
app.get('/api/grid/', function (req, res) {
    var id = req.cookies.sid;
    if (!id || !db_grids[id]) {
        id = db_ids++;
        db_grids[id] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }
    res.cookie('sid', id);
    res.status(200);
    res.json(db_grids[id]);
});

/**
 * Обновление сетки по куке
 */
app.put('/api/grid/', function (req, res) {
    var id = req.cookies.sid;
    if (id && db_grids[id]){
        if (req.body.items){
            db_grids[id] = req.body.items;
        }
    }
    res.status(200);
    res.json({
        message: 'Updated'
    });
});


var server = app.listen(8089, function () {
    //console.log('Back-end listening at localhost:' + server.address().port);
});