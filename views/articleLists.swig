{% extends 'partial/layoutBlog.swig' %}

{% block keywords %}博客 web前端 编程 全栈开发{% endblock %}
{% block description %}热爱前端的豆米打造了这么一个记录前端的博客，希望可以和大家一起见证前端的变化和发展，一起进步{% endblock %}
{% block title %}博文列表 - 豆米的博客{% endblock %}

{% block style %}
{% parent %}
<link rel='stylesheet' href='/styles/articleLists.css'>
{% endblock %}

{% block content %}
<main class='col-md-8 col-sm-8 col-xs-12'>
 {% for article in articles %}
 <!-- Article Box -->
  <article class='post widget' url-data='{{ article.slug }}'>
    <header class='post-header'>
      <h2 class='blog-single-post-title'><a href='/blog/{{ article.slug }}'>{{ article.title }}</a></h2>
      <div class='tags hidden-xs'>
        {% for tag in article.tagsArray %}
        <span><a href = '/blog/tag/{{tag}}'>{{ tag }}</a></span>
        {% endfor %}
      </div>
      <img src="{{ article.picture }}" alt="文章首页图片">
      <span class="ribble">
        {{ article.archiveTime }}
      </span>
    </header>
    <div class='post-content'>
      <p class='post-excerpt'>
        {{ article.digest |safe }}
        <a href='/blog/{{ article.slug }}' class = 'articleLink'>阅读全文</a>
      </p>
    </div>
    <div class='comment-count'>
       <a href='http://blog.5udou.cn/blog/{{ article.slug }}#disqus_thread'></a>
    </div>
    </article>
  {% endfor %}
  <!-- Pagination Box -->
  {% if pageNum > 1 %}
  <nav id='page-nav'>
     {% if currentPage != 1 %}
        <a class='extend prev' rel='prev' href='{{pageUrl}}/{{ currentPage-1 }}'>上一页</a>
        <a class='page-number' href='{{pageUrl}}/1/'>1</a>
    {% endif %}
    {% if currentPage - 3 > 1 %}
       <span class='space'>…</span>
    {% endif %}
    {% if currentPage - 2 > 1 %}
        <a class='page-number' href='{{pageUrl}}/{{currentPage-2}}'>{{ currentPage-2 }}</a>
    {% endif %}
    {% if currentPage - 1 > 1 %}
        <a class='page-number' href='{{pageUrl}}/{{currentPage-1}}'>{{ currentPage-1 }}</a>
    {% endif %}
    <span class='page-number current'>{{ currentPage }}</span>
    {% if parseInt(currentPage) + 1 <= parseInt(pageNum) %}
        <a class='page-number' href='{{pageUrl}}/{{parseInt(currentPage) + 1}}'>{{parseInt(currentPage) + 1}}</a>
    {% endif %}
    {% if parseInt(currentPage) + 2 <= parseInt(pageNum) %}
        <a class='page-number' href='{{pageUrl}}/{{parseInt(currentPage) + 2}}'>{{ parseInt(currentPage) + 2 }}</a>
    {% endif %}
    {% if parseInt(currentPage) + 3 <= parseInt(pageNum) %}
    <a class='page-number' href='{{pageUrl}}/{{parseInt(currentPage) + 3}}'>{{ parseInt(currentPage) + 3 }}</a>
    {% endif %}
    {% if parseInt(currentPage) + 5 <= parseInt(pageNum) %}
        <span class='space'>…</span>
    {% endif %}
    {% if parseInt(currentPage) + 4 <= parseInt(pageNum) %}
      <a class='page-number' href='{{pageUrl}}/{{pageNum}}'>{{ pageNum }}</a>
    {% endif %}
    {% if parseInt(currentPage) != parseInt(pageNum)  %}
      <a class='extend next' rel='next' href='{{pageUrl}}/{{parseInt(currentPage) + 1}}'>下一页</a>
    {% endif %}
  </nav>
  {% endif %}
  <script id='dsq-count-scr' src='//doumiblog2016.disqus.com/count.js' async></script>
</main>
{% endblock %}

