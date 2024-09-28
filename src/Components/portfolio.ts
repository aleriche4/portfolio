document.addEventListener("DOMContentLoaded", function() {

    const jsonURL: string = "components/data/data.json", // Replace with your API
        loader: JQuery<HTMLElement> = $('#loader'),
        samples: JQuery<HTMLElement> = $('#samples');
        
    let changingSection: boolean = true;

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

/////////////////////////////// RENDER PORTFOLIO CONTENTS ///////////////////////////////////

    // Define a specific type for portfolio data if you know the structure
    interface PortfolioItem {
        companyName: string;
        sample?: string;
        link: string;
        imageName: string;
        city: string;
        position: string;
        applications: string;
        technologies: string;
        achievements: string[];
        note?: string;
    }

    async function renderPortfolioContent(data: PortfolioItem[]) {
        const portfolioContainer = document.getElementById('portfolioContainer') as HTMLElement | null;
        if (!portfolioContainer) {
            console.error("Element with id 'portfolioContainer' not found.");
            return;
        }
        const content = data.map(item => `
            <section id="${item.companyName}">
                <h1>${item.companyName}</h1>
                <div class="portfolio">
                ${item.sample ? `<button class="buttonSample" data-name=${item.sample}>samples</button>` : ''}
                <a href="${item.link}" target="_blank" rel="external">
                    <img class="image lazyload" data-src="images/thumbs/${item.imageName}.png" alt="${item.companyName} logo" />
                </a>
                <div class="title seen">${item.companyName} <span class="city"> - ${item.city}</span></div>
                <div class="title noDisplay">${item.companyName}<span class="city"><br />New York City</span></div>
                <div class="jobContainer">
                    <div class="clear_both"></div>
                    <div class="keys">Position:</div>
                    <div class="jobPosition">${item.position}</div>
                    <div class="keys">Applications:</div>
                    <div class="infoText">${item.applications}</div>
                    <div class="keys">Technologies:</div>
                    <div class="code">${item.technologies}</div>
                    <div class="keys">Achievements:</div>
                    <ul>
                        ${item.achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                    ${item.note ? `<div class="info">${item.note}</div>` : ''}
                </div>
            </section>`
        ).join('');
        portfolioContainer.innerHTML = content;
    }


//////////////////////////////////// GET JSON / DATA ////////////////////////////////////////

    // Function to fetch JSON data
    async function fetchPortfolioData() {
        try {
            const response = await fetch(jsonURL);
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            const data: PortfolioItem[] = await response.json();
            await renderPortfolioContent(data);
        } catch (error: any) {
            console.error(error.message);
        }
    }

//////////////////////////// AGENT DESKTOP/MOBILE/TABLET ////////////////////////////////////

    // Be able to remove the close background button event for mobile and tablet so it won't close the sample page after scrolling
    // async function getDeviceType(): Promise<"mobile" | "tablet" | "desktop"> {
    //     const userAgent = navigator.userAgent;
    //     if (/Mobi|Android/i.test(userAgent)) return 'mobile';
    //     if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) /*|| window.matchMedia("only screen and (min-width: 480px) and (max-width: 709px)").matches)*/ return 'tablet';
    //     return 'desktop';
    // }

    async function getDeviceType(): Promise<"mobile" | "tablet" | "desktop"> {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
        return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    }

    async function checkDeviceType() {
        const deviceType = await getDeviceType();
        if (deviceType === 'desktop') {
            triggerEvent(); 
        } else {
            $('.overlayContainer').css("cursor: auto;");
        }
    }

//////////////////////////////// INITIALIZATION ///////////////////////////////////

    async function setInitialState() {
        const hash = window.location.hash.replace('#', '') || 'portfolio'; // Get the current hash from the URL
        if (hash && hash !== 'portfolio') {
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            // await loadPageContent($('#resumePage'), `${hash}.html`);
            // console.log(`:::: If it is NOT portfolio :::  ${hash}`)
        } else {
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            console.log(`:::: If it is portfolio`)
            $('.nav-btn[data-name="portfolio"]').addClass('active').prop('disabled', true);
            history.pushState({ section: 'portfolio' }, 'portfolio', '#portfolio');
        }
        await fetchPortfolioData(); // Load portfolio data
        await restoreStateOnReload(); // Handle page reload and restore state
        loader.fadeOut(200);
        $('#mainContainer, #footer').fadeIn(800);
        // Find the corresponding navigation button and trigger its click handler programmatically
        const initialNavButton = document.querySelector(`.nav-btn[data-name="${hash}"]`);
        if (initialNavButton) {
            initialNavButton.dispatchEvent(new Event('touchend'));
        }
    }

    setInitialState();

/////////////////////////////// PAGE CONTENT LOADING /////////////////////////////////////

    async function loadPageContent(page: JQuery<HTMLElement>, url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error loading page: ${response.statusText}`);
            const content = await response.text();
            page.html(content);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to handle loading and history management
    async function loadPage(section: string, addToHistory = true) {
        const sectionPath = `${section}.html`,  // Path to the section's HTML file
            pageId = `#${section}Page`,  // Dynamically generate the ID selector for the page
            page = $(pageId);  // Get the page element by ID // For testing
        console.log(`Loading page: ${sectionPath}`);
        if(changingSection) $('.pages, #footer').fadeOut(400); // Hide all pages first
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
            console.log(`___ :::: Loading page: ${pageId} and ${sectionPath} and ${section}`);
            page.fadeIn(600, function() {document.body.style.overflowY = 'auto'});
            $('#footer').fadeIn(600);
            $('.nav-btn').removeClass('active').prop('disabled', false);
            $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
        });
        document.body.style.overflowY = 'hidden'; 
        if (addToHistory) history.pushState({ section }, section, `#${section}`);
    }

///////////////////////////// SAMPLES LOADING //////////////////////////////////
 
    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    if (addToHistory) {
                        const sampleName = samplePath.split('/').pop()?.replace('.html', '');
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

//////////////////////////////////// GENERAL NAVIGATION //////////////////////////

    // Attach event listener to all navigation buttons
    $('.nav-btn').on('click touchend', function () {
        const thisNavButton = $(this),  // Reference the clicked button
            section: string = thisNavButton.data('name');  // Get the section name from data-name attribute
        localStorage.setItem('lastOpenedSection', section);  // Save the current section to localStorage
        $('.nav-btn').removeClass('active').prop('disabled', false);
        thisNavButton.addClass('active').prop('disabled', true);
        changingSection = true;
        loadPage(section, true); // Load the page and add it to the history
    });


/////////////////////////// CLOSING SAMPLE EVENT /////////////////////////////////////

    // Closing the Sample pages
    async function triggerEvent() {
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto';
        });
    }

    // Creating the Closing Sample pages event
    async function closingSample() {
        $('.overlayContainer').off('click touchend').on('click touchend', function (event) {
            loadPage('portfolio', true);
            if ($(event.target).hasClass('closeBtn')) { // Determine if the click was on .closeBtn
                triggerEvent()
            } else {
                checkDeviceType();
            }
        });
    }

    // from parents
    $(document).on('click touchend', '.buttonSample', async function (event) {
        event.preventDefault()
        loader.fadeIn(200);
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";
        changingSection = false;
        console.log(`Loading page sample: ${samplePath}`);  // For testing
        await loadSample(samplePath);
        loader.fadeOut(200, function() {document.body.style.overflowY = 'hidden';});
        $('.overlayContainer').scrollTop(0),
        closingSample();
    });

//////////////////////////////// REFRESH & HISTORY HANDLING //////////////////////////////////

    // Function to restore state from URL hash or history
    // async function restoreStateOnReload() {
    //     const hash = window.location.hash.replace('#', '');
    //     if (hash.startsWith('sample-')) {
    //         const sampleName = hash.replace('sample-', '');
    //         const samplePath = `samples/${sampleName}.html`;  // Extract the sample name from the URL
    //         try {
    //             await loadSample(samplePath, false);  // Don't add to history again
    //             samples.fadeIn(600);
    //             document.body.style.overflowY = 'hidden';
    //             closingSample(); // **IMPORTANT**: Reattach the close button event listener here
    //         } catch (error) {
    //             console.error(`Error loading sample from URL: ${error}`);
    //         }
    //     } else if (hash) {
    //         await loadPage(hash, false);  
    //     } else {
    //         await loadPage('portfolio', false);
    //     }
    // }

    // // Handle browser back/forward button (popstate)
    // window.onpopstate = async function (event: any) {
    //     if (event.state) {
    //         const section = event.state.section || event.state.sample;
    //         if (event.state.sample) {
    //             await loadSample(`samples/${section}.html`, false);
    //             samples.fadeIn(600);
    //             document.body.style.overflowY = 'hidden';
    //             closingSample(); // **IMPORTANT**: Reattach the close button event listener here
    //         } else {
    //             await loadPage(section, false);
    //             $('.nav-btn').removeClass('active').prop('disabled', false);
    //             $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
    //             // If a sample is open, close it when navigating to a different section
    //             if (samples.is(':visible')) { 
    //                 triggerEvent();
    //             }
    //         }
    //     }
    // };

    async function restoreStateOnReload() {
        const hash = window.location.hash.replace('#', '');
        if (hash.startsWith('sample-')) {
            const sampleName = hash.replace('sample-', ''),
                samplePath = `samples/${sampleName}.html`;
            await loadSample(samplePath, false);
            document.body.scrollTop = 0;
            document.body.style.overflowY = 'hidden';
            closingSample();
        } else {
            await loadPage(hash || 'portfolio', false);
        }
    }

    window.onpopstate = async function (event: any) {
        if (event.state) {
            const sections = event.state.section || event.state.sample;
            if (sections) {
                if (event.state.sample) {
                    await loadSample(`samples/${sections}.html`, false);
                    closingSample();
                } else {
                    await loadPage(sections, false);
                    $('.nav-btn').removeClass('active').prop('disabled', false);
                    $(`.nav-btn[data-name="${sections}"]`).addClass('active').prop('disabled', true);
                    // If a sample is open, close it when navigating to a different page
                    if (samples.is(':visible')) { 
                        triggerEvent();
                    }
                }
            } else {
                await loadPage('portfolio', false);  // Default fallback if state is missing
            }
        }
    };
});