import axios from "axios";
import { load } from "cheerio";
import { db } from "~/utils/db.server";
import {
  listing,
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

export async function shuffle(array: number[]) {
  let currentIndex = array.length, randomIndex;

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

export async function getRe(): Promise<any> {
  const extractionPlace = Math.floor(Math.random() * listing.length);
  try {
    // console.log("getRE");
    //search for a place
    console.log(extractionPlace)
    defaultReObj.city = listing[extractionPlace]
    var page = await axios.get(BASE_IMMO_API_LISTING + paramsImmo[extractionPlace])
    const nAnnunci = page.data.count > (80 * 25) ? 80 * 25 : page.data.count
    //choose one
    var extractionRe = Math.floor(Math.random() * +nAnnunci!);
    const wichOneInPage = extractionRe - (Math.floor(extractionRe / 30) * 30);

    //page
    const pageN = Math.floor(extractionRe / 30) + 1;

    //go to the right listing page
    page = await axios.get(BASE_IMMO_API_LISTING + paramsImmo + 'pag=' + pageN.toString())

    const re = page.data.results[wichOneInPage]
    defaultReObj.externalID = re.realEstate.id;
    defaultReObj.detailUrl = BASE_IMMO_DETAIL + defaultReObj.externalID
    defaultReObj.sqm = re.realEstate.properties[0].surface.split(" ")[0]
    defaultReObj.images = re.realEstate.properties[0].multimedia.photos.map((img: any) => img.urls.small)
    defaultReObj.title = re.realEstate.properties[0].caption
    defaultReObj.latitude = re.realEstate.properties[0].location.latitude
    defaultReObj.longitude = re.realEstate.properties[0].location.longitude
    defaultReObj.price = re.realEstate.properties[0].price.value
    defaultReObj.typology = re.realEstate.properties[0].typology.name
    // console.log("defaultReObj.price")
    // console.log(defaultReObj.price)
    if (defaultReObj.price == "" || defaultReObj.price == "0" || defaultReObj.price == "null" || defaultReObj.latitude === "" || defaultReObj.longitude === "" || defaultReObj.sqm === "") {
      console.log("api 86")
      return await getDbReRandom(listing[extractionPlace])
    }
    else {
      var newObj: any = defaultReObj
      newObj.price = await calcPrices(+newObj.price)
      return newObj;
    }

  } catch (e: any) {
    console.log("e")
    console.log(e)
    const test=await getDbReRandom(listing[extractionPlace])
    console.log("etst")
    console.log(test)
    return test
  }
}

export async function saveDbRe(re: any) {
  try {
    var reToSave = {
      detailUrl: re.detailUrl as String,
      title: re.title as String,
      image: {
        create:
          re.images.map((url: String) => {
            return ({ url: url })
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
    if (await oldRe === null)
      return await db.re.create({ data: reToSave })
    else {
       console.log('esiste')
      // console.log(oldRe)
      return oldRe
    }
  } catch (e: any) {
    console.log('e131')
    console.log(re)
    console.log(e)
    return await getDbReRandom(re.city);
  }

}

export async function getDbRerfomExtID(id: string) {
  var re = await db.re.findFirst({
    where: {
      externalID: id + ""
    },
    include: { image: true }
  })
  if (re != null)
    re.image = re.image.map((item): any => {
      return item.url
    })
  // console.log(re)
  return re
}

export async function getDbReRandom(place:string) {
  console.log("-----------------------------rnd")
  const sizeDb = await db.re.count()
  const rnd = Math.floor(Math.random() * sizeDb);
  var re = await db.re.findFirst({
    where:{
      city: place
    },
    skip: rnd,
    take: 1,
    include: { image: true }
  })
  if (re != null) {
    var reNew: any = re
    reNew.images = reNew.image.map((item: { url: any; }): any => {
      return item.url
    })
    reNew.price = (await calcPrices(+reNew.price)).map((item): any => {
      return String(item)
    })
  }
  console.log("reNew")
  // console.log(reNew)
  return reNew
}

export async function calcPrices(price: number): Promise<number[]> {
  console.log(price)
  const perc = price * 0.2

  const val1 = Math.random() * ((price + perc) - (price - perc)) + (price - perc)
  const val2 = Math.random() * ((price + perc) - (price - perc)) + (price - perc)

  console.log(price)
  var res = await shuffle([price,
    (Math.round(val1 / 1000) * 1000),
    (Math.round(val2 / 1000) * 1000),
  ])
  console.log(res)
  return res
}

export async function getDbRe(id: number) {
  var re = await db.re.findFirst({
    where: {
      reID: id
    },
    include: { image: true }
  })
  if (re != null) {
    var reNew: any = re
    reNew.images = reNew.image.map((item: { url: any; }): any => {
      return item.url
    })
    reNew.price = (await calcPrices(+reNew.price)).map((item): any => {
      return String(item)
    })
  }
  // console.log(re)
  return reNew
}