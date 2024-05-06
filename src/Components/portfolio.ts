/*jslint browser:true*/
/*global $, jQuery*/
// $(document).ready(function () {
document.addEventListener("DOMContentLoaded", function main() {
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

    let samples: JQuery<HTMLElement> = $('#samples'),
        linkSample: JQuery<HTMLElement> = $('.buttonSample');

    // SAMPLES
    linkSample.on('click touchend', function () {
        let samplePath = 'samples/' + $(this).data('name') + ".html";
        console.log("samplePath = " + samplePath);

        samples.load(samplePath, function (responseTxt, statusTxt, xhr) { // function (responseTxt, statusTxt, xhr) {
            if (statusTxt === "success") {
                samples.fadeIn(500);
                document.body.style.overflowY = 'hidden';
                $('.close').on('click touchend', function () {
                    samples.fadeOut(600);
                    setTimeout(() => {
                        document.body.style.overflowY = 'scroll';
                    }, 600);
                });
            }
        });
    });
    document.removeEventListener("DOMContentLoaded", main);
}); 