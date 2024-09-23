interface HProps {
  title: String;
  description: String;
}

const Heading = ({ title, description }: HProps) => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
