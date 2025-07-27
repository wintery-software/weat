"use client";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_NAME, MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition, type ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "无效的邮箱地址" }),
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    message: `密码至少${MIN_PASSWORD_LENGTH}个字符`,
  }),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"form">) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(() => {
      // Use FormData to match server action signature
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      login(formData);
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1>登录 {APP_NAME}</h1>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>密码</FormLabel>
                  <Link href="#" className="link text-sm">
                    忘记密码?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="cursor-pointer" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            登录
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              或者
            </span>
          </div>
          <Button className="cursor-pointer" variant="outline" type="button">
            <SiGoogle />
            使用 Google 登录
          </Button>
        </div>
        <div className="text-center text-sm">
          没有账号?&nbsp;
          <a href="#" className="link">
            创建新账号
          </a>
        </div>
      </form>
    </Form>
  );
};
