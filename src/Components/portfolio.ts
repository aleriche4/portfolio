document.addEventListener("DOMContentLoaded", function() {

////////////////////////////////// INITIALIZATION / HISTORY ///////////////////////////////////

    // Define the structure of the data you're expecting
    interface ApiData {
        name: string;
        value: string | number;  // Modify this based on your actual data
    }

    const portfolioPage = $('#portfolioPage'),
        apiEndpoint = "data/data.json", // Replace with your API
        overlayContainer: JQuery<HTMLElement> = $('.overlayContainer'),
        loader: JQuery<HTMLElement> = $('#loader'),
        samples: JQuery<HTMLElement> = $('#samples');


    fetch(apiEndpoint)
    .then((response: Response): Promise<ApiData[]> => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json(); // This is now Promise<ApiData[]>
    })
    .then((data: ApiData[]): void => {

        // Processing the fetched JSON data
        const contentDiv = document.getElementById('json-content');
        if (contentDiv) {
            contentDiv.innerHTML = formatData(data);
        } else {
            console.error("Element with id 'json-content' not found.");
        }
    })
    .catch((error: Error): void => {
        console.error('Fetch error:', error);
        const contentDiv = document.getElementById('json-content');
        if (contentDiv) {
            contentDiv.textContent = 'Error loading data';
        }
    });

    // Helper function to format JSON data with type annotations
    function formatData(data: ApiData[]): string {
        let content = '<ul>';
        data.forEach(item => {
            content += `<li>${item.name}: ${item.value}</li>`;  // Customize based on your data structure
        });
        content += '</ul>';
        return content;
    }




    async function setInitialState() {
        try {
            // Asynchronously load portfolio page content
            await loadPageContent(portfolioPage, 'portfolio.html');
            // $('#mainContainer').hide();
            $('#mainContainer').fadeIn(800);
            loader.fadeOut(200);
            // Ensure DOM is ready before fading in the content
            // $(function () {
            //     $('#mainContainer').fadeIn(800);
            // });
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

    //////////////////////////////////// MAIN NAVIGATION & HISTORY //////////////////////////

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
        // console.log(`Loading page from: ${sectionPath}`);

        // Hide all pages first
        $('.pages').fadeOut(400);
        // Check if the section content has not been loaded yet
        if (!pageLoadStatus[section]) {
            loader.fadeIn(200);
            // Load the content for the selected section
            try {
                await loadPageContent(page, sectionPath);
                loader.fadeOut(200);
                pageLoadStatus[section] = true;
            } catch (error) {
                // console.error(`Error loading ${section} page:`, error);
                console.log(`Error loading ${section} page:`, error);
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

    // Detect with agent if it's a mobile, tablet or desktop
    // function isMobileDevice() {
    //     return /Mobi|Android/i.test(navigator.userAgent) || window.matchMedia("only screen and (max-width: 768px)").matches;
    // }

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
                            checkDeviceType();
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

    ///////////////////////////// LOADING SAMPLES / HISTORY //////////////////////////////////
 
    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.hide();
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    if (addToHistory) {
                        // Extract the sample name from the path (assuming it follows 'samples/sampleName.html')
                        const sampleName = samplePath.split('/').pop()?.replace('.html', '');
                        // Push the state to the history
                        history.pushState({ sample: sampleName }, sampleName || '', `#sample-${sampleName}`);
                    }
                    // $('.overlayContainer')[0].offsetHeight;
                    // $('.overlayContainer').scrollTop(0);
                    samples.fadeIn(600);

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
    async function triggerEvent() {
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

    //////////////////////////////////////// AGENT //////////////////////////////////////////

    async function getDeviceType(): Promise<"mobile" | "tablet" | "desktop"> {

        const userAgent = navigator.userAgent;
    
        if (/Mobi|Android/i.test(userAgent)) {
            return 'mobile';
        } else if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) /*|| window.matchMedia("only screen and (min-width: 480px) and (max-width: 709px)").matches)*/ {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    async function checkDeviceType() {

        const deviceType = await getDeviceType(); // Use await here
    
        if (deviceType === 'mobile') {
            $('.overlayContainer').css("cursor: auto;");
            console.log('This is a mobile device.');
        } else if (deviceType === 'tablet') {
            $('.overlayContainer').css("cursor: auto;");
            console.log('This is a tablet device.');
        } else {
            triggerEvent();
            console.log('This is a desktop device.');
        }
    }
    

    // from parents
    $(document).on('click touchend', '.buttonSample', async function () {
        loader.fadeIn(200);
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";
        // For testing
        console.log(`Loading page sample from: ${samplePath}`);
        try {
            await loadSample(samplePath);
            loader.fadeOut(200);
            // alert($('.overlayContainer').scrollTop());
            $('.overlayContainer').scrollTop(0),
            // Hide the main scroller
            document.body.style.overflowY = 'hidden';
            // history.pushState(null, '', window.location.pathname + window.location.search);
            // Set up the close button event
            $('.overlayContainer').on('click touchend', function (event) {
                // Determine if the click was on .closeBtn
                if ($(event.target).hasClass('closeBtn')) {
                    triggerEvent();
                } else {
                    checkDeviceType();
                }
            });
        } 
        catch (error) {
            console.error(error);
        }
    });
});