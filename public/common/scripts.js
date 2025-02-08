const showToast = (title, message, type = "info", reload = false) => {
	console.log(title, message, type, reload);
	iziToast.settings({
		close: true,
		progressBar: true,
		position: "topRight",
		timeout: 5000,
		resetOnHover: true,
		transitionIn: "fadeInDown",
		transitionOut: "fadeOutUp",
	});

	iziToast[type]({
		title,
		message,
		layout: 1,
		close: true,
		closeOnEscape: false,
		closeOnClick: false,
		position: "topRight",
		timeout: 5000,
		pauseOnHover: true,
		onClosed: () => {
			if (reload) {
				location.reload();
			}
		},
	});
};

const charCount = () => {
	$(".char-count").length &&
		$(".char-count").each(function () {
			const maxLength = parseInt($(this).data("max-length"));
			const textarea = $(this).prev("textarea");
			const counter = $(this);

			textarea.on("input change", function (event) {
				let length = $(this).val().length;
				let remaining = maxLength - length;
				let currentCount = maxLength - remaining;

				if (remaining <= 0) {
					const trimmedText = $(this).val().substring(0, maxLength);
					$(this).val(trimmedText);
					currentCount = maxLength;
				}

				counter.text(`${currentCount}/${maxLength}`);
			});

			textarea.on("keydown", function (event) {
				let length = $(this).val().length;
				let remaining = maxLength - length;

				// Allow backspace even if max length reached
				if (event.keyCode === 8 && length >= maxLength) {
					return true;
				}

				if (remaining <= 0) {
					event.preventDefault();
				}
			});
		});
}
charCount();

$('.numeric').length && $('.numeric').on('input', function () {
	$(this).val($(this).val().replace(/\D/g, ''));
});

const scrollTo = (elem, time) => {
	$('html, body').animate({
		scrollTop: $(elem).offset().top
	}, time);
}

// $(function () {
// 	const currentUrl = window.location.href;
// 	const menuLinks = $("#main-menu a");

// 	menuLinks.each(function () {
// 		const $this = $(this);
// 		const linkUrl = $this.attr("href");

// 		if (currentUrl.indexOf(linkUrl) !== -1) {
// 			$this.parents("li").addClass("active");
// 			$this.parents("ul").addClass("in").attr("aria-expanded", "true");
// 			return false;
// 		}
// 	});
// });
$(function () {
	const currentUrl = window.location.href; // Get the current URL
	const menuLinks = $(".sidebar-menu a"); // Select all menu links in the sidebar

	menuLinks.each(function () {
		const $this = $(this);
		const linkUrl = $this.attr("href"); // Get the href attribute of the link

		if (currentUrl.indexOf(linkUrl) !== -1 && linkUrl !== '#') {
			// Add 'active' class to the current link's parent `li`
			$this.closest("li").addClass("active");

			// If the link is part of a submenu, expand the submenu and its parents
			const $submenu = $this.closest(".collapse");
			if ($submenu.length) {
				$submenu.addClass("show"); // Expand the submenu
				$submenu.siblings("a").addClass("active open"); // Highlight parent menu item
				$submenu.closest("li").addClass("active open"); // Set parent menu as active
			}

			// Expand all parent menus of the current item
			$this.parents(".collapse").each(function () {
				$(this).addClass("show").attr("aria-expanded", "true");
				$(this).siblings("a").addClass("active open");
				$(this).closest("li").addClass("active open");
			});

			return false; // Break the loop once the match is found
		}
	});
});

$(document).on('click', '.change-password', function (e) {
	e.preventDefault();
	$('#changePasswordModal').modal('show');
})

$('#changePasswordForm').submit(function (e) {
	e.preventDefault();
	let main = $(this),
		btn = main.find('button[type=submit]');
	const formData = new FormData(this);
	$('span.field-feedback').html('');
	btn.prop('disabled', true).html('Loading...');
	$.ajax({
		type: 'POST',
		url: main.attr('action'),
		data: formData,
		contentType: false,
		processData: false,
		dataType: 'json',
		success: function (response) {
			if (response.success) {
				btn.prop('disabled', false).html('Change');
				$('#changePasswordModal').modal('hide');
				location.reload();
			} else {
				$.each(response.errors, function (index, error) {
					main.find(`[name=${index}]`).siblings('span.field-feedback').html(error);
				});
				if (response.message)
					showToast('Error', response.message, 'error');
				btn.prop('disabled', false).html('Change');
			}
		},
		error: function (xhr, status, error) {
			var errorMessage = JSON.parse(xhr.responseText).message;
			console.log('Server Error Message:', errorMessage);
			btn.prop('disabled', false).html('Change');
		}
	});
});

$(document).on('click', '.show-content', function (e) {
	const title = $(this).data('title'),
		content = $(this).data('content');

	$('#modalReadMoreLabel').html(title);
	$('#modalReadMoreBody').html(content);
	$('#modalReadMore').modal('show');
});


const copyData = content => {
	navigator.clipboard.writeText(content)
		.then(() => {
			showToast('Success!', 'Copied', 'success');
		})
		.catch(err => {
			console.error('Failed to copy: ', err);
		});
}