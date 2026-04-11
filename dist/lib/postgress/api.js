"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitScan = submitScan;
async function submitScan(email, token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Scan failed');
    }
    return res.json();
}
