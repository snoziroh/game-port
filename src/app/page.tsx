"use client"
import { Press_Start_2P } from "next/font/google";
import Image from "next/image";

import { getRandom2DArray, canScored, checkForMatchingPairsAndPaths, shuffleGrid } from '@/app/utils/constants';
import { useEffect, useState } from "react";
import InformBox from "./InformBox";

const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400' });

type Card = {
  name: string;
  x: number;
  y: number;
}

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<Card>({ name: '', x: -1, y: -1 });
  const [lifeCount, setLifeCount] = useState(10);
  const [point, setPoint] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [stagePoint, setStagePoint] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(500);

  useEffect(() => {
    setGrid(getRandom2DArray()); // Chỉ chạy trên client
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsPaused(true);
      return; // Dừng khi hết thời gian
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup khi component unmount
  }, [timeLeft]);

  useEffect(() => {
    //Kiểm tra xem còn tồn tại nước đi hay không mỗi khi grid thay đổi
    if (grid.length > 0) {
      if (stagePoint === 1440) {
        setIsPaused(true);
        return;
      }
      if (!checkForMatchingPairsAndPaths(grid)) {
        if (lifeCount > 0) {
          setGrid((prevGrid) => shuffleGrid(prevGrid));
          setLifeCount(lifeCount - 1);
        } else {
          alert("You lose!!");
        }
      }
    }
  }, [grid]);

  function handleOnClick(pokemon: string, x: number, y: number) {
    setSelectedPokemon(() => {
      if (pokemon === '') return selectedPokemon; //Không làm gì nếu click vào ô rỗng
      if (selectedPokemon.name === '') { //Nếu trước đó chưa có thẻ nào được chọn thì đánh dấu
        return { name: pokemon, x, y };
      } else if (selectedPokemon.x === x && selectedPokemon.y === y) { //Nếu thẻ được trọn trùng vị trí với thẻ vừa bấm thì bỏ chọn
        return { name: '', x: -1, y: -1 };
      } else if (selectedPokemon.name === pokemon) { //Nếu thẻ được chọn cùng loại với thẻ đã chọn trước thì kiểm tra đường đi
        if (canScored(grid, selectedPokemon.x, selectedPokemon.y, x, y)) {//Kiểm tra đường đi hợp lệ
          //Xóa đi các thẻ đã được ghi điểm và cộng điểm
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[selectedPokemon.y][selectedPokemon.x] = '';
            newGrid[y][x] = '';
            return newGrid;
          });
          setPoint(point + 20);
          setStagePoint(stagePoint + 20);

          //Xử lý khi hết bàn cờ (qua màn)

          return { name: '', x: -1, y: -1 };
        } else { //Nếu đường đi không hợp lệ thì xóa chọn thẻ cũ
          return { name: '', x: -1, y: -1 };
        }
      } else { //Nếu thẻ được chọn khác loại với thẻ đã chọn trước thì bỏ chọn
        return { name: '', x: -1, y: -1 };
      }
    });
  }

  function stageClear() {
    setTimeLeft(500);
    setGrid(getRandom2DArray());
    setLifeCount(lifeCount + 1);
    setStagePoint(0);
    setIsPaused(false);
    return;
  }


  return (
    <div className="w-[768px] h-[586px] flex flex-col rounded-md border-gray-500 border overflow-hidden">
      {isPaused && <InformBox stageClear={stageClear}/>}
      <div className="w-full flex justify-between bg-[#EFF4F9] items-center font-medium">
        <div className="flex gap-2 px-1">
          <Image src={"/pokemon/logo.png"} alt={""} width={24} height={24} />
          <p className="">Pikachu Classic Cloned By TMQ</p>
        </div>
        <div className="flex">
          <div className="flex justify-center px-2 items-center hover:bg-gray-300 text-black py-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929C4.48043 11.1054 4.73478 11 5 11H19C19.2652 11 19.5196 11.1054 19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071C19.5196 12.8946 19.2652 13 19 13H5C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex justify-center px-2 items-center hover:bg-gray-300 text-black py-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.616 20C5.168 20 4.78667 19.8427 4.472 19.528C4.15733 19.2133 4 18.8323 4 18.385V5.615C4 5.16833 4.15733 4.78733 4.472 4.472C4.78667 4.15733 5.168 4 5.616 4H18.385C18.8317 4 19.2127 4.15733 19.528 4.472C19.8427 4.78667 20 5.168 20 5.616V18.385C20 18.8317 19.8427 19.2127 19.528 19.528C19.2133 19.8427 18.8323 20 18.385 20H5.616ZM5.616 19H18.385C18.5643 19 18.7117 18.9423 18.827 18.827C18.9423 18.7117 19 18.5643 19 18.385V5.615C19 5.43567 18.9423 5.28833 18.827 5.173C18.7117 5.05767 18.5643 5 18.385 5H5.615C5.43567 5 5.28833 5.05767 5.173 5.173C5.05767 5.28833 5 5.436 5 5.616V18.385C5 18.5643 5.05767 18.7117 5.173 18.827C5.28833 18.9423 5.436 19 5.616 19Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex justify-center px-2 items-center hover:bg-gray-300 text-black py-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6.39989 18.308L5.69189 17.6L11.2919 12L5.69189 6.40002L6.39989 5.69202L11.9999 11.292L17.5999 5.69202L18.3079 6.40002L12.7079 12L18.3079 17.6L17.5999 18.308L11.9999 12.708L6.39989 18.308Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full text-sm flex bg-white">
        <div className="px-1 hover:bg-gray-200 cursor-pointer">
          Game (<span className="underline">G</span>)
        </div>
        <div className="px-1 hover:bg-gray-200 cursor-pointer">
          Sound (<span className="underline">S</span>)
        </div>
        <div className="px-1 hover:bg-gray-200 cursor-pointer">
          About (<span className="underline">A</span>)
        </div>
      </div>
      <div className="w-full h-full bg-black flex flex-col py-5 px-10 gap-7">
        <div className={`${pressStart2P.className} flex items-center justify-between text-white`}>
          <div className="w-[80]">❤️{lifeCount}</div>
          <div className="w-1/2 border-yellow-200 border h-3/4 self-center">
            <div
              className={`h-full animate-gradient`}
              style={{ width: `${timeLeft / 5}%`, animationPlayState: isPaused ? "paused" : "running" }}
            >
            </div>
          </div>
          <div className="w-[80] text-right">{point}</div>
        </div>
        <div className="flex flex-col w-full text-center">
          {grid.map((row, rowIndex) => (
            rowIndex > 0 && rowIndex < grid.length - 1 &&
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                colIndex > 0 && colIndex < row.length - 1 &&
                <div
                  key={colIndex}
                  className={`card ${grid[rowIndex][colIndex] === '' ? 'scored-card' : ''} ${selectedPokemon.x === colIndex && selectedPokemon.y === rowIndex ? 'selected-card' : ''}`}
                  onClick={() => handleOnClick(cell, colIndex, rowIndex)}
                >
                  {cell !== '' && <Image src={`/pokemon/${cell}.png`} alt={cell} width={30} height={30} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
