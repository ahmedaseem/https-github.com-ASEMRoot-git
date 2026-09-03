const API_BASE = "https://gov-server.com/api";

const businesses = await fetch(`${API_BASE}/businesses`).then(r => r.json());
const products = await fetch(`${API_BASE}/products`).then(r => r.json());
const tourism = await fetch(`${API_BASE}/tourism`).then(r => r.json());
