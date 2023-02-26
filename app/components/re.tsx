import { ActionArgs, redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { Carousel } from 'react-responsive-carousel';
import ButtonPrice from '~/components/buttonPrice';

export default function Re({ re, className }: any) {
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
    price = (<div className='flex justify-center mt-5'>
    {re.price.map((item: any, index: number) => {
      return (<ButtonPrice price={item} id={re.externalID} key={index}></ButtonPrice>)
    })}
  </div>)
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
    price = ''
  }
  return (
    <div>
    <div className={`${className} mx-auto bg-white border border-gray-200 rounded-lg shadow-2xl md:w-2/3 max-w-2xl`}>
      <div className="flex flex-col md:flex-row ">
        {gallery}
        <div>
        <div className='flex flex-col leading-normal'>
          <h2 className="font-bold p-5 pb-0">{re.title ? re.title : re.typology}</h2>
          <div className="px-5 pt-4 pb-2 flow-root">
            <span className="inline-block float-left bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{re.sqm} m<sup>2</sup></span>
            <a href={"http://www.google.com/maps/place/" + re.latitude + "," + re.longitude } target="_blank">
              <span className="inline-block bg-amber-400	 rounded-full hover:bg-slate-800 px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">{re.city.charAt(0).toUpperCase() + re.city.slice(1).toLowerCase()}</span>
            </a>
          </div>
        </div>
        {
          re.success ? (
            <span className='flex justify-center pt-10 '>
            <svg className="h-24 w-24 animate-ping absolute" style={{color: "rgb(75, 126, 68)"}} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#4b7e44" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></svg>
            <svg className="h-24 w-24 relative " style={{color: "rgb(75, 126, 68)"}} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#4b7e44" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></svg>
            </span>
          ) : (re.success != undefined && !re.success) ?
            (
              <span className='flex justify-center pt-10 '>
                <svg style={{color: "red"}} xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 bi bi-x-circle-fill animate-ping absolute"fill="currentColor" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" fill="red"></path> </svg>
                <svg style={{color: "red"}} xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 bi bi-x-circle-fill relative"fill="currentColor" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" fill="red"></path> </svg>
              </span>
            ) : ''
        }
        </div>
      </div>
    </div>
    {price}
  </div>
    
  );
}
