// This file includes all validation logic for account creation.
// Author: Daniel Manley

// Requirements
const firefose = require("firefose");
const Account = require("../models/account");

// Entry point for validation
async function verifyAccountData(data) {
   await checkDuplicateEmail(data.email);
}

// Check to see whether or not an email is already associated with an account.
async function checkDuplicateEmail(email) {
    const accounts = await  Account.find(new firefose.Query().where('email', '==', email));

    // If the query does not return any accounts, return with no errors.
    if(accounts.length == 0) {
        return;
    }
    
    // if one or more accounts exist with that email, throw error
    if(accounts.length > 0 || accounts != undefined) {
        throw new Error("An account with this email already exists!");
    } 
}

module.exports = { verifyAccountData: verifyAccountData }