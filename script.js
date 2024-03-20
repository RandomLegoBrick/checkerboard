var canvas = document.getElementById("checkerboard-preview");
var canvasSize = window.innerHeight < window.innerWidth ? ~~(window.innerHeight * 0.6) : ~~(window.innerWidth * 0.6);
canvas.width = canvasSize;
canvas.height = canvasSize;

var ctx = canvas.getContext("2d");

var settings = {
    width: 512,
    height: 512,
    tileSize: 32,
    bg: "black",
    fg: "white",
};

var settingsElements = {
    width: document.getElementById("image-width-slider"),
    widthPreview: document.getElementById("image-width-preview"),

    height: document.getElementById("image-height-slider"),
    heightPreview: document.getElementById("image-height-preview"),

    square: document.getElementById("square-checkbox"),

    tileSize: document.getElementById("tile-size-slider"),
    tilePreview: document.getElementById("tile-size-preview"),

    bgColor: document.getElementById("bg-color-selector"),
    fgColor: document.getElementById("fg-color-selector"),
};

function map(value, input_start, input_stop, output_start, output_stop) {
    return output_start + (output_stop - output_start) * ((value - input_start) / (input_stop - input_start));
}

function drawPreview(){

    var width = canvas.width;
    var height = canvas.height;
    var translateX = 0;
    var translateY = 0;

    if(settings.width > settings.height){
        width = canvas.width;
        height = canvas.width * (settings.height/settings.width);
        translateY = (canvas.height - height) / 2;
    }else if(settings.height > settings.width){
        height = canvas.height;
        width = canvas.height * (settings.width/settings.height);
        translateX = (canvas.width - width) / 2;
    }

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = settings.bg;
    ctx.fillRect(translateX, translateY, width, height);

    ctx.fillStyle = settings.fg;

    var n = 0;
    for(var x = 0; x <= settings.width; x += settings.tileSize){
        for(var y = 0; y <= settings.height; y += settings.tileSize){
            var mappedX = translateX + map(x, 0, settings.width, 0, width);
            var mappedY = translateY + map(y, 0, settings.height, 0, height);
            var mappedSize = map(settings.tileSize, 0, settings.width, 0, width);
            

            if(n%2 === 0){
                ctx.fillRect(mappedX, mappedY, mappedSize, mappedSize);
            }
            n++;
        }
    }   
}

function downloadImage(){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    
    canvas.width = settings.width;
    canvas.height = settings.height;

    ctx.fillStyle = settings.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = settings.fg;

    var n = 0;
    for(var x = 0; x <= settings.width; x += settings.tileSize){
        for(var y = 0; y <= settings.height; y += settings.tileSize){              
            if(n%2 === 0){
                ctx.fillRect(x, y, settings.tileSize, settings.tileSize);
            }
            n++;
        }
    }

    var image = canvas.toDataURL();
    var downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = "checkerboard"+settings.tileSize+"_"+settings.width+"x"+settings.height+".png";
    downloadLink.click();
}

function listenChanges(config){
    if(config.preview) config.preview.textContent = 2 ** + config.source.value;
    settings[config.output] = config.power2 ? 2 ** +config.source.value : config.source.value;
    config.source.addEventListener("input", (event) => {
        if(config.preview) config.preview.textContent = 2 ** (+event.target.value);
        settings[config.output] = config.power2 ? 2 ** (+event.target.value) : event.target.value;
        if(config.onRun) config.onRun(event.target);
        if(!config.noPreview) drawPreview();
    });
    if(config.onRun) config.onRun(config.source);
    if(!config.noPreview) drawPreview();
}

listenChanges({
    source: settingsElements.width,
    preview: settingsElements.widthPreview,
    output: "width",
    power2: true,
    onRun: function(source) {
        if(settingsElements.square.checked){
            settings.height = settings.width;
            settingsElements.height.value = source.value;
            settingsElements.heightPreview.textContent = settings.width;
        }
    }
});

listenChanges({
    source: settingsElements.height,
    preview: settingsElements.heightPreview,
    output: "height",
    power2: true,
    onRun: function(source) {
        if(settingsElements.square.checked){
            settings.width = settings.height;
            settingsElements.width.value = source.value;
            settingsElements.widthPreview.textContent = settings.height;
        }
    }
});

listenChanges({
    source: settingsElements.tileSize,
    preview: settingsElements.tilePreview,
    output: "tileSize",
    power2: true,
});

listenChanges({
    source: settingsElements.bgColor,
    output: "bg",
});

listenChanges({
    source: settingsElements.fgColor,
    output: "fg",
});

drawPreview();