
import React from 'react';
import StepByStepRegister from '../../components/Auth/StepByStepRegister';
import PageAICopilot from '../../components/Global/PageAICopilot';

const Register: React.FC = () => {
  return (
    <>
      <StepByStepRegister />
      <PageAICopilot pageContext="register" />
    </>
  );
};

export default Register;
