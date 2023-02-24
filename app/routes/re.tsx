import { Carousel } from 'react-responsive-carousel';

export default function Re({ re }: any) {
  return (
    <div className="rounded overflow-hidden shadow-lg max-w-md mx-auto mt-10">
      <div>
        <h2 className="font-bold p-5 pb-0">{re.title ? re.title : re.typology}</h2>
        <div className="px-5 pt-4 pb-2 flow-root">
          <span className="inline-block float-left bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{re.sqm} m<sup>2</sup></span>
          <span className="inline-block float-left bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{re.city}</span>
          <span className="inline-block float-right bg-sky-500 hover:bg-sky-800 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
            <a href={"http://www.google.com/maps/place/" + re.latitude + "," + re.longitude } target="_blank">Map</a>
          </span>
        </div>
      </div>
      <Carousel dynamicHeight={false} width="200">
        {re.images.map((image: string) => {
          return (
            <div key={image}>
              <img src={image}></img>
            </div>
          )
        })}
      </Carousel>
    </div>
  );
}
