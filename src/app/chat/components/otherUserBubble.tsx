import { Message } from "../chatWindow";
import { formatDateTime } from "@/lib/formatDateTime";

export const OtherUserBubble = ({ msg }: { msg: Message }) => {
  return (
    <div key={msg.id} className="flex justify-end my-2">
      <div className="max-w-[75%]">
        <div className="text-xs text-gray-500 text-end mb-1">
          You • {formatDateTime(msg.createdAt)[1]}
        </div>
        <div className="text-sm bg-blue-500 text-white p-2 rounded-lg rounded-tr-none">
          {msg.content}
        </div>
      </div>
    </div>
  );
};
