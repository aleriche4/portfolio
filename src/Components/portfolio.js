$(document).ready(function () {
    "use strict";

    var inHeight,
        inWidth,
        samples = $('#samples'),
        wScreen = $('#screen'),
        preload = $('#preload'),
        top = $('#topPage'),
        linkSample = $('.linkSample'),
        contentHeight,
        This,
        samplesX,
        preloadX,
        sampleOpen = false,
        topOn = true,
        y;

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
        if (sampleOpen) samples.css('left', samplesX);

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

    // SCROLLER
    // $(window).on('scroll', function () {

    //     if (topOn) {
    //         var wrap = $('#box'),
    //             yOffset = window.pageYOffset,
    //             status = $('#status');
    //         contentHeight = wrap.height();
    //         y = yOffset + inHeight;
    //         if (y > inHeight) {
    //             top.fadeIn(200);
    //         } else {
    //             top.fadeOut(400);
    //         }
    //         status.html(contentHeight + " | " + y + " | " + inHeight);
    //     }
    // });

    // top.on('click', function () {
    //     var speed = (y * 1.3) / 10;
    //     $('html, body').animate({
    //         scrollTop: "0px"
    //     }, speed);
    // });

    // SAMPLES
    linkSample.on('click', function () {
        sampleOpen = true;
        var samplePath = 'samples/' + $(this).data('name') + ".html";
        console.log="samplePath = " + samplePath;
        wScreen.fadeIn();
        samples.css('left', samplesX);
        preload.css('left', preloadX).fadeIn();
        samples.load(samplePath, function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {
                preload.fadeOut();
                samples.fadeIn();

                $('.banner').on('click', function () {
                    This = $(this);
                    var bWidth = This.data('width'),
                        bHeight = This.data('height'),
                        fileName = This.data('name'),
                        company = This.data('company'),
                        campaign = This.data('campaign'),
                        type = This.data('type'),
                        fileAddress = 'banners/' + company + '/' + campaign + '/' + fileName + type,
                        vertical = $('#boxvertical'),
                        // horizontal = $('#boxhorizontal'),
                        format = '<img src="' + fileAddress + '" width="' + bWidth + '" height="' + bHeight + '" alt="' + campaign + '">';

                    // format = type === '.jpg' ? '<img src="' + fileAddress + '" width="' + bWidth + '" height="' + bHeight + '" alt="' + campaign + '">' : '<embed src="' + fileAddress + '" width="' + bWidth + '" height="' + bHeight + '">';

                    /*format = '<img src="' + fileAddress + '" width="' + bWidth + '" height="' + bHeight + '" alt="' + campaign + '">'; : '<embed src="' + fileAddress + '" width="' + bWidth + '" height="' + bHeight + '">';*/

                    // if (bHeight > bWidth/* || bWidth < 501*/) {
                    //     if (bWidth >= 460) vertical.css('margin-top', '40px');
                        // else vertical.css('margin-top', '20px');
                        vertical.html(format).show();
                        // horizontal.hide();
                        // } else {
                        //     horizontal.html(format).show();
                        //     vertical.hide();
                        // }
                    });
                $('.close').on('click', function () {
                    sampleOpen = false;
                    samples.add(wScreen).hide().empty();
                });
            }
            if (statusTxt == "error") {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
        wScreen.on('click', function () {
            preload.fadeOut();
            sampleOpen = false;
            samples.add(wScreen).hide().empty();
        });
    });
});