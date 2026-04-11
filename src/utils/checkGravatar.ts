import crypto from "crypto"
import type { ScanResult } from "@/api/scanEmailRisk";

export async function checkGravatar(email: string): Promise<boolean> {
    const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex")
    const url = `https://www.gravatar.com/avatar/${hash}?d=404`

    const res = await fetch(url)
    return res.status === 200
}

export async function searchGitHub(email: string, username?: string): Promise<boolean> {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.cloak-preview+json"
    }



    const globalUrl = `https://api.github.com/search/commits?q=author:${encodeURIComponent(email)}`
    const res = await fetch(globalUrl, { headers  })

    if (!res.ok) {
        console.error("GitHub search failed:", res.statusText)
        return false
    }
    console.log(process.env.GITHUB_TOKEN)

    const data = await res.json()
    return data.total_count > 0
}

export async function searchEmailMentions(email: string): Promise<string[]> {
    const query = `"${email}"`
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}&num=10`
    const res = await fetch(url)
    const data = await res.json()

    if (data.organic_results && data.organic_results.length > 0) {
        return data.organic_results.map((result: string) => result.link)
    }

    return []
}

export async function emailScanner(email: string): Promise<boolean> {
    const apiKey = process.env.HUNTER_API_KEY
    if (!apiKey) {
        console.error("Missing HUNTER_API_KEY in environment variables")
        return false
    }

    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`

    try {
        const res = await fetch(url)
        if (!res.ok) {
            console.error("Hunter.io verification failed:", res.statusText)
            return false
        }

        const data = await res.json()
        const status = data?.data?.status
        return status === "valid"
    } catch (err) {
        console.error("Error verifying email:", err)
        return false
    }
}


export async function generateAISummary(results: ScanResult): Promise<string> {
    const prompt = `
    You are an email risk scanning agent.
    Analyze the following signals for the email: ${results.email}

    - Valid: ${results.isValid}
    - Gravatar: ${results.hasGravatar}
    - GitHub: ${results.foundOnGitHub}
    - Breached: ${results.foundInBreaches}
    - Public Mentions: ${results.publicMentions.length}

    Task:
    - Determine if this email has been exposed in breaches or leaks.
    - Provide a concise 2 -3 sentence risk assessment with a risk level (Low/Medium/High). 
  `;

    // Example using OpenAI API
   try {
       const response = await fetch("http://localhost:11434/api/generate", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ model: "gemma:2b",  prompt,  }),
       });

       const raw = await response.text()

       const lines = raw.trim().split("\n");

       let fullResponse = "";

       for (const line of lines) {
           try {
               const obj = JSON.parse(line);
               if(obj.response){
                   fullResponse += obj.response;
               }
           }catch{

           }
       }

       return fullResponse.trim() || "No AI summary available"
   }catch (err){
       console.error("Error generating AI summary:", err);
       return "Error generating AI summary:";
   }

}
