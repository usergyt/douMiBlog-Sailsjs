﻿{% extends 'partial/layoutIndex.swig' %}

{% block title %}首页 - 豆米的博客{% endblock %}

{% block style %}
  {% parent %}
  <link rel='stylesheet' href='/styles/index.css'>
{% endblock %}

{% block content %}
<header class='title'>
  <a href='http://www.5udou.cn'>5udou.cn</a>
</header>
<section class='wrapper'>

  <div class='blogProfile'>
    <figure class='author-image'>
      <a class='img' href='/author/'><span class='hidden'>豆米的头像</span></a>
    </figure>
    <section class='author'>
      <h4><a href='/author/'>豆米</a></h4>
      <p>豆米目前生活在“上有天堂，下有苏杭”的杭州，美不胜收的美景之地也收获着甜蜜恩爱的生活。豆米热爱前端，热爱互联网，豆米是洋芋(土豆-豆)和米喳(米)的简称。</p>
      <div class='author-meta'>
        <span class='glyphicon glyphicon-map-marker'>杭州</span>
        <span class='glyphicon glyphicon-link'><a href='http://www.5udou.cn'>http://www.5udou.cn</a></span>
      </div>
    </section>
  </div>
  <nav class='navigation clearfix'>
    <a href='/' class='medium_pic_wrap a1'>
      <img class='medium_pic' src='/images/index1.jpg'>
      <div class='medium_text'>
        <h3 class='img_txt_title'>首页</h3>
        <p class='img_p'>前方<br>为你开启</p>
        <span class='location'>杭州 · 西溪</span>
      </div>
    </a>
    <a href='#' class='small_pic_wrap a2'>
      <img class='small_pic' src='/images/index2.jpg'>
      <div class='small_text'>
        <h3 class='img_txt_title'>启程</h3>
        <p class='img_p'>扬帆<br>在风浪中拼搏</p>
        <span class='location'>杭州 · 湘湖</span>
      </div>
    </a>
    <a href='/blog' class='medium_pic_wrap a3' target='_blank'>
      <img class='medium_pic' src='/images/index3.jpg'>
      <div class='medium_text'>
        <h3 class='img_txt_title'>博客</h3>
        <p class='img_p'>记录<br>感悟不止一点点</p>
        <span class='location'>杭州 · 西湖</span>
      </div>
    </a>
    <a href='#' class='small_pic_wrap a4' target='_blank'>
      <img class='small_pic'  src='/images/index4.jpg'>
      <div class='small_text'>
        <h3 class='img_txt_title'>行进</h3>
        <p class='img_p'>梦想<br>就在前方</p>
        <span class='location'>杭州 · 九溪</span>
      </div>

    </a>
    <a href='/aboutDouMi' class='medium_pic_wrap a5' target='_blank'>
      <img class='medium_pic' src='/images/index5.jpg'>
      <div class='medium_text'>
        <h3 class='img_txt_title'>关于豆米</h3>
        <p class='img_p'>你想了解的<br>都在这里</p>
        <span class='location'>杭州 · 你和我</span>
      </div>
    </a>
  </nav>

  <h2>热门文章<small>（<a href='/blog'>全部博客文章</a>）</small></h2>
  <ul>
    {% for post in hotterArticles%}
      <li>
        <a href='/blog/{{post.slug}}'><span>{{ post.title }}</span><time datetime='{{post.archiveTime}}'>{{post.archiveTime}}</time></a>
      </li>
    {% endfor %}
  </ul>

</section>
{% endblock %}

{% block script %}

{% endblock %}
