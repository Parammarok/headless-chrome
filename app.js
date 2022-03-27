const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');

var parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


app.get('/', function(req, res) {
    var urlToScreenshot = parseUrl(req.query.url);

    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
             
            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            await page.setViewport({
            width: 1200,
            height: 800
                });   
            await autoScroll(page);
            
            var array = fs.readFileSync("words.txt").toString().split('\n');
  var random = array[Math.floor(Math.random() * array.length)];
  // simple selector for search box
  await page.click('[name=q]');
  await page.keyboard.type(random);
  // you forgot this
  await page.keyboard.press('Enter');
  // wait for search results
  await page.waitForSelector('h3.LC20lb', {timeout: 10000});
  await page.evaluate(() => {
    let elements = document.querySelectorAll('h3.LC20lb')
    // "for loop" will click all element not random
    let randomIndex = Math.floor(Math.random() * elements.length) + 1
    elements[randomIndex].click();
  })
}
            
            
            await page.screenshot().then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer)
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});

app.listen(port, function() {
    console.log('App listening on port ' + port)
})
