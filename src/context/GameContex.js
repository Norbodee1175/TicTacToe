import { createContext, useEffect, useState, useContext, useRef } from "react";
import calcBestMove, { calcWinner } from "../helpers/calcSquares";
import { bestMove } from "../helpers/calcSquares";
import { ModalContext } from "./ModalContext";

const GameContext = createContext();

const GameState = (props) => {

  const Rows = localStorage.getItem('Rows')
  const Boxs = localStorage.getItem('Boxs')

  const [dimension, setDimension] = useState(Number(Rows))
  const [screen, setScreen] = useState("start"); // start || game
  const [playMode, setPlayMode] = useState("user"); // user || cpu
  const [activeUser, setActiveUser] = useState("x"); // x || o
  const [squares, setSquares] = useState(new Array(Number(Boxs)).fill(""));
  const [xnext, setXnext] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerLine, setWinnerLine] = useState(null);
  const [ties, setTies] = useState({ x: 0, o: 0 });
  const [sq, setSq] = useState([]);

  const { showModal, hideModal, setModalMode } = useContext(ModalContext);

  useEffect(() => {
    //check if cpu turn
    let currentUser = xnext ? "o" : "x";
    if (playMode === "cpu" && currentUser !== activeUser && !winner) {
      cpuNextMove(squares);
    }
    checkNoWinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xnext, winner, screen]);

  const handleStart = (player, box, row) => {
    setPlayMode(player);
    setSquares(new Array(Number(box)).fill(""))
    setDimension(Number(row))
    setScreen("game");
  };

  const handleSquareClick = (ix) => {
    if (squares[ix] || winner) {
      return;
    }
    let currentUser = xnext ? "o" : "x";
    if (playMode === "cpu" && currentUser !== activeUser) {
      return;
    }
    let ns = [...squares];
    let dm = Number(dimension)
    ns[ix] = !xnext ? "x" : "o";
    setSquares(ns);
    setXnext(!xnext);
    checkWinner(ns, dm);
    setSq(sq.concat([squares]));
  };

  const handleUndo = () => {
    let currentUser = xnext ? "o" : "x";
    if (playMode === "cpu" && currentUser !== activeUser) {
      return;
    }
    setXnext(!xnext);
    if (sq.length > 0) {
      setSquares(sq.slice(-1)[0]);
      // setSquares(sq[sq.length - 1]);
      sq.pop();
    }
    else {
      return;
    }
  }

  const checkWinner = (ns, dm) => {
    let isWinner = calcWinner(ns, dm);
    if (isWinner == 'tie') {
      isWinner = null
      setWinner("no");
      showModal();
      setModalMode("winner");
    }
    if (isWinner) {
      setWinner(isWinner);
      setWinnerLine(isWinner.line);
      const nties = { ...ties };
      nties[isWinner.winner] += 1;
      setTies(nties);
      showModal();
      setModalMode("winner");
    } 
  };

  const cpuNextMove = (sqrs) => {
    if (dimension == 3) {
      let bestmove = bestMove(sqrs, activeUser === "x" ? "o" : "x", dimension);
      let ns = [...squares];
      let dm = Number(dimension)
      ns[bestmove] = !xnext ? "x" : "o";
      setSquares(ns);
      setXnext(!xnext);
      checkWinner(ns, dm);
    } else {
      let bestmove = calcBestMove(sqrs, activeUser === "x" ? "o" : "x", dimension);
      let ns = [...squares];
      let dm = Number(dimension)
      ns[bestmove] = !xnext ? "x" : "o";
      setSquares(ns);
      setXnext(!xnext);
      checkWinner(ns, dm);
    }
  };

  const handleReset = () => {
    setSquares(new Array(Number(localStorage.getItem('Boxs'))).fill(""));
    setXnext(false);
    setWinner(null);
    setWinnerLine(null);
    setActiveUser("x");
    setTies({ x: 0, o: 0 });
    hideModal();
    setScreen("start");
    setSq([]);
  };

  const handleNextRound = () => {
    setSquares(new Array(Number(localStorage.getItem('Boxs'))).fill(""));
    setXnext(winner === "x");
    setWinner(null);
    setWinnerLine(null);
    hideModal();
    setSq([]);
  };

  const checkNoWinner = () => {
    const moves = squares.filter((sq) => sq === "");
    if (moves.length === 0 && winner === null) {
      setWinner("no");
      showModal();
      setModalMode("winner");
    }
  };

  return (
    <GameContext.Provider
      value={{
        dimension,
        squares,
        winner,
        winnerLine,
        xnext,
        ties,
        screen,
        activeUser,
        playMode,
        handleStart,
        setActiveUser,
        setPlayMode,
        setTies,
        handleSquareClick,
        handleReset,
        handleNextRound,
        handleUndo
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

export { GameContext, GameState };
