"use strict";
document.addEventListener("DOMContentLoaded", function main() {
    console.log("DOM fully loaded and parsed");
    document.removeEventListener("DOMContentLoaded", main);


/*jslint browser:true*/
/*global $, jQuery*/
// $(document).ready(function () {
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

    // let box = document.getElementById('box'); 

    let linkSamples = document.querySelectorAll('.buttonSample');
    
    let samples = document.getElementById('samples'); 

    // SAMPLES
    linkSamples.forEach(function(samples) {

        

        samples.addEventListener('click', function () {
            // console.log(sample);
            let samplePath = 'samples/' + samples.id + ".html";
            // console.log("samplePath = " + samplePath);

            fetch(samplePath, {
                method: 'get'
            }).then(function(response) {
                // samples.fadeIn(500);
                // document.body.style.overflowY = 'hidden';
                alert("YOUPPI 0000")
            }).catch(function(err) {
                samples.fadeIn(500);
	            // Error :(
                    alert("YOUPPI")
            });


            // sample.include(samplePath, function (responseTxt, statusTxt, xhr) {
            //     if (statusTxt === "success") {
            //         samples.fadeIn(500);
            //         document.body.style.overflowY = 'hidden';
            //         close.on('click touchend', function () {
            //             samples.fadeOut(600);
            //             setTimeout(() => {
            //                 document.body.style.overflowY = 'scroll';
            //             }, 600);
            //         });
            //     }
            // });

        });

        
    });
});