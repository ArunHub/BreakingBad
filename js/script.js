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
        var retVal = regexMatch(periodicArr, val, 2);
        if (retVal == null || retVal == undefined) {
            retVal = regexMatch(periodicArr, val, 1);
        }
        if (retVal == null || retVal == undefined) {
            view.displayMessage('No match found for this word: ' + val);
            return;
        } else {
            var joinedArr = joinArray(val, retVal);
            view.buildFullDom(joinedArr, idx);
        }
    });
        $('.periodic-element').addClass('pseudo').css("transition-delay",view.delay+"s");
    clearForm();
}

function joinArray(str, retVal) {
    var first = getParts(retVal.symbol, str);
    var removed = { string: first.splice(retVal.pos).join(''), after: true };
    first = { string: first.join(''), before: true };
    var retArr = Array.of(first, retVal, removed);
    return retArr;
}

function getParts(input, string) {
    var regex = new RegExp(input, 'i')
    return string.replace(regex, '').split('');
}

function regexMatch(periodicArr, str, n) {
    for (var i = 0; i < periodicArr.length; i++) {
        if (periodicArr[i].symbol.length === n) {
            var regex = new RegExp(periodicArr[i].symbol, 'i');
            var temp = str.match(regex);
        }
        if (temp) {
            periodicArr[i]['pos'] = temp.index;
            break;
        }
    }
    return periodicArr[i];
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
    left: 0,
    delay: 1,
    buildFullDom: function(dom, index) {
        var inputgroup = $('.input-group');
        var inputword = "input-word-" + index;
        var genWordId = '.' + inputword;
        var details = $('.details');
        var length = dom.length - 1;
        inputgroup.append('<div class=' + inputword + '><div class="periodic-element" style="left:' + view.left + 'px;transition-delay:'+view.delay+'s"></div></div>');

        for (var i = 0; i < dom.length; i++) {

            if (dom[i].symbol) {
                $(genWordId + ' ' + '.periodic-element').append('<div class="atomic-mass">' + dom[i].atomic_mass + '</div><div class="oxidation"></div><div class="symbol">' + dom[i].symbol.toLowerCase() + '</div><div class="number">' + dom[i].number + '</div><div class="shells">2</div>');
                dom[i].shells.forEach(function(val, idx) {
                    $(genWordId + ' ' + '.shells').append("<span>" + '-' + val + "</span>");
                });
                dom[i].oxidationStates.forEach(function(val, idx) {
                    $(genWordId + ' ' + '.oxidation').append("<span>" + val + "</span>");
                });
                details.append('<div>' + dom[i].name + '----------' + dom[i].source + '----------' + dom[i].summary + '</div>');
            }


            if (!dom[i].symbol) {
                if (dom[i].before) {
                    $(genWordId + ' ' + '.periodic-element').attr("data-before", dom[i].string);
                    var spanEl = $(genWordId + ' .periodic-element').outerWidth();
                } else if (dom[i].after) {
                    $(genWordId + ' ' + '.periodic-element').attr("data-after", dom[i].string);
                }

            }

            $(genWordId + ' ' + '.periodic-element').addClass('animate');
        }
        var el = $(genWordId + ' .periodic-element').outerWidth()
        // var dl = $(genWordId + ' .periodic-element').css('transition-delay',delay);
        view.left += el;
        view.delay += 2.5;
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