export const sliderStyles = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
    transform: translateY(-5px);
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: white;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
    transform: translateY(-2px);
  }
  input[type="range"]::-moz-range-thumb:hover {
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
  }
  input[type="range"]::-moz-range-track {
    height: 4px;
    border-radius: 2px;
  }
  
  body {
    overscroll-behavior: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
