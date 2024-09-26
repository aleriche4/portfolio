document.addEventListener("DOMContentLoaded", function() {

    const jsonURL: string = "components/data/data.json", // Replace with your API
        loader: JQuery<HTMLElement> = $('#loader'),
        samples: JQuery<HTMLElement> = $('#samples');
    let changingSection: Boolean = true,
        footer: JQuery<HTMLElement> = $('#footer');


/////////////////////////////// RENDER PORTFOLIO CONTENTS ///////////////////////////////////

    async function portfolioContent(data: any[]){
        let content: string = "";
        for (let i: number = 0; i < data.length; i++) {
            content += `<section id="${data[i].companyName}">
                <h1>${data[i].companyName}</h1>
                <div class="portfolio">`;
                if(data[i].sample !== null) { // if there is a sample section
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
                    for (let j: number = 0; j < data[i].achievements.length; j++) { // Looping the bullet contents
                        content += `<li>${data[i].achievements[j]}</li>`;
                    }
                    content += `</ul>`
                    if(data[i].note !== null) { // if there is a note content
                        content += `<div class="info">${data[i].note}</div>`
                    }
                    content += `</div>
                </div>
            </section>`
        }  

        // Find the element by ID and check if it exists
        const jsonContentElement = document.getElementById('portfolioContainer');
        if (jsonContentElement) {
            jsonContentElement.innerHTML = content; // Insert the content into a DOM element, e.g.:
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

    // async function setInitialState() {
    //     await loadPageContent($('#portfolioPage'), 'portfolio.html');
    //     await getData(); // Load portfolio data
    //     await restoreStateOnReload(); // Handle page reload and restore state
    //     loader.fadeOut(200);
    //     $('#mainContainer').fadeIn(800);
    //     history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
    //     $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
    // }

    async function setInitialState() {
        const hash = window.location.hash.replace('#', ''); // Get the current hash from the URL
        if (hash && hash !== 'portfolio') {
            // await loadPage(hash, false); // Load the corresponding section, without adding to history
            // $(`.nav-btn[data-name="${hash}"]`).addClass('active').prop('disabled', true);
            console.log(`____HASH : ${hash}`)
            // await loadPage(hash, false);
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            // await loadPageContent($(`#${hash}`), `${hash}.html`);
            // $(`.nav-btn[data-name="${hash}"]`).addClass('active').prop('disabled', true);
            // history.pushState({ section: hash }, hash, `#${hash}`);
        } else {
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
            history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
        }
        // await loadPageContent($('#portfolioPage'), 'portfolio.html');
        await getData(); // Load portfolio data
        await restoreStateOnReload(); // Handle page reload and restore state
        loader.fadeOut(200);
        $('#mainContainer').fadeIn(800);
        $('#footer').fadeIn(800);
        // history.pushState({ section: `'portfolio'` }, 'portfolio', '#portfolio');
    }

    // async function setInitialState() {
    //     await getData(); // Load portfolio data
    //     const hash = window.location.hash.replace('#', ''); // Get the current hash from the URL
    //     if (hash && hash !== 'portfolio') {
    //         await loadPage(hash, false); // Load the corresponding section, without adding to history
    //         $(`.nav-btn[data-name="${hash}"]`).addClass('active').prop('disabled', true);
    //     } else {
    //         await loadPage('portfolio', false); // Default to portfolio if no hash or portfolio is present
    //         $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
    //     }
    //     loader.fadeOut(200);
    //     $('#mainContainer').fadeIn(800);
    // }

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
        page = $(pageId);  // Get the page element by ID // For testing

    console.log(`Loading page from: ${sectionPath}`);
    if(changingSection) {
        $('.pages').fadeOut(400); // Hide all pages first
        $('#footer').fadeOut(400);
    }
    if (!pageLoadStatus[section]) { // Check if the section content has not been loaded yet
        loader.fadeIn(200);
        try {
            await loadPageContent(page, sectionPath);
            loader.fadeOut(200);
            pageLoadStatus[section] = true;
        } catch (error) {
            console.log(`Error loading ${section} page:`, error); // console.error(`Error loading ${section} page:`, error);
        }
    }
    $('.pages').promise().done(function () { // After fade-out is complete, fade in the selected section
        if(changingSection) window.scrollTo(0, 0);
        page.fadeIn(500);
        $('#footer').fadeIn(500);
        document.body.style.overflowY = 'auto';
        $('.nav-btn').removeClass('active').prop('disabled', false);
        $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
    });
    document.body.style.overflowY = 'hidden'; 
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
        localStorage.setItem('lastOpenedSection', section);  // Save the current section to localStorage
        $('.nav-btn').removeClass('active').prop('disabled', false);
        thisNavButton.addClass('active').prop('disabled', true);
        changingSection = true;
        loadPage(section); // Load the page and add it to the history
    });


    // Closing the Sample pages
    async function triggerEvent() {
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto';
        });
    }

    // Creating the Closing Sample pages event
    async function closingSample() {
        $('.overlayContainer').on('click touchend', function (event) {
            loadPage('portfolio');
            if ($(event.target).hasClass('closeBtn')) { // Determine if the click was on .closeBtn
                triggerEvent()
            } else {
                checkDeviceType();
            }
        });
    }

    // from parents
    $(document).on('click touchend', '.buttonSample', async function () {
        loader.fadeIn(200);
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";
        changingSection = false;
        console.log(`Loading page sample from: ${samplePath}`);  // For testing
        try {
            await loadSample(samplePath);
            loader.fadeOut(200);
            $('.overlayContainer').scrollTop(0),
            document.body.style.overflowY = 'hidden';
            closingSample();
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
            const sampleName = hash.replace('sample-', '');
            const samplePath = `samples/${sampleName}.html`;  // Extract the sample name from the URL
            try {
                await loadSample(samplePath, false);  // Don't add to history again
                samples.fadeIn(600);
                document.body.style.overflowY = 'hidden';
                closingSample(); // **IMPORTANT**: Reattach the close button event listener here
            } catch (error) {
                console.error(`Error loading sample from URL: ${error}`);
            }
        } else if (hash) {
            await loadPage(hash, false);  
        } else {
            await loadPage('portfolio', false);
            // $('.nav-btn').removeClass('active').prop('disabled', false);
            // $(`.nav-btn[data-name="${hash}"]`).addClass('active').prop('disabled', true);
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
                closingSample(); // **IMPORTANT**: Reattach the close button event listener here
            } else {
                await loadPage(section, false);
                console.log(`___________||||||||||||||||\\\\\\\\\\\\\: ${section}`)
                $('.nav-btn').removeClass('active').prop('disabled', false);
                $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
                // If a sample is open, close it when navigating to a different section
                if (samples.is(':visible')) { 
                    triggerEvent();
                }
            }
        }
    };

///////////////////////////// MAIN SAMPLES //////////////////////////////////
 
    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.hide();
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    if (addToHistory) {
                        const sampleName = samplePath.split('/').pop()?.replace('.html', ''); // Extract the sample name from the path (assuming it follows 'samples/sampleName.html')
                        history.pushState({ sample: sampleName }, sampleName || '', `#sample-${sampleName}`); // Push the state to the history
                    }
                    samples.fadeIn(600);
                    resolve();
                } else {
                    reject(new Error(`Error loading sample: ${xhr.status} ${xhr.statusText}`));
                }
            });
        });
    }
});