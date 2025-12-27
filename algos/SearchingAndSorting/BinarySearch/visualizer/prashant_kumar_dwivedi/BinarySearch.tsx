"use client";

// BinarySearch.tsx is the main visualizer component.
// Since it uses React hooks like useState, it needs "use client" directive.
// In Next.js, components that use client-side features must be marked as client components.
// This differs from a normal React app where all components are client by default.

import { useState, useEffect } from "react";

interface Step {
  low: number;
  high: number;
  mid: number;
  message: string;
  found: boolean;
  foundIndex?: number;
}

export default function BinarySearch() {
  const [array, setArray] = useState<number[]>([]);
  const [arrayInput, setArrayInput] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // ms

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  };

  const setArrayFromInput = () => {
    const nums = arrayInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
    setArray(nums);
    setSteps([]);
    setCurrentStep(0);
  };

  const startSearch = () => {
    if (array.length === 0) return;
    const targetNum = Number(target);
    if (isNaN(targetNum) || !target.trim()) {
      alert("Please enter a valid search value.");
      return;
    }
    const newSteps: Step[] = [];
    let low = 0;
    let high = array.length - 1;
    let found = false;
    let foundIndex = -1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      newSteps.push({
        low,
        high,
        mid,
        message: `mid = ${mid}, arr[${mid}] = ${array[mid]}, target = ${targetNum}`,
        found: false,
      });
      if (array[mid] === targetNum) {
        found = true;
        foundIndex = mid;
        newSteps[newSteps.length - 1].found = true;
        newSteps[newSteps.length - 1].foundIndex = mid;
        newSteps[newSteps.length - 1].message += `, Found at index ${mid}`;
        break;
      } else if (array[mid] < targetNum) {
        newSteps[newSteps.length - 1].message += `, ${
          array[mid]
        } < ${targetNum}, so low = ${mid + 1}`;
        low = mid + 1;
      } else {
        newSteps[newSteps.length - 1].message += `, ${
          array[mid]
        } > ${targetNum}, so high = ${mid - 1}`;
        high = mid - 1;
      }
    }
    if (!found) {
      newSteps.push({
        low,
        high,
        mid: -1,
        message: `Target not found, low > high`,
        found: false,
      });
    }
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setArray([]);
    setArrayInput("");
    setTarget("");
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const actualSpeed = 3500 - speed; // Invert speed: higher slider = faster
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, actualSpeed);
      return () => clearTimeout(timer);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const current = steps[currentStep];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Binary Search Visualizer
        </h1>
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Array (comma-separated numbers):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="border border-gray-300 px-3 py-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1,3,5,7,9"
              />
              <button
                onClick={setArrayFromInput}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors whitespace-nowrap"
              >
                Set Array
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Target Value:
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="border px-2 py-1 w-full"
              placeholder="e.g., 5"
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={generateArray}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Generate Random Array
            </button>
            <button
              onClick={startSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
              disabled={!target.trim()}
            >
              Let's visualize
            </button>
          </div>
        </div>
        <div className="mb-4 text-center">
          Searching for:{" "}
          <span className="font-semibold">{target || "none"}</span>
        </div>
        {/* Array Display - Reserved Space */}
        <div className="mb-6 min-h-[120px] p-4 bg-white border-2 border-gray-200 rounded-lg flex flex-wrap justify-center items-center gap-2">
          {array.length > 0 ? (
            array.map((num, index) => {
              let className =
                "border-2 px-3 py-2 text-center min-w-[60px] rounded font-mono transition-all";
              if (current) {
                if (index < current.low || index > current.high) {
                  className += " opacity-50 bg-gray-100 border-gray-300";
                }
                if (index === current.mid) {
                  className += " bg-yellow-300 border-yellow-500 shadow-md";
                }
                if (current.found && index === current.foundIndex) {
                  className += " bg-green-300 border-green-500 shadow-md";
                }
              } else {
                className += " bg-gray-100 border-gray-300";
              }
              return (
                <div key={index} className={className}>
                  <div className="font-bold">{num}</div>
                  <div className="text-xs text-gray-600">[{index}]</div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-lg">No array set</p>
              <p className="text-sm">
                Enter an array above and click "Set Array" or "Generate Random
                Array"
              </p>
            </div>
          )}
        </div>
        {current && (
          <div className="mb-4 p-2 bg-gray-200 rounded text-center">
            <p className="font-semibold">Step {currentStep + 1}:</p>
            <p>
              Low: {current.low}, High: {current.high}, Mid: {current.mid}
            </p>
            <p>{current.message}</p>
          </div>
        )}
        {/* Results - Reserved Space */}
        <div className="min-h-[100px] p-6 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center mb-6">
          {steps.length > 0 && currentStep === steps.length - 1 ? (
            <div className="text-center">
              {steps[steps.length - 1].found ? (
                <div>
                  <p className="text-green-800 font-bold text-lg mb-1">
                    ✅ Target Found!
                  </p>
                  <p className="text-gray-700">
                    Index:{" "}
                    <span className="font-semibold">
                      {steps[steps.length - 1].foundIndex}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    Total Steps:{" "}
                    <span className="font-semibold">{steps.length}</span>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-red-800 font-bold text-lg mb-1">
                    ❌ Target Not Found
                  </p>
                  <p className="text-gray-700">
                    Total Steps:{" "}
                    <span className="font-semibold">{steps.length}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Results will appear here after completing the search
            </p>
          )}
        </div>
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous Step
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
            className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next Step
          </button>
          <button
            onClick={reset}
            className="bg-red-700 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-3 justify-center items-center">
          <button
            onClick={() => {
              if (!isPlaying) {
                setCurrentStep(0); // Start from beginning
              }
              setIsPlaying(!isPlaying);
            }}
            disabled={steps.length === 0}
            className="bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isPlaying ? "Pause" : "Auto Play"}
          </button>
          <label className="flex items-center">
            Speed: Slow
            <input
              type="range"
              min="500"
              max="3000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="ml-2 mx-2"
            />
            Fast
          </label>
        </div>
      </div>
    </div>
  );
}
