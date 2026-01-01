interface LoadingProps {
  message: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="text-center p-4">
      <p>{message}</p>
    </div>
  );
}
