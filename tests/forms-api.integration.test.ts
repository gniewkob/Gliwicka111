import { describe, it, expect } from "vitest";
import { POST as virtualOfficeHandler } from "@/app/api/forms/virtual-office/route";
import { POST as coworkingHandler } from "@/app/api/forms/coworking/route";
import { POST as meetingRoomHandler } from "@/app/api/forms/meeting-room/route";
import { POST as advertisingHandler } from "@/app/api/forms/advertising/route";
import { POST as specialDealsHandler } from "@/app/api/forms/special-deals/route";

function toRequest(data: Record<string, any>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((val) => fd.append(k, String(val)));
    } else if (v !== undefined) {
      fd.append(k, String(v));
    }
  });
  return new Request("http://localhost", { method: "POST", body: fd });
}

describe("form API handlers", () => {
  it("virtual-office accepts valid data", async () => {
    const req = toRequest({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: "true",
      package: "basic",
      startDate: "2024-01-01",
      businessType: "llc",
    });
    const res = await virtualOfficeHandler(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("coworking accepts valid data", async () => {
    const req = toRequest({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: "true",
      workspaceType: "hot-desk",
      duration: "daily",
      startDate: "2024-01-01",
      teamSize: "1",
    });
    const res = await coworkingHandler(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("meeting-room accepts valid data", async () => {
    const req = toRequest({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: "true",
      roomType: "small",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      attendees: "1",
    });
    const res = await meetingRoomHandler(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("advertising accepts valid data", async () => {
    const req = toRequest({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: "true",
      campaignType: "mobile-billboard",
      duration: "1-week",
      startDate: "2024-01-01",
      budget: "under-1000",
    });
    const res = await advertisingHandler(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("special-deals accepts valid data", async () => {
    const req = toRequest({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: "true",
      dealType: "welcome-package",
      interestedServices: ["virtual-office"],
      currentSituation: "new-business",
      timeline: "immediate",
    });
    const res = await specialDealsHandler(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
