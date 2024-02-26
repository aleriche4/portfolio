/*jslint browser:true*/
/*global $, jQuery*/
$(document).ready(function () {
    "use strict";

    var inHeight,
        inWidth,
        samples = $('#samples'),
        wScreen = $('#screen'),
        // preload = $('#preload'),
        top = $('#topPage'),
        linkSample = $('.buttonSample'),
        // linkSample = $('PortfolioBox'),
        // portfolioContainer = $('.portfolio'),
        // contentHeight,
        // y,
        // This,
        samplesX,
        preloadX,
        sampleOpen = false,
        topOn = true;

    // WINDOW SIZE
    function adjustStyle() {
        inHeight = window.innerHeight;
        inWidth = window.innerWidth;
        var xTop = inWidth - 70 + "px",
            yTop = inHeight - 40 + "px";
        samplesX = (inWidth / 2) - 390 + 'px';
        preloadX = (inWidth / 2) - 20 + "px";
        top.css({ 'left': xTop, top: yTop });
        wScreen.css({ 'height': inHeight, 'width': inWidth });
        if (sampleOpen) {
            samples.css('left', samplesX);
        }
        if (inWidth < 760) {
            topOn = false;
            top.fadeOut(400);
        } else {
            topOn = true;
        }
        // console.log(inWidth);
        // console.log("topOn = " + topOn);
    }

    $(window).load(function () {
        adjustStyle();
    });

    $(window).resize(function () {
        adjustStyle();
    });

    // SAMPLES
    linkSample.on('click touchend', function () {
        sampleOpen = true;
        var samplePath = 'samples/' + $(this).data('name') + ".html";
        console.log("samplePath = " + samplePath);
        wScreen.fadeIn();
        samples.css('left', samplesX);
        // preload.css('left', preloadX).fadeIn();
        samples.load(samplePath, function (responseTxt, statusTxt, xhr) { // function (responseTxt, statusTxt, xhr) {
            if (statusTxt === "success") {
                // preload.fadeOut();
                samples.fadeIn(500);
                // setTimeout(() => {
                //     $('preloader2').hide();
                //  }, 500);

                document.body.style.overflowY = 'hidden';

                if(inWidth > 480) {
                    document.body.style.marginLeft = '-17px';
                }

                $('.close').on('click touchend', function () {
                    // preload.fadeOut();
                    samples.fadeOut(600);
                    sampleOpen = false;
                    setTimeout(() => {
                        document.body.style.overflowY = 'scroll';
                        document.body.style.marginLeft = '0px';
                        samples.add(wScreen).empty();
                     }, 600);
                    // samples.add(wScreen).hide().empty();
                });
            }
            // if (statusTxt == "error") {
            //     alert("Error: " + xhr.status + ": " + xhr.statusText);
            // }
        });
        // wScreen.on('click touchend', function () {
        //     preload.fadeOut();
        //     sampleOpen = false;
        //     samples.add(wScreen).hide().empty();
        // });
    });
});