import type { RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { API_URL } from "@/config/constants";

import {
  MOCK_PASSWORD,
  MOCK_RESPONSE,
  MOCK_TOKEN,
  MOCK_USER,
} from "./constants";

interface StudentOrganization {
  id: number;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  departmentId?: number | null;
  logoKey?: string | null;
  coverKey?: string | null;
  source?: string;
  organizationType?: string;
  organizationStatus?: string;
  isStrategic?: boolean;
  coverPreview?: boolean;
}

let studentOrganizations: StudentOrganization[] = [];
let nextId = 1;

export const handlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password?: string };
    return body.email === MOCK_USER.valid.email &&
      body.password === MOCK_PASSWORD.valid
      ? HttpResponse.json({
          user: MOCK_USER.valid,
          token: MOCK_TOKEN.valid,
        })
      : body.password == null || body.password === ""
        ? MOCK_RESPONSE.validationFailure()
        : HttpResponse.json(
            {
              error: {
                message: "Invalid user credentials",
                code: "E_INVALID_CREDENTIALS",
              },
            },
            { status: 400 },
          );
  }),

  http.get(new RegExp(`${API_URL}/student_organizations(?:\\?.*)?$`), () => {
    return HttpResponse.json({
      data: studentOrganizations,
      meta: { total: studentOrganizations.length },
    });
  }),

  http.post(`${API_URL}/student_organizations`, async ({ request }) => {
    const newOrg = (await request.json()) as Omit<StudentOrganization, "id">;
    const created = { ...newOrg, id: nextId++ };
    studentOrganizations.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(
    `${API_URL}/student_organizations/:id`,
    async ({ request, params }) => {
      const updatedOrg = (await request.json()) as Partial<
        Omit<StudentOrganization, "id">
      >;
      const orgId = Number(params.id);
      studentOrganizations = studentOrganizations.map((org) =>
        org.id === orgId ? { ...org, ...updatedOrg } : org,
      );
      return HttpResponse.json(
        studentOrganizations.find((org) => org.id === orgId),
      );
    },
  ),

  http.delete(`${API_URL}/student_organizations/:id`, ({ params }) => {
    const orgId = Number(params.id);
    studentOrganizations = studentOrganizations.filter(
      (org) => org.id !== orgId,
    );
    return new HttpResponse(null, { status: 204 });
  }),
] satisfies RequestHandler[];
