javascript: (function() {
    var configurl = document.querySelector('.js-player').getAttribute('data-config-url');
    addElements();

    function openMovie(data) {
        var list = data.request.files.progressive;
        list.sort((a, b) => (a.width > b.width) ? -1 : 1);
        download(list[0].url);
    }

    function downloadLoading() {
        var elem = document.querySelector('#vimeodl__loader');
        elem.innerHTML = ` <div class="overlay"> <div class="overlay__inner"> <div class="overlay__content"> <div> <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" id="downloader"> <title>SVG Download</title> <defs> <clipPath id="mainCircleMask"> <circle fill="none" stroke="#000000" stroke-width="14.9511" stroke-miterlimit="10" cx="400" cy="319.7" r="121"></circle> </clipPath> </defs> <path id="outline" class="spinner" stroke="#fff" d="M400,192.12A127.62,127.62,0,1,0,527.62,319.73,127.62,127.62,0,0,0,400,192.12z" fill="none" stroke-miterlimit="10" stroke-width="15"></path> <g clip-path="url(#mainCircleMask)"> <path fill="#fff" id="arrow" d="M427 344 C438.9 344 450.8 344 462.7 344 441.8 365.2 420.9 386.4 400 407.6 379.1 386.4 358.2 365.2 337.3 344 349.2 344 361.1 344 373 344 373 326 373 308 373 290 391 290 409 290 427 290 427 308 427 326 427 344 z" data-svg-origin="337.29998779296875 290" style="transform: translateY(-15px);"></path> </g> </svg> </div> <p>Downloading... (might take a while)</p> </div> </div> </div>`;
    }

    function downloadDone() {
        var elem = document.querySelector('#vimeodl__loader');
        elem.innerHTML = ` <div class="overlay overlay--done" onclick="this.parentNode.innerHTML=''" style="cursor:pointer"> <div class="overlay__inner"> <div class="overlay__content"> <div> <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" id="downloader"> <title>SVG Done</title> <defs> <clipPath id="mainCircleMask"> <circle fill="none" stroke="#000000" stroke-width="14.9511" stroke-miterlimit="10" cx="400" cy="319.7" r="121"></circle> </clipPath> </defs> <g clip-path="url(#mainCircleMask)"> <path fill="#fff" id="tick" d="M386 381.2 C370.96 366.16 355.93 351.13 340.9 336.1 347.93 328.06 354.96 320.03 362 312 370 320.03 378 328.06 386 336.1 408.6 311 431.2 285.9 453.8 260.8 461.33 268.83 468.86 276.86 476.4 284.89 446.26 317 416.13 349.1 386 381.2 z" data-svg-origin="408.6499938964844 321"></path> </g> </svg> </div> <p>Download complete</p> </div> </div> </div> `;
    }

    function addElements() {
        var loadercontainer = document.createElement('div');
        loadercontainer.id = "vimeodl__loader";
        document.body.appendChild(loadercontainer);
        var style = document.createElement('style');
        style.innerHTML = ` .overlay { left: 0; top: 0; width: 100%; height: 100%; position: fixed; background: #222; color: #fff; } .overlay.overlay--done { background: green; } .overlay p { color: #fff; text-align: center; } .overlay__inner { left: 0; top: 0; width: 100%; height: 100%; position: absolute; } .overlay__content { left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 300px; } #downloader { width: 300px; height: 150px; } .spinner { animation: spin 3s infinite linear; } @keyframes spin { 0% { stroke-dashoffset: 0; stroke-dasharray: 200px, 200px; } 100% { stroke-dashoffset: 2000; stroke-dasharray: 200px, 200px; } } `;
        document.head.appendChild(style);
    }
    fetch(configurl, {
        method: 'GET',
        credentials: 'include'
    }).then(r => r.json()).then(data => openMovie(data)).catch(e => console.log(e)); /* Uses download.js from https://github.com/rndme/download */
    (function(root, factory) {
        typeof define == "function" && define.amd ? define([], factory) : typeof exports == "object" ? module.exports = factory() : root.download = factory()
    })(this, function() {
        return function download(data, strFileName, strMimeType) {
            var self = window,
                defaultMime = "application/octet-stream",
                mimeType = strMimeType || defaultMime,
                payload = data,
                url = !strFileName && !strMimeType && payload,
                anchor = document.createElement("a"),
                toString = function(a) {
                    return String(a)
                },
                myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
                fileName = strFileName || "download",
                blob, reader;
            myBlob = myBlob.call ? myBlob.bind(self) : Blob, String(this) === "true" && (payload = [payload, mimeType], mimeType = payload[0], payload = payload[1]);
            if (url && url.length < 2048) {
                fileName = url.split("/").pop().split("?")[0], anchor.href = url;
                if (anchor.href.indexOf(url) !== -1) {
                    var ajax = new XMLHttpRequest;
                    return ajax.open("GET", url, !0), ajax.responseType = "blob", ajax.onload = function(e) {
                        download(e.target.response, fileName, defaultMime)
                    }, setTimeout(function() {
                        ajax.send();
                        downloadLoading();
                    }, 0), ajax
                }
            }
            blob = payload instanceof myBlob ? payload : new myBlob([payload], {
                type: mimeType
            });

            function saver(url, winMode) {
                if ("download" in anchor) return anchor.href = url, anchor.setAttribute("download", fileName), anchor.className = "download-js-link", anchor.innerHTML = "downloading...", anchor.style.display = "none", anchor.addEventListener("click", function(e) {
                    e.stopPropagation(), this.removeEventListener("click", arguments.callee)
                }), document.body.appendChild(anchor), setTimeout(function() {
                    anchor.click(), document.body.removeChild(anchor), winMode === !0 && setTimeout(function() {
                        self.URL.revokeObjectURL(anchor.href)
                    }, 250)
                }, 66), !0;
                if (/(Version)\/(\d )\.(\d )(?:\.(\d ))?.*Safari\//.test(navigator.userAgent)) return /^data:/.test(url) && (url = "data:"
                    url.replace(/^data:([\w\/\-\ ] )/, defaultMime)), window.open(url) || confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.") && (location.href = url), !0;
                var f = document.createElement("iframe");
                document.body.appendChild(f), !winMode && /^data:/.test(url) && (url = "data:"
                    url.replace(/^data:([\w\/\-\ ] )/, defaultMime)), f.src = url, setTimeout(function() {
                    document.body.removeChild(f)
                }, 333)
            }
            if (self.URL) {
                saver(self.URL.createObjectURL(blob), !0);
                downloadDone();
            }
            return !0
        }
    });
})();


