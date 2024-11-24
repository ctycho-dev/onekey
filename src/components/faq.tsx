import { FC } from "react";
import FAQBlock from "./faqBlock";
import { faqList } from '../store/faq'

type FAQType = {
    question: string
    answer: any
}

interface IFAQ { }

const FAQ: FC<IFAQ> = ({ }) => {

    return (
        <>
            <div className="bg-checkout dark:bg-dark-primary dark:text-slate-200">
                <div className="max-w-7xl m-auto px-6 tablet:px-10 pb-10 tablet:pb-20">
                    <div className="py-10">
                        <h2 className="text-3xl mb-14">Часто задаваемые вопросы</h2>

                        {
                            faqList.map((item: FAQType, index) => {
                                return (
                                    <FAQBlock key={index} index={index} question={item.question} answer={item.answer} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FAQ