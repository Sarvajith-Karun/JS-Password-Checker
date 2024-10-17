"use client"

"use client";

import { useState } from 'react';

// Time estimation function
const estimateTimeToCrack = (password: string): string => {
  const rates = {
    veryFast: 1e9, // 1 billion guesses per second
  };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26; // Lowercase letters
  if (/[A-Z]/.test(password)) poolSize += 26; // Uppercase letters
  if (/[0-9]/.test(password)) poolSize += 10; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 32; // Special characters

  const entropy = Math.pow(poolSize, password.length); // Total combinations
  const crackTimeInSeconds = entropy / rates.veryFast;

  // Convert seconds to readable time
  const seconds = crackTimeInSeconds;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  if (hours < 24) return `${Math.round(hours)} hours`;
  if (days < 365) return `${Math.round(days)} days`;
  return `${Math.round(years)} years`;
};

// Checklist rules for password validation
const checkPasswordRules = (password: string) => ({
  minLength: password.length >= 8,
  hasUpperCase: /[A-Z]/.test(password),
  hasLowerCase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

const PasswordChecker = () => {
  const [password, setPassword] = useState<string>('');
  const [strength, setStrength] = useState<string>('');
  const [crackTime, setCrackTime] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Password strength checker function
  const checkStrength = (password: string) => {
    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } =
      checkPasswordRules(password);

    let strengthScore = 0;
    if (minLength) strengthScore++;
    if (hasUpperCase) strengthScore++;
    if (hasLowerCase) strengthScore++;
    if (hasNumber) strengthScore++;
    if (hasSpecialChar) strengthScore++;

    if (strengthScore <= 1) {
      setStrength('Weak');
    } else if (strengthScore === 2 || strengthScore === 3) {
      setStrength('Medium');
    } else if (strengthScore === 4) {
      setStrength('Strong');
    } else if (strengthScore === 5) {
      setStrength('Very Strong');
    }

    setCrackTime(estimateTimeToCrack(password));
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Password Strength Checker</h1>
      <div className="relative w-full max-w-md">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkStrength(e.target.value);
          }}
          className="p-3 w-full border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Enter your password"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="mt-4 w-full max-w-md">
        {strength && (
          <span
            className={`text-lg font-semibold ${
              strength === 'Weak'
                ? 'text-red-500'
                : strength === 'Medium'
                ? 'text-yellow-500'
                : strength === 'Strong'
                ? 'text-green-500'
                : 'text-blue-500'
            }`}
          >
            {strength} Password
          </span>
        )}
      </div>

      <div className="mt-2">
        {crackTime && (
          <p className="text-gray-600">
            Estimated time to crack: <strong>{crackTime}</strong>
          </p>
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <p className="text-xl font-semibold mb-2">Password Requirements:</p>
        <ul className="list-disc list-inside">
          {Object.entries(checkPasswordRules(password)).map(
            ([rule, isValid], idx) => (
              <li
                key={idx}
                className={`${
                  isValid ? 'text-green-600' : 'text-red-500'
                } flex items-center`}
              >
                <span className="mr-2">
                  {isValid ? '✔️' : '❌'}
                </span>
                {rule === 'minLength' && 'At least 8 characters'}
                {rule === 'hasUpperCase' && 'At least one uppercase letter'}
                {rule === 'hasLowerCase' && 'At least one lowercase letter'}
                {rule === 'hasNumber' && 'At least one number'}
                {rule === 'hasSpecialChar' && 'At least one special character'}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default PasswordChecker;
