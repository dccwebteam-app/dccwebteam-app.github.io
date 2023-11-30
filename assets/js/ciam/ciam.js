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

        // append HR tag
        var hrTag = document.createElement('hr');
        element.appendChild(hrTag);
    });

})();