import SystemNotification from "@models/SystemNotification";
import User from "@models/User";

export interface NotificationWithUser extends SystemNotification{
    user:User
}