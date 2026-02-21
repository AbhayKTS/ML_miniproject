import { useState } from "react";

type ControlSliderProps = {
  label: string;
  value: number;
  onChange?: (value: number) => void;
};

const ControlSlider = ({ label, value: initValue, onChange }: ControlSliderProps) => {
  const [val, setVal] = useState(initValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    setVal(n);
    onChange?.(n);
  };

  return (
    <div className="slider">
      <label style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ opacity: 0.6, fontSize: 12 }}>{val}%</span>
      </label>
      <input type="range" min={0} max={100} value={val} onChange={handleChange} />
    </div>
  );
};

export default ControlSlider;
