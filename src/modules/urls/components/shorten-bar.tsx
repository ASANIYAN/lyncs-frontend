import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Plus } from "lucide-react";

import { CustomInput } from "@/components/custom-components/custom-input";
import { CustomButton } from "@/components/custom-components/custom-button";
import { toast } from "@/components/custom-components/custom-toast";
import { ShortenSchema, type ShortenFormType } from "../utils/validations";
import { useShortenUrl } from "../hooks/use-shorten-url";

const ShortenBar = () => {
  const form = useForm<ShortenFormType>({
    resolver: zodResolver(ShortenSchema),
    defaultValues: {
      url: "",
    },
  });

  const { mutate, isPending } = useShortenUrl();

  const handleSubmit = (values: ShortenFormType) => {
    mutate(
      { url: values.url },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Short URL created");
          form.reset();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        },
      },
    );
  };

  return (
    <form
      className="flex w-full flex-col gap-2.5 sm:flex-row"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <CustomInput
        control={form.control}
        name="url"
        placeholder="https://your-long-url.com"
        type="url"
        leftIcon={<Link2 className="size-4" />}
        containerClassName="flex-1"
      />
      <CustomButton
        type="submit"
        variant="primary"
        loading={isPending}
        leftIcon={<Plus className="size-4" />}
      >
        Shorten
      </CustomButton>
    </form>
  );
};

export default ShortenBar;
