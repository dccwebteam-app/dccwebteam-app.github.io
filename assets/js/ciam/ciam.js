// Wait for the DOM to be loaded 
(function () {

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
    if (createAccountElement != null) {
        createAccountLink = createAccountElement.href; // get the URL before deleting it 

        if (typeof createAccountLink !== "undefined") {
            // append to it's new position
            var newLinkPosition = '<a id="createAccount" href="' + createAccountLink + '" class="action-button gainsboro-action-button">Sign up now</a>';

            var create_elements = document.querySelectorAll('.create');
            create_elements.forEach(function (element) {
                element.innerHTML = newLinkPosition;
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


    // Find all elements with the given class
    var parentElements = document.querySelectorAll(`.attrEntry`);

    // Iterate through each element and append the span inside the label
    parentElements.forEach(function (parentElement) {
        var labelElement = parentElement.querySelector('label');

        var nearestAnchor = labelElement.closest("a.helpLink");
        if (nearestAnchor) {
            spanElement.setAttribute('aria-label', nearestAnchor.getAttribute("data-help"));
        }

        labelElement.appendChild(spanElement.cloneNode(true)); // Use cloneNode to append a copy to each label
    });

    // Find all elements with the given class
    var parentElements = document.querySelectorAll(`.attrEntry`);

    // Iterate through each element and append the span inside the label
    parentElements.forEach(function (parentElement) {
        var labelElement = parentElement.querySelector('span');
        labelElement.appendChild(iElement.cloneNode(true)); // Use cloneNode to append a copy to each label
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

    document.addEventListener("keyup", function (event) {
        console.log(event)
        if (event.target && event.target.matches("input[type='password']")) {
            var password = event.target.value;

            var hasNumber = /^(?=.*[0-9])/.test(password);
            var hasUppercase = /^(?=.*[A-Z])/.test(password);
            var hasLowercase = /^(?=.*[a-z])/.test(password);
            var hasSpecialChar = /^(?=.*[\W])/.test(password);
            var hasLength = /^(?=.{8,})/.test(password);

            var meterValue = (hasNumber + hasLowercase + hasUppercase + hasLength + hasSpecialChar) * 20;

            var meter = document.getElementsByTagName("meter")[0];
            if (meter && meter.matches("meter")) {
                meter.value = meterValue;
            }
        }
    });


})();