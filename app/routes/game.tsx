
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
    <div className="flex items-center">
      <Re re={re}></Re>
      {re.success ? (<p>giustooooo</p>) : (re.success != undefined && !re.success) ? (<p>sbagliatooo</p>) : ''}
    </div>
    <div className="">
        <Link to=".">Get a new RE</Link>
    </div>
    </>
  )
}
