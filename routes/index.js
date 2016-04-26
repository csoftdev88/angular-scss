var glob = require('glob');
var tenant = null;

process.argv.forEach(function (val) {
  if(val.indexOf('tenant') !== -1){
    tenant = val.split('=')[1];
    console.log('Tenant is set to :' + tenant);
  }
});

if(!tenant){
  throw new Error("node commandline-param 'tenant' is required");
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

  //load redirect array from src/targets/<tenant>/redirects.json
  try{
    var routesPath = './src/targets/' + tenant + '/redirects.json';
    var fs = require('fs');
    var content = fs.readFileSync(routesPath);
    var redirects=JSON.parse(content);
    for (var p in redirects){
      console.log("build redirect for "+redirects[p].from);
      app.get(redirects[p].from,function(req, res) {
        //search for redirect URL in the redirects array
        redirectItem=redirects.filter(function(item) {
          //console.log(item.from == req.path +" or "+ item.from == req.path+"/")
          return item.from == req.path.toLowerCase() || item.from == req.path.toLowerCase()+"/" || item.from+"/" == req.path.toLowerCase();
        });

        if (redirectItem[0] && redirectItem[0].to){
         return res.redirect(301,redirectItem[0].to);
        } else {
          //didn't find it. test for just slashes...
          redirectItem=redirects.filter(function(item) {
            var searchFor=req.path.substring(0,req.path.lastIndexOf("/"));
            if (item.id){
              //console.log("checkForSubstring")
              if (searchFor.toLowerCase().indexOf(item.from) > -1){
               //console.log("yay!");
               return true;
              }
            }
          

            var result;   
              var searchFor=req.path.substring(0,req.path.lastIndexOf("/"));
              result = searchFor;
            return item.id == result || item.from == req.path+"/";
          });  
          if (redirectItem[0] && redirectItem[0].to){
            return res.redirect(301,redirectItem[0].to);            
          } else {
            return;
          }

        }
      });        
    }    
  } catch(e){
    //file doesn't exist. We dont care
  }


    app.route('/:url(static)/*').get(function(req, res) {
      console.log("here!")
      res.status(404).end();
    });

    //robots block crawling
    app.get('/robots.txt', function (req, res) {
        res.type('text/plain');
        res.send('User-agent: *\nDisallow: /reservations\nDisallow: /reservation/');
    });

    app.get('/404', function(req, res, next) {
      res.status(404);
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
