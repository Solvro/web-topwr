"use client";

import { CoreAdmin, Resource } from "ra-core";
import fakeDataProvider from "ra-data-fakerest";

import { Dashboard } from "./components/dashboard";
import { Layout } from "./components/layout";
import { LoginPage } from "./components/login-page";
import { ArticlesEdit } from "./edit-pages/articles-edit";
import { OrganizationsEdit } from "./edit-pages/organizations-edit";
import { ArticlesList } from "./list-pages/articles-list";
import { OrganizationsList } from "./list-pages/organizations-list";

// prettier-ignore
const dataProvider = fakeDataProvider({
    articles: [
        { id: 0, name: "Hello, world!", contents: "Lorem ipsum." },
        { id: 1, name: "Hello, world!", contents: "Lorem ipsum dolor sit amet." },
    ],
    organizations: [
        { id: 0, name: "org 1", contents: "Lorem ipsum." },
        { id: 1, name: "org 2", contents: "Lorem ipsum dolor sit amet." },
    ]
});

export function AdminApp() {
  return (
    <CoreAdmin
      dataProvider={dataProvider}
      loginPage={LoginPage}
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource
        name="articles"
        list={ArticlesList}
        edit={ArticlesEdit}
        recordRepresentation={"name"}
      />
      <Resource
        name="organizations"
        list={OrganizationsList}
        edit={OrganizationsEdit}
        recordRepresentation={"name"}
      />
    </CoreAdmin>
  );
}
