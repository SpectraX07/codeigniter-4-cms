const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('superheroes-container');

    loadMoreBtn.addEventListener('click', function () {
        const offset = parseInt(loadMoreBtn.getAttribute('data-offset'));

        fetch(`/placements/load-more-superheroes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ offset: offset })
        })
            .then(response => response.json())
            .then(data => {
                if (data.superheroes.length > 0) {
                    data.superheroes.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'alumni-card';
                        card.innerHTML = `<img src="${item.image}" alt="Alumni Image">`;
                        container.appendChild(card);
                    });

                    loadMoreBtn.setAttribute('data-offset', offset + data.superheroes.length);

                    if (!data.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading superheroes:', error);
            });
    });
});
