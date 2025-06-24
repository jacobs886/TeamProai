import AiPromptHeader from "@/components/layout/ai-prompt-header";
import NotificationCenter from "@/components/notifications/notification-center";

export default function Notifications() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        <NotificationCenter />
      </div>
    </div>
  );
}