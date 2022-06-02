const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');
const fs = require("fs");
var parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

app.get('/', function(req, res) {
    var urlToScreenshot = parseUrl(req.query.url);
     var mode = req.query.mode;
    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
			
			await page.goto(urlToScreenshot, {waitUntil: 'networkidle2'});
			
			
			if ( mode == 'res')  {
          const html = await page.content();
            console.log(html);
           res.send(html); } 
            
            await browser.close();
		   } 
			
			
          
			if ( mode == 's')  {
           await page.screenshot().then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
              res.setHeader('Content-Type', 'image/png');
               res.send(buffer)		  		   
           }); 
		     const html = await page.content();
            console.log(html);
		   } else {
			await page.evaluate(() => document.querySelector("#F1 > button").click());
		   await page.$x('//*[@id="F1"]/button')
		   const elements = await page.$x('//*[@id="F1"]/button')
           await elements[0].click() 

			
			await page.waitForNavigation({waitUntil: 'networkidle2'});
             const html = await page.content();
            console.log(html);
           res.send(html); } 
            
            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});

app.listen(port, function() {
    console.log('App listening on port ' + port)
})
