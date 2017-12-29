function fireSubmit() {
    var sayUrName = document.getElementById('say-ur-name');
    var input = sayUrName.value.trim();
    if (input === null || input.length === 0 || input.match(/[^a-zA-Z\s+]/gi)) {
        view.displayMessage('Oops, Special characters, numbers are not allowed. Enter only Letters!');
        clearForm();
        return;
    } else if (input.length === 1) {
        view.displayMessage('Enter atleast two letters');
        clearForm();
        return;
    } else {
        processInput(input.toLowerCase());
    }
}

function processInput(input) {
    var splitInput = input.split(/\s+/);
    var periodicArr = ajaxCall();
    btnState("disabled");
    for (var i = 0; i < splitInput.length; i++) {
        var retVal = regexMatch(periodicArr, splitInput[i]);
        if ((retVal == null || retVal == undefined)) {
            view.displayMessage('No match found for this word: ' + splitInput[i]);
            btnState("");
            clearForm();
            return;
        } else {
            var joinedArr = joinArray(splitInput[i], retVal);
            view.buildFullDom(joinedArr, i);
        }
    }
    $('.periodic-element').addClass('pseudo').css("transition-delay", view.get('delay') + "s");
    $('.details').css("transition-delay", view.get('delay') +1+ "s").fadeIn();
    clearForm();
    return;
}

function joinArray(str, retVal) {
    var first = replaceSymbol(retVal.symbol, str);
    var removed = { string: first.splice(retVal.pos).join(''), after: true };
    first = { string: first.join(''), before: true };
    var retArr = Array.of(first, retVal, removed);
    return retArr;
}

function replaceSymbol(input, string) {
    var regex = new RegExp(input, 'i')
    return string.replace(regex, '').split('');
}

function btnState(state) {
    $('#submitBtn').attr("disabled", state);
}

function regexMatch(periodicArr, str) {
    var oneLen = [];
    var twoLen = [];
    for (var i = 0; i < periodicArr.length; i++) {
        var regex = new RegExp(periodicArr[i].symbol, 'i');
        var temp;
        if (periodicArr[i].symbol && (temp = str.match(regex)) !== null) {
            periodicArr[i]['pos'] = temp.index;
            (temp[0].length === 2) ? twoLen.push(periodicArr[i]): oneLen.push(periodicArr[i])

        }
    }
    return twoLen[0] ? twoLen[0] : oneLen[0] ? oneLen[0] : null;
}

function breakStr(string, count) {
    return [...string.slice(count - 1)].map((_, i) => string.slice(i, i + count));
}

function clearForm() {
    var form = document.getElementsByName('periodicForm')[0];
    form.reset();
}

function refreshPage() {
    window.location.reload();
}


var view = {
    left: 0,
    delay: 1,
    get: function(prop) {
        return prop === 'left' ? this.left : this.delay;
    },
    set: function(prop, value) {
        return prop === 'left' ? this.left += value : this.delay += value;
    },
    buildFullDom: function(dom, index) {
        var inputgroup = $('.input-group');
        var inputword = "input-word-" + index;
        var genWordId = '.' + inputword;
        var details = $('.details');
        inputgroup.append('<div class=' + inputword + '><div class="periodic-element" style="left:' + view.get('left') + 'px;transition-delay:' + view.get('delay') + 's"></div></div>');

        // for (var i = 0; i < dom.length; i++) {

        //     if (dom[i].symbol) {
        //         $(genWordId + ' ' + '.periodic-element').append('<div class="atomic-mass">' + dom[i].atomic_mass + '</div><div class="oxidation"></div><div class="symbol">' + dom[i].symbol + '</div><div class="number">' + dom[i].number + '</div><div class="shells">2</div>');
        //         dom[i].shells.forEach(function(val) {
        //             $(genWordId + ' ' + '.shells').append("<span>" + '-' + val + "</span>");
        //         });
        //         dom[i].oxidationStates.forEach(function(val) {
        //             $(genWordId + ' ' + '.oxidation').append("<span>" + val + "</span>");
        //         });
        //         details.append('<div>' + dom[i].name + '----------' + dom[i].source + '----------' + dom[i].summary + '</div>');
        //     }else if (dom[i].before) {
        //         $(genWordId + ' ' + '.periodic-element').attr("data-before", dom[i].string);
        //         var spanEl = $(genWordId + ' .periodic-element').outerWidth();
        //     } else if (dom[i].after) {
        //         $(genWordId + ' ' + '.periodic-element').attr("data-after", dom[i].string);
        //     }

        //     $(genWordId + ' ' + '.periodic-element').addClass('animate');
        // }

        $(genWordId + ' ' + '.periodic-element').append('<div class="atomic-mass">' + dom[1].atomic_mass + '</div><div class="oxidation"></div><div class="symbol">' + dom[1].symbol + '</div><div class="number">' + dom[1].number + '</div><div class="shells">2</div>');
        dom[1].shells.forEach(function(val) {
            $(genWordId + ' ' + '.shells').append("<span>" + '-' + val + "</span>");
        });
        dom[1].oxidationStates.forEach(function(val) {
            $(genWordId + ' ' + '.oxidation').append("<span>" + val + "</span>");
        });
        details.append('<div>' + dom[1].name + '----------' + dom[1].source + '----------' + dom[1].summary + '</div>');

        $(genWordId + ' ' + '.periodic-element').attr("data-before", dom[0].string);
        $(genWordId + ' ' + '.periodic-element').attr("data-after", dom[2].string);
        // var spanEl = $(genWordId + ' .periodic-element').outerWidth();

        $(genWordId + ' ' + '.periodic-element').addClass('animate');

        var el = $(genWordId + ' .periodic-element').outerWidth();
        view.set('left', el);
        view.set('delay', 2.5);
    },
    displayMessage: function(str) {
        var message = $('.message');
        message.text(str).fadeOut(4000, function() {
            message.show().text("");
        });
    }
};

function ajaxCall() {
    return tempObj = jsonData.elements.map(function(obj) {
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