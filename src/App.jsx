import { Children, useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";
import { Square } from "./components/Square.jsx";
import { TURNS } from "./components/constanst.jsx";
import { checkWinner, checkEndGame } from "./logic/board.jsx";
import { WinnerModal } from "./components/WinnerModal.jsx";

function App() {
  const [board, setBoard] = useState(() => {
    console.log("inicializar estado del board");

    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFormStorage = window.localStorage.getItem("turn");
    //console.log("hola: " + turnFormStorage);
    return turnFormStorage ?? TURNS.x;
  });
  //null es que no hay ganador, flase es que hay un empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.x);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;
    setTurn(newTurn);
    //guardar aqui partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    console.log(turn);
    window.localStorage.setItem("turn", newTurn);

    const newWinner = checkWinner(newBoard);

    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };
  return (
    <main className="board">
      <h1>Tres en Linea</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
