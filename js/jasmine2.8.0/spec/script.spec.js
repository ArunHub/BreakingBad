describe('jasmine-node', function() {
    var periodicArr;
    beforeEach(function() {
        periodicArr = ajaxCall();
    })

    var str = "breaking";
    var symbol = "br";
    describe('break string', function() {
        var breakSt = breakStr(str, 3);
        var expected = ["bre", "rea", "eak", "aki", "kin", "ing"];
        it('should break string into array items with given count', function() {
            expect(breakSt).toEqual(expected);
        });
        it('string length equals array items length', function() {
            expect(str.length).toEqual(expected.length + 2);
        });
    });

    it('should replace symbol with empty', function() {
        var replace = replaceSymbol(symbol, str);
        var expected = ["e", "a", "k", "i", "n", "g"];
        expect(symbol.length).toBe(2);
        expect(replace).toEqual(expected);
        expected.forEach(function(val) {
            expect(val.length).toEqual(1);
        });
        expect(replace).toContain(expected[0]);
        expect(replace).toEqual(jasmine.arrayContaining(expected));
        expect(replace).not.toEqual(jasmine.arrayContaining([symbol]));
    });

    it('should find regex match of element', function() {
        var regex_match1 = regexMatch(periodicArr, symbol);
        var regex_match2 = regexMatch(periodicArr, "zz");
        expect(regex_match1).not.toBe(null);
        expect(regex_match2).toBe(null);
        expect(regex_match1).toEqual(jasmine.objectContaining({
            symbol: symbol
        }));
        expect(regex_match1).toEqual(jasmine.objectContaining({ symbol: jasmine.stringMatching(/br/) }));
    });

    it('should join array of three', function() {
        var join_array = joinArray("breaking", { symbol: symbol, pos: 0 });
        expect(join_array).not.toBe(null);
        expect(join_array).toContain("eaking");
    });

    it('should call the process input function', function() {
      // spyOn(window, 'btnState');
      window.btnState = jasmine.createSpy('btnState');
      spyOn(window, 'regexMatch');
      spyOn(view, 'buildFullDom');
      spyOn(view, 'displayMessage');
      spyOn(window, 'clearForm');
      spyOn(window, 'ajaxCall');
      // spyOn(document, 'getElementsByName');
      var processInp = processInput("breaking bad");
      expect(window.regexMatch).toHaveBeenCalled();
      expect(window.regexMatch).toHaveBeenCalledWith(periodicArr, "breaking");
      expect(window.regexMatch).not.toBeNull();
      expect(processInp).toBeUndefined();
      expect(window.ajaxCall).toHaveBeenCalled();
      expect(view.displayMessage).toHaveBeenCalledTimes(1);
      expect(window.btnState).toHaveBeenCalledTimes(2);
      expect(view.buildFullDom).toHaveBeenCalled();
      // expect(window.clearForm).toHaveBeenCalled();
      // expect(document.getElementsByName).toHaveBeenCalled();
    });
});