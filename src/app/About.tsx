'use client';
import { useState } from 'react';
import useIndexedDBStore from './hooks/useIndexedDB';

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  const [dontShow, setDontShow] = useState(false);
  const { putValue } = useIndexedDBStore();

  const handleDontShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDontShow(e.target.checked);
  };

  const handleClose = () => {
    console.log('handleClose invoked, dontShow:', dontShow);
    if (dontShow) {
      putValue('hideAbout', true)
        .then(() => {
          // console.log('Preference saved, closing modal.');
          onClose();
        })
        .catch((error) => {
          console.error('Error saving About preference:', error);
          onClose();
        });
    } else {
      // console.log('No preference saved, closing modal.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 z-50 px-4 sm:px-0">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">About Text-a-Mess</h2>
        <p className="mb-4">
          Text-a-Mess is a hacky little app that obfuscates your text
          using&nbsp;
          <a
            href="https://en.wikipedia.org/wiki/Diacritic"
            className="text-blue-600 underline" target='_blank'
          >
            diacritical marks
          </a>
          . It transforms your text into something visually interesting but{' '}
          <span className="text-red-700 font-bold bg-amber-50">
            it severely impacts accessibility of your text.
          </span>{' '}
          Please use it with that in mind. It was built just for fun.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dont-show"
            checked={dontShow}
            onChange={handleDontShowChange}
            className="mr-2"
          />
          <label htmlFor="dont-show" className="text-sm">
            Don&apos;t show this again
          </label>
        </div>
        <button
          onClick={handleClose}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
