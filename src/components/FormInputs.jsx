import React from 'react';

export function TextInput({
  label,
  error,
  hint,
  required,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-text-primary font-sans text-sm font-medium">
          {label}
          {required && <span className="text-red-wine ml-1">*</span>}
        </label>
      )}
      <input
        className={`editorial-input ${error ? 'ring-2 ring-red-wine' : ''}`}
        {...props}
      />
      {error && <p className="text-red-wine font-sans text-xs">{error}</p>}
      {hint && !error && <p className="text-text-secondary font-sans text-xs">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  required,
  rows = 4,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-text-primary font-sans text-sm font-medium">
          {label}
          {required && <span className="text-red-wine ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`editorial-input resize-none ${error ? 'ring-2 ring-red-wine' : ''}`}
        {...props}
      />
      {error && <p className="text-red-wine font-sans text-xs">{error}</p>}
      {hint && !error && <p className="text-text-secondary font-sans text-xs">{hint}</p>}
    </div>
  );
}

export function SelectInput({
  label,
  error,
  hint,
  required,
  options = [],
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-text-primary font-sans text-sm font-medium">
          {label}
          {required && <span className="text-red-wine ml-1">*</span>}
        </label>
      )}
      <select
        className={`editorial-input ${error ? 'ring-2 ring-red-wine' : ''}`}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-wine font-sans text-xs">{error}</p>}
      {hint && !error && <p className="text-text-secondary font-sans text-xs">{hint}</p>}
    </div>
  );
}

export function CheckboxInput({
  label,
  error,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-coffee text-coffee cursor-pointer"
          {...props}
        />
        {label && (
          <span className="text-text-primary font-sans text-sm">
            {label}
          </span>
        )}
      </label>
      {error && <p className="text-red-wine font-sans text-xs">{error}</p>}
    </div>
  );
}

export function RadioInput({
  label,
  options = [],
  error,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-text-primary font-sans text-sm font-medium">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              className="w-4 h-4 cursor-pointer"
              {...props}
            />
            <span className="text-text-primary font-sans text-sm">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-wine font-sans text-xs">{error}</p>}
    </div>
  );
}
