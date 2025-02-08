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



$(function () {
    "use strict";

    $('#initBtTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        $('#archiveData').prop('disabled', !$('#initBtTable').bootstrapTable('getSelections').length)
        selectedIds = getIdSelections('#initBtTable');
    });

    $('#archiveData').click(function () {
        handleRequest(`${adminUrl}grievances/delete`, selectedIds, 'DELETE', {}, '#initBtTable', 'are you sure you want to delete selected Grievances?');
    });
});
