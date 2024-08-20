const firefose = require("firefose");
const Account = require("../models/account");

async function verifyAccountData(data) {
   await checkDuplicateEmail(data.email);
}

async function checkDuplicateEmail(email) {
    const accounts = await  Account.find(new firefose.Query().where('email', '==', email));

    if(accounts == undefined) {
        return accounts[0];
    }
    
    if(accounts.length > 0 || accounts != undefined) {
        throw new Error("An account with this email already exists!");
    } 
}

module.exports = { verifyAccountData: verifyAccountData }