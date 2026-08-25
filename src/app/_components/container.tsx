type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="mx-auto max-w-[1200px] px-5">{children}</div>;
};

export default Container;
