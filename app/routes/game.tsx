
import { getRe, saveDbRe, shuffle,  getDbRerfomExtID } from "~/api.server";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import Re from "../components/re"
import carousel from "node_modules/react-responsive-carousel/lib/styles/carousel.min.css"; 
import { LinksFunction } from "@remix-run/react/dist/routeModules";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: carousel },
];
export async function loader({request, params}: LoaderArgs) {
  const url = new URL(request.url);
  if (url.searchParams.get("id")) {
    var re : any = await getDbRerfomExtID(url.searchParams.get("id")!)
    re.success = false
    if(re?.price == url.searchParams.get("price"))
        re.success = true
    return re
  }else{
    const re = await getRe()
    saveDbRe(await re)
    var newRe = await re
    const perc = await +newRe.price * 0.2

    const val1 = Math.random() * ((+newRe.price + perc) - (+newRe.price - perc)) + (+newRe.price - perc)
    const val2 = Math.random() * ((+newRe.price + perc) - (+newRe.price - perc)) + (+newRe.price - perc)

    console.log(newRe.price)
    newRe.price = await shuffle([+newRe.price, 
        (Math.round(val1 / 1000) * 1000),
        (Math.round(val2 / 1000) * 1000),
    ])

    console.log(newRe)
    return json(await newRe)
    }
}
  
export default function game() {
  const re = useLoaderData<typeof loader>() as any;
  console.log(re)
  return (
    <>
    <div className="w-full ">
      <Re re={re} className={'mt-5 bg-white'}></Re>
    </div>
    <div className="flex justify-center mt-5">
        <Link to=".">
        <svg style={{color: "blue"}} xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" fill="blue"></path> </svg>
        </Link>
    </div>
    </>
  )
}
