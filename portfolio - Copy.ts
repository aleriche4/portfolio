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

    const portfolioPage = $('#portfolioPage');

//////////////////////////////////////////////// OPENING /////////////////////////////////////

    function setInitialState() {
        // Load portfolio page content and handle errors
        portfolioPage.load( "portfolio.html", function(response, status, xhr) {
            if (status === "error") {
                console.error("Error loading portfolio page: ", xhr.status, xhr.statusText);
            } else {
                // Hide main container until portfolio content is fully loaded
                $('#mainContainer').hide();
                // Ensure DOM is ready before fading in the content
                $(function () {
                    $('#mainContainer').fadeIn(600);
                });
            }
        });
        // Set initial state of portfolio button
        $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
    }

    setInitialState();

    //////////////////////////////////////////////// MAIN NAVIGATION /////////////////////////////

    // Define the page load status type
    type PageLoadStatus = {
        [key: string]: boolean;
    };

    // Initialize the page load status object
    let pageLoadStatus: PageLoadStatus = {
        portfolio: true,
        resume: false,
        projects: false,
    };

    // Function to handle loading and history management
    function loadPage(section: string, addToHistory = true) {
        const sectionPath: string = `${section}.html`,  // Path to the section's HTML file
            pageId: string = `#${section}Page`,  // Dynamically generate the ID selector for the page
            page = $(pageId);  // Get the page element by ID

        // Hide all pages first
        $('.pages').fadeOut(400);

        // Check if the section content has not been loaded yet
        if (!pageLoadStatus[section]) {
            // Load the content for the selected section
            page.load(sectionPath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    pageLoadStatus[section] = true;
                } else {
                    console.error(`Error loading ${section} page:`, xhr.status, xhr.statusText);
                }
            });
        }
        // After fade-out is complete, fade in the selected section
        $('.pages').promise().done(function () {
            page.fadeIn(600);
            document.body.style.overflowY = 'auto'; // Re-enable scrolling after fade-in is complete
        });

        // Optionally lock body scrolling when switching sections
        document.body.style.overflowY = 'hidden';

        // Add the state to the browser history
        if (addToHistory) {
            history.pushState({ section }, section, `#${section}`);
        }
    }

    // Attach event listener to all navigation buttons
    $('.nav-btn').on('click touchend', function () {
        const thisNavButton = $(this),  // Reference the clicked button
            section: string = thisNavButton.data('name');  // Get the section name from data-name attribute

        // Update the active button states
        $('.nav-btn').removeClass('active').prop('disabled', false);
        thisNavButton.addClass('active').prop('disabled', true);

        // Load the page and add it to the history
        loadPage(section);
    });

    // Event listener for browser back/forward buttons
    window.onpopstate = function (event) {
        if (event.state && event.state.section) {
            const section = event.state.section;

            // Update the navigation button states
            $('.nav-btn').removeClass('active').prop('disabled', false);
            $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);

            // Load the page corresponding to the history state
            loadPage(section, false); 
        }
    };

    // Initialize the first page based on the URL hash if available
    // $(document).ready(function () {
    //     const initialSection = window.location.hash.replace('#', '') || 'portfolio';
    //     $('.nav-btn[data-name="' + initialSection + '"]').click(); // Trigger click to load initial section
    // });

    document.addEventListener('DOMContentLoaded', function () {
        const initialSection = window.location.hash.replace('#', '') || 'portfolio';
        
        // Find the corresponding navigation button and trigger its click handler programmatically
        const initialNavButton = document.querySelector(`.nav-btn[data-name="${initialSection}"]`);
        if (initialNavButton) {
            initialNavButton.dispatchEvent(new Event('touchend'));
        }
    });

    //////////////////////////////////////////////// LOADING SAMPLES /////////////////////////////////////

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
});



