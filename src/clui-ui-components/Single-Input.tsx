import React, { useState } from 'react';

import ComponentStore from '../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

/**
 * Similar to {@link ListProps}
 */
type SingleInputProps = {
  parents: Array<string>
  type: string
  placeholder?: string
  otherProps?: any
  className?: string
  child?: {
    component: any, // Expect a JSX Element
    props: any
  }
}

/**
 * Abstraction of a Slider Functional Component which can be used in the CLUI
 * @param param0 {@link SliderProps}
 */

const SingleInput = ({
  parents, type, placeholder, child, otherProps, className,
}: SingleInputProps) => {
  const [inputValue, setInputValue] = useState<any>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateConfiguration({ value: inputValue }, [...parents]);
  };

  return (
    <div className="single-input-wrapper">
      <div className="single-input">
        <input type={type} value={inputValue} placeholder={placeholder} onChange={handleChange} className={className || 'single-input-element'} {...otherProps} />
      </div>

      {child && (
        <div className="child">
          <child.component {...child.props} />
        </div>
      )}
      {/* @ts-ignore */}
      <style jsx>
        {`
        .single-input-wrapper {
          display:flex;
          flex-direction: column;
          align-items: center;
          width: 100%
        }
        .child {
          width : 100%;
        }
        .single-input-element {
          background-color: #30363b;
          border-radius: 5px;
        }

        .single-input {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
          background: transparent;
          border-radius: 4px;
          border: solid 1px #ffffff;
          color: inherit;
          display: block;
          outline: 0;
          padding: 0 1rem;
          text-decoration: none;
          width: 50%;
          height : 2.75rem;
        }
        `}

      </style>
    </div>
  );
};

export default SingleInput;
