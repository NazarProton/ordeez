interface CheckBoxItemProps {
  id: number;
  checked: number;
  setChecked: (id: number) => void;
  label: string;
}

const CheckBoxItem: React.FC<CheckBoxItemProps> = ({
  id,
  checked,
  setChecked,
  label,
}) => (
  <button
    onClick={() => setChecked(id)}
    className={`group flex justify-start gap-2 items-center text-grayNew p-1 ${
      checked === id ? 'text-maize' : 'text-grayNew hover:text-whiteNew'
    }`}
  >
    <input
      checked={checked === id}
      className="checked:group-hover:bg-maize group-hover:outline-whiteNew checked:group-hover:outline-maize border-[3px] checked:bg-maize border-black rounded-full w-3 h-3 cursor-pointer appearance-none color-whiteNew outline outline-1 outline-grayNew checked:outline-1 checked:outline-maize"
      type="checkbox"
      readOnly
    />
    <p className="font-vt323v4">{label}</p>
  </button>
);
export default CheckBoxItem;
