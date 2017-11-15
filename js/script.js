

    // console.log("jsonFunction",jsonFunction);

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
            if( retVal !== null || retVal !== undefined) {
                var regex = '[^' + retVal.symbol + ']';
                regex = new RegExp(regex, 'gi')
                var reduceArr = val.match(regex);
                reduceArr.splice(retVal.pos, 0, retVal);
                // periodicArr.splice(periodicArr.indexOf(retVal), 1);
                view.buildObjDom(reduceArr, idx);
                // view.updateColor(retVal, val, idx);
            }else {
                view.displayMessage('No match found');
                clearForm();
                return;
            }
        })
        clearForm();
    }

    function matchElem(periodicArr, letterArr) {
        //randomize array here
        for (var i = 0; i < letterArr.length; i++) {
            for (var j = 0; j < periodicArr.length; j++) {
                if (letterArr[i] === periodicArr[j].symbol) {
                    // if (letterArr[i] === periodicArr[j]) {
                    // return letterArr[i];
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

    // function forFn(arr) {
    //     var retArray = [];
    //     for (var i = 0; i < arr.length; i++) {
    //         if (arr[i].symbol) {
    //             var elObj = {
    //                 atomic_mass: arr[i].atomic_mass,
    //                 number: arr[i].number,
    //                 shells: arr[i].shells,
    //                 symbol: arr[i].symbol.toLowerCase()
    //             }
    //             retArray.push(elObj);
    //         } else {
    //             retArray.push(arr[i].toLowerCase());
    //         }
    //     }
    //     return retArray;
    // }

    window.onload = init;

    var model = {
        chunkNumber: 2,
        jsonElems: [],
        origInput: ""
    };

    var view = {
        buildDom: function(dom) {
            var hTag = $('#h1');
            for (var i = 0; i < dom.length; i++) {
                hTag.append("<span>" + dom[i].toLowerCase() + "</span>");
            }
        },
        buildObjDom: function(dom, index) {
            var inputgroup = $('.input-group');
            var details = $('.details');
            var inputword = "input-word-" + index;
            var genWordId = '#' + inputword;
            inputgroup.append('<div id=' + inputword + '></div>');
            var count = 0;
            for (var i = 0; i < dom.length; i++) {
                if (dom[i].symbol) {
                    $(genWordId).append('<div class="periodic-element"><div class="atomic-mass">' + dom[i].atomic_mass + '</div><div class="oxidation"></div><div class="symbol">' + dom[i].symbol.toLowerCase() + '</div><div class="number">' + dom[i].number + '</div><div class="shells">2</div></div>');
                    dom[i].shells.forEach(function(val, idx) {
                        $(genWordId + ' ' + '.shells').append("<span>" + '-' + val + "</span>");
                    });
                    dom[i].oxidationStates.forEach(function(val, idx) {
                        $(genWordId + ' ' + '.oxidation').append("<span>" + val + "</span>");
                    });
                    details.append('<div>'+dom[i].name+'----------'+dom[i].source+'----------'+dom[i].summary+'</div>');
                    console.log("big",$('.periodic-element').outerWidth());
                    var perEl = $('.periodic-element').outerWidth();
                    count += perEl;
                } else {
                    $(genWordId).append("<span>" + dom[i].toLowerCase() + "</span>");
                    console.log("span",$(genWordId + ' > span').outerWidth());
                    var spanEl = $(genWordId + ' > span').outerWidth();
                    count += spanEl;
                }
                console.log("ount",count);
            }
        },
        displayMessage: function(str) {
            var message = $('.message');
            message.text(str).fadeOut(4000, function() {
                message.show().text("");
            });
        },
        updateColor: function(colorEle, splitWord, idx) {
            var name = $('#name');
            var wordId = "word_" + idx
            var genWordId = '#' + wordId;
            if (idx > 0) {
                name.append('<div id=' + wordId + '></div>');
                for (var i = 0; i < splitWord.length; i++) {
                    $(genWordId).append("<span>" + splitWord[i].toLowerCase() + "</span>");
                }
            } else {
                this.buildDom(splitWord);
            }
            if (colorEle === undefined) {
                return;
            } else if (colorEle.length === 2) {
                colorEle = colorEle.match(/.{1,1}/g);
            }

            for (var i = 0; i < colorEle.length; i++) {
                for (var k = 0; k < splitWord.length; k++) {
                    if (splitWord[k] === colorEle[i]) {

                        if (idx > 0) {
                            $(genWordId).children().eq(i).addClass('highlight');
                        } else {
                            name.children().eq(i).addClass('highlight');
                        }
                        break;
                    }
                }

            }
        }
    };

    var controller = {
        jsonUrl: 'PeriodicTableJSON.json',
        // processInput: function(colorList) {
        //     view.updateColor(colorList, model.origInput);
        // }
    };

    function ajaxCall() {
        $.ajax({
            dataType: "json",
            url: controller.jsonUrl,
            data: "data",
            success: function(response) {
                // model.jsonElems = forFn(response.elements);
                model.jsonElems = response.elements.map(function(obj) {
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
        });
    }