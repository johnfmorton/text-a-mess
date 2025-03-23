'use client';
import { useState, useEffect, useCallback } from 'react';
import AboutModal from './About';
import useIndexedDBStore from './hooks/useIndexedDB';

export default function Home() {
  const [rawText, setRawText] = useState('');
  const [messRange, setMessRange] = useState(50);
  const [messChance, setMessChance] = useState(75);
  const [output, setOutput] = useState('');
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  // New state to ensure we load the About preference only once
  const [aboutPreferenceLoaded, setAboutPreferenceLoaded] = useState(false);

  const maxChars = 300;

  const { db, putValue, getValue } = useIndexedDBStore();

  // Wrap obfuscateText in useCallback so it remains stable.
  const obfuscateText = useCallback(
    (input: string, messiness: number, chance: number): string => {
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
        '\u0336',
        '\u033E',
        '\u030B',
        '\u0360',
        '\u0311',
        '\u030D',
        '\u0342',
        '\u0343',
        '\u0358',
        '\u0352',
        '\u033D',
        '\u031F',
        '\u035C',
        '\u032C',
        '\u033A',
        '\u033B',
        '\u0321',
      ];
      return input
        .split('')
        .map((char) => {
          // Preserve whitespace without modification (including line breaks)
          if (char.trim() === '') return char;
          if (Math.random() * 100 > chance) return char;
          const countAbove = Math.floor(Math.random() * maxMarks) + 1;
          const countBelow = Math.floor(Math.random() * maxMarks) + 1;
          let result = char;
          const diacriticsAbove = [
            '\u0300',
            '\u0301',
            '\u0302',
            '\u0303',
            '\u0304',
            '\u0305',
            '\u0306',
            '\u0307',
            '\u0308',
            '\u0309',
            '\u030A',
            '\u030B',
            '\u030C',
            '\u030D',
            '\u030E',
            '\u030F',
            '\u0310',
            '\u0311',
            '\u0312',
            '\u0313',
            '\u0314',
            '\u0315',
            '\u0316',
            '\u0317',
            '\u0318',
            '\u0319',
            '\u031A',
            '\u031B',
            '\u031C',
            '\u031D',
            '\u031E',
            '\u031F',
            '\u0320',
            '\u0321',
            '\u0322',
            '\u0323',
            '\u0324',
            '\u0325',
            '\u0326',
            '\u0327',
            '\u0328',
            '\u0329',
            '\u032A',
            '\u032B',
            '\u032C',
            '\u032D',
            '\u032E',
            '\u032F',
            '\u0330',
          ];
          const diacriticsBelow = [
            '\u0316',
            '\u0317',
            '\u0323',
            '\u0324',
            '\u0325',
            '\u0326',
            '\u0327',
            '\u0328',
            '\u0330',
            '\u0331',
          ];
          for (let i = 0; i < countAbove; i++) {
            const randomMark =
              diacriticsAbove[
                Math.floor(Math.random() * diacriticsAbove.length)
              ];
            result += randomMark;
          }
          for (let i = 0; i < countBelow; i++) {
            const randomMark =
              diacriticsBelow[
                Math.floor(Math.random() * diacriticsBelow.length)
              ];
            result += randomMark;
          }
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
    },
    []
  );

  // Wrap updateOutput in useCallback so its dependency is stable.
  const updateOutput = useCallback(
    (text: string, range: number, chance: number) => {
      const newOutput = obfuscateText(text, range, chance);
      setOutput(newOutput);
    },
    [obfuscateText]
  );

  // Use fixed default values to avoid unwanted effect re-runs.
  useEffect(() => {
    if (db && !settingsLoaded) {
      const defaultMessRange = 50;
      const defaultMessChance = 75;
      getValue('settings')
        .then((result) => {
          if (
            result &&
            typeof (
              result as { value: { messRange?: number; messChance?: number } }
            ).value === 'object'
          ) {
            const { messRange: savedRange, messChance: savedChance } =
              (result as { value: { messRange?: number; messChance?: number } })
                .value || {};
            if (typeof savedRange === 'number') {
              setMessRange(savedRange);
            }
            if (typeof savedChance === 'number') {
              setMessChance(savedChance);
            }
            // Only update output if rawText is still empty.
            if (rawText === '') {
              updateOutput(
                '',
                savedRange || defaultMessRange,
                savedChance || defaultMessChance
              );
            }
          } else {
            // Only update output if rawText is still empty.
            if (rawText === '') {
              updateOutput('', defaultMessRange, defaultMessChance);
            }
          }
          setSettingsLoaded(true);
        })
        .catch((error) => {
          console.error('Error retrieving settings:', error);
          setSettingsLoaded(true);
        });
    }
  }, [db, getValue, updateOutput, settingsLoaded, rawText]);

  // New effect to check "hideAbout" only once.
  useEffect(() => {
    if (db && !aboutPreferenceLoaded) {
      getValue('hideAbout')
        .then((result) => {
          if (!result || (result as { value?: boolean }).value !== true) {
            setShowAbout(true);
          } else {
            setShowAbout(false);
          }
          setAboutPreferenceLoaded(true);
        })
        .catch((error) => {
          console.error('Error retrieving hideAbout preference:', error);
          setShowAbout(true);
          setAboutPreferenceLoaded(true);
        });
    }
  }, [db, getValue, aboutPreferenceLoaded]);

  const saveSettings = (range: number, chance: number) => {
    if (db) {
      putValue('settings', { messRange: range, messChance: chance }).catch(
        (error) => console.error('Error saving settings:', error)
      );
    }
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
            |{' '}
            <a
              href="https://supergeekery.com"
              className="text-sky-700 underline"
            >
              SuperGeekery.com
            </a>{' '}
            |{' '}
            <a
              href="https://github.com/johnfmorton/text-a-mess"
              className="text-sky-700 underline"
            >
              Source code on GitHub
            </a>
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
                className="text-sky-700 underline"
              >
                John F Morton
              </a>{' '}
              is licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                target="_blank"
                rel="license noopener noreferrer"
                style={{ display: 'inline-block' }}
                className="text-sky-700 underline"
              >
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0
                International
              </a>
            </span>
            <span className="flex justify-center items-center flex-row flex-wrap">
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
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
