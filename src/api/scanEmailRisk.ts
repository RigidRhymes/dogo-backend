import {checkGravatar, generateAISummary, searchEmailMentions, searchGitHub, emailScanner} from "../utils/checkGravatar";



export interface ScanResult {
    email: string
    isValid: boolean
    hasGravatar: boolean
    foundOnGitHub: boolean
    foundInBreaches: boolean
    publicMentions: string[]
    summary: string
}


export async function scanEmailRisk(email: string) : Promise<ScanResult> {

    const results: ScanResult = {
        email,
        isValid: false,
        hasGravatar: false,
        foundOnGitHub: false,
        foundInBreaches: false,
        publicMentions: [],
        summary: ''
    }

//     1. Email Verification
    results.isValid = await emailScanner(email); //via Hunter.io

//     2. Gravatar Check
    results.hasGravatar = await checkGravatar(email)

//     3. GitHub usage
    results.foundOnGitHub = await searchGitHub(email);

    results.publicMentions = await searchEmailMentions(email);


    results.summary = await generateAISummary(results);

    return results;

}