
import { getRe, saveDbRe, shuffle, getDbRerfomExtID, calcPrices } from "~/api.server";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate, useSubmit, useTransition } from "@remix-run/react";
import Re from "../components/re"
import carousel from "node_modules/react-responsive-carousel/lib/styles/carousel.min.css";
import { LinksFunction } from "@remix-run/react/dist/routeModules";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: carousel },
];

export async function loader({ request, params }: LoaderArgs) {
    const url = new URL(request.url);
    if (url.searchParams.get("id")) {
        var re: any = await getDbRerfomExtID(url.searchParams.get("id")!)
        re.success = false
        if (re?.price == url.searchParams.get("price"))
            re.success = true
        return re
    } else {
        var re = await getRe()
        console.log('daaaaaaaiiiiiiiii')
         console.log(re!=null)
        saveDbRe( await re)
        return json(await re)
    }
}

export default function game() {
    const re = useLoaderData<typeof loader>() as any;
    const transition = useTransition();
    console.log(re)
    return (
        <>
            <div className="w-full ">
                <Re re={re} className={'mt-5 bg-white'}></Re>
            </div>
            <div className="flex justify-center mt-5">
                {transition.state != "idle" ? (
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <Link to=".">
                        <svg style={{ color: "blue" }} xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" fill="blue"></path> </svg>
                    </Link>)
                }
            </div>
        </>
    )
}
