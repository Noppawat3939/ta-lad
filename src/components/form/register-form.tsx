"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Input,
  Link,
  Textarea,
  cn,
} from "@nextui-org/react";
import { InputOtp, InputPassword, SelectOption } from ".";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";
import {
  type ReactNode,
  Fragment,
  useCallback,
  useMemo,
  useState,
  Suspense,
} from "react";
import { authService } from "@/apis";
import { useFormState, useFormStatus } from "react-dom";
import { hasLowerCase, hasNumber, hasUpperCase, numberOnly } from "@/lib";
import { registerAction, sellerRegisterAction } from "@/actions";
import { AnimateHidden } from "..";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useGetProvince } from "@/hooks";
import type { CreateUser } from "@/types";

const PASSWORD_CON_LABEL = {
  number: "ตัวเลข (0-9) อย่างน้อย 1 ตัว",
  lowercase: "ตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว",
  uppercase: "ตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว",
  length: "ความยาวอย่างน้อย 8 ตัวอักษร",
};

const registerState = {
  email: "",
  password: "",
  phone_number: "",
  first_name: "",
  last_name: "",
  id_card: "",
  address_card_id: "",
  province: "",
  district: "",
  sub_district: "",
  store_name: "",
  code: "",
  verify_token: "",
};

type RegisterFormProps = {
  cardProps?: CardProps;
  withRole: "end-user" | "seller-user";
};

export default function RegisterForm({
  cardProps,
  withRole,
}: RegisterFormProps) {
  const isRegisUser = withRole === "end-user";

  const [values, setValues] = useState(registerState);
  const [step, setStep] = useState(1);
  const [passwordIsValid, setPasswordIsValid] = useState({
    number: false,
    lowercase: false,
    uppercase: false,
    length: false,
  });
  const [errorValidateField, setErrorValidateField] =
    useState<Record<string, ReactNode>>();

  const [err, action] = useFormState(
    () =>
      isRegisUser
        ? registerAction(step, values, onSubmitStep)
        : sellerRegisterAction(step, values, onSubmitStep),
    {}
  );

  const { pending } = useFormStatus();

  const { provinces, districts, subDistricts } = useGetProvince(step === 2);

  const createUserMutation = useMutation({
    mutationFn: isRegisUser ? authService.createUser : authService.createSeller,
    onSuccess: () => setStep(4),
    onError: (e) => {
      if (e instanceof AxiosError) {
        setErrorValidateField({ otp: e.response?.data?.error_message });
      }
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onError: (err) => {
      console.error(err);
    },
    onSuccess: ({ data }) => {
      if (data?.verify_token) {
        onChangeValue("verify_token", data?.verify_token);
      }
    },
    onMutate: () => {
      if (values.code) {
        onChangeValue("code", "");
      }
    },
  });

  const validatePasswordValid = useCallback((password: string) => {
    const lengthValid = password.trim().length >= 8;

    setPasswordIsValid({
      length: lengthValid,
      number: hasNumber(password),
      lowercase: hasLowerCase(password),
      uppercase: hasUpperCase(password),
    });
  }, []);

  const onChangeValue = useCallback(
    (field: keyof typeof values, value: string) => {
      if (field === "password") {
        validatePasswordValid(value);
      }

      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const proviceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        key: province.name_th,
        value: province.name_th,
      })),
    [provinces]
  );

  const districtOptions = useMemo(() => {
    const province_id = provinces.find(
      (province) => province.name_th === values.province
    )?.id;

    if (values.province && province_id) {
      return districts
        .filter((district) => district.province_id === province_id)
        .map((district) => ({
          key: district.name_th,
          value: district.name_th,
        }));
    }

    return districts.map((district) => ({
      key: district.name_th,
      value: district.name_th,
    }));
  }, [values.province]);

  const subDistrictOptions = useMemo(() => {
    const district_id = districts.find(
      (district) => district.name_th === values.district
    )?.id;

    if (values.district && district_id) {
      return subDistricts
        .filter((sub) => sub.amphure_id === district_id)
        .map((sub) => ({
          key: sub.name_th,
          value: `${sub.name_th} ${sub.zip_code}`,
        }));
    }

    return subDistricts.map((sub) => ({
      key: sub.name_th,
      value: sub.name_th,
    }));
  }, [values.district]);

  const onSubmitStep = () => {
    const hasInvalidField = [
      errorValidateField?.email,
      errorValidateField?.phone_number,
      errorValidateField?.id_card,
    ].some((val) => val);

    if (hasInvalidField) return;

    if (step === 2) {
      sendEmailMutation.mutate({ email: values.email });
    }

    if (step === 3) {
      createUserMutation.mutate({
        ...values,
        email: values.email.trim().toLowerCase(),
        ...(isRegisUser && {
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
        }),
      });

      return;
    }

    setStep((prev) => (prev >= 3 ? 3 : prev + 1));
  };

  const error = err as null | Partial<Record<keyof typeof values, string[]>>;

  const handleValidate = async (fieldValue: {
    email?: string;
    phone_number?: string;
    id_card?: string;
  }) => {
    try {
      const { data } = await authService.validateField({
        ...fieldValue,
        ...(!isRegisUser && { role: "store" }),
      });

      if (!data?.available && data?.field) {
        setErrorValidateField({ [data.field]: data.error_message });

        return;
      }

      setErrorValidateField(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
    }
  };

  const renderFirstStep = () => {
    const fields = [
      { name: "email", label: "อีเมลล์" },
      { name: "password", label: "รหัสผ่าน" },
      { name: "phone_number", label: "เบอร์โทรศัพท์" },
    ] as { name: keyof typeof values; label: string }[];

    return (
      <Fragment>
        {fields.map((field) => {
          const errField = error?.[field.name];

          if (field.name === "password")
            return (
              <InputPassword
                key={field.name}
                label={field.label}
                autoComplete="off"
                value={values[field.name]}
                onChange={({ target: { value } }) =>
                  onChangeValue(field.name, value)
                }
                name={field.name}
                isInvalid={Boolean(errField)}
                variant="bordered"
                errorMessage={errField?.[0]}
              />
            );

          return (
            <Input
              key={field.name}
              label={field.label}
              autoComplete="off"
              value={values[field.name]}
              onChange={({ target: { value } }) =>
                onChangeValue(
                  field.name,
                  field.name === "phone_number"
                    ? numberOnly(value)
                    : value.toLowerCase()
                )
              }
              maxLength={field.name === "phone_number" ? 10 : undefined}
              name={field.name}
              isInvalid={
                Boolean(errField) ||
                !!errorValidateField?.[
                  field.name as keyof typeof errorValidateField
                ]
              }
              variant="bordered"
              errorMessage={
                errorValidateField?.[
                  field.name as keyof typeof errorValidateField
                ] || errField?.[0]
              }
              onBlur={() =>
                values[field.name].trim() &&
                handleValidate({ [field.name]: values[field.name] })
              }
            />
          );
        })}

        <h3 className="font-medium text-sm">{"รหัสผ่านต้องประกอบไปด้วย"}</h3>
        <ul className="gap-2 flex flex-col">
          {Object.keys(PASSWORD_CON_LABEL).map((key, i) => {
            const containLabel =
              PASSWORD_CON_LABEL[key as keyof typeof PASSWORD_CON_LABEL];

            return (
              <li
                key={`contain-${i}`}
                className={cn(
                  "text-xs flex items-center gap-1",
                  passwordIsValid[key as keyof typeof passwordIsValid]
                    ? "text-teal-500"
                    : "text-gray-300"
                )}
              >
                {passwordIsValid[key as keyof typeof passwordIsValid] ? (
                  <CircleCheckBig className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {containLabel}
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  };

  const renderSecondStep = () => {
    const FIELDS = [
      { field: "first_name", label: "ขื่อจริง" },
      { field: "last_name", label: "นามสกุล" },
      { field: "store_name", label: "ชื่อร้านค้า" },
    ] as { field: keyof CreateUser; label: string }[];

    const inputFields = isRegisUser
      ? FIELDS.filter((f) => f.field !== "store_name")
      : FIELDS.filter((f) => f.field === "store_name");

    return (
      <Fragment>
        {inputFields.map((inputField) => {
          return (
            <Input
              key={inputField.field}
              label={inputField.label}
              value={values[inputField.field]}
              name={inputField.field}
              errorMessage={error?.[inputField.field]?.[0]}
              isInvalid={Boolean(error?.[inputField.field])}
              onChange={({ target: { value } }) =>
                onChangeValue(inputField.field, value)
              }
              variant="bordered"
              autoComplete="off"
            />
          );
        })}

        <Input
          label="เลขบัตรประชาชน"
          value={values.id_card}
          onChange={({ target: { value } }) =>
            onChangeValue("id_card", numberOnly(value))
          }
          name="id_card"
          errorMessage={errorValidateField?.id_card || error?.id_card?.[0]}
          isInvalid={
            Boolean(error?.id_card) || !!errorValidateField?.["id_card"]
          }
          variant="bordered"
          autoComplete="off"
          onBlur={() =>
            values.id_card.trim() && handleValidate({ id_card: values.id_card })
          }
        />
        <Textarea
          label="ที่อยู่ตามบัตรประชาชน"
          value={values.address_card_id}
          onChange={({ target: { value } }) =>
            onChangeValue("address_card_id", value)
          }
          name="address_card_id"
          variant="bordered"
          autoComplete="off"
          isInvalid={Boolean(error?.address_card_id)}
          errorMessage={error?.address_card_id?.[0]}
        />
        <SelectOption
          label="จังหวัด"
          variant="bordered"
          onChange={({ target: { value } }) => {
            onChangeValue("province", value);
          }}
          options={proviceOptions}
          value={values.province}
          name="province"
          isInvalid={Boolean(error?.province)}
          errorMessage={error?.province?.[0]}
        />
        <div className="flex space-x-2">
          <SelectOption
            label="อำเภอ"
            variant="bordered"
            isDisabled={!values.province && !Boolean(error?.district)}
            options={districtOptions}
            value={values.district}
            onChange={({ target: { value } }) => {
              onChangeValue("district", value);
            }}
            name="district"
            isInvalid={Boolean(error?.district)}
            errorMessage={error?.district?.[0]}
          />
          <SelectOption
            label="เขต/ตำบล"
            variant="bordered"
            value={values.sub_district}
            isDisabled={!values.district && !Boolean(error?.sub_district)}
            options={subDistrictOptions}
            onChange={({ target: { value } }) =>
              onChangeValue("sub_district", value)
            }
            name="sub_district"
            errorMessage={error?.sub_district?.[0]}
            isInvalid={Boolean(error?.sub_district)}
          />
        </div>
      </Fragment>
    );
  };

  const renderThirdStep = () => {
    return (
      <div className="flex flex-col items-center w-full gap-2">
        <h2 className="text-xl">{"โปรดยืนยันรหัส"}</h2>
        <div className="flex gap-1 max-sm:flex-col">
          {sendEmailMutation.isPending ? (
            <p className="text-slate-700">{"ระบบกำลังส่งรหัสยืนยัน..."}</p>
          ) : (
            <Fragment>
              <p className="text-slate-700">{"ระบบได้ส่งรหัสยืนยันไปยัง"}</p>
              <p className="text-[#FF731D] font-medium">{values.email}</p>
            </Fragment>
          )}
        </div>
        <InputOtp
          value={values.code}
          length={6}
          onChange={(code) => onChangeValue("code", code)}
          inputProps={{
            size: "lg",
            isInvalid: Boolean(errorValidateField?.otp),
            errorMessage: errorValidateField?.otp,
          }}
        />
        <div className="flex space-x-1 mt-3">
          <p className="text-sm text-slate-700">{"ยังไม่ได้รับอีเมลล์"}</p>
          <Link
            className="text-sm cursor-pointer"
            color="primary"
            onClick={() => sendEmailMutation.mutate({ email: values.email })}
          >
            {"ส่งใหม่อีกครั้ง"}
          </Link>
        </div>
      </div>
    );
  };

  if (step === 4)
    return (
      <Card {...cardProps} className="py-[24px] px-2 max-sm:mx-3">
        <CardBody>
          <h1 className="text-3xl font-medium max-md:text-2xl max-sm:text-xl">
            {"สวัสดี ยินต้อนรับสมาชิกใหม่ของเรา"}
          </h1>
          <h3 className="text-lg ml-[20px] mt-2">
            {isRegisUser
              ? `คุณ ${values.first_name} ${values.last_name}`
              : `ร้าน ${values.store_name}`}
          </h3>
          <AnimateHidden isCenter>
            <img
              src="/images/completed.png"
              className="h-[420px] max-sm:h-[360px]"
              loading="lazy"
            />
          </AnimateHidden>
        </CardBody>
        <CardFooter className="justify-center space-x-2">
          <p>{"เข้าสู่ระบบ"}</p>
          <Button as={Link} href={`/login/${withRole}`} color="primary">
            {"ล็อคอิน"}
          </Button>
        </CardFooter>
      </Card>
    );

  return (
    <Suspense fallback={<Fragment />}>
      <Card {...cardProps} className="py-[24px] px-2">
        <form action={action}>
          <CardHeader>
            <h2 className="text-xl font-semibold w-full text-center">
              {isRegisUser
                ? "สมัครสมาชิกสำหรับผู้ใช้งานใหม่"
                : "สมัครสมาชิกสำหรับร้านค้าใหม่"}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {step === 1 && renderFirstStep()}
              {step === 2 && renderSecondStep()}
              {step === 3 && renderThirdStep()}
            </div>
          </CardBody>
          <CardFooter className="mt-3">
            <div className="flex flex-col w-full gap-3">
              <Button
                isLoading={
                  pending ||
                  sendEmailMutation.isPending ||
                  createUserMutation.isPending
                }
                color={"primary"}
                className="w-full"
                type="submit"
                isDisabled={step === 3 && values.code.length < 6}
              >
                {step >= 3 ? "ยืนยัน" : "ถัดไป"}
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="flex space-x-1 justify-center items-baseline">
                <p className="text-sm">{"ฉันเป็นสมาชิกอยู่แล้ว"}</p>
                <Link
                  color="primary"
                  isDisabled={createUserMutation.isPending}
                  href={`/login/${withRole}`}
                  className="cursor-pointer text-sm"
                >
                  {"ล็อคอิน"}
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </Suspense>
  );
}
