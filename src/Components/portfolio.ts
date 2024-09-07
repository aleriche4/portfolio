document.addEventListener("DOMContentLoaded", function() {

//////////////////////////////////////////////// OPENING /////////////////////////////////////

    const portfolioPage = $('#portfolioPage');

    async function setInitialState() {
        try {
            // Asynchronously load portfolio page content
            // await loadPageContent(portfolioPage, 'portfolio.html');
            // $('#mainContainer').hide();

            // Ensure DOM is ready before fading in the content
            $(function () {
                $('#mainContainer').fadeIn(600);
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
    async function loadPage(section: string, addToHistory = true) {
        const sectionPath: string = `${section}.html`,  // Path to the section's HTML file
            pageId: string = `#${section}Page`,  // Dynamically generate the ID selector for the page
            page = $(pageId);  // Get the page element by ID

            // For testing
            // console.log(`Loading page sample from: ${sectionPath}`);

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

    // Event listener for browser back/forward buttons
    window.onpopstate = async function (event) {
        if (event.state && event.state.section) {
            const section = event.state.section;

            // Update the navigation button states
            $('.nav-btn').removeClass('active').prop('disabled', false);
            $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);

            // Load the page corresponding to the history state
            await loadPage(section, false); 
        }
    };

    //////////////////////////////////////////////// LOADING SAMPLES /////////////////////////////////////

    let samples: JQuery<HTMLElement> = $('#samples');

    async function loadSample(samplePath: string) {
        return new Promise<void>((resolve, reject) => {
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    resolve(); // Make sure to resolve the promise
                    // samples.fadeIn(600);
                    // document.body.style.overflowY = 'hidden';
                } else {
                    reject(new Error(`Error loading sample: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }

    // from parents
    $(document).on('click touchend', '.buttonSample', async function () {

        let samplePath: string = 'samples/' + $(this).data('name') + ".html";

        // For testing
            // console.log(`Loading page sample from: ${samplePath}`);
    
        try {
            await loadSample(samplePath);
            samples.fadeIn(600);
            // Hide the main scroller
            document.body.style.overflowY = 'hidden';
    
            // Set up the close button event
            $('.close').off('click touchend').on('click touchend', function () {
                samples.fadeOut(400);
                setTimeout(() => {
                    document.body.style.overflowY = 'auto';
                }, 400);
            });
        } 
        catch (error) {
            console.error(error);
        }
    });
});