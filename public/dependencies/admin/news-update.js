let selectedIds = [];
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function getIdSelections(tableId) {
    return $.map($(tableId).bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
}

function queryParams(p) {
    return {
        limit: p.limit,
        offset: p.offset,
        search: p.search,
    };
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selectedIds) !== -1
    })
    return res
}

const handleRequest = async (url, selectedIds, method, extraBody, tableId, message) => {
    if (confirm(message)) {
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ ids: selectedIds, ...extraBody })
            });
            const data = await response.json();
            if (data.success) {
                $(tableId).bootstrapTable('uncheckAll');
                selectedIds.length = 0;
                showToast('Success', data.message, 'success');
                $(tableId).bootstrapTable('refresh');
            } else {
                showToast('Error', data.message, 'error');
            }
        } catch (error) {
            console.log(error);

            showToast('Error', 'An error occurred while changing the status.', 'error');
        }
    }
};

const handleSubmit = (formId) => {
    $(formId).submit(function (e) {
        e.preventDefault();
        const main = $(this),
            btn = main.find('button[type=submit]'),
            btnHtml = btn.html(),
            formData = new FormData(this);

        $('span.field-feedback').empty();
        btn.prop('disabled', true).html('Loading...');

        $.ajax({
            type: 'POST',
            url: main.attr('action'),
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {
                location.href = response.redirect
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    const response = JSON.parse(xhr.responseText);
                    $.each(response.errors, function (index, error) {
                        main.find(`span[name=${index}]`).html(error);
                    });
                } else {
                    const errorMessage = JSON.parse(xhr.responseText).message;
                    console.log('Server Error Message:', errorMessage);
                    if (errorMessage) {
                        showToast('Error', errorMessage, 'error');
                    }
                }
            },
            complete: function () {
                btn.prop('disabled', false).html(btnHtml);
            }
        });
    });
};



$(function () {
    "use strict";

    $('#date').length && $('#date').daterangepicker({
        singleDatePicker: true, // Enables single date selection
        autoApply: true,        // Automatically applies the selected date
        locale: {
            format: 'YYYY-MM-DD' // Adjust the format as needed
        }
    });

    $('#initBtTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        $('#archiveData').prop('disabled', !$('#initBtTable').bootstrapTable('getSelections').length)
        selectedIds = getIdSelections('#initBtTable');
    });

    $('#archiveData').click(function () {
        handleRequest(`${adminUrl}media/news-and-update/archive`, selectedIds, 'PUT', {}, '#initBtTable', 'are you sure you want to archive selected News & Updates?');
    });

    handleSubmit('#defaultForm');
});
