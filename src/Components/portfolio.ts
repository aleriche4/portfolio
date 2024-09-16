document.addEventListener("DOMContentLoaded", function() {

////////////////////////////////// INITIALIZATION / HISTORY ///////////////////////////////////

    const portfolioPage = $('#portfolioPage');
    let samples: JQuery<HTMLElement> = $('#samples');
    const overlayContainer: JQuery<HTMLElement> = $('.overlayContainer');

    async function setInitialState() {
        try {
            // Asynchronously load portfolio page content
            await loadPageContent(portfolioPage, 'portfolio.html');
            $('#mainContainer').hide();
            $('#mainContainer').fadeIn(800);
            // Ensure DOM is ready before fading in the content
            $(function () {
                $('#mainContainer').fadeIn(800);
            });
            // Push the initial state to the history
            history.replaceState({ section: 'portfolio' }, 'portfolio', '#portfolio');
            // Set initial state of portfolio button
            $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
        } 
        catch (error) {
            console.error("Error loading portfolio page: ", error);
        }
    }

    async function loadPageContent(page: JQuery<HTMLElement>, url: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            page.load(url, function (response, status, xhr) {
                if (status === "success") {
                    resolve();
                } else {
                    reject(new Error(`Error loading page: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }

    setInitialState();

    const initialSection = window.location.hash.replace('#', '') || 'portfolio';

    // Find the corresponding navigation button and trigger its click handler programmatically
    const initialNavButton = document.querySelector(`.nav-btn[data-name="${initialSection}"]`);
    if (initialNavButton) {
        initialNavButton.dispatchEvent(new Event('touchend'));
    }

    ////////////////////////////////////////// MAIN NAVIGATION & HISTORY //////////////////////////

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
    async function loadPage(section: string, addToHistory = true) {

        const sectionPath: string = `${section}.html`,  // Path to the section's HTML file
            pageId: string = `#${section}Page`,  // Dynamically generate the ID selector for the page
            page = $(pageId);  // Get the page element by ID

            // For testing
            console.log(`Loading page sample from: ${sectionPath}`);

            // Hide all pages first
            $('.pages').fadeOut(400);
            // Check if the section content has not been loaded yet
            if (!pageLoadStatus[section]) {
                // Load the content for the selected section
                try {
                    await loadPageContent(page, sectionPath);
                    pageLoadStatus[section] = true;
                } catch (error) {
                    console.error(`Error loading ${section} page:`, error);
                }
            }
            // After fade-out is complete, fade in the selected section
            $('.pages').promise().done(function () {
                // Reset the scroll position to the top
                window.scrollTo(0, 0);
                page.fadeIn(500);
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

    //////////////////////////////////// HISTORY MANAGEMENT ///////////////////////////////////


    // Event listener for browser back/forward buttons
    window.onpopstate = async function (event) {
        if (event.state) {
            const section = event.state.section || event.state.sample;
            if (section) {
                if (event.state.sample) {
                    // Handle sample state
                    await loadSample(`samples/${section}.html`, false);
                    samples.fadeIn(600);
                    document.body.style.overflowY = 'hidden';
                    // bindCloseEvent();
                    // **IMPORTANT**: Reattach the close button event listener here
                    $('.overlayContainer').on('click touchend', function (event) {
                        if ($(event.target).hasClass('closeBtn')) {
                            triggerEvent();
                        } else {
                            triggerEvent();
                        }
                    });
                } else {
                    // Handle section state
                    $('.nav-btn').removeClass('active').prop('disabled', false);
                    $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
                    await loadPage(section, false);

                    // If a sample is open, close it when navigating to a different section
                    if (samples.is(':visible')) {
                        triggerEvent();
                    }
                }
            }
        }
    };

    // window.onpopstate = async function (event) {
    //     if (event.state) {
    //         if (event.state.section) {
    //             const section = event.state.section;
    //             // Update the navigation button states
    //             $('.nav-btn').removeClass('active').prop('disabled', false);
    //             $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
    //             await loadPage(section, false); // Load page without adding to history
    //             // If a sample is open, close it when navigating to a different section
    //             if (samples.is(':visible')) {
    //                 triggerEvent(); // Close the sample page
    //             }
    //         } else if (event.state.sample) {
    //             const sampleName = event.state.sample,
    //                 samplePath = samples/${sampleName}.html;
    //             try {
    //                 // Load the page corresponding to the history state
    //                 await loadSample(samplePath, false); // Load sample without adding to history
    //                 samples.fadeIn(600);
    //                 document.body.style.overflowY = 'hidden';

    //                 // **IMPORTANT**: Reattach the close button event listener here
    //                 $('.overlayContainer').on('click touchend', function (event) {
    //                     if ($(event.target).hasClass('closeBtn')) {
    //                         triggerEvent();
    //                     } else {
    //                         triggerEvent();
    //                     }
    //                 });

    //             } catch (error) {
    //                 console.error(Error loading sample: ${error});
    //             }
    //         }
    //     } else {
    //         // If no state is present, close any open sample page
    //         if (samples.is(':visible')) {
    //             triggerEvent(); // Close the sample page
    //         }
    //     }
    // };

    ///////////////////////////////// LOADING SAMPLES / HISTORY //////////////////////////////////

    // let samples: JQuery<HTMLElement> = $('#samples');

    // const overlayContainer: JQuery<HTMLElement> = $('.overlayContainer');


    // function debugScrollContainer() {
        // const overlayContainer: JQuery<HTMLElement> = $('.overlayContainer');
        // console.log("overlayContainer element visibility:", overlayContainer.is(':visible'));
        // console.log("overlayContainer element height:", overlayContainer.height());
        // console.log("overlayContainer element scrollHeight:", overlayContainer[0].scrollHeight);
        // console.log("overlayContainer element scrollTop:", overlayContainer.scrollTop());
        // overlayContainer.scrollTop(0);  
        
        // overlayContainer.css('display', 'none');
        // overlayContainer[0].offsetHeight; // Trigger reflow
        // overlayContainer.css('display', '');
        // overlayContainer.scrollTop(0);

    // }

 
    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    if (addToHistory) {
                        // Extract the sample name from the path (assuming it follows 'samples/sampleName.html')
                        const sampleName = samplePath.split('/').pop()?.replace('.html', '');
                        // Push the state to the history
                        history.pushState({ sample: sampleName }, sampleName || '', `#sample-${sampleName}`);
                    }
                    // Debug container size and scroll position
                    // debugScrollContainer(overlayContainer);
                    // $('.overlayContainer').scrollTop(0);
                    // overlayContainer.scrollTop(0);

                    // setTimeout(() => {
                    //     debugScrollContainer();
                    // }, 100); // Small delay to ensure scroll position is applied

                    resolve();
                } else {
                    reject(new Error(`Error loading sample: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }

    // Closing the sample page
    async function triggerEvent(): Promise<void> {
        // history.pushState(null, '', "/dev/#portfolio");
        // history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto';
            // history.pushState({ section: 'portfolio' }, '', '');
            // history.replaceState({ section: 'portfolio' }, 'portfolio', '#portfolio');
            // if (history.state?.section !== 'portfolio') {
                // console.log("______________________ " + history.state.section)
                // history.replaceState(null, '', '#portfolio');
            // }

            // resolve();
        });
    }

    // from parents
    $(document).on('click touchend', '.buttonSample', async function () {
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";
        // For testing
        console.log(`Loading page sample from: ${samplePath}`);
        try {
            await loadSample(samplePath);
            samples.fadeIn(600);
            // Hide the main scroller
            document.body.style.overflowY = 'hidden';
            // history.pushState(null, '', window.location.pathname + window.location.search);
            // Set up the close button event
            $('.overlayContainer').on('click touchend', function (event) {
                // Determine if the click was on .closeBtn
                if ($(event.target).hasClass('closeBtn')) {
                    triggerEvent();
                } else {
                    triggerEvent();
                }
            });
        } 
        catch (error) {
            console.error(error);
        }
    });
});