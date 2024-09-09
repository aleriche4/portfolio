document.addEventListener("DOMContentLoaded", function() {

////////////////////////////////// INITIALIZATION / HISTORY ///////////////////////////////////

    const portfolioPage = $('#portfolioPage');

    async function setInitialState() {
        try {
            // Asynchronously load portfolio page content
            await loadPageContent(portfolioPage, 'portfolio.html');
            $('#mainContainer').hide();
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

    ////////////////////////////////////////// MAIN NAVIGATION / HISTORY //////////////////////////

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
            if (event.state.section) {
                const section = event.state.section;
                // Update the navigation button states
                $('.nav-btn').removeClass('active').prop('disabled', false);
                $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
                await loadPage(section, false); // Load page without adding to history
                // If a sample is open, close it when navigating to a different section
                if (samples.is(':visible')) {
                    triggerEvent(); // Close the sample page
                }
            } else if (event.state.sample) {
                const sampleName = event.state.sample,
                    samplePath = `samples/${sampleName}.html`;
                try {
                    // Load the page corresponding to the history state
                    await loadSample(samplePath, false); // Load sample without adding to history
                    samples.fadeIn(600);
                    document.body.style.overflowY = 'hidden';
                } catch (error) {
                    console.error(`Error loading sample: ${error}`);
                }
            }
        }
    };

    ///////////////////////////////// LOADING SAMPLES / HISTORY //////////////////////////////////

    let samples: JQuery<HTMLElement> = $('#samples'),
        overlayContainer: JQuery<HTMLElement> = $('.overlayContainer');

    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    // let overlayContainer: JQuery(HTMLElement) = $('.overlayContainer');
                    // alert(overlayContainer);
                    // const sampleElement = overlayContainer.get(0);
                    // if (sampleElement) {
                    //     sampleElement.scrollTo(0, 0); // Reset scroll position to top
                    //     alert(sampleElement);
                    // }
                    // overlayContainer.scrollTop(0);
                    // console.log("Sample loaded successfully.");
                    // samples.hide(); // Hide the sample container first
                    // samples.scrollTop(0); // Reset scroll position to top
                    // overlayContainer.scrollTop(0);
                    // console.log("Scroll position reset.");


                    if (addToHistory) {
                        // Extract the sample name from the path (assuming it follows 'samples/sampleName.html')
                        const sampleName = samplePath.split('/').pop()?.replace('.html', '');
                        // Push the state to the history
                        history.pushState({ sample: sampleName }, sampleName || '', `#sample-${sampleName}`);
                    }
                    // Reset scroll position to top of the sample container
                    // samples.scrollTop(0);
                    resolve(); // Make sure to resolve the promise
                    // samples.fadeIn(600);
                    // document.body.style.overflowY = 'hidden';
                } else {
                    reject(new Error(`Error loading sample: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }

    // Closing the sample page
    async function triggerEvent() {
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto'; // Re-enable the main page's scroll
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