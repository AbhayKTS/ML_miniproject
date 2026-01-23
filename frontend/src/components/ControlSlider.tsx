type ControlSliderProps = {
  label: string;
  value: number;
};

const ControlSlider = ({ label, value }: ControlSliderProps) => {
  return (
    <div className="slider">
      <label>{label}</label>
      <input type="range" min={0} max={100} defaultValue={value} />
    </div>
  );
};

export default ControlSlider;
