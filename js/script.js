/*
File: script.js
GUI Assignment: Homework 4 Part 1
Jacob Ouellet, UMass Lowell Computer Science, jacob_ouellet@student.uml.edu
Copyright (c) 2021 by Jacob Ouellet. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Jacob Ouellet on Aug 3, 2021 at 7:06 PM
*/

// class that contains methods pertaining to the Table Parameters
class Table_Params{
    
    // constructor for class. Class contains values row_start, row_end, column_start, column_end
    constructor(rowStart, rowEnd, columnStart, columnEnd) {
        this.row_start = rowStart;
        this.row_end = rowEnd;
        this.column_start = columnStart;
        this.column_end = columnEnd;
    }
    // take the row and column values and multiply together to build the calculation table
    calculate_table(){
        const x_axis = [];
        const y_axis = [];
        const results = []; // results of each computation in linear array
        var i;
        
        // init each array with the range
        if(this.row_end < this.row_start){  // if the row end index is smaller than the start index then init the array backwards
            i = this.row_start;
            while(i >= this.row_end){ // while i (row start) is not less than row_end add each value between the row start and end to the x axis list
                x_axis.push(i);
                i--;
            }
        }
        else{  // if start index is larger than the end index then count upwards like normal
            i = this.row_start;
            while(i <= this.row_end){ // while i (row start) is not greater than row_end add each value between the row start and end to the x axis list
                x_axis.push(i);
                i++;
            }
        }

        if(this.column_end < this.column_start){ // if the column end index is smaller than the start index then init the array backwards
            i = this.column_start;
            var j = x_axis.length;
            while(i >= this.column_end){
                y_axis.push(i); // add the column value to the y axis 
                for(var x = 0; x < j; x++){ // for each value in the row (x_axis) multiply it by the current column we just got and add each resulting value to the result array 
                    results.push(i * x_axis[x])
                }
                i--;
            }
        }
        else{ // if start index is larger than the end index then count upwards like normal
            i = this.column_start;
            var j = x_axis.length;
            while(i <= this.column_end){
                y_axis.push(i); // add the column value to the y axis 
                for(var x = 0; x < j; x++){
                    results.push(i * x_axis[x]) // for each value in the row (x_axis) multiply it by the current column we just got and add each resulting value to the result array 
                }
                i++;
            }
        }
        return this._construct_html_table(x_axis, y_axis, results); // returns the html formatted table with the x axis y axis and results for each row col pair
    }

    // builds the html text for the table
    _construct_html_table(x_axis, y_axis, results){
        var text = '<tr><td></td>'; // first table column/row is empty so emprt <td></td>
        for(var x = 0; x < x_axis.length; x++){ // add all the x_axis elements to the first row in the table
            text += '<td>' + x_axis[x] + '</td>';
        }
        text += '</tr>';    // close the first row
        
        var offset = x_axis.length; // offset used to seperate the values in the results array since it is a linear array not 2d
        var result_index = 0;
        for(var y = 0; y < y_axis.length; y++){ // now add each row starting with the y axis (column index) and all its coresponding calulation from result array
            text += '<tr>';
            text += '<td>' + y_axis[y] + '</td>';   // add in the y axis (first column value)
            while(result_index < offset){   // add in all the calulation values for that row from the result table
                text += '<td>' + results[result_index] + '</td>';
                result_index++;
            }
            result_index = offset;  // increment the result index up to get the next row of table calulations
            offset = offset + x_axis.length;
            text += '</tr>';    // close the row
        }
        return text;    // return the text html table
    }
}

$(function(){
    $("#input_form").validate({
        // if invalid do not focus on any specific element
        focusInvalid: false,
        rules:{
            rowstart:{
                required: true, // make field required
                range: [-9999, 9999],   // range for which values must be
                step: 1     // make sure the value is an integer and not a decimal
            },
            rowend:{
                required: true,
                range: [-9999, 9999],
                step: 1
            },
            rowdif:{
                required: true,
                range: [0, 200]  // the value of difference must be between the range
            },
            columnstart:{
                required: true,
                range: [-9999, 9999],
                step: 1
            },
            columnend:{
                required: true,
                range: [-9999, 9999],
                step: 1
            },
            coldif:{
                required: true,
                range: [0, 200]
            }
        },
        messages:{
            // error messages for each attribute to be validated
            rowstart:{
                required: "row start index is required",
                range: "row start index must be an integer between -9999 and 9999",
                step: "row start must be an integer",
            },
            rowend:{
                required: "row end index is required",
                range: "row end index must be an integer between -9999 and 9999",
                step: "row end must be an integer",
            },
            rowdif:{
                required: "row difference is required",
                range: "The difference between row start/end index must not exceed 200 integers"
            },
            columnstart:{
                required: "column start index is required",
                range: "column start index must be an integer between -9999 and 9999",
                step: "column start must be an integer",
            },
            columnend:{
                required: "column end index is required",
                range: "column end index must be an integer between -9999 and 9999",
                step: "column end must be an integer",
            },
            coldif:{
                required: "column difference is required",
                range: "The difference between column start/end index must not exceed 200 integers"
            }
        }
    }),
    // when the form is submitted make sure the form is valid. If it is build the table
    $("#input_form").submit(function(event) {
        var isvalid = $("#input_form").valid()  // check if valid
        if (isvalid) { 
            process_table() // process the table if it is
        }
        event.preventDefault();
    }),

    $("#rowdif").focus(function() {     // when focused on the row difference input calulate the difference (row difference is read only)
        var parent = $("#rowdif").parent()  // get the div that contains rowstart,rowend, and rowdif
        const array = [];

        $(parent).find("input").each(function () {  // for each input in the div add it to the array and parse the int inside it
            array.push(parseInt($(this).val()))
        });

        this.value = Math.abs(array[0] - array[1])  // get the difference of row start and row end
    }),

    $("#coldif").focus(function() {    // when focused on the col difference input calulate the difference (col difference is read only) 
        var parent = $("#coldif").parent() // get the div that contains colstart, colend, and coldif
        const array = [];

        $(parent).find("input").each(function () { // for each input in the div add it to the array and parse the int inside it
            array.push(parseInt($(this).val()))
        });

        this.value = Math.abs(array[0] - array[1])  // get the difference of col start and col end
    }),

    // used to make sure if the row or column index changes then the difference must be revalidated by making row/col difference empty
    $("#rowstart").change(function(){
        $("#rowdif").val("");
    })
    $("#rowend").change(function(){
        $("#rowdif").val("");
    })
    $("#columnstart").change(function(){
        $("#coldif").val("");
    })
    $("#columnend").change(function(){
        $("#coldif").val("");
    })
});

function process_table(){
    // get each value from the form for the table indexes
    var row_start = parseInt(document.getElementById('rowstart').value);
    var row_end = parseInt(document.getElementById('rowend').value);
    var column_start = parseInt(document.getElementById('columnstart').value);
    var column_end = parseInt(document.getElementById('columnend').value);

    // construct the table object
    table_layout = new Table_Params(row_start, row_end, column_start, column_end);
    var table = document.getElementById('multTable'); // get the table from the page
    table.innerHTML = table_layout.calculate_table();   // put the html table into the page
}
