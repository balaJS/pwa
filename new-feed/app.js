(function($) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }

  const apiKey = 'REPLACE_WITH_YOUR_API_KEY';
  const $main = $('main');
  const $sourceSelector = $('.js-source_select');
  const defaultSource = 'the-washington-post';

  async function _fetchnews(searchQuery = defaultSource) {
    const responce = await fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&from=2019-10-27&sortBy=publishedAt`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    const news = await responce.json();
    $main.html(news.articles.map(create_article).join('\n'));
  }

  async function render_headings() {
    const responce = await fetch(`https://newsapi.org/v2/sources`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    const options = await responce.json();
    $sourceSelector.html(options.sources.map(heading => `<option value="${heading.id}">${heading.name}</option>`));
    $sourceSelector.val(defaultSource);
  }

  function create_article(article) {
    const imgUrl = article.urlToImage || 'resource/icons-192.png';
    return article.url && `
      <article>
        <a href="${article.url}">
          <h2>${article.title}</h2>
          <img src="${imgUrl}" />
          <p>${article.description}</p>
        </a>
      </article>
    `;
  }

  render_headings();
  _fetchnews();

  $sourceSelector.on('change', function() {
    _fetchnews(this.value);
  });

})(jQuery);
