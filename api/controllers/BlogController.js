// 文章查询顺序：以创建时间逆序
FIND_ORDER = 'createdAt desc';
// 文章每页条目数
FIND_PER_PAGE = 5;

function matchString(){
  var now = new Date();
  //Format the current time to year/month/day
  var matchString = '';
  matchString = '' + now.getFullYear();
  matchString += ((now.getMonth() + 1) < 10) ? ('-0' + (now.getMonth() + 1)) : ('-' + (now.getMonth() + 1));
  matchString += (now.getDate() < 10) ? ('-0' + now.getDate()) : ('-' + now.getDate());

  return matchString;
}

module.exports = {

  index: function (req, res){
    // 获得当前需要加载第几页
    var page = req.param('page') ? parseInt(req.param('page')) : 1;
    var reqIp = '';
    Article.find({
      sort: FIND_ORDER,
      where: {articleStatus:"published"}
    }).paginate({page: page, limit: FIND_PER_PAGE})
      .then(function (articles) {
        // 每篇文章转换
        // 查找分类,及标签
        return [
          articles,
          Article.count({where: {articleStatus:"published"}}),
          Category.find().populate('articles',{where: {articleStatus:"published"}}),
          Tags.find().populate('articles',{where: {articleStatus:"published"}}),
          Archive.find().populate('articles',{where: {articleStatus:"published"}}),
          Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
          Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
          Statistics.findOne({key: 0})
        ];
      })
      .spread(function (articles,numOfArticles, categories, tags, archives, hotterArticles, newArticlesToday, statistics) {

        var archiveArray = [];
        for (var index = 0; index < archives.length; index++){
          var year = archives[index].archiveTime.substr(0,4);
          var month = archives[index].archiveTime.substr(5,2);
          var newFormat = year + "年" + month + "月";

          var archive = {
            oldArchiveTime: archives[index].archiveTime,
            archiveTime: newFormat,
            numOfArticles: archives[index].articles.length
          };

          archiveArray.push(archive);
        }

        if (req.headers['x-real-ip'] === undefined){
          reqIp = req.ip;
        }else{
          reqIp = req.headers['x-real-ip'];
        }
        //console.log(statistics)
        if (statistics.todayVisitIps.indexOf(reqIp) === -1) {
          var newVisitCounts = statistics.totalVisitCounts + 1;
          var newTodayCounts = statistics.todayVisitCounts + 1;
          statistics.todayVisitIps.push(reqIp);

          Statistics.update({key: 0}, {
            totalVisitCounts: newVisitCounts,
            todayVisitCounts: newTodayCounts,
            todayVisitIps: statistics.todayVisitIps
          }).exec(function(err, record){
            if(err){
              console.log(err);
            }else{
              //console.log(record);
            }
          });
        }

        return res.view(
          'articleLists',
          {
            articles: articles.map(function(item){item.archiveTime = item.archiveTime.substr(0, 10);  return item;}),
            categories: categories,
            tags: tags,
            archives: archiveArray,
            currentPage: page,
            pageUrl: '/blog/page',
            pageNum: Math.ceil(numOfArticles/FIND_PER_PAGE),
            breadcrumb: [],
            hotterArticles: hotterArticles,
            numOfArticles: numOfArticles,
            newArticlesToday: newArticlesToday.length,
            totalVisitCounts: statistics.totalVisitCounts + 1,
            todayVisitCounts: statistics.todayVisitCounts + 1
          });
      });
  },

  showOneArticle: function (req, res){
    var articleUrl = req.param('url'),
        reqIp = '';

    Article.findOne({slug: articleUrl})
      .then(function(article){

        return [
          article,
          Category.find().populate('articles',{where: {articleStatus:"published"}}),
          Tags.find().populate('articles',{where: {articleStatus:"published"}}),
          Archive.find().populate('articles',{where: {articleStatus:"published"}}),
          Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
          Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
          Statistics.findOne({key: 0}),
          Article.count({where: {articleStatus:"published"}}),
        ];
      }).spread(function(article, categories, tags, archives,hotterArticles, newArticlesToday, statistics,numOfArticles){
        var archiveArray = [];
        for (var index = 0; index < archives.length; index++){
          var year = archives[index].archiveTime.substr(0,4);
          var month = archives[index].archiveTime.substr(5,2);
          var newFormat = year + "年" + month + "月";

          var archive = {
            oldArchiveTime: archives[index].archiveTime,
            archiveTime: newFormat,
            numOfArticles: archives[index].articles.length
          };

          archiveArray.push(archive);
        }

        if (req.headers['x-real-ip'] === undefined){
          reqIp = req.ip;
        }else{
          reqIp = req.headers['x-real-ip'];
        }
        //  如果用户的IP地址不在该文章的访客列表中,那么就认为该用户对于
        //  这篇文章来说是新的阅读者，注意文章的访客列表每天清空一次
        if (article && article.pageViews.indexOf(reqIp) === -1){

          article.pageViews.push(reqIp);

          Article.update(article.id,
            {
             pageViews: article.pageViews,
             pageViewsCount: article.pageViewsCount + 1
            }
          ).exec(function(err, article){
            if(err){
              console.log(err);
            }else{
              //console.log(record);
            }
          });
          // 如果访问该文章的用户IP不在全局访问列表中，那么就认为该用户是网站
          // 的新用户, 注意该全局访问IP表也是每天清空一次
          if (statistics.todayVisitIps.indexOf(reqIp) === -1) {
            var newVisitCounts = statistics.totalVisitCounts + 1;
            var newTodayCounts = statistics.todayVisitCounts + 1;
            statistics.todayVisitIps.push(reqIp);

            Statistics.update({key: 0}, {
              totalVisitCounts: newVisitCounts,
              todayVisitCounts: newTodayCounts,
              todayVisitIps: statistics.todayVisitIps
            }).exec(function(err, record){
              if(err){
                console.log(err);
              }else{
                //console.log(record);
              }
            });
          }
        }
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // 改造显示归档时间
        article.archiveDay = article.archiveTime.substr(8, 2);
        article.archiveMonth = months[parseInt(article.archiveTime.substr(5, 2)) - 1];

        return res.view('articleShow',
        {
          categories: categories,
          tags: tags,
          archives: archiveArray,
          article: article,
          breadcrumb: [article.title],
          hotterArticles: hotterArticles,
          numOfArticles: numOfArticles,
          newArticlesToday: newArticlesToday.length,
          totalVisitCounts: statistics.totalVisitCounts,
          todayVisitCounts: statistics.todayVisitCounts
        });
      }).catch(function(err){
        console.error('crash occur at showOneArticle: ', articleUrl);
        console.error('error code: ', err);
        return res.send('获取文章分类失败,请联系管理员。');
      });
  },
  showOneCategory: function (req, res){
    // 获得当前需要加载第几页
    var page = req.param('page') ? req.param('page') : 1;
    var queryCategory = req.param('url');
    try{
      Category.findOne({name: queryCategory}).populate('articles',{
        where: {
          articleStatus:"published"
        },
        sort: FIND_ORDER,
        limit: FIND_PER_PAGE,
        skip: (page - 1) * FIND_PER_PAGE
      }).then(function (categories) {
        var now = new Date();
        //Format the current time to year/month/day
        return [
          categories.articles,
          Category.find({name: queryCategory}).populate('articles',{where: {articleStatus:"published" }}),
          Category.find().populate('articles',{where: {articleStatus:"published"}}),
          Tags.find().populate('articles',{where: {articleStatus:"published"}}),
          Archive.find().populate('articles',{where: {articleStatus:"published"}}),
          Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
          Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
          Statistics.findOne({key: 0}),
          Article.count({where: {articleStatus:"published"}})
        ];
      }).spread(function (articles,totalQueryArticles, categories, tags, archives,hotterArticles, newArticlesToday, statistics,numOfArticles) {

        var archiveArray = [];
        for (var index = 0; index < archives.length; index++){
          var year = archives[index].archiveTime.substr(0,4);
          var month = archives[index].archiveTime.substr(5,2);
          var newFormat = year + "年" + month + "月";

          var archive = {
            oldArchiveTime: archives[index].archiveTime,
            archiveTime: newFormat,
            numOfArticles: archives[index].articles.length
          };

          archiveArray.push(archive);
        }

        return res.view(
          'articleLists',
          {
            articles: articles.map(function(item){item.archiveTime = item.archiveTime.substr(0, 10);  return item;}),
            categories: categories,
            tags: tags,
            archives: archiveArray,
            currentPage: page,
            pageUrl: '/blog/category/' + queryCategory + '/page',
            pageNum: Math.ceil(totalQueryArticles[0].articles.length/FIND_PER_PAGE),
            breadcrumb: ['分类', queryCategory],
            hotterArticles: hotterArticles,
            numOfArticles: numOfArticles,
            newArticlesToday: newArticlesToday.length,
            totalVisitCounts: statistics.totalVisitCounts,
            todayVisitCounts: statistics.todayVisitCounts
          });
      });
    }catch(err){
      console.error('crash occur at showOneCategory: ', page, queryCategory);
      console.error('error code: ', err);
      return res.send('获取文章分类失败,请联系管理员。');
    }
  },

  showOneTag: function (req, res){
    // 获得当前需要加载第几页
    var page = req.param('page') ? req.param('page') : 1;
    var queryTag = req.param('url');

    Tags.findOne({name: queryTag}).populate('articles',{
      where: {
        articleStatus:"published"
      },
      sort: FIND_ORDER,
      limit: 5,
      skip: (page - 1) * FIND_PER_PAGE
    }).then(function (tags) {
      return [
        tags.articles,
        Tags.find({name: queryTag}).populate('articles',{where: {articleStatus:"published" }}),
        Category.find().populate('articles',{where: {articleStatus:"published"}}),
        Tags.find().populate('articles',{where: {articleStatus:"published"}}),
        Archive.find().populate('articles',{where: {articleStatus:"published"}}),
        Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
        Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
        Statistics.findOne({key: 0}),
        Article.count({where: {articleStatus:"published"}})
      ];
    }).spread(function (articles, totalQueryArticles, categories, tags, archives,hotterArticles, newArticlesToday, statistics,numOfArticles) {

      var archiveArray = [];
      for (var index = 0; index < archives.length; index++){
        var year = archives[index].archiveTime.substr(0,4);
        var month = archives[index].archiveTime.substr(5,2);
        var newFormat = year + "年" + month + "月";

        var archive = {
          oldArchiveTime: archives[index].archiveTime,
          archiveTime: newFormat,
          numOfArticles: archives[index].articles.length
        };

        archiveArray.push(archive);
      }

      return res.view(
        'articleLists',
        {
          articles: articles.map(function(item){item.archiveTime = item.archiveTime.substr(0, 10);  return item;}),
          categories: categories,
          tags: tags,
          archives: archiveArray,
          currentPage: page,
          pageUrl: '/blog/tag/' + queryTag + '/page',
          pageNum: Math.ceil(totalQueryArticles[0].articles.length/FIND_PER_PAGE),
          breadcrumb: ['标签', queryTag],
          hotterArticles: hotterArticles,
          numOfArticles: numOfArticles,
          newArticlesToday: newArticlesToday.length,
          totalVisitCounts: statistics.totalVisitCounts,
          todayVisitCounts: statistics.todayVisitCounts
        });
    }).catch(function(err){
      console.error('crash occur at showOneTag: ', page, queryTag);
      console.error('error code: ', err);
      return res.send('获取文章分类失败,请联系管理员。');
    });
  },

  showOneArchive: function (req, res){

    var page = req.param('page') ? req.param('page') : 1;
    var queryArchive = req.param('url');

    Archive.findOne({archiveTime: queryArchive}).populate('articles',{
      where: {
        articleStatus:"published"
      },
      sort: FIND_ORDER,
      limit: FIND_PER_PAGE,
      skip: (page - 1) * FIND_PER_PAGE
    }).then(function (archives) {
      var now = new Date();
      //Format the current time to year/month/day
      return [
        archives.articles,
        Archive.find({archiveTime: queryArchive}).populate('articles',{where: {articleStatus:"published" }}),
        Category.find().populate('articles',{where: {articleStatus:"published"}}),
        Tags.find().populate('articles',{where: {articleStatus:"published"}}),
        Archive.find().populate('articles',{where: {articleStatus:"published"}}),
        Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
        Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
        Statistics.findOne({key: 0}),
        Article.count({where: {articleStatus:"published"}})
      ];
    }).spread(function (articles, totalQueryArticles, categories, tags, archives,hotterArticles, newArticlesToday, statistics,numOfArticles) {

      var archiveArray = [];
      for (var index = 0; index < archives.length; index++){
        var year = archives[index].archiveTime.substr(0,4);
        var month = archives[index].archiveTime.substr(5,2);
        var newFormat = year + "年" + month + "月";

        var archive = {
          oldArchiveTime: archives[index].archiveTime,
          archiveTime: newFormat,
          numOfArticles: archives[index].articles.length
        };

        archiveArray.push(archive);
      }

      return res.view(
        'articleLists',
        {
          articles: articles.map(function(item){item.archiveTime = item.archiveTime.substr(0, 10);  return item;}),
          categories: categories,
          tags: tags,
          archives: archiveArray,
          currentPage: page,
          pageUrl: '/blog/archive/' + queryArchive + '/page',
          pageNum: Math.ceil(totalQueryArticles[0].articles.length/FIND_PER_PAGE),
          breadcrumb: ['归档', queryArchive],
          hotterArticles: hotterArticles,
          numOfArticles: numOfArticles,
          newArticlesToday: newArticlesToday.length,
          totalVisitCounts: statistics.totalVisitCounts,
          todayVisitCounts: statistics.todayVisitCounts
        });
    }).catch(function(err){
      console.error('crash occur at showOneArchive: ', page, queryArchive);
      console.error('error code: ', err);
      return res.send('获取文章分类失败,请联系管理员。');
    });
  },
  showOneUser: function(req, res){
    var page = req.param('page') ? req.param('page') : 1;

    var queryUser = req.param('url');

    User.findOne({fullname: queryUser}).populate('articles',{
      where: {
        articleStatus:"published"
      },
      sort: FIND_ORDER,
      limit: FIND_PER_PAGE,
      skip: (page - 1) * FIND_PER_PAGE
    }).then(function (users) {
      var now = new Date();
      //Format the current time to year/month/day
      return [
        users.articles,
        User.find({fullname: queryUser}).populate('articles',{where: {articleStatus:"published" }}),
        Category.find().populate('articles',{where: {articleStatus:"published"}}),
        Tags.find().populate('articles',{where: {articleStatus:"published"}}),
        Archive.find().populate('articles',{where: {articleStatus:"published"}}),
        Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }),
        Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}),
        Statistics.findOne({key: 0}),
        Article.count({where: {articleStatus:"published"}})
      ];
    }).spread(function (articles, totalQueryArticles, categories, tags, archives,hotterArticles, newArticlesToday, statistics,numOfArticles) {

      var archiveArray = [];
      for (var index = 0; index < archives.length; index++){
        var year = archives[index].archiveTime.substr(0,4);
        var month = archives[index].archiveTime.substr(5,2);
        var newFormat = year + "年" + month + "月";

        var archive = {
          oldArchiveTime: archives[index].archiveTime,
          archiveTime: newFormat,
          numOfArticles: archives[index].articles.length
        };

        archiveArray.push(archive);
      }

      return res.view(
        'articleLists',
        {
          articles: articles.map(function(item){item.archiveTime = item.archiveTime.substr(0, 10);  return item;}),
          categories: categories,
          tags: tags,
          archives: archiveArray,
          currentPage: page,
          pageUrl: '/blog/user/' + queryUser + '/page',
          pageNum: Math.ceil(totalQueryArticles[0].articles.length/FIND_PER_PAGE),
          breadcrumb: ['作者', queryUser],
          hotterArticles: hotterArticles,
          numOfArticles: numOfArticles,
          newArticlesToday: newArticlesToday.length,
          totalVisitCounts: statistics.totalVisitCounts,
          todayVisitCounts: statistics.todayVisitCounts
        });
    }).catch(function(err){
      console.error('crash occur at showOneUser: ', page, queryUser);
      console.error('error code: ', err);
      return res.send('获取文章分类失败,请联系管理员。');
    });
  },

  showSearch: function(req, res){
    var query = req.param('query');

    if(query !== ''){
      Article.find({title:{'contains': query}}).exec(function(err, results){
        return res.json(200, {data: results, err: err})
      });
    }else{

    }
  },

  aboutSite: function (req, res){

    async.parallel([
      function(callback){Category.find().populate('articles',{where: {articleStatus:"published"}}).exec(callback)},
      function(callback){Tags.find().populate('articles',{where: {articleStatus:"published"}}).exec(callback)},
      function(callback){Archive.find().populate('articles',{where: {articleStatus:"published"}}).exec(callback)},
      function(callback){Article.find({ where: { articleStatus: 'published' }, sort: 'pageViewsCount DESC', limit: 10 }).exec(callback)},
      function(callback){Article.find({where:{articleStatus:'published',archiveTime: {'contains': matchString()}}}).exec(callback)},
      function(callback){Statistics.findOne({key: 0}).exec(callback)},
      function(callback){Article.count({where: {articleStatus:"published"}}, callback)}
    ],function(error, results){
      /*If any creating model failure, this process
       should be stop and return the error to client*/
      if (error){
        sails.log.error(error);
        callback(error, null);
      }else{
        var archiveArray = [];
        for (var index = 0; index < results[2].length; index++){
          var year = results[2][index].archiveTime.substr(0,4);
          var month = results[2][index].archiveTime.substr(5,2);
          var newFormat = year + "年" + month + "月";

          var archive = {
            oldArchiveTime: results[2][index].archiveTime,
            archiveTime: newFormat,
            numOfArticles: results[2][index].articles.length
          };

          archiveArray.push(archive);
        }
        return res.view('aboutSite', {
          breadcrumb: ['关于本站'],
          categories: results[0],
          tags: results[1],
          archives: archiveArray,
          hotterArticles: results[3],
          numOfArticles: results[6],
          newArticlesToday: results[4].length,
          totalVisitCounts: results[5].totalVisitCounts,
          todayVisitCounts: results[5].todayVisitCounts
        })
      }
    });
  }
};
