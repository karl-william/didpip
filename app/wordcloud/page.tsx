'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WordCloud from '@/components/data-viz/WordCloud';

export default function WordCloudPage() {
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<string[]>([
    'education', 'learning', 'teaching', 'school', 'classroom',
    'student', 'teacher', 'knowledge', 'skills', 'curriculum',
    'lesson', 'study', 'academic', 'education', 'learning'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newWords = inputText.split(',').filter(word => word.trim() !== '');
      setWords(newWords);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Word Cloud Generator</h1>
        
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Enter Words</h2>
            <p className="mb-4">Enter a list of words separated by commas to generate a word cloud.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <textarea 
                  className="textarea textarea-bordered h-24"
                  placeholder="Enter words separated by commas..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                ></textarea>
              </div>
              <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary">Generate Word Cloud</button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Word Cloud</h2>
            <WordCloud words={words} width={600} height={400} />
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">About Word Clouds</h3>
              <p>
                Word clouds visually represent text data where the size of each word indicates its frequency or importance.
                They are useful for quickly perceiving the most prominent terms in a text and for comparing word usage between different texts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
