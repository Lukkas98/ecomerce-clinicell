import { Suspense } from "react";
import { Categories } from "./Categories";

export default async function Home() {
  return (
    <div>
      <h1>Categories</h1>
      <ul>
        <Suspense fallback={<li>Loading categories...</li>}>
          <Categories />
        </Suspense>
      </ul>
    </div>
  );
}
