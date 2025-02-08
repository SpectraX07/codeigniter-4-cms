const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('gallery-container');

    loadMoreBtn.addEventListener('click', function () {
        const offset = parseInt(loadMoreBtn.getAttribute('data-offset'));

        fetch(`/media/gallery/load-more-gallery-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ offset: offset })
        })
            .then(response => response.json())
            .then(data => {
                if (data.galleries.length > 0) {
                    data.galleries.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'news-card';
                        card.innerHTML = `
                            <a href="#" class="news-card__card-link"></a>
                            <img src="${item.image}" alt="" class="news-card__image">
                            <div class="news-card__text-wrapper">
                                <h6 class="news-card__title">${item.title}</h6>
                                <div class="news-card__post-date">${item.subTitle}</div>
                            </div>
                        `;
                        container.appendChild(card);
                    });

                    loadMoreBtn.setAttribute('data-offset', offset + data.galleries.length);

                    if (!data.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading gallery items:', error);
            });
    });
});
