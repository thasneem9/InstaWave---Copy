import React from 'react'
import '../singlecard.css'

export const SingleCard = ({card, handleChoice,flipped,disabled}) => {

const handleClick=()=>{
    if(!disabled){
        handleChoice(card)

    }


}

  return (
    <div className='card'>

    
    <div className={flipped?"flipped":""}>
            
            <img className="front" src={card.src} style={{ width: "100px", height: "150",margin: " auto"  }}/>
            <img className="back"  onClick={handleClick} src="/memory/purplex.png"/>
    </div>
    </div>

       
  )
}
