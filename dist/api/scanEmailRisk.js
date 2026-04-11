"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanEmailRisk = scanEmailRisk;
const checkGravatar_1 = require("../utils/checkGravatar");
async function scanEmailRisk(email) {
    const results = {
        email,
        isValid: false,
        hasGravatar: false,
        foundOnGitHub: false,
        foundInBreaches: false,
        publicMentions: [],
        summary: ''
    };
    //     1. Email Verification
    results.isValid = await (0, checkGravatar_1.emailScanner)(email); //via Hunter.io
    //     2. Gravatar Check
    results.hasGravatar = await (0, checkGravatar_1.checkGravatar)(email);
    //     3. GitHub usage
    results.foundOnGitHub = await (0, checkGravatar_1.searchGitHub)(email);
    results.publicMentions = await (0, checkGravatar_1.searchEmailMentions)(email);
    results.summary = await (0, checkGravatar_1.generateAISummary)(results);
    return results;
}
