// Wait for the DOM to be loaded 
var passwordStrength = 0;
var passwordMatched = false;
var passcode = "";
var email_success_shown = false;
var inputTimeout;
var codeBtnDisabled = false;
var fieldIdsForValidation = [];
var formFields = {};
var formChanged = false;
var domainValidationError = false;
(function () {

    // change error messages
    setInterval(function () {
        if (typeof CONTENT !== "undefined") {
            if (("error_requiredFieldMissing" in CONTENT)) {
                CONTENT['error_requiredFieldMissing'] = "Please complete all mandatory fields and try again."
            }
            if (("error_passwordEntryMismatch" in CONTENT)) {
                CONTENT['error_passwordEntryMismatch'] = "Please make sure your passwords match."
            }
            if (("ver_intro_msg" in CONTENT)) {
                CONTENT['ver_intro_msg'] = "Verify by clicking the Send button"
            }
            if (("ver_fail_retry" in CONTENT)) {
                CONTENT['ver_fail_retry'] = "Invalid code. Please try again."
            }
            if (("ver_fail_server" in CONTENT)) {
                CONTENT['ver_fail_server'] = "Trouble verifying your email. Please enter a valid email and try again."
            }
            if (("ver_fail_throttled" in CONTENT)) {
                CONTENT['ver_fail_throttled'] = "Too many verification requests for this email. Please wait and try again."
            }
            if (("ver_but_edit" in CONTENT)) {
                CONTENT['ver_but_edit'] = "Change Email"
            }
            if (("error_fieldIncorrect" in CONTENT)) {
                CONTENT['error_fieldIncorrect'] = "Invalid entries in one or more fields. Please review and try again."
            }
            if (("alert_title" in CONTENT)) {
                CONTENT['alert_title'] = "Invalid entries in one or more fields. Please review and try again."
            }
            if (("alert_message" in CONTENT)) {
                CONTENT['alert_message'] = "Too many incorrect attempts. Please try again later."
            }
            if (("ver_fail_no_retry" in CONTENT)) {
                CONTENT['ver_fail_no_retry'] = "Invalid code. Please try again."
            }
            if (("ver_fail_code_expired" in CONTENT)) {
                CONTENT['ver_fail_code_expired'] = "The code has expired. Please request a new one."
            }
            if (("ver_info_msg" in CONTENT)) {
                CONTENT['ver_info_msg'] = "Check your inbox for the verification code and enter it below."
            }
            if (("button_continue" in CONTENT)) {
                CONTENT['button_continue'] = "Get Started"
            }
            if (("ver_success_msg" in CONTENT)) {
                CONTENT['ver_success_msg'] = "Email verified. You#39;re all set to continue."
            }
        }
    }, 2000)

    // remove empty aria label
    var errorItemLevel = document.querySelectorAll('.error');
    if (errorItemLevel.length > 0) {
        errorItemLevel.forEach(function (error) {
            error.removeAttribute('aria-label');
        });

    }

    // Find and remove the h2 tag "OR" inside the divider class
    var divider_elements = document.querySelectorAll('.divider');
    divider_elements.forEach(function (element) {
        var h2Tags = element.querySelectorAll('h2');
        // remove H2 tag
        h2Tags.forEach(function (h2Tag) {
            h2Tag.parentNode.removeChild(h2Tag);
        });
    });
    // check whether the screen is 768px wide atleast
    if (window.innerWidth >= 768) {
        // remove forgot password link from its' default position and append it next to keep me logged in
        var forgotPasswordElement = document.getElementById('forgotPassword');
        if (forgotPasswordElement) {
            forgotPasswordLink = forgotPasswordElement.href; // get the URL before deleting it 
            if (typeof forgotPasswordLink !== "undefined") {
                // remove the link
                forgotPasswordElement.parentNode.removeChild(forgotPasswordElement);
                // append to it's new position
                var newLinkPosition = '<a id="forgotPassword" href="' + forgotPasswordLink + '">Forgot your password?</a>';
                var rememberMeElement = document.getElementById('rememberMe');
                rememberMeElement.parentNode.innerHTML += newLinkPosition
            }
        }
    }
    // remove default signup link and add as custom action button
    var createAccountElement = document.getElementById('createAccount');
    if (createAccountElement !== null) {
        createAccountLink = createAccountElement.href; // get the URL before deleting it 
        if (typeof createAccountLink !== "undefined") {
            // append to it's new position
            var newLinkPositionSignup = '<a id="createAccount" href="' + createAccountLink + '" class="action-button gainsboro-action-button">Sign up now</a>';
            var create_elements = document.querySelectorAll('.create');
            create_elements.forEach(function (element) {
                element.innerHTML = newLinkPositionSignup;
            });
        }
    }
    // signin page
    var signInNameElement = document.getElementById("signInName");
    if (signInNameElement) {
        signInNameElement.placeholder = "user@example.com";
    }
    var passwordElement = document.getElementById("password");
    if (passwordElement) {
        passwordElement.placeholder = "Enter your password";
    }
    // forgot password page
    var emailAddressElement = document.getElementById("emailAddress");
    if (emailAddressElement) {
        emailAddressElement.placeholder = "user@example.com";
    }
    var sendCodeElement = document.getElementsByClassName("sendCode")[0];
    if (sendCodeElement) {
        sendCodeElement.className = "action-button green-action-button";
    }
    var verifyCodeElement = document.getElementsByClassName("verifyCode")[0];
    if (verifyCodeElement) {
        verifyCodeElement.className = "action-button green-action-button";
    }
    var sendNewCodeElement = document.getElementsByClassName("sendNewCode")[0];
    if (sendNewCodeElement) {
        sendNewCodeElement.className = "action-button haze-action-button";
    }
    var changeClaimsElement = document.getElementsByClassName("changeClaims")[0];
    if (changeClaimsElement) {
        changeClaimsElement.className = "action-button haze-action-button";
    }
    // update the current year in footer
    var currentYear = new Date().getFullYear();
    // Find the span element by its ID and set its text content to the current year
    var yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
    // append helpful link 
    var spanElement = document.createElement("span");
    spanElement.className = "hint-tooltip hint--right";
    var iElement = document.createElement("i");
    iElement.className = "userTip";
    if ($(window).width() >= 640) {
        // Find all elements with the given class
        var parentElements = document.querySelectorAll(`.attrEntry`);
        // Iterate through each element and append the span inside the label
        parentElements.forEach(function (parentElement) {
            var labelElement = parentElement.querySelector('label');
            var nearestAnchor = parentElement.querySelector("a.helpLink");
            if (nearestAnchor) {
                spanElement.setAttribute('aria-label', nearestAnchor.getAttribute("data-help"));
            }
            labelElement.appendChild(spanElement.cloneNode(true)); // Use cloneNode to append a copy to each label
        });
        // Find all elements with the given class
        var parentSpanElements = document.querySelectorAll(`.attrEntry`);
        // Iterate through each element and append the span inside the label
        parentSpanElements.forEach(function (parentElement) {
            var labelElement = parentElement.querySelector('span');
            labelElement.appendChild(iElement.cloneNode(true)); // Use cloneNode to append a copy to each label
        });
    } else {
        var anchorLinks = document.querySelectorAll('a.helpLink');
        anchorLinks.forEach(function (link) {
            var attributeValue = link.getAttribute('data-help');
            if (attributeValue) {
                var labelAbove = __findLabelAbove(link);
                if (labelAbove) {
                    labelAbove.innerHTML += "<span>Hint: " + attributeValue + "</span>";
                }
            }
        });
    }
    // prevent default click event of help links
    var links = document.querySelectorAll('.helpLink');
    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
        });
    });
    // append password strength meter
    var passwordField = document.getElementById('newPassword');
    if (passwordField) {
        var meter = document.createElement('meter');
        meter.min = "0";
        meter.max = "100";
        meter.value = "0"; // Initial value, adjust as needed
        // Append the <meter> element next to the specified element
        passwordField.insertAdjacentElement('afterend', meter);
    }
    var reenterPasswordField = document.getElementById('reenterPassword');
    if (reenterPasswordField) {
        var reenterPasswordFieldMeter = document.createElement('meter');
        reenterPasswordFieldMeter.min = "0";
        reenterPasswordFieldMeter.max = "100";
        reenterPasswordFieldMeter.value = "0"; // Initial value, adjust as needed
        // Append the <meter> element next to the specified element
        reenterPasswordField.insertAdjacentElement('afterend', reenterPasswordFieldMeter);
    }
    document.addEventListener("keyup", function (event) {
        __passwordStrength(event, "newPassword")
        __passwordStrength(event, "reenterPassword", 1)
    });

    //diable form autocomplete
    var form = document.getElementById('attributeVerification');
    if (form) {
        var textInputs = form.getElementsByTagName('input');
        for (var i = 0; i < textInputs.length; i++) {
            textInputs[i].autocomplete = 'off';
        }
    }

    $('input[type="password"]').attr("autocomplete", "sp-ciam-new-password")

    // apply custom css

    // ge the URL.

    if ($("#attributeVerification").length > 0 && $(".VerificationControl").length == 0) {

        var email_info_html = $("#email_info").html();
        var email_success_html = $("#email_success").html();
        var email_fail_retry = $("#email_fail_retry").html();
        var email_fail_no_retry = $("#email_fail_no_retry").html();

        var email_fail_throttled = $("#email_fail_throttled").html();
        var email_fail_code_expired = $("#email_fail_code_expired").html();
        var email_fail_server = $("#email_fail_server").html();
        var email_incorrect_format = $("#email_incorrect_format").html();

        var password_mismatch = "";

        setInterval(function () {

            if ($("#passwordEntryMismatch").html().length > 0) {
                password_mismatch = $("#passwordEntryMismatch").html();
            }

            if ($(".working").length > 0 && $("#localAccountForm").length == 0) {
                $(".verificationInfoText").html("");
                $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                $(".verificationErrorText").html("");
                $(".verificationErrorText").removeClass("dcc-alert dcc-alert-danger");
                $(".verificationSuccessText").html("");
                $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");
            }
            // code sent
            if ($("#email_info").length > 0) {
                if (!($("#email_info").css("display") == "none")) {
                    $("#email_info").addClass("dcc-alert dcc-alert-success");
                    $("#email_info").html("<span>" + email_info_html + "</span>");

                    $(".verificationErrorText").html("");
                    $(".verificationErrorText").removeClass("dcc-alert dcc-alert-danger");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");

                } else {
                    $("#email_info").removeClass("dcc-alert dcc-alert-success");
                    $("#email_info").html("");
                }



            }

            // email verified
            if ($("#email_success").length > 0) {
                if (!($("#email_success").css("display") == "none") && (!email_success_shown)) {
                    $("#email_success").addClass("dcc-alert dcc-alert-success");
                    $("#email_success").html("<span>" + email_success_html + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationErrorText").html("");
                    $(".verificationErrorText").removeClass("dcc-alert dcc-alert-danger");


                } else {
                    $("#email_success").removeClass("dcc-alert dcc-alert-success");
                    $("#email_success").html("");
                }

            }

            // email_fail_retry
            if ($("#email_fail_retry").length > 0) {
                if (!($("#email_fail_retry").css("display") == "none")) {

                    // reset the input value
                    if (!codeBtnDisabled) {
                        $("#email_ver_input").val("")
                        $("#email_ver_but_verify").prop("disabled", true)
                        $("#emailVerificationControl_but_verify_code").prop("disabled", true);
                        codeBtnDisabled = true
                    }


                    $("#email_fail_retry").addClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_retry").html("<span>" + email_fail_retry + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");


                } else {
                    $("#email_fail_retry").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_retry").html("");
                }


            }

            // email_fail_no_retry
            if ($("#email_fail_no_retry").length > 0) {
                if (!($("#email_fail_no_retry").css("display") == "none")) {



                    $("#email_fail_no_retry").addClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_no_retry").html("<span>" + email_fail_no_retry + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");

                } else {
                    $("#email_fail_no_retry").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_no_retry").html("");
                }
            }

            // email_fail_throttled
            if ($("#email_fail_throttled").length > 0) {
                if (!($("#email_fail_throttled").css("display") == "none")) {



                    $("#email_fail_throttled").addClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_throttled").html("<span>" + email_fail_throttled + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");


                } else {
                    $("#email_fail_throttled").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_throttled").html("");
                }
            }

            // email_fail_code_expired
            if ($("#email_fail_code_expired").length > 0) {
                if (!($("#email_fail_code_expired").css("display") == "none")) {

                    // reset the input value
                    if (!codeBtnDisabled) {
                        $("#email_ver_input").val("")
                        $("#email_ver_but_verify").prop("disabled", true)
                        $("#emailVerificationControl_but_verify_code").prop("disabled", true);
                        codeBtnDisabled = true
                    }

                    $("#email_fail_code_expired").addClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_code_expired").html("<span>" + email_fail_code_expired + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");


                } else {
                    $("#email_fail_code_expired").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_code_expired").html("");
                }

            }

            // email_fail_server
            if ($("#email_fail_server").length > 0) {
                if (!($("#email_fail_server").css("display") == "none")) {

                    $("#email_fail_server").addClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_server").html("<span>" + email_fail_server + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");

                } else {
                    $("#email_fail_server").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_fail_server").html("");
                }

            }

            // email_incorrect_format
            if ($("#email_incorrect_format").length > 0) {
                if (!($("#email_incorrect_format").css("display") == "none")) {
                    $("#email_incorrect_format").addClass("dcc-alert dcc-alert-danger");
                    $("#email_incorrect_format").html("<span>" + email_incorrect_format + "</span>");

                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");

                } else {
                    $("#email_incorrect_format").removeClass("dcc-alert dcc-alert-danger");
                    $("#email_incorrect_format").html("");
                }

            }

            // remove success message 
            $(".error.pageLevel").each(function () {
                if (!($(this).css("display") == "none")) {

                    if ($(this).text().length > 0) {
                        $(this).html("<p>" + $(this).text() + "</p>");
                    }
                    $(".verificationInfoText").html("");
                    $(".verificationInfoText").removeClass("dcc-alert dcc-alert-success");
                    $(".verificationSuccessText").html("");
                    $(".verificationSuccessText").removeClass("dcc-alert dcc-alert-success");
                    $("#verifying_blurb").html("")

                    email_success_shown = true;
                }

            })

        }, 100);
    }
    var findForm = window.location.search.indexOf("ForgotPasswordExchange");
    /* if (findForm !== -1) {
        setInterval(function () {
            if (!($("#emailVerificationControl_error_message").css("display") == "none") && (($("#emailVerificationControl_success_message").css("display") == "none"))) {
                $(".verificationInfoText").html("");
                $("#emailVerificationControl_info_message").removeClass("dcc-alert dcc-alert-success");
               $(".verificationSuccessText").html("");
                $("#emailVerificationControl_success_message").removeClass("dcc-alert dcc-alert-success");
            }
            else if (!($("#emailVerificationControl_success_message").css("display") == "none") && (($("#emailVerificationControl_error_message").css("display") == "none"))) {
                $(".verificationInfoText").html("");
                $("#emailVerificationControl_info_message").removeClass("dcc-alert dcc-alert-success");
                $(".verificationErrorText").html("");
                $("#emailVerificationControl_success_message").removeClass("dcc-alert dcc-alert-danger");
            }
        }, 100);

    }*/

    var emailVerificationError = document.getElementById("emailVerificationControl_error_message")
    var emailVerificationSuccess = document.getElementById("emailVerificationControl_success_message");

    setInterval(function () {

        var emailVerificationErrorhtml = $("#emailVerificationControl_error_message").attr("aria-label");
        var emailVerificationSuccessHtml = $("#emailVerificationControl_success_message").attr("aria-label");

        if ($("#emailVerificationControl_error_message").length > 0) {
            if (!($("#emailVerificationControl_error_message").css("display") == "none")) {
                emailVerificationError.parentElement.classList.add("dcc-alert", "dcc-alert-danger")
                emailVerificationError.innerHTML = "<span>" + emailVerificationErrorhtml + "</span>"
            }
            else {
                if (emailVerificationError) {
                    emailVerificationError.parentElement.classList.remove("dcc-alert", "dcc-alert-danger")
                    emailVerificationError.innerHTML = ""
                }
            }
        }

        // email verification from forgot password 
        if ($("#emailVerificationControl_success_message").length > 0) {
            if (!($("#emailVerificationControl_success_message").css("display") == "none")) {
                emailVerificationSuccess.classList.add("dcc-alert", "dcc-alert-success")
                emailVerificationSuccess.innerHTML = "<span>" + emailVerificationSuccessHtml + "</span>"
            }
            else {
                if (emailVerificationSuccess) {
                    emailVerificationSuccess.classList.remove("dcc-alert", "dcc-alert-success")
                    emailVerificationSuccess.innerHTML = ""
                }

            }
        }

    }, 100);

    // update T&c's text t oanchor and link it
    var termsOfUseConsentChoice = document.getElementById('extension_termsOfUseConsentChoice_label');
    if (termsOfUseConsentChoice) {
        var content = termsOfUseConsentChoice.innerHTML;
        if (content.includes('Terms and Conditions')) {
            var modifiedContent = content.replace(/(\Terms and Conditions\b)/gi, '<a href="https://www.portal.dunedin.govt.nz/solicitor/terms-and-conditions" title="Dunedin City Council Terms and Conditions" target="_blank">$1</span>');
            termsOfUseConsentChoice.innerHTML = modifiedContent;
        }
    }

    // password criteria
    var passwordCriteriaTemplate = document.getElementById("password-criteria");
    if (passwordCriteriaTemplate) {
        // above new password 
        var newPassword = document.getElementById("newPassword");
        if (newPassword) {
            var content = document.querySelector('template').content;
            newPassword.parentNode.insertBefore(document.importNode(content, true), newPassword);
        }

        // above confirm password
        var reenterPassword = document.getElementById("reenterPassword");
        if (reenterPassword) {
            var content = document.querySelector('template').content;
            reenterPassword.parentNode.insertBefore(document.importNode(content, true), reenterPassword);
        }
        // reveal password
        $(document).on("click", ".dcc-password-hint", function () {
            if ($(this).hasClass("dcc-password-hint-visible")) {
                $(this).removeClass("dcc-password-hint-visible")
            }
            else {
                $(".dcc-password-hint").removeClass("dcc-password-hint-visible")
                $(this).addClass("dcc-password-hint-visible")
            }
        })

    }

    // input field wrapper
    $("input[type='text'], input[type='password']").each(function () {
        var id = $(this).attr("id")
        $(this).wrap("<div class='dcc-w-full " + id + "'></div>");
    })

    // append password reveal icons 
    $(".newPassword, .reenterPassword").append("<i class='passwordReveal'></i>");
    $("#password").parent().append("<i class='passwordRevealLogin'></i>")

    $(".passwordReveal").on("click", function () {
        var input = $(this).parent().find("input");
        if (($(input).length > 0) && ($(input).attr("type") == "password")) {
            $(input).attr("type", "text")
            $(this).addClass("revealed")
        }
        else if (($(input).length > 0) && ($(input).attr("type") == "text")) {
            $(input).attr("type", "password")
            $(this).removeClass("revealed")
        }
    })

    $(".passwordRevealLogin").on("click", function () {
        var input = $(this).parent().find("input");
        if (($(input).length > 0) && ($(input).attr("type") == "password")) {
            $(input).attr("type", "text")
            $(this).addClass("revealed")
        }
        else if (($(input).length > 0) && ($(input).attr("type") == "text")) {
            $(input).attr("type", "password")
            $(this).removeClass("revealed")
        }
    })

    // client side validation
    function setCustomPasswordValidation(target, define = null) {
        var element = document.getElementById(target);
        if (element && define !== null) {
            element.setAttribute("minlength", 8)
            element.setAttribute("maxlength", 50)
            element.setCustomValidity("Password must be 8 characters long")
        }
        else if (element && ($("#" + target).val().length >= 8) && ($("#" + target).val().length <= 50)) {
            element.setCustomValidity("")
        }
        else if (element && $("#" + target).val().length > 50) {
            element.setCustomValidity("Password must not be more than 50 characters long")
        }
        else if (element && $("#" + target).val().length < 8) {
            element.setCustomValidity("Password must be 8 characters long")
        }

    }


    $("input[type='password']").each(function () {
        $(this).removeAttr("pattern")
        var elem = $(this).attr("id")
        setCustomPasswordValidation(elem, "yes")
    })

    $("input[type='password']").keyup(function () {
        var elem = $(this).attr("id")
        setCustomPasswordValidation(elem)
    })


    $("#email").removeAttr("pattern")

    // register page add button classes
    $(".sendButton").addClass("green-action-button");
    $(".verifyButton").addClass("green-action-button");
    $(".editButton").addClass("haze-action-button");
    $("#email_ver_but_resend").removeClass("green-action-button");
    $("#email_ver_but_resend").addClass("haze-action-button");
    // register page 
    $("#email_ver_but_send").css("margin-left", "auto")
    $("#email_ver_but_send").css("margin-right", "auto")
    $("#email_ver_but_send").css("width", "max-content")
    $(".buttons.verify").css("width", "100%")


    // forgot password page
    $("#emailVerificationControl_but_send_code").css("margin-left", "auto")
    $("#emailVerificationControl_but_send_code").css("margin-right", "auto")
    $("#emailVerificationControl_but_send_code").css("width", "max-content")
    if ($("#emailVerificationControl_but_send_code").length > 0) {
        $(".buttons:eq(1)").css("width", "100%")
        $("#continue").addClass("dcc-hidden")
        $("#cancel").addClass("dcc-hidden")
        $("#emailVerificationControl_but_change_claims").css("width", "max-content")
    }

    setInterval(function () {
        if ((($("#email_ver_input_label").css("display") != "none") && ($(".TextBox.VerificationCode").length === 0)) ||
            (($("#email_ver_input_label").length === 0) && ($(".TextBox.VerificationCode").css("display") != "none"))) {

            // implement verification code style
            var verification_code_html = ` <div class="verification-code-container">
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code"/> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code"/> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code"/> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" title="Verification code" /> </div>
</div>`;


            if ($(".verification-code-container").length === 0) {
                if ($("#email_ver_input").length > 0) {
                    $(verification_code_html).insertBefore('.buttons.verify');
                }
                else if ($("#verificationCode").length > 0) {
                    $('.attrEntry .verificationCode').append(verification_code_html);
                    $("#verificationCode").addClass("dcc-hidden")
                }

                $('.verification-code-input').on('input', function () {

                    var $this = $(this);

                    clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(function () {
                        if ($this.val().length === 1) {
                            $this.closest('.verification-code-box').next().find('.verification-code-input').focus();
                        }

                        if ($this.val().length === 0) {
                            $this.closest('.verification-code-box').prev().find('.verification-code-input').focus();
                        }
                    }, 0);
                }).on('keydown', function (e) {
                    var $this = $(this);
                    if (e.keyCode == 8) {
                        clearTimeout(inputTimeout);
                        inputTimeout = setTimeout(function () {
                            if ($this.val().length === 0) {
                                $this.closest('.verification-code-box').prev().find('.verification-code-input').focus();
                            }
                        }, 0);
                    }
                });
                // apply new code threshold
                if ($("#email_ver_input").length > 0) {
                    newCodeWaitTime("#email_ver_but_resend");
                }
                else if ($("#verificationCode").length > 0) {
                    newCodeWaitTime("#emailVerificationControl_but_send_new_code");
                }

                // restrict verification code field
                $(".verification-code-input").on("keypress", function (e) {
                    if (e.keyCode >= 48 && e.keyCode <= 57) {
                        return true;
                    }
                    return false;
                })

                // handle code paste 
                $(".verification-code-input").on("paste", function (e) {
                    // if the target is a text input
                    if (e.target.type === "text") {

                        e.stopPropagation();
                        e.preventDefault();

                        var pastedData = e.originalEvent.clipboardData;
                        var data = pastedData.getData("text/plain");
                        data = data.split('');
                        [].forEach.call(document.querySelectorAll(".verification-code-input"), (node, index) => {
                            if (typeof data[index] !== "undefined" && $.isNumeric(data[index])) {
                                node.value = data[index];
                            }
                            else {
                                node.value = ""
                            }
                        });
                        return true;
                    }

                    return false;

                });

                // track form changes
                $("input").each(function () {
                    var fieldId = $(this).attr("id")
                    if (typeof fieldId !== "undefined") {
                        formFields[fieldId] = $(this).val()
                    }
                })
            }

            // get the passcode input
            if ($(".verification-code-container").length > 0) {
                var passcode_input = "";
                $(".verification-code-input").each(function () {
                    if ($(this).val().length > 0) {
                        passcode_input = passcode_input + $(this).val();

                        if ($("#email_ver_input").length > 0) {
                            $('#email_ver_input').val(passcode_input)
                        }
                        else if ($("#verificationCode").length > 0) {
                            $('#verificationCode').val(passcode_input)
                        }


                    }
                })
            }

            // check the code value and disable the button if needed
            var value = $("#email_ver_input").val();
            if ($("#verificationCode").length > 0) {
                value = $("#verificationCode").val();
            }
            var regex = /^\d{6}$/;

            if (!regex.test(value)) {
                $("#email_ver_but_verify").prop("disabled", true);
                $("#emailVerificationControl_but_verify_code").prop("disabled", true);
                codeBtnDisabled = false;
            } else {
                $("#email_ver_but_verify").prop("disabled", false);
                $("#emailVerificationControl_but_verify_code").prop("disabled", false);
            }
        }
        else {
            $(".verification-code-container").remove();
        }
    }, 500)


    // Move the elements above their parent
    $('#email_ver_input_label').insertBefore('.buttons.verify');
    $('.email_ver_input').insertBefore('.buttons.verify');
    $('.email_ver_input').addClass('dcc-hidden');

    // waiting UI
    var email_ver_wait_html = `<div class="email_ver_wait"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="message"><path fill="#2F4757" d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path></svg>
    <p>Sending Verifcation Code&nbsp;</p></div>`;
    if ($("#localAccountForm").length == 0) {
        $(".working").html(email_ver_wait_html)
    }


    // add width class
    $(".verificationInfoText").parent().addClass("dcc-w-full")
    $("#email_ver_but_edit").css("max-width", "150px")


    $("#attributeList li:first-child").addClass('dcc-email-verification');
    $("#continue").parent().addClass('dcc-hidden');

    $("#attributeList li").each(function () {
        if (!$(this).hasClass("dcc-email-verification")) {
            $(this).addClass("dcc-hidden")
        }
    });

    setInterval(function () {

        if ($("#email_ver_but_edit").css("display") != "none") {
            $("#attributeList li").each(function () {
                if ($(this).hasClass("dcc-hidden")) {
                    $(this).removeClass("dcc-hidden")
                }
            });
            $("#continue").parent().removeClass('dcc-hidden');
        }
        else {
            $("#continue").parent().addClass('dcc-hidden');

            $("#attributeList li").each(function () {
                if (!$(this).hasClass("dcc-email-verification")) {
                    $(this).addClass("dcc-hidden")
                    var input = $(this).find('input')
                    if (typeof input !== "undefined") {
                        $(input).val('')
                    }
                }
            });
            if ($("#extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes").length > 0) {
                $("meter").val(0)
                $('#extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes').prop('checked', false);
            }

        }

        // processing forms
        if ($("#simplemodal-overlay").length > 0) {
            if ($("#continue").html() == "Continue") {
                $("#continue").html("<div class='submit-btn-loading'></div>")
                $("#continue").attr("disabled", true)
                $("#continue").attr("title", "Please wait...")
            }

        }
        else {
            if ($("#continue").html() != "Continue") {
                $("#continue").html("Continue")
                $("#continue").attr("disabled", false)
            }


        }

        // show buttons 
        if ($("#verificationCode").length > 0) {
            if ($("#emailVerificationControl_but_change_claims").css("display") != "none") {
                $("#continue").removeClass("dcc-hidden")
                $("#cancel").removeClass("dcc-hidden")
                $("#continue").click();
                $("#emailVerificationControl_but_change_claims").hide();
            }
            else {
                $("#continue").addClass("dcc-hidden")
                $("#cancel").addClass("dcc-hidden")
            }
        }

    }, 100)


    // set the consent checkbox value based on user selection
    $("#extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes").on("change", function () {
        if ($(this).is(":checked")) {
            $(this).val(true)
        }
        else {
            $(this).val('')
        }
    });

    $("#email_ver_input_label").addClass("verification-code")


    // disable verfication button until email address is entererd on registration page 
    if ($("#email").val() == "") {
        $("#email_ver_but_send").prop("disabled", true)
    }
    $("#email").on("input change keyup", function () {
        var value = $(this).val();
        var itemLevelError = $(this).parent().parent().find(".error");
        var emailRegex = /^[A-Za-z0-9_.+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;

        if (!emailRegex.test(value)) {
            $("#email_ver_but_send").prop("disabled", true);
            if (itemLevelError.length > 0) {
                $(itemLevelError).html("Enter a valid email address");
                $(itemLevelError).attr("aria-label", "");
            }
        } else {
            $("#email_ver_but_send").prop("disabled", false);
            if (itemLevelError.length > 0) {
                $(itemLevelError).html("");
                $(itemLevelError).removeAttr("aria-label");
            }
        }
    });


    // disable verfication button until email address is entererd on forgot password page 
    __disableBtn("#emailAddress", "#emailVerificationControl_but_send_code", /^[A-Za-z0-9_.+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/, "Enter a valid email address")

    // disable button until user enters value
    if ($("#email_ver_input").val() == "") {
        $("#email_ver_but_verify").prop("disabled", true)
        $("#emailVerificationControl_but_verify_code").prop("disabled", true);
    }


    // disable continue btn
    setInterval(function () {
        if ($("#email_ver_input").length > 0) {

            fieldIdsForValidation = [];
            fieldIdsForValidation.push("#newPassword")
            fieldIdsForValidation.push("#reenterPassword")
            __validateForm(fieldIdsForValidation)
        }
        else if ($("#email_ver_input") && $("#newPassword").length > 0) {

            fieldIdsForValidation = [];
            fieldIdsForValidation.push("#newPassword")
            fieldIdsForValidation.push("#reenterPassword")
            __validateForm(fieldIdsForValidation)
        }
    }, 500)


    // add required astrich
    if ($(".attrEntry").length > 0) {
        var spans = $(".attrEntry").find("label span")
        $(spans).each(function (e) {
            console.log(e.id)
            $(this).before("<span style='color:#DC3545;font-weight:600;margin:0;' title='Required field'>*</span>")
        });

        $("#givenName_label span:eq(0)").remove();
        $("#surname_label span:eq(0)").remove();
    }
    if ($(".entry-item").length > 0) {
        var spans = $(".entry-item").find("label")
        $(spans).each(function (e) {
            $(this).append("<span style='color:#DC3545;font-weight:600;margin:0;' title='Required field'>*</span>")
        })
    }

    // detect form changes 
    /* setInterval(function () {
         if($("#attributeVerification").length > 0)
         {
             formChanged = false;
             $("input").each(function () {
                 var fieldId = $(this).attr("id");
                 if (fieldId in formFields && typeof fieldId !== "undefined" && !formChanged) {
                     if (formFields[fieldId] != $(this).val()) {
                         $(window).bind('beforeunload', function () {
                             return 'Are you sure you want to leave?';
                         });
                     }
                 }
             });
         }
   
     }, 300);*/


    // remove orphan Astrich on the fort password page 
    if ($("#emailVerificationControl_label").length > 0) {
        $("#emailVerificationControl_label").remove();
    }


    var cancelBtn = document.getElementById("cancel");
    if (cancelBtn && $("#confirm-signup-cancel").length > 0) {
        var content = document.querySelector('#confirm-signup-cancel').content;
        $(cancelBtn).parent().append(document.importNode(content, true), cancelBtn);
    }

    // cancel button changes 
    $("#cancel").unbind("click").bind("click", function () {
        $(".confirm-user-action-wrapper").show()
    });

    // continue signup
    $("#continueSignup").bind("click", function () {
        $(".confirm-user-action-wrapper").hide()
    });


    // disable enter click
    var form = document.getElementById("attributeVerification");
    if (form) {
        form.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();

                // signup 
                if (($("#email_ver_but_send").css("display") !== "none") && ($("#email_ver_but_send").prop("disabled") == false)) {
                    $("#email_ver_but_send").click();
                }
                else if (($("#email_ver_but_verify").css("display") !== "none") && ($("#email_ver_but_verify").prop("disabled") == false)) {
                    $("#email_ver_but_verify").click();
                }
                else if (($("#continue").css("display") !== "none") && ($("#continue").prop("disabled") == false)) {
                    $("#continue").click();
                }

                // forgot password
                if (($("#emailVerificationControl_but_send_code").css("display") !== "none") && ($("#emailVerificationControl_but_send_code").prop("disabled") == false)) {
                    $("#emailVerificationControl_but_send_code").click();
                }
                else if (($("#emailVerificationControl_but_verify_code").css("display") !== "none") && ($("#emailVerificationControl_but_verify_code").prop("disabled") == false)) {
                    $("#emailVerificationControl_but_verify_code").click();
                }


            }
        });

    }



    // check for domain validation
    setInterval(function () {

        if ($("#claimVerificationServerError").length > 0) {
            if (($("#claimVerificationServerError").html().length > 0) && !($("#claimVerificationServerError").html().includes("Incorrect pattern for: New Password"))) {
                $("#attributeVerification").hide();

                if (!domainValidationError) {
                    var attributeVerification = document.getElementById("attributeVerification");
                    if (attributeVerification && $("#domainVerification").length > 0) {
                        var content = document.querySelector('#domainVerification').content;
                        $(attributeVerification).parent().append(document.importNode(content, true), attributeVerification);
                    }
                    domainValidationError = true;
                }
            }
        }
    }, 300);



  /*  setInterval(function () {
        if (($("#localAccountForm").length > 0)) {
           var nextHtml = $("#next").html();
           console.log(nextHtml.indexOf("Sign"))
            if (($(".working").html().length == 0) && (nextHtml.indexOf("Sign") !== -1)) {
                $("#next").html("<div class='submit-btn-loading'></div>")
                $("#next").attr("disabled", true)
                $("#next").attr("title", "Please wait...")
            }
            else {
                $("#next").html("Sign in")
                $("#next").attr("disabled", false)
                $("#next").attr("title", "Sign in")
            }
        }
    }, 3000);*/

    // swap button order
    $("#email_ver_but_resend").insertBefore("#email_ver_but_verify");
    $("#cancel").insertBefore("#continue");

    // forgot password page swap button order 
    $("#emailVerificationControl_but_send_new_code").insertBefore("#emailVerificationControl_but_verify_code");

})();


// Function to find the label above the given element and to append the hint attribute
function __findLabelAbove(element) {
    var previousSibling = element.previousElementSibling;
    while (previousSibling) {
        if (previousSibling.tagName === 'LABEL') {
            return previousSibling;
        }
        previousSibling = previousSibling.previousElementSibling;
    }
    return null; // Return null if no label is found
}

/**
 * Function to disable the new code butto for 15 seconds
 */
function newCodeWaitTime(elem) {
    if (!$(elem).is(":disabled")) {
        $(elem).prop('disabled', true);
        var countdown = 15;
        $(elem).text("Please wait for " + countdown + " seconds");
        var countdownInterval = setInterval(function () {
            countdown--;
            $(elem).text("Please wait for " + countdown + " seconds");
            if (countdown <= 0) {
                $(elem).prop('disabled', false);
                clearInterval(countdownInterval);
                $(elem).text("Send new code");
            }
        }, 1000);
    }
}


function __disableBtn(target, elem, regex, error_msg) {
    if ($(target).val() == "") {
        $(elem).prop("disabled", true)
    }
    $(target).on("input change keyup", function () {
        var value = $(this).val();
        var itemLevelError = $(this).parent().parent().find(".error");


        if (!regex.test(value)) {
            $(elem).prop("disabled", true);
            if (itemLevelError.length > 0) {
                $(itemLevelError).html(error_msg);
                $(itemLevelError).attr("aria-label", "");
            }
        } else {
            $(elem).prop("disabled", false);
            if (itemLevelError.length > 0) {
                $(itemLevelError).html("");
                $(itemLevelError).removeAttr("aria-label");
            }
        }
    });
}


function __passwordStrength(event, target, criteria = 0) {
    if (event.target && event.target.id == target) {
        var password = event.target.value;
        var hasNumber = /^(?=.*[0-9])/.test(password);
        var hasUppercase = /^(?=.*[A-Z])/.test(password);
        var hasPassword = /password/i.test(password);
        var hasLength = /^(?=.{8,})/.test(password);
        var hasIdenticalChars = /(.)\1\1/.test(password);
        var hasWhitespace = /\s/.test(password);
        var meterValue = hasNumber + hasUppercase + hasLength;
        meterValue = meterValue + hasPassword;
        meterValue = meterValue + hasIdenticalChars;

        // strike through matched criteria
        var passwordCriteria = $("#" + target).parent().parent().find(".criteria");
        // has number 

        var findCriteria = $(passwordCriteria).find('li[dcc-criteria="one-digit"]');
        if (findCriteria.length > 0) {
            if (!hasNumber) {
                findCriteria.removeClass("criteria-matched")
            }
            else {
                findCriteria.addClass("criteria-matched")
            }
        }

        // has uppercase
        var findCriteria1 = $(passwordCriteria).find('li[dcc-criteria="one-uppercase"]');
        if (findCriteria1.length > 0) {
            if (!hasUppercase) {
                findCriteria1.removeClass("criteria-matched")
            }
            else {
                findCriteria1.addClass("criteria-matched")
            }
        }

        // has password
        var findCriteria2 = $(passwordCriteria).find('li[dcc-criteria="password"]');
        if (findCriteria2.length > 0) {
            if (!hasPassword) {
                findCriteria2.addClass("criteria-matched")
                meterValue = meterValue + 1;
            }
            else {
                findCriteria2.removeClass("criteria-matched")
                meterValue = meterValue - 1;
            }
        }

        // length matched
        var findCriteria3 = $(passwordCriteria).find('li[dcc-criteria="minimum-length"]');
        if (findCriteria3.length > 0) {
            if (!hasLength) {
                findCriteria3.removeClass("criteria-matched")
            }
            else {
                findCriteria3.addClass("criteria-matched")
            }
        }

        // identical chars
        var findCriteria4 = $(passwordCriteria).find('li[dcc-criteria="identical-chars"]');
        if (findCriteria4.length > 0) {
            if (!hasIdenticalChars) {
                findCriteria4.addClass("criteria-matched")
                meterValue = meterValue + 1;
            }
            else {
                findCriteria4.removeClass("criteria-matched")
                meterValue = meterValue - 1;
            }
        }

        // whitesapce
        var findCriteria5 = $(passwordCriteria).find('li[dcc-criteria="whitespace"]');
        if (findCriteria5.length > 0) {
            if (!hasWhitespace) {
                findCriteria5.addClass("criteria-matched")
                meterValue = meterValue + 1;
            }
            else {
                findCriteria5.removeClass("criteria-matched")
                meterValue = meterValue - 1;
            }
        }


        // set meter value
        var meterMultiplier = (100 / 6);
        var meter = document.getElementsByTagName("meter")[criteria];
        if (meter && meter.matches("meter")) {
            meter.value = meterValue * meterMultiplier;
        }
    }
}

function __validateForm(fields) {
    var validBtn = false;
    var passwordMatch = false;
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#reenterPassword").val()
    $(fields).each(function (i, e) {
        var val = $(fields[i]).val()
        if (typeof val !== "undefined" && val.length > 0) {
            validBtn = true
        }
        else if (!(typeof val !== "undefined" && val.length > 0)) {
            validBtn = false
        }
    });

    if (($("#email_ver_input").length > 0) && validBtn) {
        if ($("#extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes").is(":checked")) {
            validBtn = true
        }
        else if (!($("#extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes").is(":checked"))) {
            validBtn = false
        }

    }

    if (($("#newPassword").length > 0) && ($("#newPassword").length > 0)) {
        if (($("meter:eq(0)").val() == 100) && ($("meter:eq(1)").val() == 100)) { validBtn = true }
        else {
            validBtn = false;
        }
    }


    /* if ($("#newPassword").length > 0 && (newPassword.length >= 8 && newPassword.length <= 50) && (($("meter:eq(0)").val() == 100) && ($("meter:eq(1)").val() == 100)) && (newPassword == confirmPassword)) {
         passwordMatch = true
     }
     else if ($("#newPassword").length > 0 && !((newPassword.length >= 8 && newPassword.length <= 50) && (($("meter:eq(0)").val() == 100) && ($("meter:eq(1)").val() == 100)) && (newPassword == confirmPassword))) {
         passwordMatch = false
     }
     */

    if (validBtn) {
        $("#continue").prop("disabled", false)
        $("#continue").attr("title", "Complete Signup")
    }
    else if (!validBtn) {
        $("#continue").prop("disabled", true)
        $("#continue").attr("title", "Enter required fields to continue")
    }

}