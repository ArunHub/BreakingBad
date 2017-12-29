describe('jasmine-node', function(){

  var df = "";

  it('should break string into array items with given count', function(){
    // expect(df).toEqual(3);
  });

  it('shows asynchronous test', function(){
    // setTimeout(function(){
    //   expect('second').toEqual('second');
    //   asyncSpecDone();
    // }, 1);
    // expect('first').toEqual('first');
    // asyncSpecWait();
  });

  it('shows asynchronous test node-style', function(done){
    // setTimeout(function(){
    //   expect('second').toEqual('second');
    //   // If you call done() with an argument, it will fail the spec 
    //   // so you can use it as a handler for many async node calls
    //   done();
    // }, 1);
    // expect('first').toEqual('first');
  });
});