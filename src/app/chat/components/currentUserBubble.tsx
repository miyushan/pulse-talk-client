import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "../chatWindow";
import { getFirstTwoChars } from "@/lib/getFirstTwoChars";
import { formatDateTime } from "@/lib/formatDateTime";

export const CurrentUserBubble = ({ msg }: { msg: Message }) => {
  return (
    <div key={msg.id} className="flex items-start gap-3 mb-2">
      <Avatar className="h-7 w-7 mt-1 ">
        <AvatarFallback className="text-xs font-medium bg-slate-200">
          {getFirstTwoChars(msg.user.userName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{msg.user.userName}</span>
          <span className="text-xs text-gray-500">
            {formatDateTime(msg.createdAt)[1]}
          </span>
        </div>
        <div className="mt-1 text-sm bg-gray-200 dark:bg-gray-700 p-2 rounded-lg rounded-tl-none">
          {msg.content}
        </div>
      </div>
    </div>
  );
};
