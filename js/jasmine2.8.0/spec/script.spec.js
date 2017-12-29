describe('jasmine-node', function(){

  

  it('should break string into array items with given count', function(){
    var breakSt = breakStr("breaking",3);
    expect(breakSt).toEqual(["bre", "rea", "eak", "aki", "kin", "ing"]);
  });

  it('should replace symbol with empty', function(){
    var replace = replaceSymbol("br","breaking");
    expect(replace).toEqual(["e", "a", "k", "i", "n", "g"]);
  });
  it('should find regex match of element', function(){
    var periodicArr = ajaxCall();
    var regex_match = regexMatch(periodicArr, "br");
    expect(regex_match).not.toBe(null);
    expect(regex_match).toEqual(jasmine.objectContaining({
      symbol: "br"
    }));
  });  
  it('should join array of three', function(){
    var periodicArr = ajaxCall();
    var join_array = joinArray("breaking", {symbol: "br",pos: 0});
    expect(join_array).not.toBe(null);
    expect(join_array).toContain("eaking");
  });

  xit('shows asynchronous test', function(){
    setTimeout(function(){
      expect('second').toEqual('second');
      asyncSpecDone();
    }, 1);
    expect('first').toEqual('first');
    asyncSpecWait();
  });

  xit('shows asynchronous test node-style', function(done){
    setTimeout(function(){
      expect('second').toEqual('second');
      // If you call done() with an argument, it will fail the spec 
      // so you can use it as a handler for many async node calls
      done();
    }, 1);
    expect('first').toEqual('first');
  });
});