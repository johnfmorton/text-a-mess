"use client";
import { useState } from 'react';

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [messRange, setMessRange] = useState(50);
  const [output, setOutput] = useState("");

  const diacriticsAbove = [
    '\u0300', // Grave accent
    '\u0301', // Acute accent
    '\u0302', // Circumflex accent
    '\u0303', // Tilde
    '\u0304', // Macron
    '\u0305', // Overline
    '\u0306', // Breve
    '\u0307', // Dot above
    '\u0308', // Diaeresis
    '\u0309', // Hook above
    '\u030A'  // Ring above
  ];

  const diacriticsBelow = [
    '\u0316', // Combining grave accent below
    '\u0317', // Combining acute accent below
    '\u0323', // Combining dot below
    '\u0324', // Combining diaeresis below
    '\u0325', // Combining ring below
    '\u0326', // Combining comma below
    '\u0327', // Combining cedilla
    '\u0328', // Combining ogonek
    '\u0330', // Combining tilde below
    '\u0331'  // Combining macron below
  ];

  function obfuscateText(input: string, messiness: number): string {
    // Scale the messiness value to determine the maximum number of diacritical marks for each position
    const maxMarks = Math.ceil(messiness / 20);
    if (maxMarks <= 0) return input;

    return input.split('').map(char => {
      // Preserve whitespace without modification
      if (char.trim() === '') return char;

      // Generate random counts for above and below diacritics (at least one each)
      const countAbove = Math.floor(Math.random() * maxMarks) + 1;
      const countBelow = Math.floor(Math.random() * maxMarks) + 1;
      let result = char;

      for (let i = 0; i < countAbove; i++) {
        const randomMark = diacriticsAbove[Math.floor(Math.random() * diacriticsAbove.length)];
        result += randomMark;
      }
      for (let i = 0; i < countBelow; i++) {
        const randomMark = diacriticsBelow[Math.floor(Math.random() * diacriticsBelow.length)];
        result += randomMark;
      }
      return result;
    }).join('');
  }

  const updateOutput = (text: string, range: number) => {
    const newOutput = obfuscateText(text, range);
    setOutput(newOutput);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    updateOutput(newText, messRange);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = parseInt(e.target.value, 10);
    setMessRange(newRange);
    updateOutput(rawText, newRange);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div>
      <div className="container mx-auto w-full max-w-3xl bg-amber-100 p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-black text-center mb-2">Text-a-Mess</h1>
        <p>Be as messy as you want to be.</p>
        <textarea
          name="rawText"
          id="raw-text"
          className="w-full h-64 p-2 bg-amber-400/10"
          placeholder="Type your message here"
          value={rawText}
          onChange={handleTextChange}
        />

        <label htmlFor="mess-range">How messy?</label>
        <input
          type="range"
          name="mess-range"
          id="mess-range"
          min="0"
          max="100"
          step="1"
          value={messRange}
          onChange={handleRangeChange}
          className="w-full"
        />

        <div id="output" className="w-full h-64 p-2 bg-amber-400/10">
          <p>{output || "Output will go here"}</p>
        </div>

        <div>
          <button onClick={copyToClipboard}>Copy to clipboard</button>
        </div>
      </div>
    </div>
  );
}
