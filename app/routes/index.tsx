import { getStylesheetPrefetchLinks } from "@remix-run/react/dist/links";
import axios from "axios"
import cheerio from "cheerio";
import { getRe, saveDbRe } from "~/api.server";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Re from "./re"
import carousel from "node_modules/react-responsive-carousel/lib/styles/carousel.min.css"; 
import { LinksFunction } from "@remix-run/react/dist/routeModules";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: carousel },
];

export async function loader({request}: LoaderArgs) {
  const re = await getRe()
  saveDbRe(await re)
  return json(await re)
}
export default function Index() {
  const re = useLoaderData<typeof loader>();
  return (
    <div className="flex items-center">
      <Re re={re}></Re>
    </div>
  )
}
