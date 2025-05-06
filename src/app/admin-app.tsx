"use client";

import { CoreAdmin, Resource } from "ra-core";

import { authProvider } from "./auth-provider";
import { Dashboard } from "./components/dashboard";
import { Layout } from "./components/layout";
import { LoginPage } from "./components/login-page";
import { StudentOrganizationsCreate } from "./create-pages/student-organizations-create";
import { dataProvider } from "./data-provider";
import { StudentOrganizationsEdit } from "./edit-pages/student-organizations-edit";
import { StudentOrganizationsList } from "./list-pages/student-organizations-list";

export function AdminApp() {
  return (
    <CoreAdmin
      authProvider={authProvider}
      dataProvider={dataProvider}
      loginPage={LoginPage}
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource
        name="student_organizations"
        list={StudentOrganizationsList}
        edit={StudentOrganizationsEdit}
        create={StudentOrganizationsCreate}
        recordRepresentation={"name"}
      />
    </CoreAdmin>
  );
}
