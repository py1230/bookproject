"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, BookPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/user-context";
import { addBook } from "@/lib/storage";

export function PublishForm() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [version, setVersion] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("图片大小不能超过5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("请先登录");
      return;
    }

    if (!title.trim()) {
      setError("请输入书名");
      return;
    }

    if (!publisher.trim()) {
      setError("请输入出版社");
      return;
    }

    if (!version.trim()) {
      setError("请输入版本号");
      return;
    }

    if (!image) {
      setError("请上传书籍封面");
      return;
    }

    setIsSubmitting(true);

    try {
      addBook({
        title: title.trim(),
        publisher: publisher.trim(),
        version: version.trim(),
        price: price.trim() || undefined,
        description: description.trim() || undefined,
        image,
        seller_id: user.user_id,
        seller_nickname: user.nickname,
        status: "在售",
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/my-books");
      }, 1500);
    } catch {
      setError("发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Check className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">
            发布成功！
          </h2>
          <p className="mt-2 text-muted-foreground">
            正在跳转到我的发布...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24 md:pb-6">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">发布书籍</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          填写书籍信息，开始出售
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 封面上传 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            书籍封面 <span className="text-destructive">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {image ? (
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-xl border border-border">
              <img
                src={image}
                alt="封面预览"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[3/4] w-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Camera className="h-8 w-8" />
              <span className="text-sm">点击上传</span>
            </button>
          )}
        </div>

        {/* 书名 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            书名 <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="例如：高等数学（上册）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
          />
        </div>

        {/* 出版社 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            出版社 <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="例如：高等教育出版社"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="h-12"
          />
        </div>

        {/* 版本号 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            版本号 <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="例如：3"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="h-12"
          />
        </div>

        {/* 价格（可选） */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            期望价格（可选）
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              ¥
            </span>
            <Input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 pl-8"
            />
          </div>
        </div>

        {/* 描述（可选） */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            书籍描述（可选）
          </label>
          <Textarea
            placeholder="描述书籍的新旧程度、是否有笔记等"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* 提交按钮 */}
        <Button
          type="submit"
          className="h-12 w-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              发布中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <BookPlus className="h-5 w-5" />
              发布书籍
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
