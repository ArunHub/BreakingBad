    function fireSubmit() {
        clearSubmit();
        var getInput = document.getElementById('getInput');
        var input = model.origInput = getInput.value.trim();
        if (input === null || input.length === 0 || input.match(/(^[0-9])|([0-9]$)|([^a-zA-Z\s+])/)) {
            view.displayMessage('Oops, Enter only Letters!');
            clearForm();
            return;
        } else {
            concatArrayStr(input.toLowerCase());
        }
    }

    function concatArrayStr(input) {
        var retStr = "";
        var tempArray = [];
        var splitArray = input.split(/\s+/);
        var periodicSym = model.jsonElems.map(function(object){
            return object.symbol;
        });
        splitArray.forEach(function(val, idx) {
            var twoLetterArray = produceTwoChArray(val);
            var retVar = idx % 2 !== 0 ? matchElem(periodicSym, val) : matchElem(periodicSym, twoLetterArray);
            periodicSym.splice(periodicSym.indexOf(retVar), 1);
            view.updateColor(retVar, val, idx);
        })
        clearForm();
    }

    function matchElem(arr, parseInp) {
        var retVar;
        //randomize array here

        // for (var i = 0; i < arr.length; i++) {
        //     var reg = new RegExp(arr[i], 'gi');
        //     if (parseInp.match(reg) !== null) {
        //         retVar = arr[i]
        //         return retVar;
        //     }
        // }
        for (var i = 0; i < parseInp.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                console.log("text", parseInp[i], arr[j]);
                if (parseInp[i] === arr[j]) {
                    console.log('match', parseInp[i]);
                    return parseInp[i];
                } else if ((parseInp[parseInp.length - 1].length === 2) && (arr.length - 1) === j && (parseInp.length - 1) === i) {
                    // var single = forFn(arr);
                    // matchElem(single, parseInp);
                }
            }
        }
    }

    function produceTwoChArray(word) {
        var temp = "";
        var tempArr = [];
        // var retVar = generateWordSequence(n);

        for (var i = 0; i < word.length; i++) {
            temp += word[i];
            if (temp.length === 2) {
                tempArr.push(temp);
            }
            temp = word[i];
        }
        return tempArr;
    }

    function generateWordSequence(n) {
        var n = n - 2;
        var temp1 = [];
        for (var j = n; j >= 0; j--) {
            temp1.push("word[i - " + j + "]");
        }
        temp1 = temp1.join('+').toString();
        return temp1;
    }

    function clearSubmit() {
        var hTag = $('#h1');
        hTag.children().remove();
    }

    function clearForm() {
        var form = document.getElementsByName('guessForm')[0];
        form.reset();
    }

    function init() {
        var submitBtn = document.getElementById('submitBtn');
        submitBtn.onclick = fireSubmit;
        ajaxCall();
    }

    function forFn(arr) {
        var retArray = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].symbol) {
                var elObj = {
                    atomic_mass: arr[i].atomic_mass,
                    number: arr[i].number,
                    shells: arr[i].shells,
                    symbol: arr[i].symbol.toLowerCase()
                }
                retArray.push(elObj);
            } else {
                retArray.push(arr[i].toLowerCase());
            }
        }
        return retArray;
    }

    window.onload = init;

    var model = {
        jsonElems: [],
        origInput: "",
        findSelected: function(chars, symbols) {
            var retArray = [];
            for (var i = 0; i < chars.length; i++) {
                symbols.forEach(function(symbol) {
                    if (chars[i] === symbol) retArray.push(chars[i]);
                });
            }
            return retArray;
        },
        filterDups: function(selList) {
            var retArray = selList.filter(function(elem, pos) {
                return selList.indexOf(elem) == pos;
            });
            return retArray;
        }
    };

    var view = {
        buildDom: function(dom) {
            var hTag = $('#h1');
            for (var i = 0; i < dom.length; i++) {
                hTag.append("<span>" + dom[i].toLowerCase() + "</span>");
            }
        },
        displayMessage: function(str) {
            var message = $('blockquote');
            message.text(str).fadeOut(4000, function() {
                message.show().text("");
            });
        },
        updateColor: function(colorEle, splitWord, idx) {
            var hTag = $('#h1');
            // var prevIdx = 0;
            // colorArr.forEach(function(color) {
            //     charList.forEach(function(char, idx) {
            //         if (color === char) {
            //             if (prevIdx !== idx - 1) {
            //                 console.log("ajc", prevIdx);
            //                 hTag.children().eq(idx).addClass('highlight');
            //             } else {
            //                 // charList.splice(idx,1);
            //             }
            //             prevIdx = idx;
            //         }
            //     });
            // });
            var wordId = "word_" + idx
            var genWordId = '#' + wordId;
            if (idx > 0) {
                hTag.append('<div id=' + wordId + '></div>');
                for (var i = 0; i < splitWord.length; i++) {
                    $(genWordId).append("<span>" + splitWord[i].toLowerCase() + "</span>");
                }
            } else {
                this.buildDom(splitWord);
            }
            if (colorEle === undefined) {
                return;
            } 
            // else if (colorEle.length === 2) {
            //     colorEle = colorEle.match(/.{1,1}/g);
            //     debugger;
            // }

            for (var i = 0; i < colorEle.length; i++) {
                for (var k = 0; k < splitWord.length; k++) {
                    if (splitWord[k] === colorEle[i]) {

                        if (idx > 0) {
                            $(genWordId).children().eq(i).addClass('highlight');
                        } else {
                            hTag.children().eq(i).addClass('highlight');
                        }
                        break;
                    }
                }

            }
        }
    };

    function ajaxCall() {

        $.ajax({
            dataType: "json",
            url: controller.jsonUrl,
            data: "data",
            success: function(response) {
                // model.jsonElems = forFn(response.elements);
                // model.jsonElems = forFn(response.elements);
                model.jsonElems = response.elements.map(function(obj) {
                    return {
                        atomic_mass: obj.atomic_mass,
                        number: obj.number,
                        shells: obj.shells,
                        symbol: obj.symbol.toLowerCase()
                    }
                })
            }
        });
    }

    var controller = {
        jsonUrl: 'PeriodicTableJSON.json',
        processInput: function(colorList) {
            view.updateColor(colorList, model.origInput);
        }
    };