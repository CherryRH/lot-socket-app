import WebSocketBoard from "@src/app/components/WebSocketBoard";
import {NextUIProvider} from "@nextui-org/system";

export default function Home() {
  return (
    <NextUIProvider className="w-screen h-screen flex min-h-screen flex-col items-center justify-between p-5">
      <WebSocketBoard/>
    </NextUIProvider>
  );
}
