'use client';
import { useState, useEffect } from 'react';
import AboutModal from './About';
import useIndexedDBStore from './hooks/useIndexedDB';

export default function Home() {
  const [rawText, setRawText] = useState('');
  const [messRange, setMessRange] = useState(50);
  const [messChance, setMessChance] = useState(75);
  const [output, setOutput] = useState('');
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  // New state for controlling the About modal
  const [showAbout, setShowAbout] = useState(false);

  // Add a maxChars constant to set the character limit
  const maxChars = 300;

  // Use the custom hook for IndexedDB operations
  const { db, putValue, getValue } = useIndexedDBStore();

  // Retrieve stored settings once the IndexedDB is ready
  useEffect(() => {
    if (db) {
      getValue('settings')
        .then((result) => {
          if (result && typeof result.value === 'object') {
            const { messRange: savedRange, messChance: savedChance } =
              result.value;
            if (typeof savedRange === 'number') {
              setMessRange(savedRange);
            }
            if (typeof savedChance === 'number') {
              setMessChance(savedChance);
            }
            updateOutput(
              rawText,
              savedRange || messRange,
              savedChance || messChance
            );
          }
          setSettingsLoaded(true);
        })
        .catch((error) => {
          console.error('Error retrieving settings:', error);
          setSettingsLoaded(true);
        });
    }
  }, [db]);

  // Check IndexedDB for about content preference instead of localStorage
  useEffect(() => {
    if (db) {
      getValue('hideAbout')
        .then((result) => {
          if (!result || result.value !== true) {
            setShowAbout(true);
          }
        })
        .catch((error) => {
          console.error('Error retrieving hideAbout preference:', error);
          setShowAbout(true);
        });
    }
  }, [db]);

  // Function to save settings using the custom hook
  const saveSettings = (range: number, chance: number) => {
    if (db) {
      putValue('settings', { messRange: range, messChance: chance }).catch(
        (error) => console.error('Error saving settings:', error)
      );
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
    '\u030A', // Ring above
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
    '\u0330', // Tilde below
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
    '\u0331', // Combining macron below
  ];

  function obfuscateText(
    input: string,
    messiness: number,
    chance: number
  ): string {
    // Scale the messiness value to determine the maximum number of diacritical marks for each position
    const maxMarks = Math.ceil(messiness / 10);
    if (maxMarks <= 0) return input;

    const specialLetters = new Set([
      'A',
      'C',
      'E',
      'I',
      'O',
      'U',
      'Y',
      'P',
      'R',
      'S',
      'T',
      'Z',
      'a',
      'c',
      'e',
      'i',
      'o',
      'u',
      'y',
      'p',
      'r',
      's',
      't',
      'z',
    ]);
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
      '\u0321', // Combining Palatalized Hook Below
    ];

    return input
      .split('')
      .map((char) => {
        // Preserve whitespace without modification (including line breaks)
        if (char.trim() === '') return char;

        // Roll to decide if this letter should be obfuscated based on chance
        if (Math.random() * 100 > chance) return char;

        // Generate random counts for above and below diacritics (at least one each)
        const countAbove = Math.floor(Math.random() * maxMarks) + 1;
        const countBelow = Math.floor(Math.random() * maxMarks) + 1;
        let result = char;

        for (let i = 0; i < countAbove; i++) {
          const randomMark =
            diacriticsAbove[Math.floor(Math.random() * diacriticsAbove.length)];
          result += randomMark;
        }
        for (let i = 0; i < countBelow; i++) {
          const randomMark =
            diacriticsBelow[Math.floor(Math.random() * diacriticsBelow.length)];
          result += randomMark;
        }

        // For special letters, add extra diacritics
        if (specialLetters.has(char.toUpperCase())) {
          const countExtra = Math.floor(Math.random() * maxMarks) + 1;
          for (let i = 0; i < countExtra; i++) {
            const randomMark =
              extraDiacritics[
                Math.floor(Math.random() * extraDiacritics.length)
              ];
            result += randomMark;
          }
        }

        return result;
      })
      .join('');
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
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopySuccess('Copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy.');
        setTimeout(() => setCopySuccess(''), 3000);
      });
  };

  if (!settingsLoaded) {
    return (
      <div className="container mx-auto w-full max-w-3xl p-8 flex flex-col items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      <div className="container mx-auto w-full max-w-3xl bg-white pt-6 px-6 font-[family-name:var(--font-geist-sans)] flex flex-col justify-between min-h-dvh">
        <div>
          <div className="text-center pb-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-2 font-[family-name:var(--font-kablammo)] text-a-mess-gradient">
              Text-a-Mess
            </h1>
            <p className="font-bold sm:text-lg text-slate-600 italic">
              Let̟̦͂ yo̶̮̱ur tex̟̖ṭ̊̋ ṛ̖̾ef̰̀l̤̰ȩ̈̾ct yoȗ̗̱r̶̮̖ inn̖̖er cḥ̖a̪̱̓os̶̙̤.
            </p>
          </div>
          <textarea
            name="rawText"
            id="raw-text"
            className="w-full min-h-36 p-4 bg-slate-300/10 border border-gray-300 rounded h-auto"
            placeholder="Type your message here"
            maxLength={maxChars}
            value={rawText}
            onChange={handleTextChange}
          />

          <div className="mb-6 flex flex-col sm:flex-row justify-between">
            <div
              id="char-count"
              className={
                (rawText.length >= maxChars * 0.8
                  ? 'text-red-500'
                  : 'text-gray-700') + ' font-mono text-sm'
              }
            >
              {rawText.length} / {maxChars} characters
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                {rawText.length >= maxChars
                  ? 'You have reached the maximum character limit.'
                  : ''}
              </p>
            </div>
          </div>

          <div
            id="output"
            className="w-full min-h-36 p-4 bg-slate-300/10 border border-gray-300 rounded break-words whitespace-pre-wrap"
          >
            <p
              className={
                rawText.length >= 1 ? 'text-slate-900-500' : 'text-gray-400'
              }
            >
              {output || 'Your messy text will appear here'}
            </p>
          </div>

          <div className="space-y-2 pt-3 pb-4 border border-gray-300 p-4 my-6 text-sm">
            <h2 className="font-bold text-base">Settings</h2>
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
          </div>
          <div className="flex justify-center mt-4 flex-col items-center">
            <button
              onClick={copyToClipboard}
              className="bg-a-mess-gradient text-white px-5 py-1.5 text-lg rounded-sm font-bold border border-slate-200 cursor-pointer transform-gpu transition-color duration-150 ease-in-out"
            >
              Copy your mess to the clipboard
            </button>
            {copySuccess && (
              <div className="text-green-600 mt-2 text-center">
                {copySuccess}
              </div>
            )}
          </div>
        </div>
        {/* Footer button to show the About modal */}
        <footer className="mt-12 text-center flex flex-col justify-between text-xs px-3 sm:px-0 py-3 text-slate-600 border-t border-gray-200 gap-3">
          <div>
            <button
              onClick={() => {
                // Remove the stored preference and show the About modal again
                putValue('hideAbout', { value: false }).catch((error) =>
                  console.error('Error removing hideAbout preference:', error)
                );
                setShowAbout(true);
              }}
              className="text-sky-700 underline"
            >
              About this app
            </button>{' '}
            | <a href="https://supergeekery.com">SuperGeekery.com</a> |{' '}
            <a href="https://github.com/supergeekery">GitHub</a>
          </div>
          <p className="w-full text-center flex flex-col items-center gap-1">
            <span>
              <a
                rel="cc:attributionURL"
                href="https://text-a-mess.supergeekery.com"
              >
                Text-a-Mess
              </a>{' '}
              by{' '}
              <a
                rel="cc:attributionURL dct:creator"
                href="https://johnfmorton.com"
              >
                John F Morton
              </a>{' '}
              is licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                target="_blank"
                rel="license noopener noreferrer"
                style={{ display: 'inline-block' }}
              >
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0
                International
              </a>
            </span>
            <div className="flex justify-center items-center flex-row flex-wrap">
              <img
                style={{
                  height: '22px',
                  marginLeft: '3px',
                  verticalAlign: 'text-bottom',
                }}
                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                alt=""
              />
              <img
                style={{
                  height: '22px',
                  marginLeft: '3px',
                  verticalAlign: 'text-bottom',
                }}
                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                alt=""
              />
              <img
                style={{
                  height: '22px',
                  marginLeft: '3px',
                  verticalAlign: 'text-bottom',
                }}
                src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                alt=""
              />
              <img
                style={{
                  height: '22px',
                  marginLeft: '3px',
                  verticalAlign: 'text-bottom',
                }}
                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
                alt=""
              />
            </div>
          </p>
        </footer>
      </div>
    </div>
  );
}
