const mongoose = require('mongoose');
const dns = require('dns');
const validator = require('validator');
const { URL } = require('url');

const UrlModel = require("../models/UrlModel");

const makeUrlShort = async (req, res) => {
  const originalUrl = req.body.url;

  if(!validator.isURL(originalUrl, {protocols: ['http', 'https', 'ftp']})){
    return res.json({'error': 'invalid url'});
  }

  const urlRegex = /^(http(s):|ftp:)\/\/[a-zA-Z0-9@:%\._\\+~#=]{2,256}\.([a-z]{2,3})\b([a-zA-Z0-9\/?=#_$%\.]*)/g;

  if(!urlRegex.test(originalUrl)){
    return res.json({'error': 'invalid url'});
  }

  const { hostname } = new URL(originalUrl)

  dns.lookup(
    hostname,
    async (err, address) => {
      if(err) return res.json({"error": "Invalid URL"});
     
    }
  )

  try {
    const alreadyExist = await UrlModel.findOne({ originalUrl: originalUrl});
    if(alreadyExist) return res.json({'error': 'url has been saved'});
    const urlCount = await UrlModel.countDocuments();

    const result = await UrlModel.create({
      urlId: urlCount,
      originalUrl: originalUrl,
      date: new Date(),
    });

    return res.json({"original_url": originalUrl, "short_url": result.urlId});
    
  } catch(err){
    console.error(err);
    process.exit(1);
  }
}

const convertUrlShort = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await UrlModel.findOne({ urlId: parseInt(id) });

    if(!result) return res.json({'error': 'Invalid URL'});
  
    const originalUrl = `${result.originalUrl}`;

    res.redirect(originalUrl);
  } catch(error){
    console.log(error);
    process.exit(1);
  }
}

module.exports = { makeUrlShort, convertUrlShort };

