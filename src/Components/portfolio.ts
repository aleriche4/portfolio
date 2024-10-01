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

//////////////////////////////// INITIALIZATION ///////////////////////////////////

    async function setInitialState() {
        const hash = window.location.hash.replace('#', '') || 'portfolio'; // Get the current hash from the URL
        // await fetchPortfolioData(); // Load portfolio data
        if (hash && hash !== 'portfolio') {
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            // await loadPage('portfolio', true)
        } else {
            await loadPageContent($('#portfolioPage'), 'portfolio.html');
            // await loadPage('portfolio', true)
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
            page = $(pageId);  // Get the page element by ID
        if(changingSection) $('.pages, #footer').fadeOut(400); // Hide all pages first
        console.log(`Loading page: ${sectionPath}`); // For testing
        if (!pageLoadStatus[section]) { // Check if the section content has not been loaded yet
            try {
                pageLoadStatus[section] = true;
                loader.fadeIn(200);
                await loadPageContent(page, sectionPath);
                loader.fadeOut(200);
            } catch (error) {
                console.error(`Error loading ${section} page:`, error);
            }
        } 
        if (addToHistory) {
            console.log(`:::: LoadPage History Added : ${section} and ${addToHistory}`);
            history.pushState({ section }, section, `#${section}`);
            document.title = `Alain Leriche - ${section}`; // renaming the <title></title> for each sections/samples
        }
        $('.pages').promise().done(function () { // After fade-out is complete, fade in the selected section
            if(changingSection) window.scrollTo(0, 0);
            page.fadeIn(600);
            document.body.style.overflowY = 'auto'
            $('#footer').fadeIn(600);
            $('.nav-btn').removeClass('active').prop('disabled', false);
            $(`.nav-btn[data-name="${section}"]`).addClass('active').prop('disabled', true);
        });
        document.body.style.overflowY = 'hidden'; 
    }

///////////////////////////// SAMPLES LOADING //////////////////////////////////
 
    async function loadSample(samplePath: string, addToHistory = true) {
        return new Promise<void>((resolve, reject) => {
            samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
                if (statusTxt === "success") {
                    if (addToHistory) {
                        const sampleName = samplePath.split('/').pop()?.replace('.html', '');
                        document.title = `Alain Leriche - ${sampleName}`;
                        history.pushState({ sample: sampleName }, sampleName || '', `#sample-${sampleName}`);
                        console.log(`____SamplePage History Added : ${sampleName} and ${addToHistory}`);
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
    $('.nav-btn').on('click', function () {
        const thisNavButton = $(this),  // Reference the clicked button
            section: string = thisNavButton.data('name');  // Get the section name from data-name attribute
        // console.log(`${thisNavButton} et ${section}`);
        localStorage.setItem('lastOpenedSection', section);  // Save the current section to localStorage
        $('.nav-btn').removeClass('active').prop('disabled', false);
        thisNavButton.addClass('active').prop('disabled', true);
        changingSection = true;
        loadPage(section); // Load the page and add it to the history
    });

/////////////////////////// CLOSING SAMPLE EVENT /////////////////////////////////////

    // Closing the Sample pages
    async function triggerEvent(fromHistory: boolean = true) {
        if(!fromHistory) await loadPage('portfolio');
        samples.fadeOut(400, function () {
            document.body.style.overflowY = 'auto';
        });
        document.title = `Alain Leriche - portfolio`;
    }

    // Creating the Closing Sample pages event
    async function closeBtn() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
        if (isMobile || isTablet) {
            $('.closeBtn').off('touchend').on('touchend', function() {
                triggerEvent(false)
            });
        } else {
            $('.overlayContainer').off('click').on('click', function () {
                triggerEvent(false);
            });
        }
    }

    // from parents
    $(document).on('click touchend', '.buttonSample', async function (event) {
        event.preventDefault();
        changingSection = false;
        loader.fadeIn(200);
        const samplePath: string = 'samples/' + $(this).data('name') + ".html";
        const section: string = $(this).data('name');
        console.log(`Loading page sample: ${samplePath}`);  // For testing
        await loadSample(samplePath, true);
        loader.fadeOut(200, function() {document.body.style.overflowY = 'hidden';});
        $('.overlayContainer').scrollTop(0);
        await closeBtn();
    });

//////////////////////////////// REFRESH & HISTORY HANDLING //////////////////////////////////

    async function restoreStateOnReload() {
        const hash = window.location.hash.replace('#', '');
        if (hash.startsWith('sample-')) {
            const sampleName = hash.replace('sample-', ''),
                samplePath = `samples/${sampleName}.html`;
            await loadSample(samplePath, false);
            document.body.scrollTop = 0;
            document.body.style.overflowY = 'hidden';
            closeBtn();
        } else {
            await loadPage(hash || 'portfolio', false);
        }
    }

    window.onpopstate = async function (event: any) {
        if (event.state) {
            const sections = event.state.section || event.state.sample;
            // console.log(`|||||||||||||||||||||||||  ${sections}`);
            if (sections) {
                if (event.state.sample) {
                    await loadSample(`samples/${sections}.html`, false);
                    changingSection = false;
                    closeBtn();
                } else {
                    await loadPage(sections, false);
                    changingSection = true;
                    $('.nav-btn').removeClass('active').prop('disabled', false);
                    $(`.nav-btn[data-name="${sections}"]`).addClass('active').prop('disabled', true);
                    if (samples.is(':visible')) triggerEvent(true); // If a sample is open, close it when navigating to a different page
                }
            } else {
                await loadPage('portfolio', false);  // Default fallback if state is missing
            }
        }
    };
});