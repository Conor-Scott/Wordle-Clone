import './App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const WORD_LENGTH = 5;
const NUMBER_WORD_GUESSES = 6; 
const SOLUTION = "FLASH"


//Container for the entire 6 lines of 5 tiles
function Board({word_guesses, currentLine}) {
  const lines = []
  for (let i = 0; i < NUMBER_WORD_GUESSES; i++)
  {
    if (currentLine <= i)
    {
      lines.push(<Line letter_guesses={word_guesses[i]} isFinal = {true}></Line>)
    }
    else
    {
      lines.push(<Line letter_guesses={word_guesses[i]} isFinal = {false}></Line>)
    }
  }
  return <div className="board">{lines}</div>
  
}

//Forms a word guess, 5 letters
function Line({letter_guesses, isFinal}) {
  const [line, setLine] = useState("");
  const tiles = []

  for (let i = 0; i < WORD_LENGTH; i++)
  {
    const char = letter_guesses[i];
    
    //Handle text coloring

    //If haven't pressed enter yet
    if (isFinal)
    {
      tiles.push(<Tile key={i} tileClassName="notFinal" letter={char}></Tile>)
    }

    //If correct letter and correct position
    else if (SOLUTION[i] === char)
    {
      tiles.push(<Tile key={i} tileClassName="correctPosition" letter={char}></Tile>)
    }

    //If correct letter and wrong position
    else if (SOLUTION.includes(char))
    {
      tiles.push(<Tile key={i} tileClassName="correctLetter" letter={char}></Tile>)
    }

    //If wrong letter
    else
    {
      tiles.push(<Tile key={i} tileClassName="wrongLetter" letter={char}></Tile>)
    }
  }

  return (
    <>
      <div className="line">{tiles}</div>
    </>
  );
}

//Individual Letter
function Tile({letter, tileClassName}) {
  const [tile, setTile] = useState("");

  return (
    <>
      <div className={tileClassName}>{letter}</div>
    </>
  );
}


function App() {
  const guessCreate = Array(NUMBER_WORD_GUESSES).fill('', 0, NUMBER_WORD_GUESSES)
  const [guesses, setGuesses] = useState(guessCreate)
  const [wordIndex, setWordIndex] = useState(0)
  const [isFinal, setIsFinal] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [youWin, setYouWin] = useState(false)
  const [endMessage, setEndMesssage] = useState("")


  useEffect(() => {
    const handleKey = (e) => {

      //Handle Alphabet
      if (e.keyCode >= 65 && e.keyCode <= 90 && guesses[wordIndex].length < WORD_LENGTH)
      {
        let copyOfGuesses = [...guesses]
        copyOfGuesses[wordIndex] += e.key
        copyOfGuesses[wordIndex] = copyOfGuesses[wordIndex].toUpperCase()
        setGuesses(copyOfGuesses);
        console.log(wordIndex)
      }

      //Handle deleting letters
      else if (e.key === "Backspace")
      {
        let copyOfGuesses = [...guesses]
        if (copyOfGuesses[wordIndex].length > 0)
        {
          copyOfGuesses[wordIndex] = copyOfGuesses[wordIndex].slice(0, -1)
        }
        setGuesses(copyOfGuesses);
        console.log(wordIndex)
      }

      //Handle submitting a guess
      else if (e.key === "Enter")
      {
        if (guesses[wordIndex].length >= WORD_LENGTH)
        {
          setWordIndex(wordIndex + 1)
          //setGuesses(guesses)
        }

        //Check if game is over
        if (guesses[wordIndex] === SOLUTION)
        {
          setGameOver(true)
          setYouWin(true)
          setEndMesssage("Congratulations, you won!")
        }
        else if ((wordIndex+1) >= NUMBER_WORD_GUESSES)
        {
          setGameOver(true)
          setEndMesssage("Out of guesses! The solution was " + SOLUTION + ".")
        }
      }
      
    }

    //Handle events
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey);

  }, [guesses, wordIndex])

  //Main HTML 
  return (
    <>
      <header></header>
      <h1>Wordle Clone</h1> 
      <Board word_guesses={guesses} currentLine = {wordIndex}></Board>
      <p>{endMessage}</p>
    </>
  );
} 

export default App;