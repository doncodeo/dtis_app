// src/components/common/Input.tsx
import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegister<any>; // Use any or a specific type for FieldValues
  errors: FieldErrors<FieldValues>;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  list?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  register,
  errors,
  placeholder,
  ...rest
}) => {
  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id, { onChange })}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        list={list}
        className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
          ${errors[id] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
        {...rest}
      />
      {errors[id] && (
        <p className="text-red-500 text-xs italic mt-1">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  );
};

export default Input;
