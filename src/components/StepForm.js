import React, { useState } from "react";
import PhoneInput from "./PhoneInput";
import OtpVerify from "./OtpVerify";

const StepForm = () => {
  const [state, setState] = useState({
    phone: "",
    hsh: "",
    otp: "",
  });
  const [step, setStep] = useState(1);

  const handleChange = (input) => (e) => {
    setState({ ...state, [input]: e.target.value });
  };

  const hashHandleChange = (hash) => {
    setState({ ...state, hash: hash });
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const { phone, hash, otp } = state;
  const value = { phone, hash, otp };
  switch (step) {
    case 1:
      return <PhoneInput nextStep={nextStep} hashHandleChange={hashHandleChange} handleChange={handleChange} value={value}/>;
    case 2:
      return <OtpVerify nextStep={nextStep} handleChange={handleChange} value={value}/>;
    default:
        return <PhoneInput nextStep={nextStep} hashHandleChange={hashHandleChange} handleChange={handleChange} value={value}/>;
  }
};

export default StepForm;
