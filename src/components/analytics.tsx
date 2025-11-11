import Script from "next/script";

export function Analytics() {
  return (
    <Script
      defer
      src="https://analytics.solvro.pl/script.js"
      data-website-id="08f849f2-1625-4566-80f7-e7ef4958e5df"
      data-domains="admin2.topwr.solvro.pl"
    />
  );
}
