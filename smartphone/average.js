var pointer = 0;
var actualValue = 0;
var data = [];
var offset = 20;

var putValue = function(){
    data[pointer] = actualValue;
    pointer ++;
    if(pointer >= (offset-1)) {
        pointer = 0;
    }
};

var getValue = function() {
    var sum = 0;

    for(var i = 0; i < (offset-1); i++) {
        sum = sum + data[i];
    }

    return sum/offset;
};