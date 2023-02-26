import axios from "axios";
import {load} from "cheerio";
import { db } from "~/utils/db.server";
import { listing, 
  paramsImmo,
  BASE_IMMO_LISTING, 
  BASE_IMMO_AUTOCOMPLETE_1, 
  BASE_IMMO_AUTOCOMPLETE_2,
  BASE_IMMO_API_LISTING,
  BASE_IMMO_DETAIL
 } from "~/utils/common";

var defaultReObj = {
  detailUrl: "" as String,
  title: "" as String,
  images: [] as String[],
  sqm: "" as String,
  externalID: "" as String,
  latitude: "" as String,
  longitude: "" as String,
  price: "" as String,
  typology: "" as String,
  city: "" as String
};

var requestListingObj = {
  idProvincia: "",
  idComune: "0",
  idContratto: "1",
  idCategoria: "1",
  criterio: "rilevanza",
  pag: "1",
  path: ""
}

export async function shuffle(array:number[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export async function getRe(): Promise<any>{
  try{
    console.log("getRE");
    //search for a place
    const extractionPlace = Math.floor(Math.random() * listing.length);

    defaultReObj.city = listing[extractionPlace]
    var page = await axios.get(BASE_IMMO_API_LISTING + paramsImmo[extractionPlace])
    const nAnnunci = await page.data.count > (80*25) ? 80*25 : page.data.count
    //choose one 
    var extractionRe = Math.floor(Math.random() * +nAnnunci!);
    const wichOneInPage = extractionRe-(Math.floor(extractionRe/30)*30);

    //page
    const pageN = Math.floor(extractionRe / 30) + 1;

    //go to the right listing page
    page = await axios.get(BASE_IMMO_API_LISTING + paramsImmo + 'pag=' + pageN.toString())

    const re = await page.data.results[wichOneInPage]
    defaultReObj.externalID = re.realEstate.id;
    defaultReObj.detailUrl = BASE_IMMO_DETAIL + defaultReObj.externalID
    defaultReObj.sqm = re.realEstate.properties[0].surface.split(" ")[0]
    defaultReObj.images = re.realEstate.properties[0].multimedia.photos.map((img:any) => img.urls.small)
    defaultReObj.title = re.realEstate.properties[0].caption
    defaultReObj.latitude = re.realEstate.properties[0].location.latitude
    defaultReObj.longitude = re.realEstate.properties[0].location.longitude
    defaultReObj.price = re.realEstate.properties[0].price.value
    defaultReObj.typology = re.realEstate.properties[0].typology.name

    if(defaultReObj.price === "" || defaultReObj.latitude === "" || defaultReObj.longitude === "" || defaultReObj.sqm === "")
      return await getDbReRandom()
    else 
      return defaultReObj;
    
  }catch(e:any){
    console.log(e)
    return await getDbReRandom()
  }
}

export async function saveDbRe(re : any){
  try{
    var reToSave = {
      detailUrl: re.detailUrl as String,
      title: re.title as String,
      image: {
        create: 
          re.images.map((url: String) => {
            return ({url: url})
          })
      },
      sqm: re.sqm as String,
      externalID: String(re.externalID) as String,
      latitude: String(re.latitude) as String,
      longitude: String(re.longitude) as String,
      price: String(re.price) as String,
      typology: re.typology as String,
      city: re.city as String
    }
    const oldRe = await getDbRerfomExtID(reToSave.externalID.toString())
    if(await oldRe === null)
      return await db.re.create({data: reToSave})
    else {
      console.log('esiste')
      console.log(oldRe)
      return oldRe
    }
  }catch(e: any){
    console.log('e')
    console.log(e)
    return await getDbReRandom();
  }

}

export async function getDbRerfomExtID( id : string){
  return await db.re.findFirst({ 
    where: {
      externalID: id+""
    },
    include: { image: true }
  })
}

export async function getDbReRandom(){
  console.log("rnd")
  const sizeDb = await db.re.count()
  const rnd = Math.floor(Math.random() * await sizeDb);
  return await db.re.findFirst({ 
    skip: rnd,
    take: 1,
    include: { image: true }
  })
}

export async function getDbRe( id : number){
  return await db.re.findFirst({ 
    where: {
      reID: id
    },
    include: { image: true }
  })
}