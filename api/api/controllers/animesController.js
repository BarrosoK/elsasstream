'use strict';

const request = require("request");
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function scrapKickAssAnime(name, episode) {
    if (episode < 10 && episode.toString().length == 1) {
        episode = '0' + episode;
    }
    return new Promise(function (resolve, reject) {
        var links = [];
        request('https://www12.kickassanime.io/anime/'+name+'/episode-'+episode, (error, response, html) => {
            if (error || response.statusCode != 200) {
                reject(error);
            }
            var $ = cheerio.load(html);
            $('div[class="anime_muti_link"]').find('ul > li > a').each(function (index, element) {
                links.push($(element).attr('data-video'));
            });
            resolve(links);
        });
    });
}

exports.getEpisode = async function (req, res) {
    let name = req.params.name;
    let episode = req.params.episode;
    var links = [];

    links.push(...await scrapKickAssAnime(name, episode));
    res.json({anime: name, episode: episode, links: links});
    res.status(200);
    res.end();
    return;
};

function KickAssAnimeList() {

    return new Promise(function (resolve, reject) {
        var animes = [];
        request('https://www12.kickassanime.io/anime-list', (error, response, html) => {
            if (error || response.statusCode != 200) {
                reject(error);
            }
            var $ = cheerio.load(html);
            $('div[class="table-responsive"]').find('table > tbody > tr > td > a').each(function (index, element) {
                var url = $(element).attr('href').split('/')[4];
                url = url.substr(0, url.lastIndexOf('-'));
                animes.push({
                name: $(element).text(),
                link: url
            });
            });
            resolve(animes);
        });
    });
}

var animeList = [];

exports.getAnimeList = async (req, res) => {
    let search = req.params.search;

    if (animeList.length == 0) {
        animeList = await KickAssAnimeList();
    }
    if (search) {
        var filter = animeList.filter(function (el) {
            return el.name.toLowerCase().includes(search.toLowerCase());
        });
        res.json(filter);
    } else {
        res.json(animeList);
    }
    res.status(200);
    res.end();
};

function KickAssAnimeInfo(anime) {

    return new Promise(function (resolve, reject) {
        var episodes = [];
        var votes = {};
        request('https://www12.kickassanime.io/anime/' + anime, (error, response, html) => {
            if (error || response.statusCode != 200) {
                reject(error);
            }
            var $ = cheerio.load(html);
            $('table[id="anime_episodes"]').find('tbody > tr > td > a[class="black"]').each(function (index, element) {
                episodes.push(
                    $(element).text().split(' ')[1],
                );
            });

            episodes.sort((a, b) => a - b);

            let name = $('h1').text();
            let img = $('a[data-a]').prev().attr('style').match(/\bhttps?:\/\/\S+?(?=\?)/gi)[0];
            let status = $('div').filter(function() {
                return $(this).text().trim() === 'Status';
            }).next().text();
            let summary = $('div').filter(function() {
                return $(this).text().trim() === 'Summary';
            }).next().text();
            let genres = $('div').filter(function() {
                return $(this).text().trim() === 'Genres';
            }).next().text().split(',').map(Function.prototype.call, String.prototype.trim);

            let current = $('div[class="rating"]').find('div > div > select').attr('data-current-rating');
            let votes = $('div[class="rating"]').find('div > div > span').text().trim();
            resolve({anime: anime, name: name, image: img, summary: summary, episodes: episodes, genres: genres, status: status, rating: {current: current, max: 5, votes: votes}});
        });
    });
}

exports.getAnimeInfo = async (req, res) => {
    let anime = req.params.name;
    let infos = await KickAssAnimeInfo(anime);
    res.status(200);
    res.json(infos);
    res.end();
};
