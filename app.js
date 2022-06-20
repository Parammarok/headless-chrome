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
	//const proxy = 'p.webshare.io:80';
        // const username = 'rvrdexbo-rotate';
      // const password = 'wxvj2jonjvri';
	
	
	
    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
               // args: ['--no-sandbox', '--disable-setuid-sandbox']
		  args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-server=p.webshare.io:9999']    
            });

            const page = await browser.newPage();
		// Authenticate our proxy with username and password defined above
                //  await page.authenticate({ username, password });	
		//await page.goto(urlToScreenshot, {waitUntil: 'networkidle2'});
            await page.goto(urlToScreenshot);
		await page.waitForNavigation({waitUntil: 'networkidle2'});
		if ( mode == 'res')  {
             const html = await page.content();
            console.log(html);
            res.send(html); 
            await browser.close();
		   } else {
		await page.evaluate(() => document.querySelector("#best-variant-tab > div:nth-child(1) > ul > li > ul > li > a > div.download-button > svg > use").click());
		//await page.$x('//*[@id="best-variant-tab"]/div[1]/ul/li/ul/li/a/div[2]/svg/use')
		//const elements = await page.$x('//*[@id="best-variant-tab"]/div[1]/ul/li/ul/li/a/div[2]/svg/use')
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
