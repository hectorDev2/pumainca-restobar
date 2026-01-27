import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background-dark">
      <Loader text="Cargando experiencia..." />
    </div>
  );
}
