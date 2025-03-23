"use client";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [rawText, setRawText] = useState('');
  const [messRange, setMessRange] = useState(50);
  const [messChance, setMessChance] = useState(75);
  const [output, setOutput] = useState('');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Add a maxChars constant to set the character limit
  const maxChars = 300;

  // Reference to the IndexedDB database
  const dbRef = useRef<IDBDatabase | null>(null);

  // Open or create the IndexedDB on component mount
  useEffect(() => {
    const request = indexedDB.open('TextAMessSettings', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      dbRef.current = request.result;
      // Retrieve stored settings
      const transaction = dbRef.current.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const getRequest = store.get('settings');
      getRequest.onsuccess = () => {
        const settings = getRequest.result;
        if (settings) {
          if (typeof settings.messRange === 'number') {
            setMessRange(settings.messRange);
          }
          if (typeof settings.messChance === 'number') {
            setMessChance(settings.messChance);
          }
          // Update output with stored settings
          updateOutput(rawText, settings.messRange || messRange, settings.messChance || messChance);
        }
        setSettingsLoaded(true);
      };
      getRequest.onerror = () => {
        console.error('Error retrieving settings:', getRequest.error);
        setSettingsLoaded(true);
      };
    };
    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      setSettingsLoaded(true);
    };
  }, []);

  // Function to save settings to IndexedDB
  const saveSettings = (range: number, chance: number) => {
    if (dbRef.current) {
      const transaction = dbRef.current.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      store.put({ id: 'settings', messRange: range, messChance: chance });
    }
  };

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
    '\u030A',  // Ring above
    '\u030B', // Double acute accent
    '\u030C', // Caron
    '\u030D', // Vertical line above
    '\u030E', // Double vertical line above
    '\u030F', // Double grave accent
    '\u0310', // Candrabindu
    '\u0311', // Inverted breve
    '\u0312', // Turned comma above
    '\u0313', // Comma above
    '\u0314', // Reversed comma above
    '\u0315', // Comma above right
    '\u0316', // Grave accent below
    '\u0317', // Acute accent below
    '\u0318', // Left tack below
    '\u0319', // Right tack below
    '\u031A', // Left angle above
    '\u031B', // Horn
    '\u031C', // Left half ring below
    '\u031D', // Up tack below
    '\u031E', // Down tack below
    '\u031F', // Plus sign below
    '\u0320', // Minus sign below
    '\u0321', // Palatalized hook below
    '\u0322', // Retroflex hook below
    '\u0323', // Dot below
    '\u0324', // Diaeresis below
    '\u0325', // Ring below
    '\u0326', // Comma below
    '\u0327', // Cedilla
    '\u0328', // Ogonek
    '\u0329', // Vertical line below
    '\u032A', // Bridge below
    '\u032B', // Inverted double arch below
    '\u032C', // Caron below
    '\u032D', // Circumflex accent below
    '\u032E', // Breve below
    '\u032F', // Inverted breve below
    '\u0330' // Tilde below
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

  function obfuscateText(input: string, messiness: number, chance: number): string {
    // Scale the messiness value to determine the maximum number of diacritical marks for each position
    const maxMarks = Math.ceil(messiness / 10);
    if (maxMarks <= 0) return input;

    const specialLetters = new Set(['A', 'C', 'E', 'I', 'O', 'U', 'Y', 'P', 'R', 'S', 'T', 'Z', 'a', 'c', 'e', 'i', 'o', 'u', 'y', 'p', 'r', 's', 't', 'z']);
    const extraDiacritics = [
      '\u0336', // Combining Long Strikethrough
      '\u033E', // Combining Double Vertical Stroke Overlay
      '\u030B', // Combining Double Acute Accent
      '\u0360', // Combining Double Tilde
      '\u0311', // Combining Inverted Breve
      '\u030D', // Combining Vertical Line Above
      '\u0342', // Combining Greek Perispomeni
      '\u0343', // Combining Greek Koronis
      '\u0358', // Combining Dot Above Right
      '\u0352', // Combining Turned Comma Above
      '\u033D', // Combining X Above
      '\u031F', // Combining Plus Sign Below
      '\u035C', // Combining Double Breve
      '\u032C', // Combining Caron Below
      '\u033A', // Combining X Below
      '\u033B', // Combining Light Vertical Line Below
      '\u0321'  // Combining Palatalized Hook Below
    ];

    return input.split('').map((char) => {
      // Preserve whitespace without modification
      if (char.trim() === '') return char;

      // Roll to decide if this letter should be obfuscated based on chance
      if (Math.random() * 100 > chance) return char;

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

      // For special letters, add extra diacritics
      if (specialLetters.has(char.toUpperCase())) {
        const countExtra = Math.floor(Math.random() * maxMarks) + 1;
        for (let i = 0; i < countExtra; i++) {
          const randomMark = extraDiacritics[Math.floor(Math.random() * extraDiacritics.length)];
          result += randomMark;
        }
      }

      return result;
    }).join('');
  }

  const updateOutput = (text: string, range: number, chance: number) => {
    const newOutput = obfuscateText(text, range, chance);
    setOutput(newOutput);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    updateOutput(newText, messRange, messChance);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = parseInt(e.target.value, 10);
    setMessRange(newRange);
    updateOutput(rawText, newRange, messChance);
    saveSettings(newRange, messChance);
  };

  const handleChanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChance = parseInt(e.target.value, 10);
    setMessChance(newChance);
    updateOutput(rawText, messRange, newChance);
    saveSettings(messRange, newChance);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  if (!settingsLoaded) {
    return (
      <div className="container mx-auto w-full max-w-3xl p-8">
        <p>Loading settings...</p>
      </div>
    );
  }

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
          maxLength={maxChars}
          value={rawText}
          onChange={handleTextChange}
        />

        <div id='char-count' className={rawText.length >= maxChars * 0.8 ? 'text-red-500' : 'text-gray-700'}>
          {rawText.length} / {maxChars} characters
        </div>

        <hr />

        <label htmlFor="mess-chance">
          What is the chance of a messy letter?
        </label>
        <input
          type="range"
          name="mess-chance"
          id="mess-chance"
          min="0"
          max="100"
          step="1"
          value={messChance}
          onChange={handleChanceChange}
          className="w-full"
        />

        <label htmlFor="mess-range">How messy are you feeling?</label>
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
          <p>{output || 'Output will go here'}</p>
        </div>

        <div>
          <button onClick={copyToClipboard}>Copy to clipboard</button>
        </div>
      </div>
    </div>
  );
}
