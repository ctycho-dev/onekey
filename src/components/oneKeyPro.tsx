import { FC, useEffect, useState } from "react";
import AddToCard from "./addToCard";
import ProductName from "./productName";

import { Product } from "../types";

import proWhite from '../assets/products/shop-product-card-proBig-white.webp'
import proBlack from '../assets/products/shop-product-card-proBig-black.webp'
import proBlackMobile from '../assets/products/pro-black.png'
import proWhiteMobile from '../assets/products/pro-white.png'

interface IOneKeyPro {
    products: Product[]
    bucketCounter: number
    setBucketCounter: any
    setBagItems: any
}

const OneKeyPro: FC<IOneKeyPro> = ({ products, bucketCounter, setBucketCounter, setBagItems }) => {

    // Set white wallet by default
    const [colorWhite, setColorWhite] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Product>(products[0])

    const changeColor = (color: string) => {

        if (color == 'white') {
            setColorWhite(true)
            setCurrentProduct(products[0])
        } else {
            setColorWhite(false)
            setCurrentProduct(products[1])
        }

    }
    return (
        <>
            <div className="bg-[#F9FAFC] rounded-3xl">
                <div className="flex flex-col-reverse tablet:grid tablet:grid-cols-2">
                    <div className="p-7 flex flex-col justify-between">
                        <div></div>
                        <div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">OneyKey Pro</h3>
                            <h5 className="text-[#767676] mb-8 text-sm md:text-base">Biometric tech, air-gapped connection, so many reasons to go Pro.</h5>
                            <div className="lg:flex">
                                <div className="flex items-center justify-between flex-1 mb-4 lg:mb-0">
                                    <div className="text-3xl md:text-4xl">
                                        {currentProduct.price}&#x20bd;
                                    </div>
                                    <div className="flex gap-x-6 mr-4">
                                        <div className="flex gap-x-2">
                                            <button className="bg-white rounded-[50%] w-[28px] h-[28px] md:w-[34px] md:h-[34px] flex justify-center items-center border border-gray-300"
                                                onClick={() => { changeColor('white') }}>
                                                {
                                                    colorWhite ?
                                                        <div className="bg-white rounded-[50%] w-[22px] h-[22px] md:w-[25px] md:h-[25px] border border-gray-300"></div>
                                                        : ''
                                                }
                                            </button>
                                            <button className="bg-black rounded-[50%] w-[28px] h-[28px] md:w-[34px] md:h-[34px] flex justify-center items-center"
                                                onClick={() => { changeColor('black') }}>
                                                {
                                                    colorWhite ?
                                                        '' : <div className="bg-black rounded-[50%] w-[22px] h-[22px] md:w-[25px] md:h-[25px] border border-white"></div>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end tablet:justify-normal">
                                    <AddToCard
                                        text="В корзину"
                                        product={currentProduct}
                                        setBucketCounter={setBucketCounter}
                                        setBagItems={setBagItems} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            colorWhite ?
                                <div className="flex justify-center">
                                    <img src={proWhite} alt="ProBig-white" className="hidden tablet:block" />
                                    <img src={proWhiteMobile} alt="ProBig-white" className="w-96 block tablet:hidden" />
                                </div>
                                :
                                <div className="flex justify-center">
                                    <img src={proBlack} alt="ProBig-Black" className="hidden tablet:block" />
                                    <img src={proBlackMobile} alt="ProBig-Black" className="w-96 block tablet:hidden" />
                                </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default OneKeyPro