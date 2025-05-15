import { Suspense } from "react";

import { StudentOrganizationsPage } from "./student-organizations-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentOrganizationsPage />
    </Suspense>
  );
}
