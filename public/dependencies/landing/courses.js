const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('courses-container');

    loadMoreBtn.addEventListener('click', function () {
        const offset = parseInt(loadMoreBtn.getAttribute('data-offset'));

        fetch(`/courses/load-more-courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ offset: offset })
        })
            .then(response => response.json())
            .then(data => {
                if (data.courses.length > 0) {
                    data.courses.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'col-md-4 course-item';
                        card.innerHTML = `
                            <div class="single-service mb-4">
                                <img src="${item.courseImage}" class="mb-2" alt="${item.courseName}" width="80">
                                <h3><a href="javascript:void(0);">${item.courseName}</a></h3>
                                <p>${item.description}</p>
                            </div>
                        `;
                        container.appendChild(card);
                    });

                    loadMoreBtn.setAttribute('data-offset', offset + data.courses.length);

                    if (!data.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading courses:', error);
            });
    });
});
