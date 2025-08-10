import HomeClient from "./HomeClient";
import { getInitialHomeImages } from "@/utils/homeInitialServer";

export const revalidate = 86400;

export default async function Page() {
  const initialImages = (await getInitialHomeImages(12)) as [];
  return <HomeClient initialImages={initialImages} />;
}