"use client";

import { CoreAdminContext, CoreAdminUI, Resource } from "ra-core";
import fakeDataProvider from "ra-data-fakerest";

import { PlaceholderUsersEdit } from "./placeholder-users-edit";
import { PlaceholderUsersList } from "./placeholder-users-list";

// prettier-ignore
const dataProvider = fakeDataProvider({
    users: [
        { id: 1, name: "John Doe", username: "johndoe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", username: "janesmith", email: "jane.smith@example.com" },
        { id: 3, name: "Alice Johnson", username: "alicej", email: "alice.johnson@example.com" },
        { id: 4, name: "Bob Brown", username: "bobb", email: "bob.brown@example.com" }
    ],
    posts: [
        { id: 0, title: "Hello, world!" },
        { id: 1, title: "FooBar" }
    ],
    comments: [
        { id: 0, post_id: 0, author: "John Doe", body: "Sensational!" },
        { id: 1, post_id: 0, author: "Jane Doe", body: "I agree" }
    ],
});

export function AdminApp() {
  return (
    <CoreAdminContext dataProvider={dataProvider}>
      <CoreAdminUI>
        <Resource
          name="users"
          list={PlaceholderUsersList}
          edit={PlaceholderUsersEdit}
          recordRepresentation={"name"}
        />
        <Resource name="posts" />
        <Resource name="comments" />
      </CoreAdminUI>
    </CoreAdminContext>
  );
}
