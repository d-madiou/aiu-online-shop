<div className='bg-white flex items-start'>
            <div className='mx-auto container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {itemInfo.map((item, index)=>(
                    <div key={index} className='flex bg-blue-800 flex-col items-start text-center p-4 border rounded-lg shadow
                     cursor-pointer'>
                        <div className="flex justify-items-start items-center space-x-4">
                            <img src={item.imageURL} alt="" className='w-15 h-15 rounded-4xl border-3 border-white
                            transform transition-transform duration-300 hover:scale-115'/>
                            <h3 className='text-2xl text-white font-medium'>{item.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="container mx-auto py-4 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/12">
                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-2.5">Order by Catgories</div>
                            <ul className="space-y-4 bg-gray-100 p-3 border">
                                {Categories.map((category, index) => (
                                    <li key={index} className="flex items-center text-sm font-medium">
                                        <div className="w-2 h-2 border border-red-500 rounded-full mr-2"></div>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full md:w-9/12 mt-0 h-96 relative">
                           <img src={HeroImage} alt="hero" className="h-full w-full object-cover" />
                            <div className="absolute top-16 left-8 ">
                                <p className="text-gray-600 mb-4">The best online market place</p>
                                <h2 className="text-3xl font-bold">WELCOME TO AIU MARKET PLACE</h2>
                                <p className="text-xl mt-2.5 font-bold text-gray-800">THOUSANDS+ PRODUCTS</p>
                                <button className="bg-blue-800 px-8 py-1.5 text-white mt-4 hover:bg-blue-500
                                transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate('/shop')}>SHOP NOW</button>
                        </div>
                    </div>
                </div>
</div>


