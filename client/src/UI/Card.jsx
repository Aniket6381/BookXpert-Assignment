import React from "react";

const Card = (props) => {
    const content = props.inputData

    return (
        <>
            {content?.map((card, idx) => {
                return (
                    <div key={idx} className={card.css.cardCSS}>
                        <div className="group-hover:scale-110 transition-all duration-500">
                            <div className={card.css.headingCSS}>{card.title}</div>
                            <div className={card.css.dataCSS}>{card.data}</div>
                        </div>
                        <div className="group-hover:scale-110 transition-all duration-500">
                            <card.icon className={card.css.iconCSS} />
                        </div>
                    </div>
                )
            })}
        </>
    )

}

export default Card