import Footer from "./Footer";
import { HeaderError } from "./HeaderError";


export function LayoutError({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <HeaderError />
      {children}
      <Footer />
    </div>
  );
}
