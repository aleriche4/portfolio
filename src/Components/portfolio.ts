// import { data } from "jquery";

document.addEventListener("DOMContentLoaded", function() {

    const jsonURL: string = "components/data/data.json", // Replace with your API
        // overlayContainer: JQuery<HTMLElement> = $('.overlayContainer'),
        loader: JQuery<HTMLElement> = $('#loader'),
        samples: JQuery<HTMLElement> = $('#samples');


/////////////////////////////// RENDER PORTFOLIO CONTENTS ///////////////////////////////////

    async function portfolioContent(data: any[]){
        let content: string = "";
        for (let i: number = 0; i < data.length; i++) {
            content += `<section id="${data[i].companyName}">
                <h1>${data[i].companyName}</h1>
                <div class="portfolio">`;
                // if there is a sample section
                if(data[i].sample !== null) {
                    content += `<button class="buttonSample" data-name=${data[i].sample}>samples</button>`;
                }
                content += `<a href="${data[i].link}" target="_blank" rel="external">
                <img class="image" src="images/thumbs/${data[i].imageName}.png" alt="${data[i].companyName} logo" />
                </a>
                <div class="title seen">
                    ${data[i].companyName} <span class="city"> - ${data[i].city}</span>
                </div>
                <div class="title noDisplay">
                    ${data[i].companyName}<span class="city"><br />New York City</span>
                </div>
                <div class="jobContainer">
                    <div class="clear_both"></div>
                    <div class="keys">Position:</div>
                    <div class="jobPosition">${data[i].position}</div>
                    <div class="keys">Applications:</div>
                    <div class="infoText">${data[i].applications}</div>
                    <div class="keys">Technologies:</div>
                    <div class="code">${data[i].technologies}</div>
                    <div class="keys">Achievements:</div>
                    <ul>`;
                    // Looping the bullet contents
                    for (let j: number = 0; j < data[i].achievements.length; j++) {
                        content += `<li>${data[i].achievements[j]}</li>`;
                    }
                    content += `</ul>`
                    // if there is a note content
                    if(data[i].note !== null) {
                        content += `<div class="info">${data[i].note}</div>`
                    }
                    content += `</div>
                </div>
            </section>`
        }  
        // Find the element by ID and check if it exists
        const jsonContentElement = document.getElementById('portfolioContainer');
        if (jsonContentElement) {
            // Insert the content into a DOM element, e.g.:
            jsonContentElement.innerHTML = content;
        } else {
            console.error("Element with id 'portfolioContainer' not found.");
        }
    }


//////////////////////////////////// GET JSON / DATA ////////////////////////////////////////

    // Function to fetch JSON data
    async function getData() {
        try {
            const response = await fetch(jsonURL);
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            const data = await response.json();
            await portfolioContent(data);
        } catch (error: any) {
            console.error(error.message);
        }
    }

/////////////////////////////// AGENT DESKTOP/MOBILE/TABLET ////////////////////////////////////

    // Be able to remove the event of the close background button for mobile and tablet so it won't close after scrolling the section
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
        const deviceType = await getDeviceType();
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

//////////////////////////////// INITIALIZATION ///////////////////////////////////

async function setInitialState() {
    await loadPageContent($('#portfolioPage'), 'portfolio.html');
    await getData(); // Load portfolio data
    await restoreStateOnReload(); // Handle page reload and restore state
    loader.fadeOut(200);
    $('#mainContainer').fadeIn(800);
    history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
    $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
}

    // Call the initialization function when the page loads
    // setInitialState();

    // async function setInitialState() {
    //     // Check for saved section in localStorage (refresh page)
    //     // const lastOpenedSection = localStorage.getItem('lastOpenedSection') || 'portfolio'; // Default to 'portfolio' if none

    //     try {
    //         // Asynchronously load portfolio page content
    //         await loadPageContent($('#portfolioPage'), 'portfolio.html');
    //         await getData();
    //         // $('#mainContainer').hide();
    //         $('#mainContainer').fadeIn(800);
    //         loader.fadeOut(200);

    //         // Push the initial state to the history
    //         // if()
    //         // history.replaceState({ section: `${lastOpenedSection}` }, `${lastOpenedSection}`, `#${lastOpenedSection}`);
    //         history.replaceState({ section: 'portfolio' }, 'portfolio', '#portfolio');
    //         // console.log(`___________ : ${section}`)

    //         // Set initial state of portfolio button
    //         $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);

    //         // Check for saved section in localStorage (refresh page)
            
    //         // Load the saved section
    //         // loadPage(lastOpenedSection, false); // Pass false to avoid adding to history
    //         // console.log(`___________ : ${lastOpenedSection}`)
            
    //     } 
    //     catch (error) {
    //         console.error("Error loading portfolio page: ", error);
    //     }
    // }

    // Call the initialization function when the page loads
    setInitialState();

    const initialSection = window.location.hash.replace('#', '') || 'portfolio';

    // Find the corresponding navigation button and trigger its click handler programmatically
    const initialNavButton = document.querySelector(`.nav-btn[data-name="${initialSection}"]`);
    if (initialNavButton) {
        initialNavButton.dispatchEvent(new Event('touchend'));
    }


//////////////////////////////////// MAIN SECTION /////////////////////////////////////

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

// Function to handle loading and history management
async function loadPage(section: string, addToHistory = true) {

    const sectionPath = `${section}.html`,  // Path to the section's HTML file
        pageId = `#${section}Page`,  // Dynamically generate the ID selector for the page
        page = $(pageId);  // Get the page element by ID

    // For testing
    console.log(`Loading page from: ${sectionPath}`);

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

//////////////////////////////////// GENERAL NAVIGATION //////////////////////////

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

    // Attach event listener to all navigation buttons
    $('.nav-btn').on('click touchend', function () {
        const thisNavButton = $(this),  // Reference the clicked button
            section: string = thisNavButton.data('name');  // Get the section name from data-name attribute

        // Save the current section to localStorage
        localStorage.setItem('lastOpenedSection', section);

        // console.log("______________________2222: " + section);

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

    function closingSample() {
        $('.overlayContainer').on('click touchend', function (event) {
            // Determine if the click was on .closeBtn
            if ($(event.target).hasClass('closeBtn')) {
                samples.fadeOut(400, function () {
                    document.body.style.overflowY = 'auto';
                });
            } else {
                checkDeviceType();
            }
        });
    }


    // from parents
    $(document).on('click touchend', '.buttonSample', async function () {
        loader.fadeIn(200);
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";

        // Save the current section to localStorage
        // localStorage.setItem('lastOpenedSection', section);
        // const sectionID = $(this).data('section-id'); // Assumes the section link has a data attribute for the section ID
        // localStorage.setItem('lastOpenedSection', sectionID); // Save it
        // loadSection(sectionID); // Function to load the section

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

            closingSample();

            // Set up the close button event
            // $('.overlayContainer').on('click touchend', function (event) {
            //     // Determine if the click was on .closeBtn
            //     if ($(event.target).hasClass('closeBtn')) {
            //         triggerEvent();
            //     } else {
            //         checkDeviceType();
            //     }
            // });
        } 
        catch (error) {
            console.error(error);
        }
    });

//////////////////////////////// REFRESH & HISTORY HANDLING //////////////////////////////////

    // Function to restore state from URL hash or history
    async function restoreStateOnReload() {
        const hash = window.location.hash.replace('#', '');

        if (hash.startsWith('sample-')) {
            // Extract the sample name from the URL
            const sampleName = hash.replace('sample-', '');
            const samplePath = `samples/${sampleName}.html`;
            try {
                await loadSample(samplePath, false);  // Don't add to history again
                samples.fadeIn(600);
                document.body.style.overflowY = 'hidden';
                // **IMPORTANT**: Reattach the close button event listener here
                closingSample();
                // $('.overlayContainer').on('click touchend', function (event) {
                //     if ($(event.target).hasClass('closeBtn')) {
                //         triggerEvent();
                //     } else {
                //         checkDeviceType();
                //     }
                // });
            } catch (error) {
                console.error(`Error loading sample from URL: ${error}`);
            }
        } else if (hash) {
            // Handle section navigation
            await loadPage(hash);
        } else {
            // Default section (portfolio)
            await loadPage('portfolio');
        }
    }

    // Handle browser back/forward button (popstate)
    window.onpopstate = async function (event: any) {
        if (event.state) {
            const section = event.state.section || event.state.sample;
            if (event.state.sample) {
                await loadSample(`samples/${section}.html`, false);
                samples.fadeIn(600);
                document.body.style.overflowY = 'hidden';
                // // **IMPORTANT**: Reattach the close button event listener here
                closingSample();
                // $('.overlayContainer').on('click touchend', function (event) {
                //     if ($(event.target).hasClass('closeBtn')) {
                //         triggerEvent();
                //     } else { 
                //         checkDeviceType();
                //     }
                // });
            } else {
                await loadPage(section, false);
                if (samples.is(':visible')) {
                    triggerEvent();
                }
                // Handle section button state
                $('.nav-btn').removeClass('active').prop('disabled', false);
                $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
            }
        }
    };
    
    // Event listener for browser back/forward buttons
    // window.onpopstate = async function (event: any) {
    //     if (event.state) {
    //         const section = event.state.section || event.state.sample;
    //         if (section) {
    //             if (event.state.sample) {
    //                 // Handle sample state
    //                 await loadSample(`samples/${section}.html`, false);
    //                 samples.fadeIn(600);
    //                 document.body.style.overflowY = 'hidden';
    //                 // **IMPORTANT**: Reattach the close button event listener here
    //                 $('.overlayContainer').on('click touchend', function (event) {
    //                     if ($(event.target).hasClass('closeBtn')) {
    //                         triggerEvent();
    //                     } else {
    //                         checkDeviceType();
    //                     }
    //                 });
    //             } else {
    //                 // Handle section state
    //                 $('.nav-btn').removeClass('active').prop('disabled', false);
    //                 $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
    //                 await loadPage(section, false);

    //                 // If a sample is open, close it when navigating to a different section
    //                 if (samples.is(':visible')) {
    //                     triggerEvent();
    //                 }
    //             }
    //         }
    //     }
    // };

///////////////////////////// LOADING SAMPLES //////////////////////////////////
 
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
                    samples.fadeIn(600);
                    resolve();
                } else {
                    reject(new Error(`Error loading sample: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }

    ///////////////////////////// CLOSING SAMPLES //////////////////////////////////

    // Closing the sample page
    async function triggerEvent() {
        
       // $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
        
        // history.pushState(null, '', "/dev/#portfolio");
        // history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto';
            history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');

        // $('.overlayContainer').on('click touchend', function (event) {
        //     if ($(event.target).hasClass('closeBtn')) {
        //         triggerEvent();
        //     } else {
        //         checkDeviceType();
        //     }
        // });
            // history.pushState({ section: 'portfolio' }, '', '');
            // history.replaceState({ section: 'portfolio' }, 'portfolio', '#portfolio');
            // if (history.state?.section !== 'portfolio') {
                // console.log("______________________ " + history.state.section)
                // history.replaceState(null, '', '#portfolio');
            // }

            // resolve();
        });
        
    }

    
});