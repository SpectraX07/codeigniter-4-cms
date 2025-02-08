$(document).ready(function () {
    "use strict";

    // Manage tab state with localStorage
    const settingsTab = localStorage.getItem('settingsTab') || 'siteSetting';
    if (settingsTab) {
        $('.nav-pills a[href="#' + settingsTab + '"]').tab('show');
    }

    $('.nav-pills a').on('click', function () {
        const tabName = $(this).attr('href').substr(1);
        localStorage.setItem('settingsTab', tabName);
    });


    // Custom validation methods
    $.validator.addMethod("filetype", function (value, element, param) {
        const fileType = element.files[0]?.type;
        return this.optional(element) || param.includes(fileType);
    }, "Please upload a valid file type.");

    $.validator.addMethod("accept", function (value, element, param) {
        return this.optional(element) || new RegExp(param).test(value);
    }, "Invalid value.");

    $.validator.addMethod("equalTo", function (value, element, param) {
        return this.optional(element) || $.inArray(value, param) !== -1;
    }, "Invalid value.");

    $.validator.addMethod("greaterThanEqualTo", function (value, element, param) {
        return this.optional(element) || parseFloat(value) >= parseFloat(param);
    }, "Please enter a value greater than or equal to {0}.");

    // Handle form validation
    function handleFormValidation(formId, rules, messages, onSuccessRedirect = false) {
        $(`#${formId}`).validate({
            rules: rules,
            messages: messages,
            submitHandler: function (form) {
                const $form = $(form);
                const $btn = $form.find('button[type=submit]');
                const formData = new FormData(form);

                $('span.field-feedback').empty();
                $btn.prop('disabled', true).text('Loading...');

                $.ajax({
                    type: 'POST',
                    url: $form.attr('action'),
                    data: formData,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: function (response) {
                        $btn.prop('disabled', false).html('Update');
                        location.reload();
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
                        $btn.prop('disabled', false).html('Update');
                    }
                });
            }
        });

        // Trigger validation on input change
        $(`#${formId} input, #${formId} select`).on('input change', function () {
            $(this).valid();
        });
    }

    // Initialize form validation
    handleFormValidation(
        'formSiteSetting',
        {
            siteTitle: {
                required: true,
                minlength: 3
            },
            supportEmail: {
                required: true,
                email: true
            },
            adminLogo: {
                filetype: ["image/png", "image/jpeg", "image/webp"]
            },
            frontEndLogo: {
                filetype: ["image/png", "image/jpeg", "image/webp"]
            },
            favicon: {
                filetype: ["image/x-icon", "image/png"]
            }
        },
        {
            siteTitle: {
                required: "Please enter your site title.",
                minlength: "Your site title must be at least 3 characters long."
            },
            supportEmail: {
                required: "Please enter your support email address.",
                email: "Please enter a valid email address."
            },
            adminLogo: {
                filetype: "Please upload a valid admin panel logo file (.png, .jpg, .jpeg, .webp)."
            },
            frontEndLogo: {
                filetype: "Please upload a valid first frontend logo file (.png, .jpg, .jpeg, .webp)."
            },
            frontEndLogo2: {
                filetype: "Please upload a valid second frontend logo file (.png, .jpg, .jpeg, .webp)."
            },
            frontEndLogo3: {
                filetype: "Please upload a valid third frontend logo file (.png, .jpg, .jpeg, .webp)."
            },
            adminShortLogo: {
                filetype: "Please upload a valid admin panel short logo file (.png, .jpg, .jpeg, .webp)."
            },
            favicon: {
                filetype: "Please upload a valid favicon file (.ico, .png)."
            }
        }
    );

    handleFormValidation(
        'formDatetimeSetting',
        {
            timezoneArea: {
                required: true
            },
            timezone: {
                required: true
            },
            dateFormat: {
                required: true
            },
            timeFormat: {
                required: true
            }
        },
        {
            timezoneArea: {
                required: "Please select a timezone area"
            },
            timezone: {
                required: "Please select a timezone"
            },
            dateFormat: {
                required: "Please select a date format"
            },
            timeFormat: {
                required: "Please select a time format"
            }
        },
        true // Redirect on success
    );

    $(document).on('change', '#timezoneArea', async function () {
        const response = await fetch(`${adminUrl}setting/get-timezones/${$(this).val()}`);
        const data = await response.json();

        // Build the options HTML
        let options = '<option value="">Select a timezone...</option>';
        $.each(data, function (key, value) {
            options += `<option value="${key}">${value}</option>`;
        });

        // Replace the HTML of the #timezone dropdown
        $('#timezone').html(options);
    });

    // Manage email settings form
    function toggleSettings(protocol) {
        $('#mail-settings, #sendmail-settings, #smtp-settings').hide();
        if (protocol === 'mail') {
            $('#mail-settings').show();
        } else if (protocol === 'sendmail') {
            $('#sendmail-settings').show();
        } else if (protocol === 'smtp') {
            $('#smtp-settings').show();
        }
    }

    // Initialize settings based on selected protocol
    const selectedProtocol = $('#protocol').val();
    toggleSettings(selectedProtocol);

    $('#protocol').change(function () {
        const selectedProtocol = $(this).val();
        toggleSettings(selectedProtocol);
    });

    $('#SMTPPort').change(function () {
        if ($(this).val() === 'other') {
            $('#SMTPPortOtherContainer').show();
        } else {
            $('#SMTPPortOtherContainer').hide();
        }
    }).trigger('change');

    handleFormValidation(
        'formEmailSetting',
        {
            fromName: {
                required: true,
                minlength: 2
            },
            fromEmail: {
                required: true,
                email: true
            },
            protocol: {
                required: true,
                equalTo: ['mail', 'sendmail', 'smtp']
            },
            mailPath: {
                required: function () {
                    return $('#protocol').val() === 'sendmail';
                },
                minlength: 0
            },
            SMTPHost: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                minlength: 0
            },
            SMTPPort: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                accept: '25|587|465|2525|other'
            },
            SMTPPortOther: {
                required: function () {
                    return $('#SMTPPort').val() === 'other';
                },
                digits: true,
                minlength: 0
            },
            SMTPUser: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                minlength: 0
            },
            SMTPPass: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                minlength: 0
            },
            SMTPCrypto: {
                required: function () {
                    return $('#protocol').find(':selected').val() === 'smtp';
                },
                equalTo: ['ssl', 'tls']
            },
            SMTPTimeout: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                number: true,
                greaterThanEqualTo: 0
            },
            SMTPKeepAlive: {
                required: function () {
                    return $('#protocol').val() === 'smtp';
                },
                digits: true,
                range: [0, 1]
            }
        },
        {
            fromName: {
                required: "Please enter a name.",
                minlength: "Name must be at least 2 characters long."
            },
            fromEmail: {
                required: "Please enter an email address.",
                email: "Please enter a valid email address."
            },
            protocol: {
                required: "Please select a protocol.",
                equalTo: "Invalid protocol selected."
            }
        },
        true // Redirect on success
    );
});
