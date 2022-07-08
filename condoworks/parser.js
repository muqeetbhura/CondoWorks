const fs = require('fs')

let fileName = "";

process.argv.forEach(function (val, index, array) {
    if (array.length > 3) {
        console.log("ERROR: Too Many Args");
    } else {
        fileName = array[2];
    }
});

fs.readFile(fileName, function(err, data) {
    if(err) throw err;
    // ingesting txt file
    const array = data.toString().split("\n");

    // finding index of first mention of account number and customer number
    const indexCusAccNum = array.findIndex(element => {
        if (element.includes("Customer no. - Account no.")) {
            return true;
        }
    })
    // creating output strings
    const customerNumber = "Customer number: " + array[indexCusAccNum+4].trim().split(" - ")[0];
    const accountNumber = "Account number: " + array[indexCusAccNum+4].trim().split(" - ")[1];

    // finding index of first mention of bill period
    const indexBillPeriod = array.findIndex(element => {
        if (element.includes("Bill period:")) {
            return true;
        }
    })
    // creating output strings
    const billPeriodHalf = Math.ceil(array[indexBillPeriod+1].length / 2);
    const billPeriod = "Bill period: " + array[indexBillPeriod+1].substring(billPeriodHalf).trim();

    // finding index of bill number
    const indexBillNumber = indexCusAccNum+6;
    // creating output string
    const billNumber = array[indexBillNumber].trim();

    // finding index of bill date
    const indexBillDate = indexCusAccNum+5;
    // creating output string
    const billDate = array[indexBillDate].trim();

    // finding index of total new charges
    const indexTotalNewCharges = array.findIndex(element => {
        if (element.includes("Total new charges")) {
            return true;
        }
    })
    // create output string
    const totalNewCharges = "Total new charges: " + array[indexTotalNewCharges].trim().split(/\s+/)[3];

    // spacing
    console.log();
    // formating
    console.log("------------------------------------------------")
    // print out customer number
    console.log(customerNumber);
    // print our account number
    console.log(accountNumber);
    // print bill period
    console.log(billPeriod);
    // print bill number
    console.log(billNumber);
    // print bill date
    console.log(billDate);
    //print total new charges
    console.log(totalNewCharges);
    // formating
    console.log("------------------------------------------------")
    // spacing
    console.log();
});