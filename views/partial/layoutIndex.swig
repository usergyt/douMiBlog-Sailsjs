﻿<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="Keywords" content="豆米 前端 博客 服务器 生活">
  <meta name="Description" content="豆米博客，用心、用爱、用力拥抱热爱前端">
  <title>{% block title %}{% endblock %}</title>

  {% block style %}
  <link rel='stylesheet' href='/vender/bootstrap/dist/css/bootstrap.min.css'>
  {% endblock %}
  <script type='text/javascript'  src='/js/requirejs/require.min.js'></script>
  <script type='text/javascript'  src='/js/config.js'></script>

</head>
<body>
  {% block content %}{% endblock %}
  <footer class='footer'>
  <div>
    Copyright © <a href='/'>豆米博客</a>. 2017 • All rights reserved. | 浙ICP备15041819号-1
  </div>
</footer>
</body>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-85522412-1', 'auto');
  ga('send', 'pageview');

</script>
</html>
