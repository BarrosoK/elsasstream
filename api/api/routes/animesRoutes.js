'use strict';
module.exports = function (app) {
    var animeList = require('../controllers/animesController');

    app.route('/anime/list/:search?')
        .get(animeList.getAnimeList);

    app.route('/anime/:name')
        .get(animeList.getAnimeInfo);

    app.route('/anime/:name/:episode')
        .get(animeList.getEpisode);



};
