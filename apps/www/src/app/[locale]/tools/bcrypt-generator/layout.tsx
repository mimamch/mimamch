import BcryptGeneratorPage from "./page";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = {
  title: "Bcrypt Generator",
  description: "Generate and compare Bcrypt hashes easily.",
};

export default BcryptGeneratorPage;
