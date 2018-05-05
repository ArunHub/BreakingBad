function clearForm() {
    var form = document.getElementsByName('periodicForm');
    form[0].reset();
}

function breakStr(string, count) {
    return [...string.slice(count - 1)].map((_, i) => string.slice(i, i + count));
}

function refreshPage() {
    window.location.reload();
}

function ajaxCall() {
    var tempObj = jsonData.elements.map(function(obj) {
        return {
            name: obj.name,
            source: obj.source,
            summary: obj.summary,
            category: obj.category,
            atomic_mass: obj.atomic_mass,
            number: obj.number,
            shells: obj.shells,
            symbol: obj.symbol.toLowerCase(),
            oxidationStates: obj.oxidationStates
        };
    });
    return tempObj;
}

function regexMatch(periodicArr, str) {
    var oneLen = [];
    var twoLen = [];
    for (var i = 0; i < periodicArr.length; i++) {
        var regex = new RegExp(periodicArr[i].symbol, 'i');
        var temp;
        if (periodicArr[i].symbol && (temp = str.match(regex)) !== null) {
            periodicArr[i]['pos'] = temp.index;
            (temp[0].length === 2) ? twoLen.push(periodicArr[i]): oneLen.push(periodicArr[i]);

        }
    }
    return twoLen[0] ? twoLen[0] : oneLen[0] ? oneLen[0] : null;
}

function joinArray(str, retVal) {
    var first = replaceSymbol(retVal.symbol, str);
    var removed = first.splice(retVal.pos).join('');
    first = first.join('');
    var retArr = Array.of(first, retVal, removed);
    return retArr;
}

function addClass(id, cl) {
    var element, name, arr;
    element = document.getElementById(id);
    name = cl;
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

function replaceSymbol(input, string) {
    var regex = new RegExp(input, 'i');
    return string.replace(regex, '').split('');
}

function play() {
    var audio = document.getElementById("audio");
    audio.play();
}

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
        // play();
    }
}

function processInput(input) {
    var splitInput = input.split(/\s+/);
    var periodicArr = ajaxCall();
    var notFoundId = document.getElementById('not-found');
    document.getElementById('submit-btn').setAttribute('disabled','disabled');

    for (var i = 0; i < splitInput.length; i++) {
        var retVal = regexMatch(periodicArr, splitInput[i]);
        if ((retVal === null || retVal === undefined)) {
            var createEl = document.createElement('span');
            createEl.innerText = splitInput[i] + " ";
            notFoundId.append(createEl);
            notFoundId.style.display = "block";
        } else {
            var joinedArr = joinArray(splitInput[i], retVal);
            view.buildFullDom(joinedArr, i);
        }
    }

    [].forEach.call(document.querySelectorAll('.periodic-element'), function(el) {
      el.classList.add('pseudo'); // or add a class
      el.style.transitionDelay = view.get('delay') + "s";
    });

    var details = document.getElementById('details');
    Object.assign(details.style, {opacity: 1, transitionDelay: view.get('delay') + 1 + "s" });

    clearForm();
    return;
}

function createElem(tag, classN, attr, text) {
    var ce = document.createElement(tag);
    ce.className += classN;

    if (attr !== undefined) {
        attr.type === 'id' ? ce.setAttribute('id', attr.value) : ce.setAttribute('title', attr.value);
    }

    if (text) ce.innerText = text;
    return ce;
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
    setCateColor: function(category){
      switch(category) {
        case 'non metal': return '#ffcc00';
        case 'noble gas': return '#33cccc';
        case 'alkaline earth metal': return '#99ccff';
        case 'semi metal': return '#ff8080';
        case 'halogen': return '#99cc00';
        case 'transition metal': return '#99ccff';
        case 'basic metal': return '#ccc0da';
        case 'alkali metal': return '#ff99cc';
        case 'lanthanides': return '#f1dddc';
        case 'actinides': return '#f1dddc';
        default: return 'whitesmoke';
      }
    },
    buildFullDom: function(dom, index) {
        var inputword = "input-word-" + index;
        var genWord = '.' + inputword;
        var categoryColor = view.setCateColor(dom[1].category);
        var inputGroup = document.getElementById('input-group');
        var peIndex = 'pe-'+index;

        var ciw = createElem('div', inputword);
        var cpe = createElem('div','periodic-element', {type: 'id', value: peIndex});
        Object.assign(cpe.style, {left: view.get('left') + 'px', transitionDelay: view.get('delay') + 's' });
        ciw.append(cpe); //appendchild
        inputGroup.append(ciw);

        var thisEl = document.getElementById(peIndex);

        thisEl.innerHTML = '<div class="atomic-mass" title="atomic mass">' + dom[1].atomic_mass + '</div><div class="oxidation" title="oxidation states"></div><div class="symbol" title="periodic element">' + dom[1].symbol + '</div><div class="number" title="atomic number">' + dom[1].number + '</div><div class="shells" title="shells">2</div>';

        dom[1].shells.forEach(function(val) {
          var createShell = createElem('span', '', undefined, '-'+val);
            thisEl.lastElementChild.append(createShell);
        });

        dom[1].oxidationStates.forEach(function(val) {
          var createOxd = createElem('span', '', undefined, val);
            thisEl.firstElementChild.nextElementSibling.append(createOxd);
        });
        
        var _details = document.getElementById('details');
        _details.innerHTML += '<div><strong style="color:'+categoryColor+'">' +dom[1].name + ' - <span class="details-symbol">' + dom[1].symbol + '</span></strong><br>' + dom[1].summary + '<br>' + dom[1].source+'</div>';

        thisEl.setAttribute("data-before", dom[0]);
        thisEl.setAttribute("data-after", dom[2]);
        var spanEl = thisEl.offsetWidth; //useless

        addClass(peIndex, 'transit');

        var smokeElement = 'smoke'+index;
        var cookEl = document.getElementsByClassName('cook-element')[0];

        var createSmokeEl = createElem('div', '', {type:'id', value: smokeElement});
        createSmokeEl.setAttribute('title', 'category: '+dom[1].category);
        cookEl.append(createSmokeEl);

        var smokeJs = document.getElementById(smokeElement);

        smokeJs.className += ' animate';
        smokeJs.style.animationDelay = view.get('delay') + "s";

        smokeJs.addEventListener("webkitAnimationEnd", deleteSmoke, false);
        smokeJs.addEventListener("animationend", deleteSmoke, false);
        smokeJs.addEventListener("oanimationend", deleteSmoke, false);

        function deleteSmoke() {
          window[smokeElement].destroy();
        }

        var elWidth = thisEl.offsetWidth;

        view.set('left', elWidth);
        view.set('delay', 2.5);

        smokeEmitter(smokeElement);
        window[smokeElement].opts.color = categoryColor;

    },
    displayMessage: function(str) {
        var message = document.getElementById('message');
        document.getElementById('submit-btn').setAttribute('disabled','disabled');
        message.innerText = str;
        fade(message);
    }
};


function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://localhost:5000/periodic-elements/");
oReq.send();

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            console.log(op,"op")
            clearInterval(timer);
            op = 0;
            element.style.opacity = op;
            // element.style.display = 'none';
            document.getElementById('submit-btn').removeAttribute('disabled');
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 300);
}
