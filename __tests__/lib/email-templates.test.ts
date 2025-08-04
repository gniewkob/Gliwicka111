import { describe, it, expect } from "vitest";
import { getEmailSubject, getEmailBody } from "@/lib/server-actions";

const testCases = [
  {
    formType: "virtual-office",
    data: { companyName: "Test Co", startDate: "2024-01-01", package: "basic" },
    subjects: {
      pl: "Potwierdzenie zapytania o biuro wirtualne - Gliwicka 111",
      en: "Virtual Office Inquiry Confirmation - Gliwicka 111",
    },
    bodies: {
      pl: `Dziękujemy za zgłoszenie dotyczące biuro wirtualne.\n\nNazwa firmy: Test Co\nData rozpoczęcia: 2024-01-01\nPakiet: basic\n\nSkontaktujemy się wkrótce.`,
      en: `Thank you for your virtual office inquiry.\n\nCompany name: Test Co\nStart date: 2024-01-01\nPackage: basic\n\nWe will contact you soon.`,
    },
  },
  {
    formType: "coworking",
    data: { companyName: "Test Co", startDate: "2024-01-01", workspaceType: "hot-desk" },
    subjects: {
      pl: "Potwierdzenie zapytania o coworking - Gliwicka 111",
      en: "Coworking Inquiry Confirmation - Gliwicka 111",
    },
    bodies: {
      pl: `Dziękujemy za zgłoszenie dotyczące coworking.\n\nNazwa firmy: Test Co\nData rozpoczęcia: 2024-01-01\nTyp przestrzeni: hot-desk\n\nSkontaktujemy się wkrótce.`,
      en: `Thank you for your coworking inquiry.\n\nCompany name: Test Co\nStart date: 2024-01-01\nWorkspace type: hot-desk\n\nWe will contact you soon.`,
    },
  },
  {
    formType: "meeting-room",
    data: { companyName: "Test Co", date: "2024-01-01", startTime: "09:00" },
    subjects: {
      pl: "Potwierdzenie rezerwacji sali - Gliwicka 111",
      en: "Meeting Room Booking Confirmation - Gliwicka 111",
    },
    bodies: {
      pl: `Dziękujemy za zgłoszenie dotyczące sala konferencyjna.\n\nNazwa firmy: Test Co\nData: 2024-01-01\nGodzina rozpoczęcia: 09:00\n\nSkontaktujemy się wkrótce.`,
      en: `Thank you for your meeting room inquiry.\n\nCompany name: Test Co\nDate: 2024-01-01\nStart time: 09:00\n\nWe will contact you soon.`,
    },
  },
  {
    formType: "advertising",
    data: { companyName: "Test Co", startDate: "2024-01-01", campaignType: "digital" },
    subjects: {
      pl: "Potwierdzenie zapytania o reklamę - Gliwicka 111",
      en: "Advertising Inquiry Confirmation - Gliwicka 111",
    },
    bodies: {
      pl: `Dziękujemy za zgłoszenie dotyczące reklama.\n\nNazwa firmy: Test Co\nData rozpoczęcia: 2024-01-01\nTyp kampanii: digital\n\nSkontaktujemy się wkrótce.`,
      en: `Thank you for your advertising inquiry.\n\nCompany name: Test Co\nStart date: 2024-01-01\nCampaign type: digital\n\nWe will contact you soon.`,
    },
  },
  {
    formType: "special-deals",
    data: { companyName: "Test Co", timeline: "immediate", dealType: "welcome" },
    subjects: {
      pl: "Potwierdzenie zapytania o oferty specjalne - Gliwicka 111",
      en: "Special Deals Inquiry Confirmation - Gliwicka 111",
    },
    bodies: {
      pl: `Dziękujemy za zgłoszenie dotyczące oferty specjalne.\n\nNazwa firmy: Test Co\nHarmonogram: immediate\nTyp oferty: welcome\n\nSkontaktujemy się wkrótce.`,
      en: `Thank you for your special deals inquiry.\n\nCompany name: Test Co\nTimeline: immediate\nDeal type: welcome\n\nWe will contact you soon.`,
    },
  },
];

describe("getEmailSubject", () => {
  testCases.forEach(({ formType, subjects }) => {
    it(`returns correct subject for ${formType}`, () => {
      expect(getEmailSubject(formType, "pl")).toBe(subjects.pl);
      expect(getEmailSubject(formType, "en")).toBe(subjects.en);
    });
  });
});

describe("getEmailBody", () => {
  testCases.forEach(({ formType, data, bodies }) => {
    it(`returns correct body for ${formType}`, () => {
      expect(getEmailBody(data, formType, "pl")).toBe(bodies.pl);
      expect(getEmailBody(data, formType, "en")).toBe(bodies.en);
    });
  });
});
