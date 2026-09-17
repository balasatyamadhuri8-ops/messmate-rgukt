import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PROBLEM_CATEGORIES } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/student/report")({
  component: ReportProblem,
});

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

function ReportProblem() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!category) next.category = "Please select a category.";
    if (title.trim().length < 3) next.title = "Please enter a short title.";
    if (description.trim().length < 5) next.description = "Please describe the problem.";
    if (file) {
      if (!ALLOWED.includes(file.type)) next.file = "Please upload a JPG, PNG or WebP image.";
      else if (file.size > MAX_BYTES) next.file = "Image must be 5 MB or smaller.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !profile || !validate()) return;
    setLoading(true);
    try {
      let imagePath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${profile.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("problem-images")
          .upload(path, file, { contentType: file.type });
        if (uploadError) {
          toast.error("Unable to upload the image. Please try again.");
          return;
        }
        imagePath = path;
      }

      const { error } = await supabase.from("problems").insert({
        student_id: profile.id,
        category,
        title: title.trim(),
        description: description.trim(),
        image_url: imagePath,
      });

      if (error) {
        toast.error("Unable to submit the problem. Please try again.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["my-problems"] });
      toast.success("Problem reported successfully. Status: Pending.");
      void navigate({ to: "/student/problems" });
    } catch {
      toast.error("Unable to submit the problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Report a Problem"
        description="Tell the mess staff about any issue. Reports are reviewed and updated by staff."
      />
      <Card className="max-w-2xl border-border/70 shadow-sm">
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="category">Problem Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" aria-invalid={!!errors['category']}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors['category'] ? <p className="text-sm text-destructive">{errors['category']}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                value={title}
                maxLength={120}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!errors['title']}
              />
              {errors['title'] ? <p className="text-sm text-destructive">{errors['title']}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-invalid={!!errors['description']}
              />
              {errors['description'] ? (
                <p className="text-sm text-destructive">{errors['description']}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-sm text-muted-foreground">
                Image is optional. JPG, PNG or WebP up to 5 MB.
              </p>
              {errors['file'] ? <p className="text-sm text-destructive">{errors['file']}</p> : null}
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Submitting..." : "Submit Problem"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
