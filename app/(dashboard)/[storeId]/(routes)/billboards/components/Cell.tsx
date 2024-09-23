import Image from "next/image";

interface CProps {
  imageUrl: string;
}
const Cell = ({ imageUrl }: CProps) => {
  return (
    <div className="relative h-4 min-h-16 w-32 min-w-32 overflow-hidden rounded-md shadow-md">
      <Image
        src={imageUrl}
        alt="Billboard Image"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default Cell;
