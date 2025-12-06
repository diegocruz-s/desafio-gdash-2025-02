import { useEffect, useState } from "react";
import { Card } from "../ui/card";

interface IPropsMessage {
  datas: {
    typeMessage: 'error' | 'success';
    message: string;
  }
}

export function Message ({ datas }: IPropsMessage) {
  const [isShowMessage, setIsShowMessage] = useState<boolean>(true);
  const { message, typeMessage } = datas;

  useEffect(() => {
    setTimeout(() => {
      setIsShowMessage(false);
    }, 3000)
  }, [])

  return (
    <div className="w-full mt-4">
      { isShowMessage && (
        <Card
          className={`text-white text-center ${ typeMessage === 'error' ? 'bg-red-500' : 'bg-green-500' }`}
        >
          {message}
        </Card>
      )}
    </div>
  )
}