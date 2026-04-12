"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOBILE_CARD_ITEMS = exports.HERO_CARD_ITEMS = exports.TESTIMONIALS = exports.CARD_ITEMS = exports.NAV_ITEMS = void 0;
const lucide_react_1 = require("lucide-react");
exports.NAV_ITEMS = [
    { href: '/', label: 'HOME' },
    { href: '/email-check', label: 'EMAIL CHECK' },
    { href: '/social-media-check', label: 'SOCIAL MEDIA CHECK' },
    { href: '/email-number-check', label: 'PHONE NUMBER CHECK' },
    { href: '/blog', label: 'ABOUT' },
];
exports.CARD_ITEMS = [
    { title: 'Scan Your Digital Footprint', desc: 'Enter your email to uncover where your data lives online—from old accounts to public forums and data breaches.', image: '/foot.png' },
    { title: 'Delete What Doesn’t Serve You', desc: 'Choose what stays and what goes. DogoTracker helps you request data removal from sites—on your terms.', image: '/deleting.webp' },
    { title: 'Let AI Be Your Privacy Analyst', desc: 'Our intelligent engine analyzes your exposure and gives real-time feedback on risks, trends, and next steps.', image: '/analyst.png' },
    { title: 'See the Big Picture', desc: 'Get a clear, interactive dashboard that maps your digital presence—by category, risk level, and timeline.', image: '/dashboard.png' },
    { title: 'Real-Time Privacy Alerts', desc: 'Be the first to know when your data appears in new places. Our AI keeps watch so you don’t have to.', image: '/alert.png' }
];
exports.TESTIMONIALS = [
    { desc: 'Before integrating this platform, our security team was drowning in alerts. Now, the AI filters noise and flags only what matters. It’s like having a digital analyst who never sleeps.', name: 'Aisha Bello, CTO at NovaTech Systems' },
    { desc: 'We needed a solution that could scale with us. The self-learning AI adapts to our evolving threat landscape better than any manual system we’ve tried.', name: "Fatima Yusuf, Co-founder of ByteShield" },
    { desc: 'I’m not a tech expert, but this made privacy simple. One scan showed me where my email had been exposed—and helped me clean it up instantly', name: 'Emmanuel O., Lagos' },
];
exports.HERO_CARD_ITEMS = [
    { icon: lucide_react_1.AtSign, title: "EMAIL CHECK", desc: "Deep-scan billions of data breach records to determine if your professional or personal email has been compromised or listed as a target.", sub: "Initialize Scan", arrow: lucide_react_1.ArrowRight },
    { icon: lucide_react_1.MessageSquareDot, title: "SOCIAL MEDIA CHECK", desc: "Analyze social handles against AI-identified malicious clusters and automated bot-nets to ensure identity integrity across platforms.", sub: "Verify Identity", arrow: lucide_react_1.ArrowRight },
    { icon: lucide_react_1.PhoneCall, title: "PHONE NUMBER CHECK", desc: "Real-time lookup for VOIP masks, scam list associations, and suspicious geographical origin data to block proactive threats.", sub: "Check Carrier", arrow: lucide_react_1.ArrowRight },
];
exports.MOBILE_CARD_ITEMS = [
    { icon: lucide_react_1.Mail, title: "Email Check", desc: "Scan for breaches & leaks" },
    { icon: lucide_react_1.Share, title: "Social Media Check", desc: "Verify digital footprints" },
    { icon: lucide_react_1.Phone, title: "Phone Number Check", desc: "Identify risk profiles" }
];
