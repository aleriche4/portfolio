/*jslint browser:true*/
/*global $, jQuery*/
// $(document).ready(function () {
// document.addEventListener("DOMContentLoaded", function main() {
    // console.log("DOM fully loaded and parsed");
    // "use strict";

// function onReady(callback: () => void): void {
//     if (document.readyState !== 'loading') {
//         callback();
//     } else {
//         document.addEventListener('DOMContentLoaded', callback);
//     }
// }

    // let samples = $('#samples'),
    //     linkSample = $('.buttonSample');

    // let samples: JQuery<HTMLElement> = $('#samples'),
    //     linkSample: JQuery<HTMLElement> = $('.buttonSample');

    // SAMPLES
    // linkSample.on('click touchend', function () {
    //     let samplePath = 'samples/' + $(this).data('name') + ".html";
    //     console.log("samplePath = " + samplePath);

       //samples.load(samplePath, function (responseTxt, statusTxt, xhr) { // function (responseTxt, statusTxt, xhr) {
    //         if (statusTxt === "success") {
    //             samples.fadeIn(500);
    //             document.body.style.overflowY = 'hidden';
    //             $('.close').on('click touchend', function () {
    //                 samples.fadeOut(600);
    //                 setTimeout(() => {
    //                     document.body.style.overflowY = 'scroll';
    //                 }, 600);
    //             });
    //         }
    //     });
    // });
    //document.removeEventListener("DOMContentLoaded", main);
//}); 
document.addEventListener("DOMContentLoaded", function() {

    let samples = $('#samples'),
        linkSample = $('.buttonSample');

    linkSample.on('click touchend', function () {
        let samplePath = 'samples/' + $(this).data('name') + ".html";
        console.log("samplePath = " + samplePath);

        samples.load(samplePath, function(responseTxt, statusTxt, xhr) {
            if (statusTxt === "success") {
                samples.fadeIn(500);
                document.body.style.overflowY = 'hidden';

                $('.close').on('click touchend', function() {
                    samples.fadeOut(600);
                    setTimeout(() => {
                        document.body.style.overflowY = 'auto'; // Change to 'auto' for better scrollbar behavior
                    }, 600);
                });
            } else if (statusTxt === "error") {
                console.error("Error loading the file: " + xhr.status + " " + xhr.statusText);
            }
        });
    });

    let contentArea = $('#content-area');

    // Attach event listener to all navigation buttons
    $('.nav-btn').on('click touchend', function () {
      let $thisNavButton = $(this);  // Reference the clicked button
      
      // Disable the clicked button
      $thisNavButton.prop('disabled', true);

      // Load corresponding content (this example assumes loading different sections)
      let section = $thisNavButton.data('section');
      let sectionPath = 'sections/' + section + ".html";  // Assuming different sections have their own HTML files

      console.log("Loading section: " + sectionPath);

      contentArea.load(sectionPath, function (responseTxt, statusTxt, xhr) {
        if (statusTxt === "success") {
          contentArea.fadeIn(500);
          $('.close-content').show();  // Show the close button
          document.body.style.overflowY = 'hidden';  // Disable scroll when content is shown

          // Disable further interaction with the current section button
          $thisNavButton.prop('disabled', true);
        }
      });

      // Close functionality for the loaded content
      $('.close-content').on('click touchend', function () {
        contentArea.fadeOut(600);
        setTimeout(() => {
          document.body.style.overflowY = 'scroll';  // Enable scroll after content is hidden
          $('.close-content').hide();  // Hide the close button

          // Re-enable all navigation buttons after content is closed
          $thisNavButton.prop('disabled', false);
        }, 600);
      });
    });
});



