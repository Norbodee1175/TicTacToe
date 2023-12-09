import React, { useState ,useEffect, useContext } from "react";

import { GameContext } from "../../context/GameContex";
import Oicon from "../icons/Oicon";
import Xicon from "../icons/Xicon";

const Start = () => {
  const { activeUser, setActiveUser, handleStart } = useContext(GameContext);

  const [numberOfRows, setNumberOfRows] = useState(3);
  const [numberOfBoxs, setNumberOfBoxs] = useState(9);

  useEffect(() => {
    localStorage.setItem('Rows', numberOfRows);
    localStorage.setItem('Boxs', numberOfBoxs);
  }, []);

  const selectrows = async () => {
    localStorage.setItem('Rows', numberOfRows);
    localStorage.setItem('Boxs', numberOfBoxs);
  }
  const selectcpu = async () => {
    localStorage.setItem('Rows', 3);
    localStorage.setItem('Boxs', 9);
  }

  return (
    <div className="start">
      <div className="start__header">
        <Xicon />
        <Oicon />
        <div>
          <select
            className="selectrows"
            onChange={(e) => setNumberOfRows(e.target.value) || setNumberOfBoxs(e.target.value*e.target.value)}>
                <option value="3">3 Rows</option>
                <option value="4">4 Rows</option>
                <option value="5">5 Rows</option>
                <option value="6">6 Rows</option>
                <option value="7">7 Rows</option>
                <option value="8">8 Rows</option>
                <option value="9">9 Rows</option>
          </select>
          {/* Confirm Button */}
          {/* <button className="btn btn-gray" onClick={selectrows}>Comfirm Rows</button> */}
        </div>
      </div>
      <div className="card shadow-gray">
        <h1 className="text-lg">Pick player 1'st mark</h1>
        <div className="start__players">
          <span
            className={activeUser === "x" ? "start__players--active" : ""}
            onClick={() => setActiveUser("x")}
          >
            <Xicon color={activeUser === "x" ? "dark" : "light"} />
          </span>
          <span
            className={activeUser === "o" ? "start__players--active" : ""}
            onClick={() => setActiveUser("o")}
          >
            <Oicon color={activeUser === "o" ? "dark" : "light"} />
          </span>
        </div>
        <p className="text-light text-normal">remember: x goes first</p>
      </div>
      <div className="start__btns">
        <button className="btn btn-yellow" onClick={() => {handleStart("cpu", 9, 3); selectcpu()}}>
          new game (vs CPU) (only 3x3)
        </button>
        <button className="btn btn-blue" onClick={() => {handleStart("user", numberOfBoxs, numberOfRows); selectrows()}}>
          {" "}
          new game (vs Player)
        </button>
      </div>
    </div>
  );
};

export default Start;
