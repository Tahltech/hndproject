<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    public function send($phone, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('sms.sms_phone_api.api_key'),
            'Content-Type'  => 'application/json',
        ])->post(config('sms.sms_phone_api.base_url') . '/sms/send', [
            'to'        => $phone,
            'message'   => $message,
            'device_id' => (int) config('sms.sms_phone_api.device_id'),
        ]);

        Log::info('SMS API Response', $response->json());

        return $response->successful();
    }
}
