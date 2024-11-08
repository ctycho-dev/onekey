import { FC, useState } from "react";
import { Toaster, toast } from 'sonner'
import { sendEmailCallRequired } from "../utils/email";
import { isValidPhoneNumber } from "../utils";

interface IFooterForm {
}

const FooterForm: FC<IFooterForm> = ({ }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [isDisabled, setButtonDisabled] = useState(false)


    const submitForm = async (event: any) => {
        setButtonDisabled(true)
        console.log(name, phone)
        if (!name) {
            toast.error('Поле "Имя" обязателено к заполнению')
        }
        else if (!phone) {
            toast.error('Поле "Телефон" обязателено к заполнению')
        }
        else if (!isValidPhoneNumber(phone)) {
            toast.error('Поле "Телефон" не валидное')
        }
        else {
            const res = await sendEmailCallRequired(name, phone)

            if (!res || res?.status !== 200) {
                toast.error('Что то пошло не так. Попробуйте снова через несколько минут.')
            } else {
                toast.success('С Вами свяжутся в ближайшее время.')
                setName('')
                setPhone('')
            }
        }
        setButtonDisabled(false)

    }

    return (
        <>
            <div className="grid md:justify-end">
                <span className="text-xs mb-2 text-[#45E555]">Заказать обратную связь?</span>
                <div className="grid tablet:grid-cols-221 gap-y-2">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        className="h-12 border border-[#439F67] rounded-lg outline-none bg-transparent px-4" />
                    <input
                        type="phone"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}
                        className="h-12 tablet:ml-2 border border-[#439F67] rounded-lg outline-none bg-transparent px-4" />
                    <button
                        className={`h-12 text-black button-gradient
                            py-2 px-4 rounded-xl transition-all tablet:ml-2 duration-200
                            hover:-mt-[2px] hover:mb-[2px] hover:cursor-pointer
                            disabled:pointer-events-none disabled:opacity-50`}
                        onClick={submitForm}
                        disabled={isDisabled}
                    >
                        Отправить
                    </button>
                </div>
            </div>
            <Toaster richColors position="top-right" />
        </>
    )
}

export default FooterForm