const firefose = require("firefose");
const Member = require("../models/member");

async function verifyMemberData(data) {
   await checkDuplicateEmail(data.email);
}

async function checkDuplicateEmail(email) {
    const query = new firefose.Query().where('email', '==', email);

    const members = await Member.find(query);
    
    if(members.length > 0 || members != undefined) {
        throw new Error("A member with this email already exists!");
    } 
}

module.exports = { verifyMemberData }