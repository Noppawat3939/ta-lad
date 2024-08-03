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
import { InputPassword, SelectOption } from ".";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { externalService } from "@/apis";
import { IDistrict, IProvince, ISubDistrict } from "@/types";
import { z } from "zod";
import { useFormState, useFormStatus } from "react-dom";

const PASSWORD_CON_LABEL = {
  number: "ตัวเลข (0-9) อย่างน้อย 1 ตัว",
  lowercase: "ตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว",
  uppercase: "ตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว",
  length: "ความยาวอย่างน้อย 8 ตัวอักษร",
};

type RegisterFormProps = {
  cardProps?: CardProps;
};

export default function RegisterForm({ cardProps }: RegisterFormProps) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    phone_number: "",
    id_card: "",
    address_card_id: "",
    province: "",
    district: "",
    sub_district: "",
  });
  const [step, setStep] = useState(1);
  const [passwordIsValid, setPasswordIsValid] = useState({
    number: false,
    lowercase: false,
    uppercase: false,
    length: false,
  });
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [subDistricts, setSubDistricts] = useState<ISubDistrict[]>([]);

  const first_step_schema = z.object({
    email: z.string().email({ message: "กรุณากรอกอีเมลล์" }),
    password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
    phone_number: z.string().min(1, { message: "กรุณากรอกเบอร์โทรศัพท์" }),
  });

  const second_step_schema = z.object({
    id_card: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชน" }),
    address_card_id: z
      .string()
      .min(1, { message: "กรุณากรอกที่อยู่ตามบัตรประชาชน" }),
    province: z.string(),
  });

  const [err, action] = useFormState(() => {
    const res = (step === 1 ? first_step_schema : second_step_schema).safeParse(
      Object.fromEntries(Object.entries(values))
    );
    if (!res.success) return res.error.formErrors.fieldErrors;

    return onSubmitStep(res.data);
  }, {});
  const { pending } = useFormStatus();

  const validatePasswordValid = useCallback((password: string) => {
    const lowerCaseValid = /[a-z]/.test(password);
    const upperCaseValid = /[A-Z]/.test(password);
    const digitValid = /\d/.test(password);
    const lengthValid = password.trim().length >= 8;

    setPasswordIsValid({
      number: digitValid,
      length: lengthValid,
      lowercase: lowerCaseValid,
      uppercase: upperCaseValid,
    });
  }, []);

  const getData = async () => {
    const [provinceRes, districtRes, subDistrictRes] = await Promise.all([
      externalService.getProvince(),
      externalService.getDistrict(),
      externalService.getSubDistrict(),
    ]);

    setProvinces(provinceRes);
    setDistricts(districtRes);
    setSubDistricts(subDistrictRes);
  };

  useEffect(() => {
    getData();
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

  const onSubmitStep = (data: Partial<typeof values>) => {
    console.log(data, values);

    setStep((prev) => prev + 1);
  };

  const error = err as null | Partial<Record<keyof typeof values, string[]>>;

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
                    ? value.replace(/[^0-9]/g, "")
                    : value
                )
              }
              name={field.name}
              isInvalid={Boolean(errField)}
              variant="bordered"
              errorMessage={errField?.[0]}
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
    return (
      <Fragment>
        <Input
          label="เลขบัตรประชาชน"
          value={values.id_card}
          onChange={({ target: { value } }) => onChangeValue("id_card", value)}
          name="id_card"
          errorMessage={error?.id_card?.[0]}
          isInvalid={Boolean(error?.id_card)}
          variant="bordered"
          autoComplete="off"
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
          onChange={({ target: { value } }) => onChangeValue("province", value)}
          options={proviceOptions}
          value={values.province}
          name="province"
          isRequired
          isInvalid={Boolean(error?.province)}
          errorMessage={error?.province?.[0]}
        />
        <div className="flex space-x-2">
          <SelectOption
            label="อำเภอ"
            variant="bordered"
            isDisabled={!values.province}
            options={districtOptions}
            value={values.district}
            onChange={({ target: { value } }) =>
              onChangeValue("district", value)
            }
            name="district"
            isInvalid={Boolean(error?.district)}
            errorMessage={error?.district?.[0]}
          />
          <SelectOption
            label="เขต/ตำบล"
            variant="bordered"
            value={values.sub_district}
            isDisabled={!values.district}
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

  return (
    <Card {...cardProps} className="py-[24px] px-2">
      <form action={action}>
        <CardHeader>
          <h2 className="text-xl font-semibold w-full text-center">
            {"สมัครสมาชิกสำหรับผู้ใช้งานใหม่"}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            {step === 1 && renderFirstStep()}
            {step === 2 && renderSecondStep()}
          </div>
        </CardBody>
        <CardFooter className="mt-3">
          <div className="flex flex-col w-full gap-3">
            <Button
              isLoading={pending}
              color={"primary"}
              className="w-full"
              type="submit"
            >
              {"ถัดไป"}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="flex space-x-2 justify-center items-baseline">
              <p className="text-sm">{"ฉันเป็นสมาชิกอยู่แล้ว"}</p>
              <Link color="primary" className="cursor-pointer text-sm">
                {"ล็อคอิน"}
              </Link>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
