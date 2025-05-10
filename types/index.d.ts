export type CognitoUserGroup = "admin" | "user" | "guest";

export type AlertType = "info" | "success" | "warning" | "error";

export interface BannerMessage {
  type: AlertType | null;
  message: string | null;
  url: string | null;
}
