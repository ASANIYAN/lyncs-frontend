import { useNavigate } from "react-router-dom";

import { CustomButton } from "@/components/custom-components/custom-button";

interface SignupSuccessViewProps {
  successMessage: string;
}

const SignupSuccessView = ({ successMessage }: SignupSuccessViewProps) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4 text-center py-1">
      <div className="space-y-1.5">
        <h2 className="text-xvi font-semibold text-lyncs-text tracking-[-0.3px]">
          Account created
        </h2>
        <p className="text-xiii text-lyncs-text-muted">{successMessage}</p>
      </div>
      <div>
        <CustomButton
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => navigate("/login")}
        >
          Continue to sign in
        </CustomButton>
      </div>
    </section>
  );
};

export default SignupSuccessView;

