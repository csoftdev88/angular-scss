var glob = require('glob');
var tenant = null;
var fs = require('fs');
var http = require('http');
var environment = null;

process.argv.forEach(function(val) {
  if (val.indexOf('tenant') !== -1) {
    tenant = val.split('=')[1];
    console.log('Tenant is set to :' + tenant);
  }
  if (val.indexOf('environment') !== -1) {
    environment = val.split('=')[1];
    console.log('Environment is set to :' + environment);
  }
});

if (!tenant) {
  throw new Error("node commandline-param 'tenant' is required");
}
if (!environment) {
  throw new Error("node commandline-param 'environment' is required");
}

module.exports = function(app) {
  var basePath = './src/targets/' + tenant + '/locales/';
  glob(basePath + '*.json', function(er, files) {
    var baseConfig = null;
    files.forEach(function(file) {
      // glob is relative path in which server started
      // require is relative to current file path
      var config = require('.' + file);

      if (config && config.locale && config.data && config.data.base_href) {
        if (config.data.base_href === '/') {
          baseConfig = config;
        } else {
          installRoute(config);
        }
      }
    });

    //Catch crawlers and server prerendered content instead of normal route
    app.use(function crawlerMiddleware(req, res, next) {
      //Get settings
      var settingsPath = './src/targets/' + tenant + '/crawlers.json';
      var settings = fs.readFileSync(settingsPath);
      settings = JSON.parse(settings);

      
      //detect and return cloudflare country header
        console.log(JSON.stringify(req.headers));
        var euCountries=["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GI", "GR", "HU", "IS", "IE", "IM", "IT", "RS", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "ME", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA", "RS"
];
        if (req.headers['cf-ipcountry']){
                var country=req.headers['cf-ipcountry'];
                res.setHeader('CF-IPCountry',country);
                if (euCountries.indexOf(country)>-1){
                        res.setHeader('CF-isEU',true);
                } else {
                        res.setHeader('CF-isEU',false);
                }
        }
      
      if(settings && settings.redirectCrawlers){
        var crawlers = ['Googlebot', 'Yahoo! Slurp', 'Bingbot', 'Baiduspider'];
        var userAgent = req.headers['user-agent'].toLowerCase();
        var isCrawler = false;

        console.log('userAgent: ' + userAgent);

        //Check if bot
        crawlers.forEach(function (crawler) {
          crawler = crawler.toLowerCase();
          if(userAgent.indexOf(crawler) !== -1){
            isCrawler = true;
            console.log('Hello mister ' + crawler + ', hang on a second!');
            //Build url
            var url = req.get('host') + req.url;
            //fake
            //url = 'www.suttonplace.com/hotels/sutton-place-hotel-edmonton-edm?property=EDM&currency=CAD';
            //remove params
            url = url.split('?')[0];

            console.log('url: ' + url);

            //Replace non alphanumeric characters with hyphens
            url = url.replace(/[\W_]+/g,'-');
            //Remove trailing hyphen if any
            var trailingHyphen = url.lastIndexOf('-');
            if(trailingHyphen !== -1){
              url = url.substring(0, trailingHyphen);
            }
            console.log('settings.redirectBaseUrl: ' + settings.redirectBaseUrl);
            console.log('processed url: ' + settings.redirectBaseUrl + settings.redirectFolderName + url);

            //Request options
            var options = {
              hostname: settings.redirectBaseUrl,
              path: settings.redirectFolderName + url,
              method: 'GET'
            };

            //Request to prerendered endpoint
            var httpReq = http.get(options, function(httpRes) {

              if(httpRes.statusCode !== 200){
                console.log('request to prerendered endpoint error: ' + httpRes.statusCode);
                console.log('continuing to normal route');
                return next();
              }

              var chunks = [];
              httpRes.on('data', function(chunk) {
                chunks.push(chunk);
              });
              httpRes.on('end', function() {
                var body = Buffer.concat(chunks).toString('utf8');
                res.send(body);
                console.log('request to prerendered endpoint successful, sending prerendered content');
              })
            });

            httpReq.on('error', function(e) {
              console.log('problem with prerendered endpoint request: ' + e.message);
              console.log('continuing to normal route');
              return next();
            });

            httpReq.end();

          }
        });

        if(!isCrawler){
          //Not a crawler
          console.log('No crawler here, continuing to normal route');
          return next();
        }

      }
      else{
        return next();
      }

    });


    //load redirect array from src/targets/<tenant>/redirects.json
    try {
      var routesPath = './src/targets/' + tenant + '/redirects.json';
      var content = fs.readFileSync(routesPath);
      var redirects = JSON.parse(content);
      for (var p in redirects) {
        console.log("build redirect for " + redirects[p].from);
        app.get(redirects[p].from, function(req, res) {
          //search for redirect URL in the redirects array
          redirectItem = redirects.filter(function(item) {
            //console.log(item.from == req.path +" or "+ item.from == req.path+"/")
            return item.from == req.path.toLowerCase() || item.from == req.path.toLowerCase() + "/" || item.from + "/" == req.path.toLowerCase();
          });

          if (redirectItem[0] && redirectItem[0].to) {
            return res.redirect(301, redirectItem[0].to);
          } else {
            //didn't find it. test for just slashes...
            redirectItem = redirects.filter(function(item) {
              var searchFor = req.path.substring(0, req.path.lastIndexOf("/"));
              if (item.id) {
                //console.log("checkForSubstring")
                if (searchFor.toLowerCase().indexOf(item.from) > -1) {
                  //console.log("yay!");
                  return true;
                }
              }


              var result;
              var searchFor = req.path.substring(0, req.path.lastIndexOf("/"));
              result = searchFor;
              return item.id == result || item.from == req.path + "/";
            });
            if (redirectItem[0] && redirectItem[0].to) {
              return res.redirect(301, redirectItem[0].to);
            } else {
              return;
            }

          }
        });
      }
    } catch (e) {
      //file doesn't exist. We dont care
    }


    app.route('/:url(static)/*').get(function(req, res) {
      console.log("here!")
      res.status(404).end();
    });

    //robots block crawling
    app.get('/robots.txt', function(req, res) {
      res.type('text/plain');
      if(environment === 'live'){
        res.send('User-agent: *\nDisallow: /reservations\nDisallow: /reservation/');
      }
      //disallow all urls if not live
      else{
        res.send('User-agent: *\nDisallow: /');
      }

    });

    app.get('/404', function(req, res, next) {
      res.sendStatus(404);
      res.render('404');
    });

    if (baseConfig) {
      installRoute(baseConfig);
    }
  });

  function installRoute(config) {
    var route = config.data.base_href + '*';
    var indexFile = 'index-' + config.locale;
    app.get(route, function(req, res, next) {
      res.render(indexFile, {
        title: 'Express'
      });
    });
  }
};
