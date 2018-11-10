'use strict';

const request = require("request");
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Wallhaven = require('wallhaven-api')
 
const wh = new Wallhaven()
 

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
            $('div[class="embed-container"]').find('iframe').each(function (index, element) {
                links.push($(element).attr('src'));
            });
            resolve(links);
        });
    });
}

function scrapNeko(name, episode) {
    if (episode < 10 && episode.toString().length == 1) {
        episode = '0' + episode;
    }
    return new Promise(function (resolve, reject) {
        var links = [];
        request('http://neko-streaming.com/'+name+'-'+episode+'-vostfr/', (error, response, html) => {
            if (error || response.statusCode != 200) {
                reject(error);
            }
            var $ = cheerio.load(html);
            $('iframe').each(function (index, element) {
                links.push($(element).attr('src'));
            });
            resolve(links);
        });
    });
}

exports.load = async function() {
    animeList = await KickAssAnimeList();
    console.log(animeList.length + ' animes loaded');
    animeList.forEach((anime, index) => {
        wh.search(anime.name, {
            categories: ['anime'],
            sorting: 'favorite',
            page: 1
        })
        .then(result => {
            //if (index % 100 == 0) console.log(index + '/' + animeList.length);
            if (result['images'] && result['images'][0]) anime.image = result['images'][0];
        }).catch(err => {
        });
        if (index === animeList.length) console.log('Thumbs loaded !')
    });
    // getAnimeListDetail();
}

exports.getEpisode = async function (req, res) {
    let name = req.params.name;
    let episode = req.params.episode;
    var links = [];

    links.push(...await scrapKickAssAnime(name, episode));
    links.push(...await scrapNeko(name, episode));
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
var animeListDetail = [];

async function getAnimeListDetail() {
    if (animeList.length === 0) {
        animeList = await KickAssAnimeList();
    }
    let animes = []
    var i;
    for (i = 0; i < animeList.length; i++) { 
         KickAssAnimeInfo(animeList[i].link).then(info => {
            console.log(info);
            if (!info.name) console.log(animeList[i].link + ' failed');
            if (i % 50 == 0) console.log(i + '/' + animeList.length + ' loaded');
            animeListDetail.push(info);
         }).catch(err => console.log(err));
        
    }
    console.log('anime detail loaded !');
    return new Promise(function (resolve, reject) {
        resolve(animes);
    });
};

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
                return;
            }
            if (!html) {
                console.log('fdp');
                reject(error);
                return;
            }
            var $ = cheerio.load(html);
            $('table[id="anime_episodes"]').find('tbody > tr > td > a[class="black"]').each(function (index, element) {
                episodes.push(
                    $(element).text().split(' ')[1],
                );
            });
            
            episodes.sort((a, b) => a - b);

            let name = $('h1').text();
            if ($('a[data-a]').prev().attr('style') == undefined) {
                resolve({
                    name: 'Error retrieving name of ' + anime
                });
                return;
            }
            let temp = $('a[data-a]').prev().attr('style').match(/\bhttps?:\/\/\S+?(?=\?)/gi);
            if (!temp || temp.length == 0) {
                resolve({
                    name: 'Error retrieving image of ' + anime
                });
                return;
            }
            let img = temp[0];
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
            let whImg;
            wh.search(name, {
                categories: ['anime'],
                sorting: 'favorite',
                page: 1
            })
            .then(result => {
                if (result['images'] && result['images'][0]) whImg = result['images'][0];
                wh.details(whImg.id).then(res => {
                    resolve({anime: anime, name: name, wh: res, image: img, summary: summary, episodes: episodes, genres: genres, status: status, rating: {current: current, max: 5, votes: votes}});
                }).catch(err => {
                    resolve({anime: anime, name: name, wh: whImg, image: img, summary: summary, episodes: episodes, genres: genres, status: status, rating: {current: current, max: 5, votes: votes}});
                });
            }).catch(err => {
                resolve({anime: anime, name: name, image: img, summary: summary, episodes: episodes, genres: genres, status: status, rating: {current: current, max: 5, votes: votes}});
            });

        });
    });
}

exports.getAnimeInfo = async (req, res) => {
    let anime = req.params.name;
    let id = -1;
    let infos;
    if (req.params.id) id = req.params.id;
    if (id != -1 && id <= animeListDetail.length) {
        console.log(anime + ' availale in cache !');
        infos = animeListDetail[id];
    } else {
        infos = await KickAssAnimeInfo(anime);
    }
    res.status(200);
    res.json(infos);
    res.end();
};
