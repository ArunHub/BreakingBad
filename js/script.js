function fireSubmit() {
    clearSubmit();
    var sayUrName = document.getElementById('say-ur-name');
    var input = model.origInput = sayUrName.value.trim();
    if (input === null || input.length === 0 || input.match(/(^[0-9])|([0-9]$)|([^a-zA-Z\s+])/)) {
        view.displayMessage('Oops, Special characters, numbers are not allowed. Enter only Letters!');
        clearForm();
        return;
    } else if (input.length === model.chunkNumber - 1) {
        view.displayMessage('Enter atleast two letters');
        clearForm();
        return;
    } else {
        processInput(input.toLowerCase());
    }
}

function processInput(input) {
    var splitInput = input.split(/\s+/);
    var periodicArr = model.jsonElems;

    splitInput.forEach(function(val, idx) {
        var twoLetterArr = breakStr(val, model.chunkNumber);
        // var retVar = idx % 2 !== 0 ? matchElem(periodicArr, val) : matchElem(periodicArr, twoLetterArr);
        var retVal = matchElem(periodicArr, twoLetterArr);
        if (retVal === 'single letter') {
            retVal = matchElem(periodicArr, val);
        }
        if (retVal == null || retVal == undefined) {
            view.displayMessage('No match found for this word: ' + val);
            clearForm();
            return;
        } else {
            view.buildPeriodEl(retVal, idx);
            var reduceArr = getParts(retVal.symbol, val);
            reduceArr.splice(retVal.pos, 0, retVal);
            view.buildObjDom(reduceArr, retVal.pos, idx);
        }
    })
    clearForm();
}

function getParts(input, string) {
    var regex = new RegExp(input, 'i')
    return string.replace(regex, '').split('');
}

function matchElem(periodicArr, letterArr) {
    //randomize array here
    for (var i = 0; i < letterArr.length; i++) {
        for (var j = 0; j < periodicArr.length; j++) {
            if (letterArr[i] === periodicArr[j].symbol) {
                periodicArr[j]['pos'] = i;
                return periodicArr[j];
            } else if ((letterArr[letterArr.length - 1].length === model.chunkNumber) && (periodicArr.length - 1) === j && (letterArr.length - 1) === i) {
                return 'single letter';
            } else if ((letterArr[letterArr.length - 1].length === model.chunkNumber - 1) && (periodicArr.length - 1) === j && (letterArr.length - 1) === i) {
                return null;
            }
        }
    }
}

function breakStr(string, count) {
    return [...string.slice(count - 1)].map((_, i) => string.slice(i, i + count));
}

function clearSubmit() {
    var hTag = $('#h1');
    hTag.children().remove();
}

function clearForm() {
    var form = document.getElementsByName('periodicForm')[0];
    form.reset();
}

function refreshPage() {
    window.location.reload();
}

function init() {
    var submitBtn = document.getElementById('submitBtn');
    var refresh = document.getElementById('refresh');
    submitBtn.onclick = fireSubmit;
    refresh.onclick = refreshPage;
    ajaxCall();
}

window.onload = init;

var model = {
    chunkNumber: 2,
    jsonElems: [],
    origInput: ""
};

var view = {
    marginLeft: 0,
    buildDom: function(dom) {
        var hTag = $('#h1');
        for (var i = 0; i < dom.length; i++) {
            hTag.append("<span>" + dom[i].toLowerCase() + "</span>");
        }
    },
    buildPeriodEl: function(obj, index) {
        var inputgroup = $('.input-group');
        var inputword = "input-word-" + index;
        var genWordId = '#' + inputword;
        inputgroup.append('<div id=' + inputword + ' style="margin-left:' + view.marginLeft + 'px"></div>');
        var details = $('.details');
        view.marginLeft = 0;
        $(genWordId).append('<div class="periodic-element"><div class="atomic-mass">' + obj.atomic_mass + '</div><div class="oxidation"></div><div class="symbol">' + obj.symbol.toLowerCase() + '</div><div class="number">' + obj.number + '</div><div class="shells">2</div></div>');
        obj.shells.forEach(function(val, idx) {
            $(genWordId + ' ' + '.shells').append("<span>" + '-' + val + "</span>");
        });
        obj.oxidationStates.forEach(function(val, idx) {
            $(genWordId + ' ' + '.oxidation').append("<span>" + val + "</span>");
        });
        details.append('<div>' + obj.name + '----------' + obj.source + '----------' + obj.summary + '</div>');
        var perEl = $('.periodic-element').outerWidth();
        view.marginLeft += perEl;
    },
    buildObjDom: function(dom, pos, index) {
        var inputgroup = $('.input-group');
        var inputword = "input-word-" + index;
        var genWordId = '#' + inputword;
        var length = dom.length - 1;
        for (var i = length; i >= 0; i--) {
            if (!dom[i].symbol) {
                if (i < pos) {
                    $(genWordId).prepend("<span>" + dom[i].toLowerCase() + "</span>");
                    var spanEl = $(genWordId + ' > span').outerWidth();
                    view.marginLeft += spanEl;
                }
            }
        }


        for (var i = 0; i < dom.length; i++) {
            if (!dom[i].symbol) {
                if (i > pos) {
                    $(genWordId).append("<span>" + dom[i].toLowerCase() + "</span>");
                    var spanEl = $(genWordId + ' > span').outerWidth();
                }
            }

        }
    },
    displayMessage: function(str) {
        var message = $('.message');
        message.text(str).fadeOut(4000, function() {
            message.show().text("");
        });
    }
};

var controller = {
    jsonUrl: 'PeriodicTableJSON.json'
};

function ajaxCall() {
    model.jsonElems = jsonData.elements.map(function(obj) {
        return {
            name: obj.name,
            source: obj.source,
            summary: obj.summary,
            atomic_mass: obj.atomic_mass,
            number: obj.number,
            shells: obj.shells,
            symbol: obj.symbol.toLowerCase(),
            oxidationStates: obj.oxidationStates
        };
    });
}