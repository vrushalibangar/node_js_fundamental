const fs = require('fs')
const path = require('path')
let header = [];
let json_string = "";
//change
function readLines(input, func) {
    var remaining = '';

    input.on('data', function (data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        let i = 0;
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            if (line.trim()!="") {
                func(line, i);
            }
            index = remaining.indexOf('\n');
            i++;
        }
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            func(remaining);
        } else if (remaining.length == 0) {
            create_json();
        }

    });
}

function func(data,line_number) {
    //console.log('Line: ' + data);
    let line = data.split(',');
    if (line_number == 0) {
        header = line;
    } else {
        let str = ",{";
        if (line_number == 1) {
            str = "{";
        } 
        
        let flag = 0;
        header.forEach(function (current_value, index) {
            let val = "";
            if (line[index] != undefined) {
                if (typeof (line[index]) == "string") {
                    val = '"' + line[index] + '"';
                }
            } else {
                val = '""';
            }
            if (flag == 0) {
                str += current_value + ":" + val
                flag = 1
            } else {
                str += "," + current_value + ":" + val
            }
        }); 
        str += "}";
        json_string += str;

    }
    
    
}

function create_json() {
    fs.writeFileSync(path.join(__dirname, 'customer-data.json'), "["+json_string+"]")
    //console.log(json_string);
}

var input = fs.createReadStream(path.join(__dirname, 'customer-data.csv'));
readLines(input, func);