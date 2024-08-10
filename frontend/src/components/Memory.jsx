import React from 'react'
import '../memory.css'
import { Flex } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { useEffect } from 'react'
import { SingleCard } from './SingleCard'
import { useToast } from '@chakra-ui/react'

const Memory = () => {
    const cardImages=[
        {"src":"/memory/apple-1.png",matched:false},
        {"src":"/memory/cake-1.png",matched:false},
        {"src":"/memory/crystal-1.png",matched:false},
        {"src":"/memory/dragon-1.png",matched:false},
        {"src":"/memory/sword-1.png",matched:false},
        {"src":"/memory/house-1.png",matched:false},
    ]




    
    const [cards,setCards]=useState([])
    const [turns,setTurns]=useState(0)
    const [choiceOne,setChoiceOne]=useState(null)
    const [choiceTwo,setChoiceTwo]=useState(null)
    const toast=useToast()
    const [disabled,setDisabled]=useState(false)


    //1.duplicate each 2.shufle
    //if postive switch..ifnegatv same hence shufled aray
    //everytime u clicknew gameits gona cal the function shufle cards
    const shuffleCards = () => {
      const shuffledCards = [...cardImages, ...cardImages]
          .sort(() => Math.random() - 0.5)
          .map((card) => ({ ...card, id: Math.random() }));

          
      setChoiceOne(null)
      setChoiceTwo(null)
      setCards(shuffledCards);
      setTurns(0);
  };


      console.log(cards, turns);
 //handle a choiceee
 const handleChoice=(card)=>{
  console.log(card)
  choiceOne? setChoiceTwo(card):setChoiceOne(card)//if null then its  one..not nul then two


 }
 //compare 2 selected cards:
 useEffect(()=>{


  if(choiceOne && choiceTwo){
    setDisabled(true)
    if(choiceOne.src===choiceTwo.src){
  /*     console.log('those cards match') */
  setCards(prevCards=>{
    return prevCards.map(card=>{
      if(card.src===choiceOne.src){
        return{...card, matched:true}
      }else{
        return card
      }
    })
  })

      resetTurn()
                 
    }else{
      console.log('those cards do not match')
      setTimeout(()=>resetTurn(),1000)
    }

  }

 },[choiceOne,choiceTwo])
 console.log("cradsstate:",cards)
 //reset choice and increas turn
 const resetTurn=()=>{
  setChoiceOne(null)
  setChoiceTwo(null)
  setTurns(prevTurns=>prevTurns+1)
  setDisabled(false)
 }
  // Check if all cards are matched and show a toast
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
        toast({
            title: "Congratulations!",
            description: "You matched all the cards!",
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }
}, [cards, toast])
//start anewgame clear states..
useEffect(()=>{
  shuffleCards()
},[])

  return (
    <>
    <Flex flexDirection={"column"} gap={10} justifyContent={"center"}>
        <Heading className='headingx'> Match Master</Heading>
        <button className='memorybutton' onClick={shuffleCards}>New Game</button>
    </Flex>
    <div className='card-grid'>
      {cards.map(card=>(
        <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card===choiceOne||card===choiceTwo||card.matched} 
        disabled={disabled}
        />
      ))}


    </div>
    <p className='memoryp' >Turns:{turns}</p>
    </>
  )
}

export default Memory