import axios from "axios";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL: BASE_URL, timeout: 20000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("der01_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeReport(report) {
  if (!report) return report;
  return { ...report, _id: report._id || report.id };
}

function normalizeStats(payload) {
  return payload?.stats || payload || { total: 0, critical: 0, high: 0, moderate: 0, low: 0 };
}

const seedReports = [];
function getMockReports() { return JSON.parse(localStorage.getItem("der01_reports") || "null") || seedReports; }
function saveMockReports(reports) { localStorage.setItem("der01_reports", JSON.stringify(reports)); }
function wait(ms = 300) { return new Promise((resolve) => setTimeout(resolve, ms)); }

export const api = {
  async login(credentials) {
    if (!USE_MOCK) {
      const { data } = await client.post("/users/auth/login", credentials);
      return data;
    }
    await wait();
    return { token: "mock-token", user: { id: "mock-user", username: "Mock User", email: credentials.email, role: "citizen" } };
  },

  async register(data) {
    if (!USE_MOCK) {
      const payload = { username: data.username || data.name, email: data.email, password: data.password };
      const { data: result } = await client.post("/users/auth/register", payload);
      return result;
    }
    await wait();
    return { token: "mock-token", user: { id: `user-${Date.now()}`, username: data.name, email: data.email, role: "citizen" } };
  },

  async getReports(params = {}) {
    if (!USE_MOCK) {
      const { data } = await client.get("/reports", { params });
      const reports = (data.reports || []).map(normalizeReport);
      return { ...data, reports };
    }
    await wait(200);
    return { reports: getMockReports() };
  },

  async getMyReports() {
    // The current backend has no /reports/my endpoint. Fetch all reports and
    // filter by this browser's stable reporter device ID, which is sent on submit.
    const deviceId = localStorage.getItem("der01_device_id");
    const result = await this.getReports();
    return { reports: (result.reports || []).filter((r) => r.reporterId === deviceId) };
  },

  async getReport(id) {
    // The current backend has no GET /reports/:id endpoint.
    const result = await this.getReports();
    const report = (result.reports || []).find((r) => String(r._id || r.id) === String(id));
    if (!report) throw new Error("Report not found.");
    return { report };
  },

  async getStats() {
    if (!USE_MOCK) {
      const { data } = await client.get("/reports/stats");
      return normalizeStats(data);
    }
    const reports = getMockReports();
    return { total: reports.length, critical: 0, high: 0, moderate: 0, low: 0 };
  },

  async submitReport(formData) {
    if (!USE_MOCK) {
      let deviceId = localStorage.getItem("der01_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : `device-${Date.now()}-${Math.random()}`;
        localStorage.setItem("der01_device_id", deviceId);
      }
      const { data } = await client.post("/reports/submit", formData, {
        headers: { "Content-Type": "multipart/form-data", "X-Device-Id": deviceId },
      });
      return { ...data, report: normalizeReport(data.report) };
    }
    await wait(500);
    const report = { _id: `RPT-${Date.now()}`, latitude: Number(formData.get("latitude")), longitude: Number(formData.get("longitude")), reporterId: localStorage.getItem("der01_device_id"), status: "VERIFIED", severity: "Moderate", hazardType: formData.get("hazardType") || "Flood", createdAt: new Date().toISOString() };
    const reports = [report, ...getMockReports()]; saveMockReports(reports); return { report };
  },
  async updateStatus(id, status) {
    if (!USE_MOCK) {
      const { data } = await client.patch(
        `/reports/${id}/status`,
        { status }
      );
      return {
        ...data,
        report: normalizeReport(data.report),
      };
    }
    throw new Error("Status updates are unavailable in mock mode.");
  },
};

