const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('awards-container');

    loadMoreBtn.addEventListener('click', function () {
        const offset = parseInt(loadMoreBtn.getAttribute('data-offset'));

        fetch(`/my-iihm/load-more-awards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ offset: offset })
        })
            .then(response => response.json())
            .then(data => {
                if (data.awards.length > 0) {
                    data.awards.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'col-lg-4 col-md-6 mb-35';
                        card.innerHTML = `
                            <div class="single-event">
                                <div class="event-img">
                                    <a href="${item.awardFile || 'javascript:void(0)'}">
                                        <img src="${item.awardImage}" alt="Award Image" width="348" height="235" />
                                        <div class="course-hover">
                                            <i class="fa fa-link"></i>
                                        </div>
                                    </a>
                                </div>
                                <div class="event-content text-start">
                                    <h4><a href="${item.awardFile || 'javascript:void(0)'}">${item.awardName}</a></h4>
                                </div>
                            </div>
                        `;
                        container.appendChild(card);
                    });

                    // Update the offset value
                    loadMoreBtn.setAttribute('data-offset', offset + data.awards.length);

                    // Hide the button if there are no more awards
                    if (!data.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                } else {
                    // If no awards are returned, hide the button
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading awards:', error);
            });
    });
});
