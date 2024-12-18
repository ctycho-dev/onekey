import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Help from "../components/help";
import HeaderSecond from "../components/header/headerSecond";
import Footer from "../components/footer/footer";
import InputCustom from "../components/inputCutom";
import CheckoutItem from "../components/checkoutItem";
import AddressDetails from "../components/addressDetails";

import { MyBag } from "../types";
import { getTotalSum, isValidEmail } from "../utils";
import { initPayment } from "../utils/tinkoff";
import { Toaster, toast } from 'sonner'
import ReactLoading from 'react-loading';
import Skeleton from 'react-loading-skeleton'
import PhoneInput from 'react-phone-input-2'

import { City } from "../types";


declare global {
    interface Window {
        CDEKWidget: any;
    }
}

interface ICheckout { }

const Checkout: FC<ICheckout> = ({ }) => {
    const navigate = useNavigate();
    const [isDisabled, setButtonDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isRendered, setIsRendered] = useState(false)
    const [myBag, setMyBag] = useState<MyBag[] | []>([])

    const [chosenCity, setChosenCity] = useState<City | null>(null)
    const [chosenZip, setChosenZip] = useState('')
    const [chosenAddress, setChosenAddress] = useState('')
    const [chosenName, setChosenName] = useState('')
    const [chosenSurname, setChosenSurname] = useState('')
    const [chosenPhone, setChosenPhone] = useState('')
    const [chosenEmail, setChosenEmail] = useState('')
    const [chosenTelegram, setChosenTelegram] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)

        const body = document.querySelector('body')
        if (body) body.style.overflow = 'auto'

        let temp = localStorage.getItem('onekey-shopping-bag')

        if (temp) {
            const items = JSON.parse(temp)
            setMyBag(items)
        }

        // async function fetchMyAPI() {
        //     const fetchedCitites = await getCities()
        //     setCitites(fetchedCitites)

        // }

        // fetchMyAPI()


        // document.addEventListener('DOMContentLoaded', () => {
        console.log('hello')
        if (window && window.CDEKWidget) {
            // new window.CDEKWidget({
            //     from: 'Казань',
            //     root: 'cdek-map',
            //     apiKey: 'bad51c9b-3d1c-4809-b170-8a9c35aef92a',
            //     servicePath: 'https://www.ghost-php-server.ru',
            //     defaultLocation: 'Казань'
            // })
            // new window.CDEKWidget({
            //     from: {
            //       country_code: 'RU',
            //       city: 'Новосибирск',
            //       postal_code: 630009,
            //       code: 270,
            //       address: 'ул. Большевистская, д. 101',
            //     },
            //     root: 'cdek-map',
            //     apiKey: 'bad51c9b-3d1c-4809-b170-8a9c35aef92a',
            //     canChoose: true,
            //     servicePath: 'http://158.160.136.110:8005',
            //     hideFilters: {
            //       have_cashless: false,
            //       have_cash: false,
            //       is_dressing_room: false,
            //       type: false,
            //     },
            //     hideDeliveryOptions: {
            //       office: false,
            //       door: false,
            //     },
            //     debug: false,
            //     goods: [
            //       {
            //         width: 10,
            //         height: 10,
            //         length: 10,
            //         weight: 10,
            //       },
            //     ],
            //     defaultLocation: [55.0415, 82.9346],
            //     lang: 'rus',
            //     currency: 'RUB',
            //     tariffs: {
            //       office: [234, 136, 138],
            //       door: [233, 137, 139],
            //     },
            //     onReady() {
            //       alert('Виджет загружен');
            //     },
            //     onCalculate() {
            //       alert('Расчет стоимости доставки произведен');
            //     },
            //     onChoose() {
            //       alert('Доставка выбрана');
            //     },
            //   });
        }

        // })

        setTimeout(() => {
            setIsRendered(true)
        }, 1000)

    }, [])


    const sumbitRequest = async () => {
        if (!chosenCity) {
            toast.error('Поле "Город" обязателено к заполнению')
            return
        } else if (!chosenZip) {
            toast.error('Поле "Индекс" обязателено к заполнению')
            return
        } else if (!chosenAddress) {
            toast.error('Поле "Адрес" обязателено к заполнению')
            return
        } else if (!chosenName) {
            toast.error('Поле "Имя" обязателено к заполнению')
            return
        } else if (!chosenSurname) {
            toast.error('Поле "Фамилия" обязателено к заполнению')
            return
        } else if (!chosenPhone) {
            toast.error('Поле "Телефон" обязателено к заполнению')
            return
        } else if (!chosenEmail) {
            toast.error('Поле "Email" обязателено к заполнению')
            return
        } else if (!isValidEmail(chosenEmail)) {
            toast.error('Поле "Email" не валидное')
            return
        }
        setButtonDisabled(true)

        let amount = 0

        const items = []
        for (const x of myBag) {
            // Сумма в копейках. Например, 3 руб. 12коп. — это число 312.
            let price = x.sku.price * 100
            items.push({
                'Name': x.sku.name,
                'Price': price,
                'Quantity': x.quantity,
                'Amount': price * x.quantity,
                'Tax': 'vat10'
            })
            amount += price * x.quantity
        }


        const data = {
            "Amount": amount,
            "DATA": {
                "Phone": chosenPhone,
                "Email": chosenEmail
            },
            "Receipt": {
                "Email": "info@leeblock.ru",
                "Phone": "+79655829966",
                "Taxation": "osn",
                "Items": items
            },
            'city': chosenCity,
            'zip': chosenZip,
            'address': chosenAddress,
            'first_name': chosenName,
            'last_name': chosenSurname,
            'phone': chosenPhone,
            'email': chosenEmail
        }

        const res = await initPayment(data)
        if (res && res.Success) {
            localStorage.setItem('PaymentId', res.PaymentId)
            localStorage.setItem('OrderId', res.OrderId)
            window.open(res.PaymentURL)
        } else {
            toast.error(res?.Details)
        }
        setButtonDisabled(false)
    }
    // <div id="cdek-map" className="w-[800px] h-[600px]"></div>


    return (
        <>
            <HeaderSecond />
            <main className="bg-checkout">
                <div className="max-w-7xl m-auto px-6 py-8">
                    <div className="flex flex-col-reverse md:grid md:grid-cols-2  gap-y-6 gap-x-6 pb-10 ">
                        <aside className="grid gap-y-6 lg:gap-y-8">
                            <AddressDetails
                                isLoading={isLoading}
                                chosenCity={chosenCity}
                                setChosenCity={setChosenCity}
                                chosenZip={chosenZip}
                                setChosenZip={setChosenZip}
                                chosenAddress={chosenAddress}
                                setChosenAddress={setChosenAddress}
                            />
                            <div className={`${isLoading ? 'bg-gray-100 opacity-50 pointer-events-none' : 'bg-white'} p-6 rounded-3xl checkout-block-shadow`}>
                                <h2 className="text-xl font-bold text-h-checkout mb-4">Ваши данные</h2>
                                <div className="grid sm-mobile:grid-cols-21 gap-x-2 gap-y-3 mb-3">
                                    <InputCustom type="text" name='name' label="Имя" value={chosenName} placeholder="Иван" onChangeFunc={setChosenName} />
                                    <InputCustom type="text" name='lname' label="Фамилия" value={chosenSurname} placeholder="Иванов" onChangeFunc={setChosenSurname} />
                                </div>
                                <div className="grid sm-mobile:grid-cols-21 gap-x-2 gap-y-3 mb-3">
                                    {/* <InputCustom type="text" label="Телефон" value={chosenPhone} placeholder="+79653332211" onChangeFunc={setChosenPhone} /> */}
                                    <div className="">
                                        <label className={'required'}>Телефон</label>
                                        <PhoneInput
                                            country={'ru'}
                                            value={chosenPhone}
                                            containerClass={'mt-2 h-10 border rounded-lg'}
                                            onChange={(e) => { setChosenPhone(e) }}
                                        />
                                    </div>
                                    <InputCustom type="text" name='' label="Telegram" value={chosenTelegram} placeholder="@" onChangeFunc={setChosenTelegram} notRequired={true} />
                                </div>
                                <InputCustom type="text" name='email' label="Email" value={chosenEmail} placeholder="example@mail.ru" onChangeFunc={setChosenEmail} />
                            </div>
                            {/* <div className={`${isLoading ? 'bg-gray-100 opacity-50 pointer-events-none' : 'bg-white'} p-6 rounded-3xl checkout-block-shadow`}>
                                <h2 className="text-xl font-bold text-h-checkout mb-4">Способ доставки</h2>

                            </div> */}
                            <div className="flex gap-4 flex-col-reverse lg:flex-row">
                                <div>
                                    <button
                                        className={`button-gradient w-full py-4 px-6 rounded-3xl 
                                            flex justify-center items-center gap-x-2
                                            whitespace-nowrap font-bold
                                            disabled:pointer-events-none disabled:opacity-50`}
                                        onClick={sumbitRequest}
                                        disabled={isDisabled}>
                                        Подтвердить заказ
                                        {
                                            isDisabled ?
                                                <ReactLoading type='spinningBubbles' color='#000' height={'20px'} width={'20px'} />
                                                : ''
                                        }
                                    </button>
                                </div>
                                <div className="text-xs">
                                    Ваши личные данные будут использоваться для обработки ваших заказов, упрощения вашей работы с сайтом и для других целей, описанных в нашей <Link to='/politika' className="underline ">политика конфиденциальности</Link>.
                                </div>
                            </div>
                        </aside>
                        <aside>
                            <div className={`${isLoading ? 'bg-gray-100 opacity-50 pointer-events-none' : ''} p-6 rounded-3xl checkout-block-shadow`}>
                                <h2 className="text-xl font-bold mb-4">Корзина</h2>
                                <div className="mb-6">
                                    {
                                        isRendered ?
                                            myBag?.map((item: MyBag, i: number) => {
                                                return <CheckoutItem key={i} item={item} />
                                            })
                                            :
                                            <>
                                                <Skeleton
                                                    style={{
                                                        borderRadius: '0.375rem'
                                                    }}
                                                    baseColor='#fff'
                                                    className="h-[70px] rounded-2xl shadow-custom" />
                                                <Skeleton
                                                    style={{
                                                        borderRadius: '0.375rem'
                                                    }}
                                                    baseColor='#fff'
                                                    className="h-[70px] rounded-2xl shadow-custom" />
                                            </>
                                    }

                                </div>
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold mb-4">Промокод</h2>
                                    <div className="grid grid-cols-21 gap-x-2">
                                        {
                                            isRendered ?
                                                <>
                                                    <div>
                                                        <input type="text" className="border p-2 rounded-xl w-full outline-none" placeholder="Код купона" />
                                                    </div>
                                                    <div>
                                                        <button className="button-gradient w-full p-2 rounded-xl flex justify-center items-center">Применить</button>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <Skeleton
                                                        style={{
                                                            borderRadius: '0.375rem'
                                                        }}
                                                        baseColor='#fff'
                                                        className="h-[50px] rounded-2xl shadow-custom" />
                                                    <Skeleton
                                                        style={{
                                                            borderRadius: '0.375rem'
                                                        }}
                                                        baseColor='#fff'
                                                        className="h-[50px] rounded-2xl shadow-custom" />
                                                </>
                                        }
                                    </div>
                                </div>
                                {
                                    isRendered ?
                                        <div className="bg-[#5AE28C21] p-4 rounded-xl">
                                            <div className="flex justify-between items-center">
                                                <div className="text-lg font-bold">Итого</div>
                                                <div className="text-xl font-bold">{getTotalSum(myBag)}&#x20bd;</div>
                                            </div>
                                        </div>
                                        :
                                        <Skeleton
                                            style={{
                                                borderRadius: '0.375rem'
                                            }}
                                            baseColor='#fff'
                                            className="h-[50px] rounded-2xl shadow-custom" />
                                }
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
            <Help />
            <Toaster richColors position="top-right" />
        </>
    )
}

export default Checkout