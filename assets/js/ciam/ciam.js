// Wait for the DOM to be loaded 
var passwordStrength = 0;
var passwordMatched = false;
var wait_seconds = 5;
(function () {

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
        sendCodeElement.className = "action-button gainsboro-action-button";
    }
    var verifyCodeElement = document.getElementsByClassName("verifyCode")[0];
    if (verifyCodeElement) {
        verifyCodeElement.className = "action-button gainsboro-action-button";
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
                var labelAbove = findLabelAbove(link);
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
        if (event.target && event.target.id == "newPassword") {
            var password = event.target.value;
            var hasNumber = /^(?=.*[0-9])/.test(password);
            var hasUppercase = /^(?=.*[A-Z])/.test(password);
            var hasPassword = /password/i.test(password);
            var hasLength = /^(?=.{8,})/.test(password);
            var hasIdenticalChars = /(.)\1\1/.test(password);
            var meterValue = hasNumber + hasUppercase + hasLength;
            meterValue = meterValue + hasPassword;
            meterValue = meterValue + hasIdenticalChars;

            // strike through matched criteria
            var passwordCriteria = document.getElementsByClassName("criteria")[0];
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

            // set meter value
            var meter = document.getElementsByTagName("meter")[0];
            if (meter && meter.matches("meter")) {
                meter.value = meterValue * 20;
            }


        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.target && event.target.id == "reenterPassword") {
            var password = event.target.value;
            var hasNumber = /^(?=.*[0-9])/.test(password);
            var hasUppercase = /^(?=.*[A-Z])/.test(password);
            var hasPassword = /password/i.test(password);
            var hasLength = /^(?=.{8,})/.test(password);
            var hasIdenticalChars = /(.)\1\1/.test(password);
            var meterValue = hasNumber + hasUppercase + hasLength;
            meterValue = meterValue + hasPassword;
            meterValue = meterValue + hasIdenticalChars;

            // strike through matched criteria
            var passwordCriteria = document.getElementsByClassName("criteria")[1];
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

            // set meter value
            var meter = document.getElementsByTagName("meter")[1];
            if (meter && meter.matches("meter")) {
                meter.value = meterValue * 20;

            }


        }
    });
    // Function to find the label above the given element and to append the hint attribute
    function findLabelAbove(element) {
        var previousSibling = element.previousElementSibling;
        while (previousSibling) {
            if (previousSibling.tagName === 'LABEL') {
                return previousSibling;
            }
            previousSibling = previousSibling.previousElementSibling;
        }
        return null; // Return null if no label is found
    }

    //diable form autocomplete
    var form = document.getElementById('attributeVerification');
    if (form) {
        var textInputs = form.getElementsByTagName('input');
        for (var i = 0; i < textInputs.length; i++) {
            textInputs[i].autocomplete = 'off';
        }
    }

    // apply custom css
    var emailVerificationError = document.getElementById("emailVerificationControl_error_message")
    var emailVerificationSuccess = document.getElementById("emailVerificationControl_success_message")

    if ($("#attributeVerification").length > 0) {

        var email_info_html = $("#email_info").html();
        var email_success_html = $("#email_success").html();
        var email_fail_retry = $("#email_fail_retry").html();
        var email_fail_no_retry = $("#email_fail_no_retry").html();

        var email_fail_throttled = $("#email_fail_throttled").html();
        var email_fail_code_expired = $("#email_fail_code_expired").html();
        var email_fail_server = $("#email_fail_server").html();
        var email_incorrect_format = $("#email_incorrect_format").html();

        setInterval(function () {


            if (("#email_ver_wait").length > 0) {
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
                if (!($("#email_success").css("display") == "none")) {
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




        }, 100);
    }


    setInterval(function () {

        if (emailVerificationError) {
            if (!($("#emailVerificationControl_error_message").css("display") == "none")) {
                emailVerificationError.parentElement.classList.add("dcc-alert", "dcc-alert-danger")
                emailVerificationError.innerHTML = "<span>" + emailVerificationError.innerHTML + "</span>"
            }
            else {
                emailVerificationError.parentElement.classList.remove("dcc-alert", "dcc-alert-danger")
                emailVerificationError.innerHTML = ""
            }
        }

        // email verification from forgot password 
        if (emailVerificationSuccess) {
            if (!($("#emailVerificationControl_success_message").css("display") == "none")) {
                emailVerificationSuccess.classList.add("dcc-alert", "dcc-alert-success")
                emailVerificationSuccess.innerHTML = "<span>" + emailVerificationSuccess.innerHTML + "</span>"
            }
            else {
                emailVerificationSuccess.classList.remove("dcc-alert", "dcc-alert-success")
                emailVerificationSuccess.innerHTML = ""
            }
        }

    }, 10000);


    /*   var createAccount = document.getElementById("continue");
       if (createAccount) {
           createAccount.disabled = "true";
       }
       setInterval(function () {
           // button styles 
           var changeClaims = document.getElementById("SignupEmailVerificationControl_but_change_claims")
           var emailVerificationChangeClaims = document.getElementById("emailVerificationControl_but_change_claims")
           var newPassword = document.getElementById("newPassword")
   
           if (changeClaims) {
               if ($("#SignupEmailVerificationControl_but_change_claims").css("display") == "block") {
                   if (createAccount && ($("#newPassword").val() !== "") && ($("#newPassword").val() == $("#reenterPassword").val()) && ($("meter:eq(0)").val() == 100 && $("meter:eq(1)").val() == 100)) {
                       $("#continue").attr("disabled", false);
                   }
                   else {
                       $("#continue").attr("disabled", true);
                   }
               }
           }
   
           else if (emailVerificationChangeClaims || newPassword) {
               console.log("1")
               if (($("#emailVerificationControl_but_change_claims").length > 0 && $("#emailVerificationControl_but_change_claims").css("display") == "block") || newPassword) {
                   console.log("2")
                   if (createAccount && !newPassword) {
                       $("#continue").attr("disabled", false);
                       console.log("3")
                   }
                   else if (createAccount && newPassword && ($("#newPassword").val() !== "") && ($("#newPassword").val() == $("#reenterPassword").val()) && ($("meter:eq(0)").val() == 100 && $("meter:eq(1)").val() == 100)) {
                       $("#continue").attr("disabled", false);
                       console.log("4")
                       console.log($("#newPassword").val())
                       console.log($("#reenterPassword").val())
                   }
                   else {
                       $("#continue").attr("disabled", true);
                       console.log("5")
                   }
               }
           }
   
       }, 1000);
   */

    // update T&c's text t oanchor and link it
    var termsOfUseConsentChoice = document.getElementById('extension_termsOfUseConsentChoice_label');
    if (termsOfUseConsentChoice) {
        var content = termsOfUseConsentChoice.innerHTML;
        if (content.includes('Terms and Conditions')) {
            var modifiedContent = content.replace(/(\Terms and Conditions\b)/gi, '<a href="https://www.dunedin.govt.nz/about-this-site/privacy-policy" title="Dunedin City Council Terms and Conditions" target="_blank">$1</span>');
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
    $(".newPassword, .reenterPassword").append("<i class='passwordReveal'></i>")
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
            element.setCustomValidity("Password must be 8 characters long")
        }
        else if (element && $("#" + target).val().length >= 8) {
            element.setCustomValidity("")
        }
        else if (element && $("#" + target).val().length < 8) {
            element.setCustomValidity("Password must be 8 characters long")
        }

    }


    $("input[type='password']").each(function () {
        var elem = $(this).attr("id")
        setCustomPasswordValidation(elem, "yes")
    })

    $("input[type='password']").keyup(function () {
        var elem = $(this).attr("id")
        setCustomPasswordValidation(elem)
    })


    // add button classes
    $(".sendButton").addClass("green-action-button")
    $(".verifyButton").addClass("green-action-button")
    $(".editButton").addClass("haze-action-button")

    $("#email_ver_but_send").css("margin-left", "auto")
    $("#email_ver_but_send").css("margin-right", "auto")
    $("#email_ver_but_send").css("max-width", "180px")
    $(".buttons.verify").css("width", "100%")

    var verification_code = "";
    setInterval(function () {
        if ($("#email_ver_input_label").css("display") != "none") {


            // implement verification code style
            var verification_code_html = ` <div class="verification-code-container">
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
    <div class="verification-code-box"> <input type="text" maxlength="1" class="verification-code-input" /> </div>
</div>`;

            if ($(".verification-code-container").length === 0) {
                $(verification_code_html).insertBefore('.buttons.verify');
                $('.verification-code-input').on('input', function () {
                    var $this = $(this);
                    verification_code = verification_code + $this.val();
                    $("#email_ver_input").val(verification_code)
                    console.log(verification_code)
                    // Delay the execution to allow the value to be updated after paste
                    setTimeout(function () {
                        if ($this.val().length === 1) {
                            $this.closest('.verification-code-box').next().find('.verification-code-input').focus();
                        }

                        if ($this.val().length === 0) {
                            $this.closest('.verification-code-box').prev().find('.verification-code-input').focus();
                        }
                    }, 0);
                });
                // apply new code threshold
                newCodeWaitTime();
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
    $("#email_ver_wait").html(email_ver_wait_html)

    //lient side validation
    signInName


})();

function newCodeWaitTime(setup = false) {
        $("#email_ver_but_resend").prop('disabled', true);
        var countdown = 15;
        $('#email_ver_but_resend').text("Please wait for " + countdown + " seconds");
        var countdownInterval = setInterval(function () {
            countdown--;
            $('#email_ver_but_resend').text("Please wait for " + countdown + " seconds");
            if (countdown <= 0) {
                $('#email_ver_but_resend').prop('disabled', false);
                clearInterval(countdownInterval);
                $('#email_ver_but_resend').text("Send new code");
            }
        }, 1000);
}
