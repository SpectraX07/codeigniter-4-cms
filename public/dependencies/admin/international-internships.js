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

const handleSubmit = (formId, tableId, modalId) => {
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
                $(tableId).bootstrapTable('refresh');
                showToast('Success', response.message, 'success');
                $(modalId).modal('hide');
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

    $('#interns-images').length && $('#interns-images').FancyFileUpload({
        url: `${adminUrl}international-internships/upload-interns-images/${$('#interns-images').data('id')}`,
        params: {
            action: 'fileuploader'
        },
        edit: false,
        maxfilesize: 2097152, // 2 MB
        added: function (e, data) {
            this.find('.ff_fileupload_actions button.ff_fileupload_start_upload').click();
        },
        accept: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        uploadcompleted: function (e, data) {
            data.ff_info.RemoveFile();
            $('#initBtTable').bootstrapTable('refresh');
        },
        replace: true,
        prevent_requeue: false,
        chunk_size: 0,
        retry: {
            enableAuto: true,
            retryAfter: 5,
            maxRetries: 3
        },
        continue_abort: function () {
            return true;
        },
        ui_class: 'ff_fileupload_uploads',
        allowedfiletypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        limitConcurrentUploads: undefined
    });

    $('#initBtTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        $('#archiveData, #deleteImageData').prop('disabled', !$('#initBtTable').bootstrapTable('getSelections').length)
        selectedIds = getIdSelections('#initBtTable');
    });

    $('#archiveData').click(function () {
        handleRequest(`${adminUrl}international-internships/archive`, selectedIds, 'PUT', {}, '#initBtTable', 'are you sure you want to archive selected INternational Internship countries?');
    });
    $('#deleteImageData').click(function () {
        handleRequest(`${adminUrl}international-internships/delete-interns`, selectedIds, 'DELETE', {}, '#initBtTable', 'are you sure you want to delete selected Interns?');
    });

    $('#triggerCreate').click(function (e) {
        e.preventDefault();
        $('#createForm').trigger('reset');
        $('#createModal').modal('show');
    });

    $(document).on('click', '.triggerEdit', function (e) {
        e.preventDefault();
        const response = $(this).data('json');

        $('#editForm').trigger('reset');
        $('#editId').val(response.id);
        $('#editCountryName').val(response.countryName);
        $('#showCountryImage').attr('src', response.countryImage);
        $('#editModal').modal('show');
    });

    handleSubmit('#createForm', '#initBtTable', '#createModal');
    handleSubmit('#editForm', '#initBtTable', '#editModal');
});
