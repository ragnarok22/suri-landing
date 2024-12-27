import type { APIRoute } from "astro";

type TelesurOptionsType = {
  call: {
    CHECK_BALANCE: string;
    RECHARGE_BALANCE: string;
    ACTIVATE_PRIVATE_MODE: string;
    DEACTIVATE_PRIVATE_MODE: string;
  };
  sms: {
    CHECK_MOBILE_DATA: {
      number: string;
      code: string;
    };
    SET_P2P_PIN: {
      number: string;
      code: string;
    };
    TRANSFER_BALANCE: {
      number: string;
      code: string;
    };
  };
};

export const GET: APIRoute = ({ params, request }) => {
  const prepaid: TelesurOptionsType = {
    call: {
      CHECK_BALANCE: "*132#",
      RECHARGE_BALANCE: "*131*{pincode}#",
      ACTIVATE_PRIVATE_MODE: "*31#",
      DEACTIVATE_PRIVATE_MODE: "#31#",
    },
    sms: {
      CHECK_MOBILE_DATA: {
        number: "4040",
        code: "NET INFO",
      },
      SET_P2P_PIN: {
        number: "134",
        code: "SET {pin}",
      },
      TRANSFER_BALANCE: {
        number: "134",
        code: "p2p {pincode} {amount} {phone_number}",
      },
    },
  } as const;

  const telesur = {
    prepaid,
  };

  return new Response(JSON.stringify(telesur));
}
