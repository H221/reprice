import { ActionArgs, redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { Carousel } from 'react-responsive-carousel';
import ButtonPrice from '~/components/buttonPrice';

export default function Re({ re }: any) {
  console.log(re)
  var gallery, price 
  if(re.images){
    console.log('images')
    gallery = <Carousel dynamicHeight={false} width="200" className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-3/5 md:rounded-none md:rounded-l-lg'>
      {re.images.map((image: string) => {
        return (
          <div key={image}>
            <img src={image}></img>
          </div>
        )
      })}
    </Carousel>
    price = <div className='flex justify-center mt-5'>
    {re.price.map((item: any, index: number) => {
      return (<ButtonPrice price={item} id={re.externalID} key={index}></ButtonPrice>)
    })}
  </div>
  }else{
  console.log('image')
  gallery = <Carousel dynamicHeight={false} width="200" className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-3/5 md:rounded-none md:rounded-l-lg'>
    {re.image.map((image: any) => {
      return (
        <div key={image.imagesID}>
          <img src={image.url}></img>
        </div>
      )
    })}
    </Carousel>
    price = <p className='flex justify-center mt-5'>{re.price}</p>
  }
  return (
    <div className='mt-10 w-full'>
    <div className=" flex flex-col mx-auto bg-white border border-gray-200 rounded-lg shadow-2xl md:flex-row md:w-2/3 max-w-2xl">
      {gallery}
      <div className='flex flex-col leading-normal'>
        <h2 className="font-bold p-5 pb-0">{re.title ? re.title : re.typology}</h2>
        <div className="px-5 pt-4 pb-2 flow-root">
          <span className="inline-block float-left bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{re.sqm} m<sup>2</sup></span>
          <a href={"http://www.google.com/maps/place/" + re.latitude + "," + re.longitude } target="_blank">
            <span className="inline-block bg-amber-400	 rounded-full hover:bg-slate-800 px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">{re.city.charAt(0).toUpperCase() + re.city.slice(1).toLowerCase()}</span>
          </a>
        </div>
      </div>
        
        </div>
        {price}

    </div>
  );
}
