// Dollars to Words //

// Start functions to transform a numeric amount into a string //

// Error messages
function UserException(message) {
    this.message = message;
    this.name = 'UserException';
}

function setValues() {
    let numberList = {};

    numberList.ones = 
    [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ];

    numberList.teens = 
    [
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen"
    ];

    numberList.tens = 
    [
        "ten",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
        "hundred"
    ];

    numberList.highs = 
    [
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
        "septillion",
        "octillion",
        "nonillion",
        "decillion",
        "undecillion",
        "duodecillion",
        "tredecillion",
        "quatttuor-decillion",
        "quindecillion",
        "sexdecillion",
        "septen-decillion",
        "octodecillion",
        "novemdecillion",
        "vigintillion",
        "unvigintillion"
    ];

    return numberList;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function numberPointer(places, grouping) {
    let pointer = places % grouping;

    if (pointer === 0) {
        pointer = grouping;
    }

    return pointer;
}

function numberGroups(places, grouping) {
    let group;
    let pointer = numberPointer(places, grouping);

    group = (places - pointer) / grouping;

    return group;
}

function offsetChunks(cycle, offset, group) {
    chunk = {};

    chunk.start = 0;
    chunk.end = offset;

    if (cycle >= 1) {
        chunk.start = (group * (cycle - 1)) + offset;
        chunk.end = (group * cycle) + offset;
    }

    return chunk;
}

function getLrgs(highs, place) {
    return highs[place - 2];
}

function getHnds(ones, teens, tens, n) {
    let valRet = "";
    let onesPlace = n.toString().slice(-1);
    let tensPlace = n.toString().slice(1, 2);
    let hndsPlace = n.toString().slice(0, 1);

    valRet = ones[hndsPlace] + " " + tens[9];

    if (tensPlace > 0) {
        let onesTensC = n.toString().slice(-2);

        valRet += " and " + getTens(ones, teens, tens, onesTensC);
    } else if (onesPlace > 0) {
        valRet += " and " + getOnes(ones, onesPlace);
    }

    return valRet;
}

function getTens(ones, teens, tens, n) {
    let valRet = "";
    let onesPlace = n.toString().slice(-1);
    let tensPlace = n.toString().slice(0, 1);

    if (tensPlace > 1) {
        valRet = tens[tensPlace - 1];

        if (onesPlace > 0) {
            valRet += "-" + getOnes(ones, onesPlace);
        }
    } else if (tensPlace == 1 && onesPlace > 0) {
        valRet = teens[n - 11];
    } else if (tensPlace == 1 && onesPlace == 0) {
        valRet = tens[0];
    }

    return valRet;
}

function getOnes(ones, n) {
    return ones[n];
}

function processIntChunks(numLst, number, placeGroup) {
    let intLen;
    let intNum = parseInt(number);
    let retStr = "";

    if (intNum === 0) {
        return "";
    }

    intLen = intNum.toString().length;

    switch (intLen) {
        case 1:
            retStr = getOnes(numLst.ones, intNum);
            break;
        case 2:
            retStr = getTens(numLst.ones, numLst.teens, numLst.tens, intNum);
            break;
        case 3:
            retStr = getHnds(numLst.ones, numLst.teens, numLst.tens, intNum);
            break;
    }

    if (placeGroup > 1) {
        retStr += " " + getLrgs(numLst.highs, placeGroup) + ", ";
    }

    return retStr;
}

function createDecStr(dec) {
    let int = parseInt(dec * 100);

    return "and " + int + "/100 cents";
}

function processDec(input) {
    let decRnd;
    let strReturn = "";

    // Limit size
    if (input.length > 16) {
        input = input.slice(0, 16);
    }

    // Round to two dec places
    decRnd = roundNumber(parseFloat("." + input), 2);

    // If rounds to greater than 0
    if (decRnd > 0) {
        strReturn += " " + createDecStr(decRnd);
    }

    return strReturn;
}

function checkForNothing(input) {
    if (input === undefined) {
        input = "";
    }

    return input;
}

function removeAllChars(str, remChar) {
    return str.replace(new RegExp(remChar, 'g'), '');
}

function removeDollar(str) {
    let match = str.match(/^\$/);

    if (match !== null) {
        str = str.slice(1);
    }

    return str;
}

function splitFloat(float) {
    let splitFloatOn = float.indexOf(".");
    let retParts = {}

    if (splitFloatOn !== -1) {
        retParts.int = float.slice(0, splitFloatOn);
        retParts.dec = float.slice(splitFloatOn + 1);
    } else {
        retParts.int = float;
    }

    return retParts;
}

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
        let arr = ("" + num).split("e");
        let sig = ""

        if(+arr[1] + scale > 0) {
            sig = "+";
        }

        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}

function processErrors(objError) {
return "An error message: " + objError.error + " (" + objError.errorType + ")";
}

function processResults(objRetOrErr) {
    if (objRetOrErr.error !== undefined) {
        return processErrors(objRetOrErr);
    }

    return objRetOrErr.result;
}

function floatToString(convertNumber) {
    let convertNumberStr,
        convertNumberIntStr,
        convertNumberDecStr,
        intChkSiz,
        intFstChk,
        intChunks,
        floatParts,
        numList;
        strReturn = "";
        objReturn = {};

    // Check for nothing
    convertNumber = checkForNothing(convertNumber);

    // Remove commas
    convertNumberStr = removeAllChars(convertNumber.toString(), ",");

    // Remove dollar if exists
    convertNumberStr = removeDollar(convertNumberStr);

    // Check if it's a number
    if (!isNumeric(convertNumberStr)) {
        objReturn.error = "This doesn't look like anything to me.";
        objReturn.errorType = "not a number";

        return objReturn;
    }

    // Check for zero
    if (parseInt(convertNumberStr) === 0) {
        return "zero";
    }

    // Sort float and int
    floatParts = splitFloat(convertNumberStr);
    convertNumberIntStr = floatParts.int
    convertNumberDecStr = floatParts.dec;

    // Check for too large
    if (convertNumberIntStr.length > 69) {
        objReturn.error = "It's too big to be a space station.";
        objReturn.errorType = "number too large";

        return objReturn;
    }

    // Process integer portion
    intChkSiz = 3;
    intFstChk = numberPointer(convertNumberIntStr.length, intChkSiz);
    intChunks = numberGroups(convertNumberIntStr.length, intChkSiz) + 1;
    numLst = setValues();

    for (let i = 0; i < intChunks; i++) {
        let chunk = offsetChunks(i, intFstChk, intChkSiz);

        strReturn += processIntChunks(numLst, convertNumberIntStr.slice(chunk.start, chunk.end), intChunks - i);
    }

    // Get rid of unwanted chars on end
    strReturn = strReturn.trim();
    if (strReturn.slice(-1) === ",") {
        strReturn = strReturn.slice(0, strReturn.length - 1);
    }

    // Add dollars
    strReturn += " dollars";

    // Check for decimal
    if (convertNumberDecStr !== undefined) {
        strReturn += processDec(convertNumberDecStr);
    }

    // Add that period and pack it up
    strReturn += ".";
    objReturn.result = strReturn;

    return objReturn;
}

// End functions to transform a numeric amount into a string //

// Start web section //

// Run when all DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    var dollarAmount =  document.getElementById('dollar-amount');
    var buttonClear =   document.getElementById('btn-clear');
    var buttonSubmit =  document.getElementById('btn-submit');
    var textDescribe =  document.getElementById('p-describe');
    var textResults =   document.getElementById('p-results');

    var processClear = function () {
        dollarAmount.value = "";
        textDescribe.classList.add("hidden");
        textResults.textContent = "";
        dollarAmount.focus();
    }

    var processSubmit = function () {
        let result = processResults(floatToString(dollarAmount.value));

        if (dollarAmount.value !== "") {
            textDescribe.classList.remove("hidden");
            textResults.textContent = result;
        } else {
            processClear();
        }
    }

    var keyInput = function (key) {
        if (key.code === "Enter" || key.code === "NumpadEnter") {
            processSubmit();
        }
    }

    buttonClear.addEventListener("click", processClear, false);
    buttonSubmit.addEventListener("click", processSubmit, false);
    document.addEventListener("keypress", keyInput, false);
});

// End web section //
