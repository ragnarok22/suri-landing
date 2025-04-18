import type { APIRoute } from 'astro'

type TelesurOptionsType = {
  call: {
    CHECK_BALANCE: string
    RECHARGE_BALANCE: string
    ACTIVATE_PRIVATE_MODE: string
    DEACTIVATE_PRIVATE_MODE: string
  }
  sms: {
    CHECK_MOBILE_DATA: {
      number: string
      code: string
    }
    SET_P2P_PIN: {
      number: string
      code: string
    }
    TRANSFER_BALANCE: {
      number: string
      code: string
    }
  }
}

export const GET: APIRoute = ({ params, request }) => {
  const prepaid: TelesurOptionsType = {
    call: {
      CHECK_BALANCE: '*132#',
      RECHARGE_BALANCE: '*131*{pincode}#',
      ACTIVATE_PRIVATE_MODE: '*31#',
      DEACTIVATE_PRIVATE_MODE: '#31#',
    },
    sms: {
      CHECK_MOBILE_DATA: {
        number: '4040',
        code: 'NET INFO',
      },
      SET_P2P_PIN: {
        number: '134',
        code: 'SET {pin}',
      },
      TRANSFER_BALANCE: {
        number: '134',
        code: 'p2p {pincode} {amount} {phone_number}',
      },
    },
  } as const

  const version = '0.3.2'

  const data_plans = [
    {
      id: 1,
      duration: '12 hours',
      data: 1024,
      price: 31,
      code: 'NET 12',
    },
    {
      id: 2,
      duration: '1 day',
      data: 10240,
      price: 59,
      code: 'NET 1D',
    },
    {
      id: 3,
      duration: '3 days',
      data: 30720,
      price: 115,
      code: 'NET 3D',
    },
    {
      id: 4,
      duration: '7 days',
      data: 71680,
      price: 294,
      code: 'NET 7D',
    },
    {
      id: 5,
      duration: '30 days',
      data: 307200,
      price: 856,
      code: 'NET 30D',
    },
  ]

  const telesur = {
    prepaid,
    version,
    data_plans,
  }

  return new Response(JSON.stringify(telesur))
}
