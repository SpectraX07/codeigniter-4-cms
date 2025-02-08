const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('downloads-container');

    loadMoreBtn.addEventListener('click', function () {
        const offset = parseInt(loadMoreBtn.getAttribute('data-offset'));

        fetch(`/my-iihm/load-more-downloads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ offset: offset })
        })
            .then(response => response.json())
            .then(data => {
                if (data.downloads.length > 0) {
                    data.downloads.forEach(item => {
                        const article = document.createElement('article');
                        article.innerHTML = `
                            <div class="article-wrapper">
                                <figure>
                                    <img src="${item.uploadImage}" alt="${item.title}" />
                                </figure>
                                <div class="article-body">
                                    <h2>${item.title}</h2>
                                    <p>${item.subTitle}</p>
                                    <a href="${item.uploadDocument}" class="read-more">
                                        Download &nbsp; &nbsp;<i class="fa fa-download"></i>
                                    </a>
                                </div>
                            </div>
                        `;
                        container.appendChild(article);
                    });

                    loadMoreBtn.setAttribute('data-offset', offset + data.downloads.length);

                    if (!data.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading more downloads:', error);
            });
    });
});
